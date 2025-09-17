import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Stethoscope, IdCard } from "lucide-react";
import { GeneralPractitioner } from '@/lib/types';

export default function GeneralPractitioners({ practitioners }: {practitioners: GeneralPractitioner[] | undefined}) {
  if (!practitioners || practitioners.length === 0) return null;

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Stethoscope className="w-5 h-5 text-blue-600" />
          General Practitioners
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {practitioners.map((gp, idx) => (
            <div key={idx} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-100 rounded-full">
                  <Stethoscope className="w-4 h-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 mb-2">
                    {gp.display || 'General Practitioner'}
                  </div>
                  {gp.identifier?.value && (
                    <div className="flex items-center gap-2">
                      <IdCard className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">NPI:</span>
                      <Badge variant="outline" className="font-mono">
                        {gp.identifier.value}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
