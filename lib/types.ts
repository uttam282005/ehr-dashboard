export interface ApiError {
  code: string;      // e.g. "NETWORK_ERROR", "API_ERROR", "CACHE_ERROR"
  message: string;   // safe user-facing message
  status: number;    // HTTP-like status (use 0 for non-HTTP issues)
  details?: any;     // optional raw error payload for logs
}

export interface Patient {
  resourceType: "Patient";
  id: string;
  meta: {
    lastUpdated: string; // ISO date-time string
  };
  extension?: Extension[];
  identifier?: Identifier[];
  active?: boolean;
  name?: HumanName[];
  telecom?: ContactPoint[];
  gender?: string;
  birthDate?: string; // Date string YYYY-MM-DD
  deceasedBoolean?: boolean;
  address?: Address[];
  maritalStatus?: CodeableConcept;
  contact?: PatientContact[];
  communication?: PatientCommunication[];
  generalPractitioner?: GeneralPractitioner[];
}

export interface Extension {
  url: string;
  extension?: ExtensionDetail[];
}

export interface ExtensionDetail {
  url: string;
  valueCoding?: Coding;
  valueString?: string;
}

export interface Identifier {
  system: string;
  value: string;
  type?: CodeableConcept;
}

export interface HumanName {
  family?: string;
  given?: string[];
}

export interface ContactPoint {
  system: string;
  value: string;
  use?: string;
  rank?: number;
}

export interface Address {
  use?: string;
  type?: string;
  line?: string[];
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

export interface CodeableConcept {
  coding?: Coding[];
  text?: string;
}

export interface Coding {
  system: string;
  code: string;
  display: string;
}

export interface PatientContact {
  relationship?: CodeableConcept[];
  name?: HumanName;
  telecom?: ContactPoint[];
}

export interface PatientCommunication {
  language: CodeableConcept;
}

export interface GeneralPractitioner {
  identifier?: Identifier;
  display?: string;
}
