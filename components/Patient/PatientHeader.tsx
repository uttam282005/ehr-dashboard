import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, Calendar, Users, Activity } from "lucide-react";
import { Patient } from '@/lib/types';

export default function PatientHeader({ patient }: { patient: Patient }) {
  const primaryName = patient.name?.[0];
  const fullName = primaryName ? `${primaryName.given?.join(' ')} ${primaryName.family}` : 'Unknown Patient';
  const initials = primaryName ? `${primaryName.given?.[0]?.charAt(0) || ''}${primaryName.family?.charAt(0) || ''}` : 'UP';

  const calculateAge = (birthDate: string | undefined) => {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const age = calculateAge(patient.birthDate);

  return (
    <Card className="border-none shadow-lg bg-gradient-to-r from-slate-50 to-blue-50">
      <CardContent className="p-8">
        <div className="flex items-start gap-6">
          <Avatar className="h-20 w-20 border-4 border-white shadow-lg">
            <AvatarFallback className="text-xl font-semibold bg-blue-100 text-blue-800">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{fullName}</h1>
              <p className="text-lg text-gray-600">Patient ID: {patient.id}</p>
            </div>

            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-gray-700">Gender:</span>
                <Badge variant="secondary" className="capitalize">
                  {patient.gender || 'Not specified'}
                </Badge>
              </div>

              {age && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-gray-700">Age:</span>
                  <Badge variant="secondary">{age} years old</Badge>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-gray-700">Status:</span>
                <Badge
                  variant={patient.active ? "default" : "destructive"}
                  className={patient.active ? "bg-green-600 hover:bg-green-700" : ""}
                >
                  {patient.active ? 'Active' : 'Inactive'}
                </Badge>
              </div>

              {patient.deceasedBoolean && (
                <Badge variant="destructive" className="bg-red-600">
                  Deceased
                </Badge>
              )}
            </div>

            {patient.birthDate && (
              <div className="text-sm text-gray-600">
                <span className="font-medium">Date of Birth:</span> {new Date(patient.birthDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
