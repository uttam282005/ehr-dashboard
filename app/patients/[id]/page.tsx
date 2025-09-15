import type { Patient } from "@/lib/types";
import { fetchEntityById } from "@/actions/patient";

export default async function PatientDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const patient: Patient | null = await fetchEntityById("Patient", id) as Patient | null;
  if (!patient) return <p>No patient found.</p>;

  const raceExtension = patient.extension?.find(ext => ext.url === "http://hl7.org/fhir/us/core/StructureDefinition/us-core-race");
  const ethnicityExtension = patient.extension?.find(ext => ext.url === "http://hl7.org/fhir/us/core/StructureDefinition/us-core-ethnicity");

  const raceText = raceExtension?.extension?.find(e => e.url === "text")?.valueString;
  const ethnicityText = ethnicityExtension?.extension?.find(e => e.url === "text")?.valueString;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Patient {patient.id}</h1>

      <div className="space-y-2">
        <p><strong>Name:</strong> {patient.name?.[0]?.given?.join(" ")} {patient.name?.[0]?.family}</p>
        <p><strong>Gender:</strong> {patient.gender}</p>
        <p><strong>Birth Date:</strong> {patient.birthDate}</p>
        <p><strong>Active:</strong> {patient.active ? "Yes" : "No"}</p>
        <p>
          <strong>Marital Status:</strong> {patient.maritalStatus?.text || "Unknown"}
        </p>
        {raceText && <p><strong>Race:</strong> {raceText}</p>}
        {ethnicityText && <p><strong>Ethnicity:</strong> {ethnicityText}</p>}
      </div>

      <div>
        <h2 className="font-semibold">Identifiers</h2>
        <ul className="list-disc list-inside">
          {patient.identifier?.map((id, idx) => (
            <li key={idx}>
              {id.value} ({id.system})
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

      <div>
        <h2 className="font-semibold">Contacts</h2>
        {patient.contact?.map((contact, idx) => (
          <div key={idx} className="mb-2">
            <p>
              <strong>Relationship:</strong> {contact.relationship?.[0]?.text || "Unknown"}
            </p>
            <p>
              <strong>Name:</strong> {contact.name?.given?.join(" ")}
            </p>
            <p>
              <strong>Phone:</strong> {contact.telecom?.[0]?.value}
            </p>
          </div>
        ))}
      </div>

      <div>
        <h2 className="font-semibold">General Practitioner</h2>
        {patient.generalPractitioner?.map((gp, idx) => (
          <p key={idx}>
            {gp.display} (NPI: {gp.identifier?.value})
          </p>
        ))}
      </div>
    </div>
  );
}

