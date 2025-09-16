"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { fetchEntity } from "@/actions/actions";
import { Appointment } from "@/lib/types/appointment";

interface AppointmentEntry {
  fullUrl: string;
  resource: Appointment;
}
interface FhirBundle {
  entry: AppointmentEntry[];
  link?: { relation: string; url: string }[];
}

export default function AppointmentsPage() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<AppointmentEntry[]>([]);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Search parameters for appointments
  const [searchParams, setSearchParams] = useState({
    status: "",
    "appointment-type": "",
    date: "",
    patient: "",
    practitioner: "",
  });

  const loadAppointments = async (params: Record<string, string> = {}) => {
    try {
      setLoading(true);
      setError(null);
      const queryParams: Record<string, string> = {};

      Object.entries(params).forEach(([key, value]) => {
        if (key === "date" && value) {
          const day = new Date(value);
          const startOfDay = new Date(day.setHours(0, 0, 0, 0)).toISOString();
          const endOfDay = new Date(day.setHours(23, 59, 59, 999)).toISOString();
          queryParams["date"] = `ge${startOfDay}`;
          queryParams["date"] = `le${endOfDay}`; // This overwrites previous date param; fix next
        } else if (key === "patient" && value.trim() !== "") {
          queryParams["patient"] = `Patient/${value.trim()}`;
        } else {
          if (value.trim() !== "") {
            queryParams[key] = value.trim();
          }
        }
      });

      // Fix date param: FHIR expects multiple 'date' keys for range,
      // but JS object keys can't be duplicated, so build URL manually:

      const urlSearchParams = new URLSearchParams();

      Object.entries(queryParams).forEach(([k, v]) => {
        urlSearchParams.append(k, v);
      });

      // Special treatment for date range: remove existing dates and append two separately
      if (params.date) {
        const day = new Date(params.date);
        const startOfDay = new Date(day.setHours(0, 0, 0, 0)).toISOString();
        const endOfDay = new Date(day.setHours(23, 59, 59, 999)).toISOString();

        urlSearchParams.delete("date");

        urlSearchParams.append("date", `ge${startOfDay}`);
        urlSearchParams.append("date", `le${endOfDay}`);
      }

      const data: FhirBundle = (await fetchEntity("Appointment", Object.fromEntries(urlSearchParams.entries()))) as FhirBundle;
      console.log(data.entry)

      setAppointments(data.entry || []);
      const nextLink = data.link?.find((l) => l.relation === "next");
      setNextPage(nextLink ? new URL(nextLink.url).searchParams.get("page") : null);
    } catch (err) {
      console.error("Error fetching appointments:", err);
      setError("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setSearchParams({
      ...searchParams,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const filteredParams: Record<string, string> = {};
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value.trim() !== "") {
        filteredParams[key] = value.trim();
      }
    });
    loadAppointments(filteredParams);
  };

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <form className="space-y-4 p-4 border rounded" onSubmit={handleSearch}>
        <h3 className="text-lg font-semibold">Search Appointments</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="status" className="block font-medium">Status</label>
            <select
              id="status"
              name="status"
              value={searchParams.status}
              onChange={handleChange}
              className="w-full border rounded p-1"
            >
              <option value="">Any</option>
              <option value="booked">Booked</option>
              <option value="cancelled">Cancelled</option>
              <option value="arrived">Arrived</option>
              <option value="fulfilled">Fulfilled</option>
              <option value="noshow">No Show</option>
            </select>
          </div>
          <div>
            <label htmlFor="appointment-type" className="block font-medium">Appointment Type</label>
            <input
              id="appointment-type"
              name="appointment-type"
              type="text"
              value={searchParams["appointment-type"]}
              onChange={handleChange}
              className="w-full border rounded p-1"
              placeholder="Type or code"
            />
          </div>
          <div>
            <label htmlFor="date" className="block font-medium">Date</label>
            <input
              id="date"
              name="date"
              type="date"
              value={searchParams.date}
              onChange={handleChange}
              className="w-full border rounded p-1"
            />
          </div>
          <div>
            <label htmlFor="patient" className="block font-medium">Patient ID</label>
            <input
              id="patient"
              name="patient"
              value={searchParams.patient}
              onChange={handleChange}
              className="w-full border rounded p-1"
              placeholder="Patient resource ID"
            />
          </div>
          <div>
            <label htmlFor="practitioner" className="block font-medium">Practitioner</label>
            <input
              id="practitioner"
              name="practitioner"
              type="text"
              value={searchParams.practitioner}
              onChange={handleChange}
              className="w-full border rounded p-1"
              placeholder="Id"
            />
          </div>
        </div>
        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Search
        </button>
      </form>

      {/* Appointments List */}
      <div className="space-y-4">
        {appointments.map((entry) => {
          const { resource } = entry;
          // Extract appointment type from the FHIR structure
          let appointmentTypeText = "Unknown Type";
          if (resource.appointmentType?.coding?.length > 0) {
            appointmentTypeText = resource.appointmentType.coding[0].display
              || resource.appointmentType.coding[0].code
              || "Unknown Type";
          } else if (resource.appointmentType?.text) {
            // Fallback to plain text if available
            appointmentTypeText = resource.appointmentType.text;
          }
          const reasons = resource.reasonCode?.map(rc => rc.text).join(", ") || "No reason specified";
          return (
            <div
              key={resource.id}
              className="p-4 border rounded cursor-pointer hover:bg-gray-100"
              onClick={() => router.push(`/appointment/${resource.id}`)}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  router.push(`/appointment/${resource.id}`);
                }
              }}
            >
              <p><strong>Full URL:</strong> {entry.fullUrl}</p>
              <p><strong>Appointment ID:</strong> {resource.id}</p>
              <p><strong>Type:</strong> {appointmentTypeText}</p>
              <p><strong>Status:</strong> {resource.status}</p>
              <p><strong>Start:</strong> {resource.start}</p>
              <p><strong>End:</strong> {resource.end}</p>
              <p><strong>Reason:</strong> {reasons}</p>
              {resource.comment && <p><strong>Comment:</strong> {resource.comment}</p>}
            </div>
          );
        })}
      </div>

      {loading && <p>Loading appointments...</p>}

      {!loading && nextPage && (
        <button
          onClick={() => router.push(`/appointment/page/${nextPage}`)}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Next Page
        </button>
      )}
    </div>
  );
}

