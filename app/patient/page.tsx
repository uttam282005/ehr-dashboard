"use client"

import { useEffect, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import PatientSearchForm from "@/components/Patient/PatientSearchForm"
import PatientList from "@/components/Patient/PatientList"
import { usePatientSearch } from "@/hooks/Patient/usePatientSearch"

export default function PatientsPage() {
  const router = useRouter()
  const {
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
  } = usePatientSearch()

  // Initial load with active patients
  useEffect(() => {
    loadPatients({ active: "true" })
  }, [loadPatients])

  const handleSearch = (e: FormEvent) => {
    e.preventDefault()
    searchPatients(searchParams)
  }

  const handleNextPage = () => {
    if (nextPage) {
      router.push(`/patient/page/${nextPage}`)
    } else {
      loadNextPage()
    }
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Patient Management</h1>
          <p className="text-muted-foreground">Search and manage patient records in your FHIR system</p>
        </div>
      </div>

      <PatientSearchForm
        searchParams={searchParams}
        onParamsChange={setSearchParams}
        onSearch={handleSearch}
        onClear={clearSearch}
        isLoading={loading}
      />

      <PatientList patients={patients} isLoading={loading} error={error} />

      {!loading && nextPage && patients.length > 0 && (
        <div className="flex justify-center pt-4">
          <Button onClick={handleNextPage} variant="outline" className="flex items-center gap-2 bg-transparent">
            Load Next Page
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}

