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
  identifier: string
  phone: string
  email: string
  active: string
}

const initialSearchParams: SearchParams = {
  given: "",
  family: "",
  birthdate: "",
  gender: "",
  identifier: "",
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
        if (value.trim() !== "") {
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

        const data = (await fetchEntityByPage("Patient", nextPage)) as FhirBundle

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

