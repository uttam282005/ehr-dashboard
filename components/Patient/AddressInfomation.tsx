import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Home } from "lucide-react";
import { Address } from '@/lib/types';

export default function AddressInformation({ addresses }: {addresses: Address[] | undefined}) {
  if (!addresses || addresses.length === 0) return null;

  const formatAddress = (address: Address) => {
    const parts = [];
    if (address.line) parts.push(address.line.join(', '));
    if (address.city) parts.push(address.city);
    if (address.state) parts.push(address.state);
    if (address.postalCode) parts.push(address.postalCode);
    if (address.country) parts.push(address.country);
    return parts.join(', ');
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <MapPin className="w-5 h-5 text-blue-600" />
          Address Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {addresses.map((address, idx) => (
            <div key={idx} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-100 rounded-full mt-1">
                  <Home className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900 mb-2">
                    {formatAddress(address)}
                  </div>
                  <div className="flex gap-2">
                    {address.use && (
                      <Badge variant="outline" className="capitalize">
                        {address.use}
                      </Badge>
                    )}
                    {address.type && (
                      <Badge variant="secondary" className="capitalize">
                        {address.type}
                      </Badge>
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
