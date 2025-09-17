import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";

interface ErrorProps {
  code?: string;
  message?: string
}

export default function Error_({ code, message }: ErrorProps) {
  if (!message) return null;

  return (
    <Alert variant="destructive" className="my-4 shadow-md">
      <div className="flex items-start">
        <AlertTriangle className="h-5 w-5 mr-3 flex-shrink-0" />
        <div className="flex-grow">
          <AlertTitle className="font-bold text-lg">{message}</AlertTitle>
          {code && (
            <AlertDescription className="mt-2">
              <Badge variant="outline" className="font-mono">
                Error Code: {code}
              </Badge>
            </AlertDescription>
          )}
        </div>
      </div>
    </Alert>
  );
}
