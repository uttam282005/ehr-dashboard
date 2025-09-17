import { fetchEntityByPage } from "@/actions/actions"
import type { ApiError, Patient } from "@/lib/types"
import PatientList from "@/components/Patient/PatientList"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Search, AlertCircle } from "lucide-react"
import Link from "next/link"
import { Suspense } from "react"

interface PatientEntry {
  fullUrl: string
  resource: Patient
}

interface FhirBundle {
  entry: PatientEntry[]
  link?: { relation: string; url: string }[]
  total?: number
}

function LoadingSkeleton() {
  return <PatientList patients={[]} isLoading={true} error={null} />
}

async function PatientPageContent({ pageNo }: { pageNo: number }) {
  try {
    const res = (await fetchEntityByPage("Patient", pageNo));
    if (!res.success) throw res.error;

    const data = res.data as FhirBundle;
    if (!data.entry || data.entry.length === 0) {
      return <PatientList patients={[]} isLoading={false} error={null} />
    }

    const hasNextPage = data.link?.some((l) => l.relation === "next")
    const hasPrevPage = pageNo > 1

    return (
      <div className="space-y-6">
        {/* Results Summary */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {data.entry.length} patients on page {pageNo}
            {data.total && ` of ${data.total} total`}
          </div>
          <Button asChild size="sm" variant="outline">
            <Link href="/patient">
              <Search className="w-4 h-4 mr-2" />
              Search Patients
            </Link>
          </Button>
        </div>

        <PatientList patients={data.entry} isLoading={false} error={null} />

        {/* Pagination */}
        <div className="flex items-center justify-between pt-4">
          <div>
            {hasPrevPage && (
              <Button asChild variant="outline">
                <Link href={`/patients/page/${pageNo - 1}`}>
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous Page
                </Link>
              </Button>
            )}
          </div>

          <div className="text-sm text-gray-500">Page {pageNo}</div>

          <div>
            {hasNextPage && (
              <Button asChild>
                <Link href={`/patients/page/${pageNo + 1}`}>
                  Next Page
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    )
  } catch (error: any) {
    const errorMessage = error.message ? error.message : "An unexpected error occurred"
    return <PatientList patients={[]} isLoading={false} error={errorMessage} />
  }
}

export default async function PatientPage({
  params,
}: {
  params: { pageno: string }
}) {
  const { pageno } = await params
  const pageNo = Number(pageno)

  if (isNaN(pageNo) || pageNo < 1) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="text-center py-12">
          <CardContent>
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Invalid page number</h3>
            <p className="text-gray-500 mb-4">Please provide a valid page number.</p>
            <Button asChild>
              <Link href="/patients">Return to Search</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Patient Directory</h1>
            <p className="text-gray-600 mt-2">Browse and manage patient records</p>
          </div>
          <Button asChild>
            <Link href="/patient">
              <Search className="w-4 h-4 mr-2" />
              Advanced Search
            </Link>
          </Button>
        </div>
      </div>

      <Suspense fallback={<LoadingSkeleton />}>
        <PatientPageContent pageNo={pageNo} />
      </Suspense>
    </div>
  )
}

