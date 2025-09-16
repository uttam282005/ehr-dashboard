import type { Appointment } from "@/lib/types/appointment";
import { fetchEntityById } from "@/actions/actions";

interface Participants {
  entity?: string;
  id?: string;
};

export default async function AppointmentDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const appointment: Appointment | null = await fetchEntityById("Appointment", id) as Appointment | null;
  if (!appointment) return <p>No appointment found.</p>;

  let participants: Participants[] = [];
  if (appointment.participant) {
    appointment.participant.forEach((part) => {
      let urlSegment = new URL(part.actor.display).pathname.split(
        "/"
      );
      participants.push({
        id: urlSegment[urlSegment.length - 1],
        entity: urlSegment[urlSegment.length - 2].toLowerCase()
      })
    })
  }

  console.log(appointment.participant)
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Appointment {appointment.id}</h1>
      <div className="space-y-2">
        <p><strong>Status:</strong> {appointment.status}</p>
        <p><strong>Type:</strong> {appointment.appointmentType?.text || "Unknown"}</p>
        <p><strong>Reason:</strong> {appointment.reasonCode?.map((r) => r.text).join(", ") || "Not specified"}</p>
        <p><strong>Description:</strong> {appointment.description || "—"}</p>
        <p><strong>Start:</strong> {appointment.start}</p>
        <p><strong>End:</strong> {appointment.end}</p>
        <p><strong>Duration (minutes):</strong> {appointment.minutesDuration}</p>
        <p><strong>Created:</strong> {appointment.created}</p>
        <p><strong>Comment:</strong> {appointment.comment || "—"}</p>
        <p><strong>Last Updated:</strong> {appointment.meta?.lastUpdated}</p>
      </div>
      <div>
        <h2 className="font-semibold">Supporting Information</h2>
        <ul className="list-disc list-inside">
          {appointment.supportingInformation?.map((info, idx) => (
            <li key={idx}>
              {info.display}
              {info.identifier && (
                <> ({info.identifier.value} - {info.identifier.system})</>
              )}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2 className="font-semibold">Participants</h2>
        <ul className="list-disc list-inside">
          {participants?.map((part, idx) => (
            <li key={idx}>
              <strong>{part.entity}</strong>{" "}
              <a
                href={`/${part.entity}/${id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                {part.entity}
              </a>
            </li>
          ))}
        </ul>

      </div>
    </div>
  );
}
