"use client"

import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar, Clock, User, MapPin, Stethoscope, AlertCircle, CheckCircle } from "lucide-react"
import { useAppointmentForm } from "@/hooks/Appointment/useAppointmentForm"

const appointmentTypes = [
  { code: "1508", display: "Surgery" },
  { code: "1509", display: "New Patient" },
  { code: "1510", display: "Follow-up" },
]

const appointmentStatuses = ["pending", "booked", "arrived", "fulfilled", "cancelled", "noshow", "checked-in"]

export function AppointmentForm() {
  const { formData, updateField, errorMessage, successMessage, loading, submitAppointment } = useAppointmentForm()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    submitAppointment()
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Create Appointment</h1>
        <p className="text-gray-600 mt-2">Schedule a new appointment for your patient</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Appointment Details
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => updateField("status", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {appointmentStatuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="appointmentType">Appointment Type</Label>
              <Select
                value={formData.appointmentTypeCode}
                onValueChange={(value) => {
                  const selected = appointmentTypes.find((a) => a.code === value)
                  updateField("appointmentTypeCode", selected?.code || "")
                  updateField("appointmentTypeDisplay", selected?.display || "")
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {appointmentTypes.map((type) => (
                    <SelectItem key={type.code} value={type.code}>
                      {type.display}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="datetime-local"
                value={formData.startLocal}
                onChange={(e) => updateField("startLocal", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                value={formData.minutesDuration}
                onChange={(e) => updateField("minutesDuration", Number.parseInt(e.target.value, 10))}
                min="1"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => updateField("description", e.target.value)}
                placeholder="Brief description of the appointment"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="comment">Comment</Label>
              <Textarea
                id="comment"
                value={formData.comment}
                onChange={(e) => updateField("comment", e.target.value)}
                placeholder="Additional notes or comments"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Participants */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Participants
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Patient */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="patientRef" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Patient ID *
                </Label>
                <Input
                  id="patientRef"
                  value={formData.patientRef}
                  onChange={(e) => updateField("patientRef", e.target.value)}
                  placeholder="Patient reference ID"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="patientDisplay">Patient Name</Label>
                <Input
                  id="patientDisplay"
                  value={formData.patientDisplay}
                  onChange={(e) => updateField("patientDisplay", e.target.value)}
                  placeholder="Patient display name"
                />
              </div>
            </div>

            {/* Practitioner */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="practitionerRef" className="flex items-center gap-2">
                  <Stethoscope className="h-4 w-4" />
                  Practitioner ID *
                </Label>
                <Input
                  id="practitionerRef"
                  value={formData.practitionerRef}
                  onChange={(e) => updateField("practitionerRef", e.target.value)}
                  placeholder="Practitioner reference ID"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="practitionerDisplay">Practitioner Name</Label>
                <Input
                  id="practitionerDisplay"
                  value={formData.practitionerDisplay}
                  onChange={(e) => updateField("practitionerDisplay", e.target.value)}
                  placeholder="Practitioner display name"
                />
              </div>
            </div>

            {/* Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="locationRef" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Location ID *
                </Label>
                <Input
                  id="locationRef"
                  value={formData.locationRef}
                  onChange={(e) => updateField("locationRef", e.target.value)}
                  placeholder="Location reference ID"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="locationDisplay">Location Name</Label>
                <Input
                  id="locationDisplay"
                  value={formData.locationDisplay}
                  onChange={(e) => updateField("locationDisplay", e.target.value)}
                  placeholder="Location display name"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Messages */}
        {errorMessage && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        {successMessage && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">{successMessage}</AlertDescription>
          </Alert>
        )}

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button type="submit" disabled={loading} className="min-w-32">
            {loading ? (
              <>
                <Clock className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Appointment"
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
