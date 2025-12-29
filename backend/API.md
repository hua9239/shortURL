# API Documentation

## Base URL
`http://localhost:3000` (Assuming default port)

## Authentication
Some endpoints require authentication. (Currently implemented via `authenticate` middleware, details depend on implementation, e.g., headers or session).

## Endpoints

### 1. Create Short URL
Create a new short URL from a full URL.

- **URL:** `/api/v1/urls`
- **Method:** `POST`
- **Content-Type:** `application/json`
- **Body Parameters:**
  - `fullUrl` (string, required): The original long URL. Must be a valid URL.
  - `shortCode` (string, optional): Custom short code. Max 10 alphanumeric characters.

**Request Example:**
```json
{
  "fullUrl": "https://www.example.com/very/long/path",
  "shortCode": "custom123"
}
```

**Success Response:**
- **Code:** 200 OK
- **Content:**
```json
{
  "success": true,
  "message": "Short URL created successfully",
  "data": {
    "fullUrl": "https://www.example.com/very/long/path",
    "shortCode": "custom123"
  }
}
```

**Error Response:**
- **Code:** 400 Bad Request
- **Content:**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [...]
}
```

---

### 2. Get All URLs
Retrieve a list of all created short URLs.

- **URL:** `/api/v1/urls`
- **Method:** `GET`
- **Authentication:** Required

**Success Response:**
- **Code:** 200 OK
- **Content:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "shortCode": "abc123",
      "fullUrl": "https://www.google.com",
      "createdAt": "2023-10-27T10:00:00.000Z"
    },
    ...
  ]
}
```

---

### 3. Delete Short URL
Delete an existing short URL by its code.

- **URL:** `/api/v1/urls/:shortCode`
- **Method:** `DELETE`
- **Authentication:** Required
- **URL Parameters:**
  - `shortCode` (string, required): The short code of the URL to delete.

**Success Response:**
- **Code:** 200 OK
- **Content:**
```json
{
  "success": true,
  "message": "Deleted successfully" 
  // Note: Actual response depends on responseHandler implementation, usually just success status
}
```

**Error Response:**
- **Code:** 404 Not Found
- **Content:**
```json
{
  "success": false,
  "message": "shortCode not found"
}
```

---

### 4. Redirect
Redirect to the original URL based on the short code.

- **URL:** `/:shortCode`
- **Method:** `GET`
- **URL Parameters:**
  - `shortCode` (string, required): The short code to redirect.

**Success Response:**
- **Code:** 302 Found (Redirect)
- **Header:** `Location: <original_full_url>`

**Error Response:**
- **Code:** 404 Not Found (If short code does not exist)
