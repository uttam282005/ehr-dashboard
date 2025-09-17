# Appointment API Documentation

## Overview

The Appointment API allows operations to manage patient appointments within the healthcare system. It follows FHIR standards, supporting JSON request and response formats, and enables retrieval, creation, and update of appointment records.

### Base URL

`{baseUrl}/{firmUrlPrefix}/ema/fhir/v2/}`

***

## Endpoints Explored

### 1. Get All Appointments

- **Endpoint:** `GET /Appointment`
- **Description:** Retrieves a paginated list of all appointments accessible to the authenticated user.
- **Query Parameters:**
  - `page` (optional): Page number for pagination.
  - `count` (optional): Number of records per page (default 50, max 50).
  - `patient` (optional): Filter by patient ID.
  - `date` (optional): Filter by appointment date (format YYYY-MM-DD).
  - `status` (optional): Filter by appointment status (e.g., booked, cancelled).
- **Headers:**
  - `Authorization: Bearer <access_token>`
  - `x-api-key: <api_key>`
- **Response:**
  - 200 OK
  - JSON bundle containing appointments with metadata and pagination links.

**Example Request:**
```bash
GET {BaseURL}/Appointment?page=1&count=20&patient=12345&status=booked
Authorization: Bearer eyJ...
x-api-key: abc123
```

**Example Response:**
```json
{
  "resourceType": "Bundle",
  "type": "searchset",
  "total": 45,
  "page": 1,
  "count": 20,
  "entry": [
    {
      "resourceType": "Appointment",
      "id": "56789",
      "status": "booked",
      "start": "2025-09-20T09:00:00Z",
      "participant": [
        {
          "actor": { "reference": "Patient/12345" }
        }
      ]
    },
    // more appointments
  ]
}
```

***

### 2. Get Appointment by ID

- **Endpoint:** `GET /Appointment/{id}`
- **Description:** Retrieves the details of a single appointment by its unique ID.
- **Path Parameters:**
  - `id` (required): Unique identifier of the appointment.
- **Headers:**
  - `Authorization: Bearer <access_token>`
  - `x-api-key: <api_key>`
- **Response:**
  - 200 OK with appointment resource.
  - 404 Not Found if appointment does not exist.

**Example Request:**
```bash
GET /api/Appointment/56789
Authorization: Bearer eyJ...
x-api-key: abc123
```

**Example Response:**
```json
{
  "resourceType": "Appointment",
  "id": "56789",
  "status": "booked",
  "start": "2025-09-20T09:00:00Z",
  "minutesDuration": 30,
  "participant": [
    {
      "actor": { "reference": "Patient/12345" }
    }
  ]
}
```

***

### 3. Create Appointment

- **Endpoint:** `POST /Appointment`
- **Description:** Creates a new appointment record.
- **Headers:**
  - `Authorization: Bearer <access_token>`
  - `x-api-key: <api_key>`
  - `Content-Type: application/json`
- **Request Body:** JSON appointment resource conforming to FHIR appointment schema.
- **Response:**
  - 201 Created
  - New appointment resource with assigned ID.

**Example Request:**
```json
{
  "resourceType": "Appointment",
  "status": "booked",
  "start": "2025-09-30T14:00:00Z",
  "minutesDuration": 60,
  "participant": [
    { "actor": { "reference": "Patient/12345" } }
  ]
}
```

**Example Response:**
```json
{
  "resourceType": "Appointment",
  "id": "67890",
  "status": "booked",
  "start": "2025-09-30T14:00:00Z"
}
```

***

### 4. Update Appointment by ID

- **Endpoint:** `PUT /Appointment/{id}`
- **Description:** Updates details of an existing appointment identified by ID.
- **Path Parameters:**
  - `id` (required): Appointment ID.
- **Headers:**
  - `Authorization: Bearer <access_token>`
  - `x-api-key: <api_key>`
  - `Content-Type: application/json`
- **Request Body:** Partial or full appointment resource fields to update.
- **Response:**
  - 200 OK with updated appointment resource.
  - 404 Not Found if the appointment does not exist.

**Example Request:**
```json
{
  "status": "cancelled"
}
```

**Example Response:**
```json
{
  "resourceType": "Appointment",
  "id": "56789",
  "status": "cancelled"
}
```

***

## Error Handling

- **400 Bad Request:** Invalid input data.
- **401 Unauthorized:** Missing or invalid authentication credentials.
- **404 Not Found:** Appointment not found.
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

***

## Notes

- All responses are JSON-formatted by default.
- Use pagination query parameters to limit response sizes.
- Authentication tokens and API keys are mandatory headers.
- Appointment data adheres to FHIR v4 standards ensuring compatibility with existing EHR systems.

***

This provides consistent, comprehensive documentation for your Appointment API endpoints following the style of your Patient API documentation.
