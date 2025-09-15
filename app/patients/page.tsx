"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Patient } from "@/lib/types";
import { fetchEntity } from "@/actions/patient";

interface PatientEntry {
  fullUrl: string;
  resource: Patient;
}

interface FhirBundle {
  entry: PatientEntry[];
  link?: { relation: string; url: string }[];
}

export default function PatientsPage() {
  const router = useRouter();
  const [patients, setPatients] = useState<PatientEntry[]>([]);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch patients on mount
  useEffect(() => {
    const loadPatients = async () => {
      try {
        setLoading(true);
        const data: FhirBundle = await fetchEntity();
        setPatients(data.entry || []);

        const nextLink = data.link?.find((l) => l.relation === "next");
        if (nextLink) {
          const urlObj = new URL(nextLink.url);
          setNextPage(urlObj.searchParams.get("page"));
        }
      } catch (err) {
        console.error("Error fetching patients:", err);
        setError("Failed to load patients");
      } finally {
        setLoading(false);
      }
    };

    loadPatients();
  }, []);

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  return (
    <div className="space-y-4">
      {patients.map((entry) => (
        <div key={entry.resource.id} className="p-4 border rounded">
          <p>
            <strong>Full URL:</strong> {entry.fullUrl}
          </p>
          <p>
            <strong>Patient ID:</strong> {entry.resource.id}
          </p>
          {entry.resource.name?.map((n, i) => (
            <p key={i}>
              <strong>Name:</strong> {n.given?.join(" ")} {n.family}
            </p>
          ))}
          {entry.resource.birthDate && (
            <p>
              <strong>Birth Date:</strong> {entry.resource.birthDate}
            </p>
          )}
        </div>
      ))}

      {loading && <p>Loading patients...</p>}

      {!loading && nextPage && (
        <button
          onClick={() => router.push(`/patients/page/${nextPage}`)}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Next Page
        </button>
      )}
    </div>
  );
}

