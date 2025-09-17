# Patient API Documentation

## Overview

The Patient API provides CRUD operations and search functionality for patient records within the healthcare system. It complies with the FHIR standard and supports JSON request and response formats.

### Base URL

`{baseUrl}/{firmUrlPrefix}/ema/fhir/v2/}`;

***

## Endpoints Explored

### 1. Get All Patients

- **Endpoint:** `GET /Patient`
- **Description:** Retrieves a paginated list of all patients accessible to the authenticated user.
- **Query Parameters:**
  - `page` (optional): Page number for pagination.
  - `count` (optional): Number of records per page (default 50, max 50).
  - `given` (optional): Filter by first name.
  - `family` (optional): Filter by last name.
  - `birthdate` (optional): Filter by date of birth (format YYYY-MM-DD).
  - `gender` (optional): Filter by gender (e.g. male, female, unknown).
- **Headers:**
  - `Authorization: Bearer <access_token>`
  - `x-api-key: <api_key>`
- **Response:**
  - 200 OK
  - JSON bundle containing patients with metadata and pagination links.

**Example Request:**
```bash
GET {BaseURL}/patient?page=1&count=20&family=Smith
Authorization: Bearer eyJ...
x-api-key: abc123
```

**Example Response:**
```json
{
  "resourceType": "Bundle",
  "type": "searchset",
  "total": 120,
  "page": 1,
  "count": 20,
  "entry": [
    {
      "resourceType": "Patient",
      "id": "12345",
      "name": [{ "family": "Smith", "given": ["John"] }],
      "gender": "male",
      "birthDate": "1980-05-20"
    },
    // more patients
  ]
}
```

***

### 2. Get Patient by ID

- **Endpoint:** `GET /patient/{id}`
- **Description:** Retrieves full details of a single patient by unique ID.
- **Path Parameters:**
  - `id` (required): Unique identifier of the patient.
- **Headers:**
  - `Authorization: Bearer <access_token>`
  - `x-api-key: <api_key>`
- **Response:**
  - 200 OK with patient resource.
  - 404 Not Found if patient does not exist.

**Example Request:**
```bash
GET /api/patient/12345
Authorization: Bearer eyJ...
x-api-key: abc123
```

**Example Response:**
```json
{
  "resourceType": "Patient",
  "id": "12345",
  "name": [{ "family": "Smith", "given": ["John"] }],
  "gender": "male",
  "birthDate": "1980-05-20",
  "address": [
    {
      "line": ["123 Main St"],
      "city": "Anytown",
      "state": "CA",
      "postalCode": "90210"
    }
  ],
  "telecom": [
    { "system": "phone", "value": "555-1234", "use": "home" }
  ]
}
```


### 4. Update Patient by ID

- **Endpoint:** `PUT /Patient/{id}`
- **Description:** Updates patient info for an existing patient identified by ID.
- **Path Parameters:**
  - `id` (required): Patient ID
- **Headers:**
  - `Authorization: Bearer <access_token>`
  - `x-api-key: <api_key>`
  - `Content-Type: application/json`
- **Request Body:** Partial or full patient resource fields to update.
- **Response:**
  - 200 OK with updated patient resource
  - 404 Not Found if patient does not exist

**Example Request:**
```json
{
  "telecom": [{ "system": "email", "value": "jane.doe@example.com", "use": "home" }]
}
```

**Example Response:**
```json
{
  "resourceType": "Patient",
  "id": "67890",
  "telecom": [{ "system": "email", "value": "jane.doe@example.com", "use": "home" }]
}
```

***

## Error Handling

- **400 Bad Request:** Invalid input data.
- **401 Unauthorized:** Missing or invalid authentication credentials.
- **404 Not Found:** Patient not found.
- **422 Unprocessable Entity:** Validation issues.
- **500 Internal Server Error:** Unexpected error.

## Error Schema

```ts
interface ApiError {
  code: string;      // e.g. "NETWORK_ERROR", "API_ERROR", "CACHE_ERROR"
  message: string;   // safe user-facing message
  status: number;    // HTTP-like status (use 0 for non-HTTP issues)
  details?: any;     // optional raw error payload for logs
}
```

## Notes

- All responses are JSON-formatted by default.
- Use pagination query params to reduce response size.
- Authentication tokens and API keys are mandatory headers.
- Patient data follows FHIR v4 standards ensuring compatibility with existing EHR systems.

***

This patient documentation can be expanded with detail on specific fields, example errors, and sample Postman collections for easy testing upon request.
