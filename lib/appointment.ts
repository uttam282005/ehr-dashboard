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
  start?: string; // ISO date string
  minutesDuration?: number;
  created?: string; // ISO date string
  participant: ActorRef[];
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
  reasonCode?: Array<{
    coding: Array<{
      system: string;
      code: string;
      display: string;
    }>;
    text: string;
  }>;
  description?: string;
  supportingInformation?: Array<{
    identifier: {
      system: string;
      value: string;
    };
    display: string;
  }>;
  start: string; // ISO datetime string
  end: string; // ISO datetime string
  minutesDuration: number;
  created?: string; // ISO datetime string
  comment?: string;
  participant: Array<{
    actor: {
      reference: string;
      display: string;
    };
  }>;
}
