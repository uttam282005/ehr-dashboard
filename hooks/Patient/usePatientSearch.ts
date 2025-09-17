"use client"

import { useState, useCallback } from "react"
import type { Patient, ApiError } from "@/lib/types"
import { fetchEntity, fetchEntityByPage } from "@/actions/actions"

interface PatientEntry {
  fullUrl: string
  resource: Patient
}

interface FhirBundle {
  entry: PatientEntry[]
  link?: { relation: string; url: string }[]
}

export interface SearchParams {
  given: string
  family: string
  birthdate: string
  gender: string
  identifier: { type: string, value: string }
  phone: string
  email: string
  active: string
}

const initialSearchParams: SearchParams = {
  given: "",
  family: "",
  birthdate: "",
  gender: "",
  identifier: { type: "", value: "" },
  phone: "",
  email: "",
  active: "true",
}

export function usePatientSearch() {
  const [patients, setPatients] = useState<PatientEntry[]>([])
  const [searchParams, setSearchParams] = useState<SearchParams>(initialSearchParams)
  const [nextPage, setNextPage] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadPatients = useCallback(async (params: Record<string, string> = {}) => {
    try {
      setLoading(true)
      setError(null)

      const res = (await fetchEntity("Patient", params));
      if (!res.success) throw res.error

      const data = res.data as FhirBundle;
      setPatients(data.entry || [])

      const nextLink = data.link?.find((l) => l.relation === "next")
      if (nextLink) {
        const urlObj = new URL(nextLink.url)
        const pageParam = urlObj.searchParams.get("page")
        setNextPage(pageParam ? Number.parseInt(pageParam) : null)
      } else {
        setNextPage(null)
      }
    } catch (err: any) {
      console.error("Error fetching patients:", err)

      setError(err?.message as string || "Failed to load patients")
      setPatients([])
      setNextPage(null)
    } finally {
      setLoading(false)
    }
  }, [])

  const searchPatients = useCallback(
    (params: SearchParams) => {
      const filteredParams: Record<string, string> = {}

      Object.entries(params).forEach(([key, value]) => {
        if (!value || (typeof value === "string" && value.trim() === "")) {
          return
        }

        if (key === "identifier" && typeof value === "object") {
          // Expecting { type, identifierValue }
          const { type, value: identifierValue } = value as {
            type: string
            value: string
          }

          if (identifierValue.trim() !== "") {
            let system = ""
            switch (type) {
              case "MRN":
                system =
                  "http://www.hl7.org/fhir/v2/0203/index.html#v2-0203-MR"
                break
              case "PMS":
                system = "PMS"
                break
              case "SSN":
                system = "http://hl7.org/fhir/sid/us-ssn"
                break
            }

            const token = `${system}|${identifierValue.trim()}`
            filteredParams.identifier = encodeURIComponent(token)
          }
          return
        }

        if (typeof value === "string") {
          filteredParams[key] = value.trim()
        }
      })

      if (Object.keys(filteredParams).length === 0) {
        filteredParams.active = "true"
      }

      loadPatients(filteredParams)
    },
    [loadPatients],
  )

  const clearSearch = useCallback(() => {
    setSearchParams(initialSearchParams)
    loadPatients({ active: "true" })
  }, [loadPatients])

  const loadNextPage = useCallback(async () => {
    if (nextPage) {
      try {
        setLoading(true)
        setError(null)

        const res = await fetchEntityByPage("Patient", nextPage)
        if (!res.success) {
          throw res.error as ApiError
        }

        const data = res.data as FhirBundle;

        setPatients((prev) => [...prev, ...(data.entry || [])])

        const nextLink = data.link?.find((l) => l.relation === "next")
        if (nextLink) {
          const urlObj = new URL(nextLink.url)
          const pageParam = urlObj.searchParams.get("page")
          setNextPage(pageParam ? Number.parseInt(pageParam) : null)
        } else {
          setNextPage(null)
        }
      } catch (err) {
        console.error("Error loading next page:", err)
        setError("Failed to load more patients")
      } finally {
        setLoading(false)
      }
    }
  }, [nextPage])

  return {
    patients,
    searchParams,
    setSearchParams,
    nextPage,
    loading,
    error,
    loadPatients,
    searchPatients,
    clearSearch,
    loadNextPage,
  }
}

