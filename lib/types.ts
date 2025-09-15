export interface ApiError {
  code: string;      // e.g. "NETWORK_ERROR", "API_ERROR", "CACHE_ERROR"
  message: string;   // safe user-facing message
  status: number;    // HTTP-like status (use 0 for non-HTTP issues)
  details?: any;     // optional raw error payload for logs
}

interface Coding {
  system?: string;
  code?: string;
  display?: string;
}
// Reference type for linked resources (Practitioner, etc.)
interface Reference {
  reference: string; // e.g. "Practitioner/12345"
  display?: string;
}
interface MaritalStatus {
  text?: string;
  coding?: Coding[]
}
// Identifier type
interface Identifier {
  system?: string;  // URL or namespace (e.g., HL7 MRN system)
  value: string;    // Identifier value
  type?: "PMS" | "MRN" | "SSN" | "Referral"; 
}

// Human name
interface HumanName {
  family?: string;
  given?: string[];
}

// Telecom type (phone, email, etc.)
interface ContactPoint {
  system: "phone" | "email" | "fax" | "url" | "sms";
  value: string;
  use?: "home" | "work" | "mobile" | "temp" | "old";
  rank?: number; // Preferred order
}

// Address
interface Address {
  use?: string;
  line?: string[];
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

// Emergency contact
interface Contact {
  relationship?: string; // HL7 v2/0131
  name?: HumanName;
  telecom?: ContactPoint[];
  address?: Address;
}

// Communication
interface Communication {
  language: string; // ISO639-2 code
  preferred?: boolean;
}

// Race & Ethnicity extensions
interface Extension {
  url: string;
  value: string;
}

// General Practitioner + last seen extension
interface GeneralPractitioner {
  practitioner: Reference;
  role: "REF" | "PPRF"; // Referrer | Primary Performer
  dateLastSeen?: string; // ISO date
}

// -------------------------
// Patient Type Definition
// -------------------------
export interface Patient {
  id: string; // MMI-specific unique ID

  identifier?: Identifier[];

  active?: boolean;

  name?: HumanName[];

  telecom?: ContactPoint[];

  gender?: "male" | "female" | "other" | "unknown";

  birthDate?: string; // ISO Date

  deceasedBoolean?: boolean;

  address?: Address[];

  maritalStatus?: string; // HL7 v2/0002 code

  contact?: Contact[];

  communication?: Communication[];

  extension?: {
    race?: Extension;
    ethnicity?: Extension;
  };

  generalPractitioner?: GeneralPractitioner[];

  referralSource?: Reference; // Practitioner or Referral ID
}
