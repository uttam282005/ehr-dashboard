import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Phone } from "lucide-react";
import { PatientContact } from '@/lib/types';

export default function EmergencyContacts({ contacts }: {contacts: PatientContact[] | undefined}) {
  if (!contacts || contacts.length === 0) return null;

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <UserPlus className="w-5 h-5 text-blue-600" />
          Emergency Contacts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {contacts.map((contact, idx) => (
            <div key={idx} className="p-4 border border-gray-200 rounded-lg">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-gray-900">
                      {contact.name?.given?.join(' ')} {contact.name?.family}
                    </div>
                    <div className="text-sm text-gray-600">
                      {contact.relationship?.[0]?.text || 'Emergency Contact'}
                    </div>
                  </div>
                  {contact.relationship?.[0]?.text && (
                    <Badge variant="outline">
                      {contact.relationship[0].text}
                    </Badge>
                  )}
                </div>
                
                {contact.telecom && contact.telecom.length > 0 && (
                  <div className="space-y-2">
                    {contact.telecom.map((tel, telIdx) => (
                      <div key={telIdx} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{tel.value}</span>
                          <Badge variant="secondary" className="text-xs capitalize">
                            {tel.system}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
