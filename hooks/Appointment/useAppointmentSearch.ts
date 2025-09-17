"use client"

import { useState, useCallback } from "react"
import { fetchEntity } from "@/actions/actions"
import type { Appointment } from "@/lib/types/appointment"

interface AppointmentEntry {
  fullUrl: string
  resource: Appointment
}

interface FhirBundle {
  entry: AppointmentEntry[]
  link?: { relation: string; url: string }[]
}

interface SearchParams {
  status: string
  "appointment-type": string
  date: string
  patient: string
  practitioner: string
}

export function useAppointmentSearch() {
  const [appointments, setAppointments] = useState<AppointmentEntry[]>([])
  const [nextPage, setNextPage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchParams, setSearchParams] = useState<SearchParams>({
    status: "",
    "appointment-type": "",
    date: "",
    patient: "",
    practitioner: "",
  })

  const loadAppointments = useCallback(async (params: Record<string, string> = {}) => {
    try {
      setLoading(true)
      setError(null)

      const urlSearchParams = new URLSearchParams()

      Object.entries(params).forEach(([key, value]) => {
        if (key === "date" && value) {
          const day = new Date(value)
          const startOfDay = new Date(day.setHours(0, 0, 0, 0)).toISOString()
          const endOfDay = new Date(day.setHours(23, 59, 59, 999)).toISOString()
          urlSearchParams.append("date", `ge${startOfDay}`)
          urlSearchParams.append("date2", `le${endOfDay}`)
        } else if (key === "patient" && value.trim() !== "") {
          urlSearchParams.append("patient", `Patient/${value.trim()}`)
        } else if (value.trim() !== "") {
          urlSearchParams.append(key, value.trim())
        }
      })

      const res = await fetchEntity("Appointment", Object.fromEntries(urlSearchParams.entries()))
      if (!res.success) throw res.error

      const data = res.data as FhirBundle
      setAppointments(data.entry || [])

      const nextLink = data.link?.find((l) => l.relation === "next")
      setNextPage(nextLink ? new URL(nextLink.url).searchParams.get("page") : null)
    } catch (err: any) {
      console.error("Error fetching appointments:", err)
      setError(err?.details?.issue[0]?.diagnostics || err.message + " ,Id's should be valid")
    } finally {
      setLoading(false)
    }
  }, [])

  const handleSearch = useCallback(
    (params: SearchParams) => {
      const filteredParams: Record<string, string> = {}
      Object.entries(params).forEach(([key, value]) => {
        if (value.trim() !== "") {
          filteredParams[key] = value.trim()
        }
      })
      loadAppointments(filteredParams)
    },
    [loadAppointments],
  )

  const updateSearchParams = useCallback((updates: Partial<SearchParams>) => {
    setSearchParams((prev) => ({ ...prev, ...updates }))
  }, [])

  return {
    appointments,
    nextPage,
    loading,
    error,
    searchParams,
    loadAppointments,
    handleSearch,
    updateSearchParams,
  }
}
