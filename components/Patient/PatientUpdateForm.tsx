"use client"

import type React from "react"

import { useState } from "react"
import { updateEntity } from "@/actions/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, User, MapPin, Phone, Mail } from "lucide-react"
import type { Patient } from "@/lib/types"

function buildPatientUpdate({
  id,
  email,
  homePhone,
  mobilePhone,
  familyName,
  givenName,
  address,
}: {
  id: string
  email?: string
  homePhone?: string
  mobilePhone?: string
  familyName?: string
  givenName?: string
  address?: { line?: string[]; city?: string; state?: string; postalCode?: string; country?: string }
}): Patient {
  const patient: Patient = {
    resourceType: "Patient",
    id,
    meta: {
      lastUpdated: new Date().toISOString(),
    },
  }

  if (familyName || givenName) {
    patient.name = [
      {
        ...(familyName ? { family: familyName } : {}),
        ...(givenName ? { given: [givenName] } : {}),
      },
    ]
  }

  if (address && Object.values(address).some((val) => val && val.length > 0)) {
    patient.address = [
      {
        use: "home",
        ...(address.line && address.line.length > 0 ? { line: address.line } : {}),
        ...(address.city ? { city: address.city } : {}),
        ...(address.state ? { state: address.state } : {}),
        ...(address.postalCode ? { postalCode: address.postalCode } : {}),
        ...(address.country ? { country: address.country } : {}),
      },
    ]
  }

  const telecom: Patient["telecom"] = []
  if (email) {
    telecom.push({
      system: "email",
      value: email,
      rank: 1,
    })
  }
  if (homePhone) {
    telecom.push({
      system: "phone",
      value: homePhone,
      use: "home",
    })
  }
  if (mobilePhone) {
    telecom.push({
      system: "phone",
      value: mobilePhone,
      use: "mobile",
      rank: 2,
    })
  }
  if (telecom.length > 0) {
    patient.telecom = telecom
  }

  return patient
}

interface PatientUpdateFormProps {
  patientId: string
}

export function PatientUpdateForm({ patientId }: PatientUpdateFormProps) {
  // Demographics
  const [familyName, setFamilyName] = useState("")
  const [givenName, setGivenName] = useState("")

  // Address
  const [street, setStreet] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [postalCode, setPostalCode] = useState("")
  const [country, setCountry] = useState("")

  // Contact info
  const [email, setEmail] = useState("")
  const [homePhone, setHomePhone] = useState("")
  const [mobilePhone, setMobilePhone] = useState("")

  // UI state
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")
    setIsSuccess(false)

    try {
      const patientUpdate = buildPatientUpdate({
        id: patientId,
        email,
        homePhone,
        mobilePhone,
        familyName,
        givenName,
        address: {
          line: [street],
          city,
          state,
          postalCode,
          country,
        },
      })

      const res = await updateEntity("Patient", patientId, patientUpdate)

      if (!res.success) throw res;

      setMessage("Patient updated successfully!")
      setIsSuccess(true)
    } catch (err: any) {
      console.log(err)
      setMessage(`${err?.code}: ${err?.message}`)
      setIsSuccess(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Update Patient</h1>
        <p className="text-muted-foreground">Patient ID: {patientId}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Demographics Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Demographics
            </CardTitle>
            <CardDescription>Update the patient's basic demographic information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="familyName">Family Name</Label>
                <Input
                  id="familyName"
                  type="text"
                  value={familyName}
                  onChange={(e) => setFamilyName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="givenName">Given Name</Label>
                <Input
                  id="givenName"
                  type="text"
                  value={givenName}
                  onChange={(e) => setGivenName(e.target.value)}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Address Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Address
            </CardTitle>
            <CardDescription>Update the patient's home address information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="street">Street Address</Label>
              <Input id="street" type="text" value={street} onChange={(e) => setStreet(e.target.value)} required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" type="text" value={city} onChange={(e) => setCity(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input id="state" type="text" value={state} onChange={(e) => setState(e.target.value)} required />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input
                  id="postalCode"
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input id="country" type="text" value={country} onChange={(e) => setCountry(e.target.value)} required />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Contact Information
            </CardTitle>
            <CardDescription>Update the patient's contact details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Address
              </Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="homePhone">Home Phone</Label>
                <Input
                  id="homePhone"
                  type="tel"
                  value={homePhone}
                  onChange={(e) => setHomePhone(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mobilePhone">Mobile Phone</Label>
                <Input
                  id="mobilePhone"
                  type="tel"
                  value={mobilePhone}
                  onChange={(e) => setMobilePhone(e.target.value)}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Separator />

        <div className="flex flex-col gap-4">
          <Button type="submit" disabled={loading} className="w-full">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "Updating Patient..." : "Update Patient"}
          </Button>

          {message && (
            <Alert variant={isSuccess ? "default" : "destructive"}>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}
        </div>
      </form>
    </div>
  )
}
