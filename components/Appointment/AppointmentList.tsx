"use client"

import { AppointmentCard } from "./AppointmentCard"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Calendar } from "lucide-react"
import { useRouter } from "next/navigation"
import type { Appointment } from "@/lib/types/appointment"

interface AppointmentEntry {
  fullUrl: string
  resource: Appointment
}

interface AppointmentListProps {
  appointments: AppointmentEntry[]
  loading?: boolean
  error?: string | null
  nextPage?: string | null
}

export function AppointmentList({
  appointments,
  loading = false,
  error = null,
  nextPage = null,
}: AppointmentListProps) {
  const router = useRouter()

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <span>Loading appointments...</span>
      </div>
    )
  }

  if (appointments.length === 0) {
    return (
      <div className="text-center py-8">
        <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-muted-foreground mb-2">No appointments found</h3>
        <p className="text-sm text-muted-foreground">Try adjusting your search criteria</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">
          {appointments.length} appointment{appointments.length !== 1 ? "s" : ""} found
        </h3>
      </div>

      <div className="grid gap-4">
        {appointments.map((entry) => (
          <AppointmentCard
            key={entry.resource.id}
            entry={entry}
            onClick={() => router.push(`/appointment/${entry.resource.id}`)}
          />
        ))}
      </div>

      {nextPage && (
        <div className="flex justify-center pt-4">
          <Button onClick={() => router.push(`/appointment/page/${nextPage}`)} variant="outline">
            Load Next Page
          </Button>
        </div>
      )}
    </div>
  )
}
