"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useAppointmentSearch } from "@/hooks/Appointment/useAppointmentSearch"
import { AppointmentSearchForm } from "@/components/Appointment/AppointmentSearchForm"
import { AppointmentList } from "@/components/Appointment/AppointmentList"

export default function AppointmentsPage() {
  const { appointments, nextPage, loading, error, searchParams, loadAppointments, handleSearch, updateSearchParams } =
    useAppointmentSearch()

  useEffect(() => {
    loadAppointments()
  }, [loadAppointments])

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Appointments</h1>
        <Link href="/appointment/create">
          <button className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 transition">
            + Create Appointment
          </button>
        </Link>
      </div>

      {/* Search */}
      <AppointmentSearchForm
        searchParams={searchParams}
        onParamsChange={updateSearchParams}
        onSearch={handleSearch}
        loading={loading}
      />

      {/* List */}
      <AppointmentList appointments={appointments} loading={loading} error={error} nextPage={nextPage} />
    </div>
  )
}

