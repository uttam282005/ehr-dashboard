import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IdCard } from "lucide-react";
import { Identifier } from '@/lib/types';

export default function PatientIdentifiers({ identifiers }: { identifiers: Identifier[] | undefined }) {
  if (!identifiers || identifiers.length === 0) return null;

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <IdCard className="w-5 h-5 text-blue-600" />
          Patient Identifiers
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {identifiers.map((identifier, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <div className="font-mono text-lg font-semibold text-gray-900">
                  {identifier.value}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {identifier.system}
                </div>
              </div>
              {identifier.type?.text && (
                <Badge variant="outline" className="ml-4">
                  {identifier.type.text}
                </Badge>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
