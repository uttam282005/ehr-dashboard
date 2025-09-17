"use client"

import type { Patient } from "@/lib/types"
import PatientCard from "./PatientCard"
import { Card, CardContent } from "@/components/ui/card"
import { Users, AlertCircle } from "lucide-react"

interface PatientEntry {
  fullUrl: string
  resource: Patient
}

interface PatientListProps {
  patients: PatientEntry[]
  isLoading: boolean
  error: string | null
}

export default function PatientList({ patients, isLoading, error }: PatientListProps) {
  if (error) {
    return (
      <Card className="border-red-200">
        <CardContent className="flex items-center gap-3 p-6">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <div>
            <h3 className="font-semibold text-red-900">Error Loading Patients</h3>
            <p className="text-red-700">{error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (patients.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-12 text-center">
          <Users className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="font-semibold text-lg mb-2">No Patients Found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search criteria or check if there are any active patients.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Users className="h-4 w-4" />
        <span>
          {patients.length} patient{patients.length !== 1 ? "s" : ""} found
        </span>
      </div>

      {patients.map((entry) => (
        <PatientCard key={entry.resource.id} patient={entry.resource} fullUrl={entry.fullUrl} />
      ))}
    </div>
  )
}
