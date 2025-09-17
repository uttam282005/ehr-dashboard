import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Globe, Heart, MessageCircle } from "lucide-react";
import { Patient } from '@/lib/types';

export default function DemographicDetails({ patient }: {patient: Patient}) {
  const raceExtension = patient.extension?.find(ext => 
    ext.url === "http://hl7.org/fhir/us/core/StructureDefinition/us-core-race"
  );
  const ethnicityExtension = patient.extension?.find(ext => 
    ext.url === "http://hl7.org/fhir/us/core/StructureDefinition/us-core-ethnicity"
  );

  const raceText = raceExtension?.extension?.find(e => e.url === "text")?.valueString;
  const ethnicityText = ethnicityExtension?.extension?.find(e => e.url === "text")?.valueString;

  const hasData = raceText || ethnicityText || patient.maritalStatus?.text || 
                  (patient.communication && patient.communication.length > 0);

  if (!hasData) return null;

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Users className="w-5 h-5 text-blue-600" />
          Demographics & Preferences
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {raceText && (
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-full">
                <Globe className="w-4 h-4 text-orange-600" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-700">Race</div>
                <Badge variant="secondary">{raceText}</Badge>
              </div>
            </div>
          )}

          {ethnicityText && (
            <div className="flex items-center gap-3">
              <div className="p-2 bg-teal-100 rounded-full">
                <Globe className="w-4 h-4 text-teal-600" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-700">Ethnicity</div>
                <Badge variant="secondary">{ethnicityText}</Badge>
              </div>
            </div>
          )}

          {patient.maritalStatus?.text && (
            <div className="flex items-center gap-3">
              <div className="p-2 bg-pink-100 rounded-full">
                <Heart className="w-4 h-4 text-pink-600" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-700">Marital Status</div>
                <Badge variant="secondary">{patient.maritalStatus.text}</Badge>
              </div>
            </div>
          )}

          {patient.communication && patient.communication.length > 0 && (
            <div className="flex items-start gap-3">
              <div className="p-2 bg-indigo-100 rounded-full">
                <MessageCircle className="w-4 h-4 text-indigo-600" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-700 mb-2">Communication</div>
                <div className="space-y-1">
                  {patient.communication.map((comm, idx) => (
                    <Badge key={idx} variant="outline">
                      {comm.language?.text || comm.language?.coding?.[0]?.display || 'Language'}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
