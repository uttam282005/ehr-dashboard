"use client";

import { useEffect, useState, FormEvent } from "react";
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Search parameters state
  const [searchParams, setSearchParams] = useState({
    given: "",
    family: "",
    birthdate: "",
    gender: "",
    identifier: "",
    phone: "",
    email: "",
    active: "true", // default to active
  });

  const loadPatients = async (params: Record<string, string> = {}) => {
    try {
      setLoading(true);
      setError(null);
      const data: FhirBundle = (await fetchEntity("Patient", params)) as FhirBundle;
      setPatients(data.entry || []);
      const nextLink = data.link?.find((l) => l.relation === "next");
      if (nextLink) {
        const urlObj = new URL(nextLink.url);
        setNextPage(urlObj.searchParams.get("page"));
      } else {
        setNextPage(null);
      }
    } catch (err) {
      console.error("Error fetching patients:", err);
      setError("Failed to load patients");
    } finally {
      setLoading(false);
    }
  };

  // Initial load with no params (active=true by default)
  useEffect(() => {
    loadPatients({ active: "true" });
  }, []);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setSearchParams({
      ...searchParams,
      [e.target.name]: e.target.value,
    });
  };

  // Handle search submit
  const handleSearch = (e: FormEvent) => {
    e.preventDefault();

    // Clean the search params by removing empty strings
    const filteredParams: Record<string, string> = {};
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value.trim() !== "") {
        filteredParams[key] = value.trim();
      }
    });

    // Load patients with search params
    loadPatients(filteredParams);
  };

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <form className="space-y-4 p-4 border rounded" onSubmit={handleSearch}>
        <h3 className="text-lg font-semibold">Search Patients</h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="given" className="block font-medium">
              Given Name
            </label>
            <input
              id="given"
              name="given"
              type="text"
              value={searchParams.given}
              onChange={handleChange}
              className="w-full border rounded p-1"
              placeholder="First name"
            />
          </div>
          <div>
            <label htmlFor="family" className="block font-medium">
              Family Name
            </label>
            <input
              id="family"
              name="family"
              type="text"
              value={searchParams.family}
              onChange={handleChange}
              className="w-full border rounded p-1"
              placeholder="Last name"
            />
          </div>

          <div>
            <label htmlFor="birthdate" className="block font-medium">
              Birthdate (YYYY-MM-DD)
            </label>
            <input
              id="birthdate"
              name="birthdate"
              type="date"
              value={searchParams.birthdate}
              onChange={handleChange}
              className="w-full border rounded p-1"
            />
          </div>

          <div>
            <label htmlFor="gender" className="block font-medium">
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              value={searchParams.gender}
              onChange={handleChange}
              className="w-full border rounded p-1"
            >
              <option value="">Any</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="unknown">Unknown</option>
            </select>
          </div>

          <div>
            <label htmlFor="identifier" className="block font-medium">
              Identifier (MRN, SSN, etc.)
            </label>
            <input
              id="identifier"
              name="identifier"
              type="text"
              value={searchParams.identifier}
              onChange={handleChange}
              className="w-full border rounded p-1"
              placeholder="e.g. PMS|12345"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block font-medium">
              Phone
            </label>
            <input
              id="phone"
              name="phone"
              type="text"
              value={searchParams.phone}
              onChange={handleChange}
              className="w-full border rounded p-1"
              placeholder="Phone number"
            />
          </div>

          <div>
            <label htmlFor="email" className="block font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={searchParams.email}
              onChange={handleChange}
              className="w-full border rounded p-1"
              placeholder="Email address"
            />
          </div>

          <div>
            <label htmlFor="active" className="block font-medium">
              Active
            </label>
            <select
              id="active"
              name="active"
              value={searchParams.active}
              onChange={handleChange}
              className="w-full border rounded p-1"
            >
              <option value="">Any</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Search
        </button>
      </form>

      {/* Patients List */}
      <div className="space-y-4">
        {patients.map((entry) => {
          const { resource } = entry;
          const fullName =
            resource.name && resource.name.length > 0
              ? `${resource.name[0].given?.join(" ") || ""} ${resource.name[0].family || ""}`.trim()
              : "Unknown";

          return (
            <div
              key={resource.id}
              className="p-4 border rounded cursor-pointer hover:bg-gray-100"
              onClick={() => router.push(`/patients/${resource.id}`)}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  router.push(`/patient/${resource.id}`);
                }
              }}
            >
              <p>
                <strong>Full URL:</strong> {entry.fullUrl}
              </p>
              <p>
                <strong>Patient ID:</strong> {resource.id}
              </p>
              <p>
                <strong>Name:</strong> {fullName}
              </p>
              {resource.birthDate && (
                <p>
                  <strong>Birth Date:</strong> {resource.birthDate}
                </p>
              )}
            </div>
          );
        })}
      </div>

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

