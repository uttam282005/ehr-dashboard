import { PatientUpdateForm } from "@/components/Patient/PatientUpdateForm"

export default function UpdatePatientPage({ params }: { params: { id: string } }) {
  return <PatientUpdateForm patientId={params.id} />
}

