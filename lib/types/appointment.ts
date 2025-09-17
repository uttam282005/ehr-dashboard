// Top-level Appointment type
export interface Appointment {
  resourceType: string; // "Appointment"
  id: string;
  meta: AppointmentMeta;
  status: string;
  appointmentType: AppointmentType;
  reasonCode: ReasonCode[];
  description: string;
  supportingInformation: SupportingInformation[];
  start: string; // ISO date string
  end: string;   // ISO date string
  minutesDuration: number;
  created: string; // ISO date string
  comment: string;
  participant: AppointmentParticipant[];
}

export const appointmentTypes = [
  { code: "1508", display: "Surgery" },
  { code: "1509", display: "New Patient" },
  { code: "1510", display: "Follow-up" },
];

// Meta information
export interface AppointmentMeta {
  lastUpdated: string; // ISO date string
}

// Appointment Type
export interface AppointmentType {
  coding: Coding[];
  text: string;
}

export interface Coding {
  system: string;
  code: string;
  display: string;
}

// Reason Code
export interface ReasonCode {
  coding: Coding[];
  text: string;
}

// Supporting Information
export interface SupportingInformation {
  identifier?: Identifier;
  display: string;
}

export interface Identifier {
  system: string;
  value: string;
}

// Participant
export interface AppointmentParticipant {
  actor: {
    reference: string;   // e.g., "Patient/89145"
    display: string;     // e.g., "https://.../Patient/89145"
  };
}

// Actor Reference
export interface ActorRef {
  actor: {
    reference: string;
    display: string;
  };
}
export interface AppointmentPayload {
  resourceType: "Appointment";
  status:
    | "pending"
    | "booked"
    | "arrived"
    | "fulfilled"
    | "cancelled"
    | "noshow"
    | "checked-in";
  appointmentType: {
    coding: Array<{
      system: string;
      code: string;
      display: string;
    }>;
    text: string;
  };
  start: string;
  end: string;
  minutesDuration: number;
  description?: string;
  comment?: string;
  participant: Array<{
    actor: {
      reference: string;
      display: string;
    };
    status?: string;
  }>;
}

