"use client"

import { useState, useMemo, FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Search, X } from "lucide-react"

// Types
export interface SearchParams {
  given: string
  family: string
  birthdate: string
  gender: string
  identifier: { type?: string, value?: string }
  phone: string
  email: string
  active: string
}

interface PatientSearchFormProps {
  searchParams: SearchParams
  onParamsChange: any
  onSearch: (e: FormEvent) => void
  onClear: () => void
  isLoading: boolean
}

// Utility: simple debounce
function debounce<T extends (...args: any[]) => void>(fn: T, delay: number) {
  let timer: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

export default function PatientSearchForm({
  searchParams,
  onParamsChange,
  onSearch,
  onClear,
  isLoading,
}: PatientSearchFormProps) {
  // Local state for fast typing
  const [localParams, setLocalParams] = useState<SearchParams>(searchParams)

  const handleChange = (field: keyof SearchParams, value: any) => {
    setLocalParams((prev) => ({ ...prev, [field]: value }))
    debouncedParamsChange({ ...localParams, [field]: value })
  }

  // Debounced parent sync (only if you want live updates)
  const debouncedParamsChange = useMemo(
    () =>
      debounce((params: SearchParams) => {
        onParamsChange(params)
      }, 300),
    [onParamsChange]
  )

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    // Sync final params to parent + run search
    onParamsChange(localParams)
    onSearch(e)
  }

  const handleClear = () => {
    const cleared: SearchParams = {
      given: "",
      family: "",
      birthdate: "",
      gender: "any",
      identifier: {type: "", value: ""},
      phone: "",
      email: "",
      active: "any",
    }
    setLocalParams(cleared)
    onParamsChange(cleared)
    onClear()
  }

  const hasActiveFilters = useMemo(
    () =>
      Object.values(localParams).some(
        (v) => v !== "" && v !== "any" && v !== "true"
      ),
    [localParams]
  )

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Search className="h-5 w-5" />
          Search Patients
        </CardTitle>
        {hasActiveFilters && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleClear}
            className="flex items-center gap-1 bg-transparent"
          >
            <X className="h-4 w-4" />
            Clear
          </Button>
        )}
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Given Name */}
            <div className="space-y-2">
              <Label htmlFor="given">Given Name</Label>
              <Input
                id="given"
                type="text"
                value={localParams.given}
                onChange={(e) => handleChange("given", e.target.value)}
                placeholder="First name"
                disabled={isLoading}
              />
            </div>

            {/* Family Name */}
            <div className="space-y-2">
              <Label htmlFor="family">Family Name</Label>
              <Input
                id="family"
                type="text"
                value={localParams.family}
                onChange={(e) => handleChange("family", e.target.value)}
                placeholder="Last name"
                disabled={isLoading}
              />
            </div>

            {/* Birth Date */}
            <div className="space-y-2">
              <Label htmlFor="birthdate">Birth Date</Label>
              <Input
                id="birthdate"
                type="date"
                value={localParams.birthdate}
                onChange={(e) => handleChange("birthdate", e.target.value)}
                disabled={isLoading}
              />
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select
                value={localParams.gender}
                onValueChange={(value) => handleChange("gender", value)}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                  <SelectItem value="unknown">Unknown</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Identifier */}
            <div className="space-y-2">
              <Label htmlFor="identifierType">Identifier Type</Label>
              <select
                id="identifierType"
                className="w-full border rounded p-2"
                value={localParams.identifier.type}
                onChange={(e) => handleChange("identifier", { type: e.target.value, value: localParams.identifier.value }) }
                disabled={isLoading}
              >
                <option value="">Select Identifier</option>
                <option value="MRN">MRN</option>
                <option value="PMS">PMS</option>
                <option value="SSN">SSN</option>
              </select>

              <Label htmlFor="identifierValue">Identifier Value</Label>
              <Input
                id="identifierValue"
                type="text"
                value={localParams.identifier.value}
                onChange={(e) => handleChange("identifier", { type: localParams.identifier.type, value: e.target.value })}
                placeholder="Enter identifier value"
                disabled={isLoading}
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={localParams.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="Phone number"
                disabled={isLoading}
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={localParams.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="Email address"
                disabled={isLoading}
              />
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="active">Status</Label>
              <Select
                value={localParams.active}
                onValueChange={(value) => handleChange("active", value)}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any status</SelectItem>
                  <SelectItem value="true">Active</SelectItem>
                  <SelectItem value="false">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <Search className="h-4 w-4" />
              {isLoading ? "Searching..." : "Search"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

