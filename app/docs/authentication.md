# Authentication API Documentation

## Overview

This endpoint authenticates clients by exchanging user credentials for access and refresh tokens, which are then stored securely in Redis. The tokens allow subsequent authorized requests to protected resources.

### Base URL

`{baseUrl}/{firmUrlPrefix}/ema/ws/oauth2/grant`

***

## Endpoint

### POST /api/get-tokens

- **Description**: Authenticates a user with their username and password, then retrieves OAuth2 tokens from the authorization server. Tokens and API key are cached in Redis for session management.
- **Headers**: 
  - `Content-Type: application/json`
- **Request Body**:
  - `username` (string, required): User's login name.
  - `password` (string, required): User's login password.
  - `apiKey` (string, required): Client API key for authorization.
  
**Example Request:**

```json
{
  "username": "john.doe",
  "password": "securepass123",
  "apiKey": "abc123xyz"
}
```

- **Response:**
  - `200 OK` on success, returning `{ success: true }`.
  - Appropriate HTTP error responses if authentication or token fetch fails.
  
**Example Success Response:**

```json
{
  "success": true
}
```

- **Error Responses:**
  - `401 Unauthorized`: Invalid username, password, or API key.
  - `500 Internal Server Error`: Server or Redis error occurred.

***

## Implementation Details

- The request sends data with `application/x-www-form-urlencoded` to the authorization server's OAuth2 token grant endpoint.
- On successful token retrieval, tokens and API key are stored in Redis hash keyed by environment (`ehr{NODE_ENV}`).
- Redis caching facilitates stateless session validation and token refresh workflows.

***

## Error Handling

- Returns JSON error message with HTTP status on failure.
- Logs server errors for diagnostics.

***

This documentation provides clear usage instructions for your authentication endpoint inline with best API documentation practices.
