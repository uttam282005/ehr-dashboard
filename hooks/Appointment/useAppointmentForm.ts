"use client"

import { useState } from "react"
import type { AppointmentPayload } from "@/lib/types/appointment"
import { createAppointment } from "@/actions/actions"

export interface AppointmentFormData {
  status: AppointmentPayload["status"]
  appointmentTypeCode: string
  appointmentTypeDisplay: string
  startLocal: string
  minutesDuration: number
  description: string
  comment: string
  patientRef: string
  patientDisplay: string
  practitionerRef: string
  practitionerDisplay: string
  locationRef: string
  locationDisplay: string
}

export const useAppointmentForm = () => {
  const [formData, setFormData] = useState<AppointmentFormData>({
    status: "booked",
    appointmentTypeCode: "1509",
    appointmentTypeDisplay: "New Patient",
    startLocal: "",
    minutesDuration: 10,
    description: "",
    comment: "",
    patientRef: "",
    patientDisplay: "",
    practitionerRef: "",
    practitionerDisplay: "",
    locationRef: "",
    locationDisplay: "",
  })

  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const updateField = (field: keyof AppointmentFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const calculateEndTime = (startISO: string, duration: number) => {
    const startDate = new Date(startISO)
    const endDate = new Date(startDate.getTime() + duration * 60000)
    return endDate.toISOString()
  }

  const validateForm = () => {
    if (!formData.startLocal || !formData.patientRef || !formData.practitionerRef || !formData.locationRef) {
      setErrorMessage("Please provide required fields: start time, patient, practitioner, and location.")
      return false
    }
    return true
  }

  const submitAppointment = async () => {
    setErrorMessage("")
    setSuccessMessage("")

    if (!validateForm()) return

    const startISO = new Date(formData.startLocal).toISOString()
    const endISO = calculateEndTime(startISO, formData.minutesDuration)

    const payload: AppointmentPayload = {
      resourceType: "Appointment",
      status: formData.status,
      appointmentType: {
        coding: [
          {
            system: "{base url}/{firm_url_prefix}/ema/fhir/v2/ValueSet/appointment-type",
            code: formData.appointmentTypeCode,
            display: formData.appointmentTypeDisplay,
          },
        ],
        text: formData.appointmentTypeDisplay,
      },
      start: startISO,
      end: endISO,
      minutesDuration: formData.minutesDuration,
      description: formData.description,
      comment: formData.comment,
      participant: [
        {
          actor: {
            reference: `Location/${formData.locationRef}`,
            display: formData.locationDisplay || "",
          },
          status: "accepted",
        },
        {
          actor: {
            reference: `Practitioner/${formData.practitionerRef}`,
            display: formData.practitionerDisplay || "",
          },
          status: "accepted",
        },
        {
          actor: {
            reference: `Patient/${formData.patientRef}`,
            display: formData.patientDisplay || "",
          },
          status: "accepted",
        },
      ],
    }

    try {
      setLoading(true)
      const response = await createAppointment(payload)
      if (!response.success) {
        setErrorMessage(`${response.error.code}: ${response.error.message}`)
      } else {
        setSuccessMessage("Appointment created successfully!")
        // Reset form on success
        setFormData({
          status: "booked",
          appointmentTypeCode: "1509",
          appointmentTypeDisplay: "New Patient",
          startLocal: "",
          minutesDuration: 10,
          description: "",
          comment: "",
          patientRef: "",
          patientDisplay: "",
          practitionerRef: "",
          practitionerDisplay: "",
          locationRef: "",
          locationDisplay: "",
        })
      }
    } catch (error: any) {
      console.error(error)
      setErrorMessage(error.message || "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return {
    formData,
    updateField,
    errorMessage,
    successMessage,
    loading,
    submitAppointment,
  }
}
