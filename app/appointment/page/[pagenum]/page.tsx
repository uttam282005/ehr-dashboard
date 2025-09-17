import { fetchEntityByPage } from "@/actions/actions"
import type { Appointment } from "@/lib/types/appointment";
interface AppointmentEntry {
  fullUrl: string;
  resource: Appointment;
}
interface FhirBundle {
  entry: AppointmentEntry[];
  link?: { relation: string; url: string }[];
}
export default async function AppointmentsPage({
  params,
}: {
  params: { pagenum: string };
}) {
  const { pagenum } = await params;
  const pageNo = Number(pagenum);
  console.log(pageNo)
  const res = await fetchEntityByPage("Appointment", pageNo);
  if (!res.success) {
    throw res.error;
  }
  const data = res.data as FhirBundle;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Appointments - Page {pageNo}</h1>
      {data.entry?.map((entry) => (
        <div key={entry.resource.id} className="p-4 border rounded">
          <p><strong>Full URL:</strong> {entry.fullUrl}</p>
          <p><strong>Appointment ID:</strong> {entry.resource.id}</p>
          <p>
            <strong>Type:</strong> {entry.resource.appointmentType?.text || "Unknown"}
          </p>
          <p>
            <strong>Status:</strong> {entry.resource.status}
          </p>
          <p>
            <strong>Start:</strong> {entry.resource.start}
          </p>
          <p>
            <strong>End:</strong> {entry.resource.end}
          </p>
        </div>
      ))}
      {data.link?.some((l) => l.relation === "next") && (
        <a
          href={`/appointments/page/${pageNo + 1}`}
          className="px-4 py-2 bg-blue-600 text-white rounded inline-block"
        >
          Next Page →
        </a>
      )}
    </div>
  );
}
