import { fetchEntityByPage } from "@/actions/patient";
import type { Patient } from "@/lib/types";

interface PatientEntry {
  fullUrl: string;
  resource: Patient;
}

interface FhirBundle {
  entry: PatientEntry[];
  link?: { relation: string; url: string }[];
}

export default async function PatientPage({
  params,
}: {
  params: { pageno: string };
}) {
  const { pageno } = await params;
  const pageNo = Number(pageno);
  const data: FhirBundle = await fetchEntityByPage(pageNo);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Patients - Page {pageNo}</h1>

      {data.entry?.map((entry) => (
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

      {data.link?.some((l) => l.relation === "next") && (
        <a
          href={`/patients/page/${pageNo + 1}`}
          className="px-4 py-2 bg-blue-600 text-white rounded inline-block"
        >
          Next Page →
        </a>
      )}
    </div>
  );
}

