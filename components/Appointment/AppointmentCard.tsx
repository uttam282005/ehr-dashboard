"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, User, FileText, MessageSquare } from "lucide-react"
import type { Appointment } from "@/lib/types/appointment"

interface AppointmentEntry {
  fullUrl: string
  resource: Appointment
}

interface AppointmentCardProps {
  entry: AppointmentEntry
  onClick?: () => void
}

export function AppointmentCard({ entry, onClick }: AppointmentCardProps) {
  const { resource } = entry

  // Extract appointment type
  let appointmentTypeText = "Unknown Type"
  if (resource.appointmentType?.coding?.length > 0) {
    appointmentTypeText =
      resource.appointmentType.coding[0].display || resource.appointmentType.coding[0].code || "Unknown Type"
  } else if (resource.appointmentType?.text) {
    appointmentTypeText = resource.appointmentType.text
  }

  const reasons = resource.reasonCode?.map((rc) => rc.text).join(", ") || "No reason specified"

  const getStatusColor = (status: string) => {
    switch (status) {
      case "booked":
        return "bg-blue-100 text-blue-800"
      case "arrived":
        return "bg-green-100 text-green-800"
      case "fulfilled":
        return "bg-emerald-100 text-emerald-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "noshow":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString()
  }

  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={onClick}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">ID: {resource.id}</span>
          </div>
          <Badge className={getStatusColor(resource.status)}>{resource.status}</Badge>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              <strong>Type:</strong> {appointmentTypeText}
            </span>
          </div>

          {resource.start && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                <strong>Start:</strong> {formatDateTime(resource.start)}
              </span>
            </div>
          )}

          {resource.end && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                <strong>End:</strong> {formatDateTime(resource.end)}
              </span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              <strong>Reason:</strong> {reasons}
            </span>
          </div>

          {resource.comment && (
            <div className="flex items-start gap-2">
              <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5" />
              <span className="text-sm">
                <strong>Comment:</strong> {resource.comment}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
