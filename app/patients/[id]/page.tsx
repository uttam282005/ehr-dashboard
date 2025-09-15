import type { Patient } from "@/lib/types";
import { fetchEntityById } from "@/actions/patient";

export default async function PatientDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const patient: Patient | null = await fetchEntityById(id);

  if (!patient) return <p>No patient found.</p>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Patient {patient.id}</h1>

      <div className="space-y-2">
        <p><strong>Name:</strong> {patient.name?.[0]?.given?.join(" ")} {patient.name?.[0]?.family}</p>
        <p><strong>Gender:</strong> {patient.gender}</p>
        <p><strong>Birth Date:</strong> {patient.birthDate}</p>
        <p><strong>Active:</strong> {patient.active ? "Yes" : "No"}</p>
        <p><strong>Marital Status:</strong> {patient.maritalStatus}</p>
      </div>

      <div>
        <h2 className="font-semibold">Identifiers</h2>
        <ul className="list-disc list-inside">
          {patient.identifier?.map((id, idx) => (
            <li key={idx}>
              {id.value}: ({id.system})
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="font-semibold">Contact</h2>
        <ul className="list-disc list-inside">
          {patient.telecom?.map((t, idx) => (
            <li key={idx}>
              {t.system}: {t.value} {t.rank === 1 && "(preferred)"}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="font-semibold">Address</h2>
        {patient.address?.map((addr, idx) => (
          <p key={idx}>
            {addr.line?.join(", ")}, {addr.city}, {addr.state} {addr.postalCode}, {addr.country}
          </p>
        ))}
      </div>
    </div>
  );
}
