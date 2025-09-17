"use client"

import type React from "react"

import { useRouter } from "next/navigation"
import type { Patient } from "@/lib/types"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { User, Calendar, Phone, Mail, MapPin, Heart, Edit, ExternalLink, Award as IdCard, Users } from "lucide-react"

interface PatientCardProps {
  patient: Patient
  fullUrl: string
}

export default function PatientCard({ patient, fullUrl }: PatientCardProps) {
  const router = useRouter()

  // Helper functions to extract patient information
  const getFullName = () => {
    if (!patient.name || patient.name.length === 0) return "Unknown"
    const name = patient.name[0]
    return `${name.given?.join(" ") || ""} ${name.family || ""}`.trim() || "Unknown"
  }

  const getPrimaryPhone = () => {
    return patient.telecom?.find((t) => t.system === "phone")?.value
  }

  const getPrimaryEmail = () => {
    return patient.telecom?.find((t) => t.system === "email")?.value
  }

  const getPrimaryAddress = () => {
    if (!patient.address || patient.address.length === 0) return null
    const addr = patient.address[0]
    const parts = [addr.line?.join(", "), addr.city, addr.state, addr.postalCode].filter(Boolean)
    return parts.join(", ")
  }

  const getPrimaryIdentifier = () => {
    return patient.identifier?.find((id) => id.system)?.value
  }

  const getAge = () => {
    if (!patient.birthDate) return null
    const birthDate = new Date(patient.birthDate)
    const today = new Date()
    const age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1
    }
    return age
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const handleCardClick = () => {
    router.push(`/patient/${patient.id}`)
  }

  const handleUpdateClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    router.push(`/patient/update/${patient.id}`)
  }

  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow duration-200 border-l-4 border-l-blue-500"
      onClick={handleCardClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-full">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{getFullName()}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>ID: {patient.id}</span>
                {patient.active !== undefined && (
                  <Badge variant={patient.active ? "default" : "secondary"}>
                    {patient.active ? "Active" : "Inactive"}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleUpdateClick}
            className="flex items-center gap-1 bg-transparent"
          >
            <Edit className="h-4 w-4" />
            Update
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Demographics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {patient.birthDate && (
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>
                {formatDate(patient.birthDate)}
                {getAge() && ` (${getAge()} years old)`}
              </span>
            </div>
          )}

          {patient.gender && (
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="capitalize">{patient.gender}</span>
            </div>
          )}
        </div>

        {/* Contact Information */}
        <div className="space-y-2">
          {getPrimaryPhone() && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{getPrimaryPhone()}</span>
            </div>
          )}

          {getPrimaryEmail() && (
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{getPrimaryEmail()}</span>
            </div>
          )}

          {getPrimaryAddress() && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{getPrimaryAddress()}</span>
            </div>
          )}
        </div>

        {/* Additional Information */}
        <div className="space-y-2">
          {getPrimaryIdentifier() && (
            <div className="flex items-center gap-2 text-sm">
              <IdCard className="h-4 w-4 text-muted-foreground" />
              <span>ID: {getPrimaryIdentifier()}</span>
            </div>
          )}

          {patient.maritalStatus?.text && (
            <div className="flex items-center gap-2 text-sm">
              <Heart className="h-4 w-4 text-muted-foreground" />
              <span>Marital Status: {patient.maritalStatus.text}</span>
            </div>
          )}

          {patient.deceasedBoolean !== undefined && patient.deceasedBoolean && (
            <Badge variant="destructive" className="text-xs">
              Deceased
            </Badge>
          )}
        </div>

        {/* Metadata */}
        <div className="pt-2 border-t">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Last Updated: {formatDate(patient.meta.lastUpdated)}</span>
            <div className="flex items-center gap-1">
              <ExternalLink className="h-3 w-3" />
              <span className="truncate max-w-[200px]">{fullUrl}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
