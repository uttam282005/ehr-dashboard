"use server"

import { updateEntity } from "@/actions/actions"

interface Props {
  patientId: string
  patientUpdate: any
}

export async function PatientUpdateHandler({ patientId, patientUpdate }: Props) {
  // this code runs on the server
  const res = updateEntity("Patient", patientId, patientUpdate) 
  return res
}
