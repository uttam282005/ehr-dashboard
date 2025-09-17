"use client"

import type { FormEvent } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Calendar, User, Stethoscope, FileText } from "lucide-react"
import { appointmentTypes } from "@/lib/types/appointment"

interface SearchParams
 {
  status: string
  "appointment-type": string
  date: string
  patient: string
  practitioner: string
}

interface AppointmentSearchFormProps {
  searchParams: SearchParams
  onParamsChange: (updates: Partial<SearchParams>) => void
  onSearch: (params: SearchParams) => void
  loading?: boolean
}

export function AppointmentSearchForm({
  searchParams,
  onParamsChange,
  onSearch,
  loading = false,
}: AppointmentSearchFormProps) {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSearch(searchParams)
  }

  const handleInputChange = (field: keyof SearchParams, value: string) => {
    onParamsChange({ [field]: value })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Search Appointments
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Status
              </Label>
              <Select value={searchParams.status} onValueChange={(value) => handleInputChange("status", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Any status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="booked">Booked</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="arrived">Arrived</SelectItem>
                  <SelectItem value="fulfilled">Fulfilled</SelectItem>
                  <SelectItem value="noshow">No Show</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="appointment-type" className="flex items-center gap-2">
                <Stethoscope className="h-4 w-4" />
                Appointment Type
              </Label>
              <select
                id="appointment-type"
                value={searchParams["appointment-type"]}
                onChange={(e) => handleInputChange("appointment-type", e.target.value)}
                className="w-full border p-2 rounded"
              >
                <option value="">Select an appointment type</option>
                {appointmentTypes.map((type: any) => (
                  <option key={type.code} value={type.code}>
                    {type.display}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Date
              </Label>
              <Input
                id="date"
                type="date"
                value={searchParams.date}
                onChange={(e) => handleInputChange("date", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="patient" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Patient ID
              </Label>
              <Input
                id="patient"
                value={searchParams.patient}
                onChange={(e) => handleInputChange("patient", e.target.value)}
                placeholder="Patient resource ID"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="practitioner" className="flex items-center gap-2">
                <Stethoscope className="h-4 w-4" />
                Practitioner ID
              </Label>
              <Input
                id="practitioner"
                value={searchParams.practitioner}
                onChange={(e) => handleInputChange("practitioner", e.target.value)}
                placeholder="Practitioner ID"
              />
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full md:w-auto">
            <Search className="h-4 w-4 mr-2" />
            {loading ? "Searching..." : "Search Appointments"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
