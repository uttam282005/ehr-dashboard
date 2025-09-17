# API Helper Functions Documentation

## Overview

These utility functions abstract interaction with the healthcare FHIR API for fetching, searching, creating, and updating healthcare entities. They manage building request URLs with query parameters, error handling, and caching where applicable.

***

## Functions

### 1. fetchEntityByPage

Fetches a paginated list of resources for a given entity type.

```ts
async function fetchEntityByPage(entity: Entity, pageNo: number)
```

- **Parameters:**
  - `entity` (`"Patient" | "Appointment" | "Slot"`): The resource type to fetch.
  - `pageNo` (`number`): The page number for pagination.

- **Returns:** Promise resolving to an object containing:
  - `success`: boolean
  - `data`: response data on success
  - `error`: error message string on failure

- **Description:** Constructs a request URL with the `page` query parameter and fetches data, utilizing caching.

***

### 2. fetchEntity

Fetches resources filtered by arbitrary search parameters.

```ts
async function fetchEntity(entity: Entity, searchParams?: Record<string, any>)
```

- **Parameters:**
  - `entity` (`"Patient" | "Appointment" | "Slot"`): The resource type to fetch.
  - `searchParams` (optional `Record<string, any>`): Key-value pairs for filtering (e.g., `{ family: "Smith", date: "2025-09-01" }`).

- **Returns:** Promise resolving to an object containing:
  - `success`: boolean
  - `data`: response data on success
  - `error`: error message string on failure

- **Description:** Builds a query string from provided parameters, supporting special handling (e.g., parameter `date2` remapped to `date`), and fetches results with caching.

***

### 3. fetchEntityById

Fetches a single resource by its unique ID.

```ts
async function fetchEntityById(entity: Entity, id: string)
```

- **Parameters:**
  - `entity` (`"Patient" | "Appointment" | "Slot"`): The resource type.
  - `id` (`string`): Unique identifier of the resource.

- **Returns:** Promise resolving to an object containing:
  - `success`: boolean
  - `data`: resource data on success
  - `error`: error message string on failure

- **Description:** Constructs URL based on entity and resource ID and fetches the resource with caching.

***

### 4. createEntity

Creates a new resource of the specified entity type.

```ts
async function createEntity(entity: Entity, body: any)
```

- **Parameters:**
  - `entity` (`"Patient" | "Appointment" | "Slot"`): The resource type.
  - `body` (`any`): JSON payload representing the new resource data.

- **Returns:** Promise resolving to:
  - `success`: boolean
  - `data`: newly created resource data on success
  - `error`: error message string on failure

- **Description:** Posts JSON payload to the entity-specific endpoint, expecting to create a resource.

***

### 5. updateEntity

Updates an existing resource by ID.

```ts
async function updateEntity(entity: Entity, id: string, body: any)
```

- **Parameters:**
  - `entity` (`"Patient" | "Appointment" | "Slot"`): The resource type.
  - `id` (`string`): Unique identifier of the resource.
  - `body` (`any`): JSON payload with updated fields.

- **Returns:** Promise resolving to:
  - `success`: boolean
  - `data`: updated resource data on success
  - `error`: error message string on failure

- **Description:** Issues a PUT request to update the specified resource.

***

### 6. createAppointment

Specialized convenience function to create a new appointment.

```ts
async function createAppointment(body: any)
```

- **Parameters:**
  - `body` (`any`): JSON payload with appointment details.

- **Returns:** Promise resolving to:
  - `success`: boolean
  - `data`: created appointment resource on success
  - `error`: error message string on failure

- **Description:** Posts to `/Appointment` endpoint to create an appointment.

***

## Error Handling

- All functions catch exceptions and return structured error objects.
- Errors are processed using the shared `handleError` utility to standardize messages.

***

## Usage Example

```ts
const response = await fetchEntityByPage("Patient", 1);
if (response.success) {
  console.log("Patients:", response.data);
} else {
  console.error("Error fetching patients:", response.error);
}
```

***
