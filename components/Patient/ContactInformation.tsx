"use client"

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Phone, Mail, MessageSquare, Star } from "lucide-react";
import { ContactPoint } from '@/lib/types';

export default function ContactInformation({ telecom }: {telecom: ContactPoint[] | undefined}) {
  if (!telecom || telecom.length === 0) return null;

  const getIcon = (system: string) => {
    switch (system?.toLowerCase()) {
      case 'phone':
        return <Phone className="w-4 h-4" />;
      case 'email':
        return <Mail className="w-4 h-4" />;
      case 'sms':
        return <MessageSquare className="w-4 h-4" />;
      default:
        return <Phone className="w-4 h-4" />;
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Phone className="w-5 h-5 text-blue-600" />
          Contact Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {telecom.map((contact, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  {getIcon(contact.system)}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    {contact.value}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="capitalize">
                      {contact.system}
                    </Badge>
                    {contact.use && (
                      <Badge variant="secondary" className="capitalize">
                        {contact.use}
                      </Badge>
                    )}
                    {contact.rank === 1 && (
                      <div className="flex items-center gap-1 text-yellow-600">
                        <Star className="w-3 h-3 fill-current" />
                        <span className="text-xs">Preferred</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
