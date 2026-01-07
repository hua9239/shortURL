# Short URL Context API Documentation

This documentation provides details on the Short URL Backend API endpoints, including request parameters and response structures.

## Base URL
`http://localhost:3000`

## Authentication
Some endpoints require authentication. Ensure you confirm the specific authentication mechanism (e.g., Headers with Bearer Token or Session Cookies) in the implementation details.

---

## Endpoints

### 1. Create Short URL
Generates a new short URL from a provided full URL.

- **Endpoint**: `POST /api/v1/urls`
- **Content-Type**: `application/json`

**Request Body Parameters:**
| Parameter | Type | Required | Description |
|---|---|---|---|
| `fullUrl` | string | Yes | The original long URL. Must be a valid URL format. |
| `shortCode` | string | Optional | Custom short code. Max 10 alphanumeric characters. If omitted, one will be generated automatically. |

**Request Example:**
```json
{
  "fullUrl": "https://www.example.com/very/long/path",
  "shortCode": "custom123"
}
```

**Success Response (200 OK):**
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

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": ["...details..."]
}
```

---

### 2. Update Short URL
Updates an existing short URL's destination or code.

- **Endpoint**: `PUT /api/v1/urls/:id`
- **Authentication**: Required

**URL Parameters:**
| Parameter | Type | Required | Description |
|---|---|---|---|
| `id` | integer | Yes | The unique ID of the URL record to update. |

**Request Body Parameters:**
| Parameter | Type | Required | Description |
|---|---|---|---|
| `fullUrl` | string | Optional | New full URL to replace the existing one. |
| `shortCode` | string | Optional | New short code to replace the existing one. |

**Request Example:**
```json
{
  "fullUrl": "https://www.new-example.com",
  "shortCode": "newcode"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Updated successfully"
}
```

---

### 3. Get All URLs
Retrieves a list of all created short URLs.

- **Endpoint**: `GET /api/v1/urls`
- **Authentication**: Required

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "shortCode": "code1",
      "fullUrl": "https://www.example.com/",
      "createdAt": "2000-01-01T00:00:00.000Z"
    },
    ...
  ]
}
```

---

### 4. Delete Short URL
Deletes an existing short URL record.

- **Endpoint**: `DELETE /api/v1/urls/:shortCode`
- **Authentication**: Required

**URL Parameters:**
| Parameter | Type | Required | Description |
|---|---|---|---|
| `shortCode` | string | Yes | The short code of the URL to delete. |

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Deleted successfully"
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "message": "shortCode not found"
}
```

---

### 5. Redirect (Public)
Redirects the user to the original URL associated with the provided short code.

- **Endpoint**: `GET /:shortCode`

**URL Parameters:**
| Parameter | Type | Required | Description |
|---|---|---|---|
| `shortCode` | string | Yes | The short code to resolve. |

**Success Response (302 Found):**
- **Action**: Redirects to the `Location` header URL.

**Error Response (404 Not Found):**
- Occurs if the short code does not exist in the database.
