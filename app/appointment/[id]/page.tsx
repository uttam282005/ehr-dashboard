import type { Appointment } from "@/lib/types/appointment";
import { fetchEntityById } from "@/actions/actions";

// Appointment type lookup
const appointmentTypes: Record<string, string> = {
  "1508": "Surgery",
  "1509": "New Patient",
  "1510": "Follow-up",
};

const getAppointmentType = (code?: string, fallback?: string) => {
  if (!code) return fallback || "Unknown";
  return appointmentTypes[code] || fallback || "Unknown";
};

export default async function AppointmentDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const res = await fetchEntityById("Appointment", id);
  if (!res.success) throw res.error;

  const appointment = res.data as Appointment;
  if (!appointment) return <p className="text-center text-gray-500">No appointment found.</p>;

  const formatDate = (d?: string) =>
    d ? new Date(d).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }) : "—";

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-2xl p-6 border">
        <h1 className="text-3xl font-bold text-gray-800">
          Appointment <span className="text-blue-600">#{appointment.id}</span>
        </h1>
        <p className="text-gray-500 mt-1">FHIR Resource Type: {appointment.resourceType}</p>
      </div>

      {/* Appointment Info */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-2xl p-6 space-y-3 border">
          <h2 className="text-lg font-semibold text-gray-700">General Information</h2>
          <dl className="space-y-2 text-sm text-gray-600">
            <div><dt className="font-medium">Status:</dt><dd>{appointment.status}</dd></div>
            <div>
              <dt className="font-medium">Type:</dt>
              <dd>
                {appointment.appointmentType?.coding?.length
                  ? getAppointmentType(
                    appointment.appointmentType.coding[0].code,
                    appointment.appointmentType.text
                  )
                  : "Unknown"}
              </dd>
            </div>
            <div>
              <dt className="font-medium">Reason:</dt>
              <dd>
                {appointment.reasonCode?.length > 0 ? (
                  <ul className="ml-4 list-disc text-gray-500">
                    {appointment.reasonCode.map((r, idx) => (
                      <li key={idx}>
                        {r.text}
                        {/* {r.coding?.map((c, cIdx) => ( */}
                        {/*   <span key={cIdx} className="block"> */}
                        {/*     {c.display} ({c.code}) [{c.system}] */}
                        {/*   </span> */}
                        {/* ))} */}
                      </li>
                    ))}
                  </ul>
                ) : "Not specified"}
              </dd>
            </div>
            <div><dt className="font-medium">Description:</dt><dd>{appointment.description || "—"}</dd></div>
          </dl>
        </div>

        <div className="bg-white shadow rounded-2xl p-6 space-y-3 border">
          <h2 className="text-lg font-semibold text-gray-700">Timing</h2>
          <dl className="space-y-2 text-sm text-gray-600">
            <div><dt className="font-medium">Start:</dt><dd>{formatDate(appointment.start)}</dd></div>
            <div><dt className="font-medium">End:</dt><dd>{formatDate(appointment.end)}</dd></div>
            <div><dt className="font-medium">Duration:</dt><dd>{appointment.minutesDuration} minutes</dd></div>
            <div><dt className="font-medium">Created:</dt><dd>{formatDate(appointment.created)}</dd></div>
            <div><dt className="font-medium">Last Updated:</dt><dd>{formatDate(appointment.meta?.lastUpdated)}</dd></div>
          </dl>
        </div>
      </div>

      {/* Notes */}
      <div className="bg-white shadow rounded-2xl p-6 border">
        <h2 className="text-lg font-semibold text-gray-700">Notes</h2>
        <p className="text-sm text-gray-600">{appointment.comment || "No comments provided."}</p>
      </div>

      {/* Supporting Information */}
      <div className="bg-white shadow rounded-2xl p-6 border">
        <h2 className="text-lg font-semibold text-gray-700">Supporting Information</h2>
        {appointment.supportingInformation?.length ? (
          <table className="w-full text-sm text-left border mt-2">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="p-2 border">Display</th>
                <th className="p-2 border">Identifier Value</th>
                <th className="p-2 border">System</th>
              </tr>
            </thead>
            <tbody>
              {appointment.supportingInformation.map((info, idx) => (
                <tr key={idx} className="border-b">
                  <td className="p-2">{info.display}</td>
                  <td className="p-2">{info.identifier?.value || "—"}</td>
                  <td className="p-2">{info.identifier?.system || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-sm text-gray-500">No supporting information available.</p>
        )}
      </div>

      {/* Participants */}
      <div className="bg-white shadow rounded-2xl p-6 border">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Participants</h2>
        {appointment.participant?.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4">
            {appointment.participant.map((p, idx) => {
              const urlSeg = p.actor.reference.split("/");
              const entity = urlSeg[urlSeg.length - 2];
              const entityId = urlSeg[urlSeg.length - 1];
              return (
                <div
                  key={idx}
                  className="p-4 rounded-xl border bg-gray-50 hover:bg-gray-100 transition"
                >
                  <h3 className="text-md font-semibold text-gray-800">{entity}</h3>
                  <p className="text-sm text-gray-600">ID: {entityId}</p>
                  <a
                    href={`/${entity.toLowerCase()}/${entityId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 underline mt-1 block"
                  >
                    View Resource
                  </a>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No participants found.</p>
        )}
      </div>
    </div>
  );
}

