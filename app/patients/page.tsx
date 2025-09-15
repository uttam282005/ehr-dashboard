"use client";

import { useEffect, useState } from "react";
import type { Patient } from "@/lib/types";
import next from "next";

interface PatientEntry {
  fullUrl: string;
  resource: Patient;
}

interface FhirBundle {
  entry: PatientEntry[];
  link?: { relation: string; url: string }[];
}

export default function PatientsPage() {
  const [patients, setPatients] = useState<PatientEntry[]>([]);
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchPatients = (url: string = "/api/patients") => {
    setLoading(true);
    fetch(url)
      .then((res) => res.json())
      .then((data: FhirBundle) => {
        setPatients((prev) => [...prev, ...(data.entry || [])]);

        const nextLink = data.link?.find((l) => l.relation === "next");

        if (nextLink) {
          const urlObj = new URL(nextLink.url);
          const pageNo = urlObj.searchParams.get("page"); // "2"
          setNextUrl(`/api/patients/page/${pageNo}`);
        }

        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch patients:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  return (
    <div className="space-y-4">
      {patients.map((entry) => (
        <div key={entry.resource.id} className="p-4 border rounded">
          <p><strong>Full URL:</strong> {entry.fullUrl}</p>
          <p><strong>Patient ID:</strong> {entry.resource.id}</p>
          {entry.resource.name?.map((n, i) => (
            <p key={i}>
              <strong>Name:</strong> {n.given?.join(" ")} {n.family}
            </p>
          ))}
          {entry.resource.birthDate && (
            <p><strong>Birth Date:</strong> {entry.resource.birthDate}</p>
          )}
        </div>
      ))}

      {loading && <p>Loading patients...</p>}

      {!loading && nextUrl && (
        <button
          onClick={() => fetchPatients(nextUrl)}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Load More
        </button>
      )}
    </div>
  );
}

