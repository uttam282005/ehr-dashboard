import { ArrowLeft, Calendar, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ApiError, Patient } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { fetchEntityById } from "@/actions/actions";

// Import modular components
import PatientHeader from "@/components/Patient/PatientHeader";
import PatientIdentifiers from "@/components/Patient/PatientIdentifiers";
import ContactInformation from "@/components/Patient/ContactInformation";
import AddressInformation from "@/components/Patient/AddressInfomation";
import EmergencyContacts from "@/components/Patient/EmergencyContacts";
import GeneralPractitioners from "@/components/Patient/GeneralPractitioners";
import DemographicDetails from "@/components/Patient/DemographicDetails";
import Error_ from "@/components/Error_"

export default async function PatientDetailPage({ params }: { params: { id: string } }) {
  try {
    const { id } = await params;
    const res = await fetchEntityById("Patient", id);
    if (!res.success) throw res.error as ApiError;
    const patient: Patient = res.data as Patient;
    if (!patient) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Card className="p-8">
            <CardContent className="text-center">
              <p className="text-gray-600">Patient not found.</p>
            </CardContent>
          </Card>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                Last updated: {new Date(patient.meta.lastUpdated).toLocaleString()}
              </div>
            </div>
            <Badge variant="outline" className="text-xs">
              {patient.resourceType}
            </Badge>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="space-y-8">
            {/* Patient Header */}
            <PatientHeader patient={patient} />

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <PatientIdentifiers identifiers={patient.identifier} />
                <ContactInformation telecom={patient.telecom} />
                <DemographicDetails patient={patient} />
              </div>

              <div className="space-y-6">
                <AddressInformation addresses={patient.address} />
                <EmergencyContacts contacts={patient.contact} />
                <GeneralPractitioners practitioners={patient.generalPractitioner} />
              </div>
            </div>

            {/* Additional Information */}
            {patient.communication && patient.communication.length > 0 && (
              <Card className="shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <MessageCircle className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold">Communication Preferences</h3>
                  </div>
                  <div className="flex gap-2">
                    {patient.communication.map((comm, idx) => (
                      <Badge key={idx} variant="outline" className="text-sm">
                        {comm.language?.text || 'Language preference'}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    );
  } catch (error: any) {
    return <Error_ message={error.meessage} code={error.code} />
  }
}

