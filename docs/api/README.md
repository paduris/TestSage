# TestSage API Documentation

## Base URL
- Development: `http://localhost:8080`
- Production: `https://api.testsage.com` (example)

## Authentication
All API endpoints require authentication using Bearer token:
```http
Authorization: Bearer <your_token>
```

## API Endpoints

### Repository Management

#### List Repositories
```http
GET /api/repositories
```
Response:
```json
{
  "repositories": [
    {
      "id": "1",
      "name": "TestSage",
      "gitUrl": "https://github.com/org/testsage",
      "branch": "main",
      "domain": "Testing",
      "lastAnalyzed": "2025-05-27T01:30:14-05:00"
    }
  ]
}
```

#### Add Repository
```http
POST /api/repositories
```
Request:
```json
{
  "name": "TestSage",
  "gitUrl": "https://github.com/org/testsage",
  "branch": "main",
  "domain": "Testing"
}
```

#### Get Repository
```http
GET /api/repositories/{id}
```

#### Update Repository
```http
PUT /api/repositories/{id}
```

#### Delete Repository
```http
DELETE /api/repositories/{id}
```

### Risk Area Configuration

#### List Risk Configurations
```http
GET /api/risk-configs
```

#### Add Risk Configuration
```http
POST /api/risk-configs
```
Request:
```json
{
  "pattern": ".*\\.java$",
  "weight": 5.0,
  "description": "Java source files"
}
```

#### Update Risk Configuration
```http
PUT /api/risk-configs/{id}
```

#### Delete Risk Configuration
```http
DELETE /api/risk-configs/{id}
```

### Code Analysis

#### Start Analysis
```http
POST /api/analyze/{repositoryId}
```
Response:
```json
{
  "analysisId": "123",
  "status": "IN_PROGRESS",
  "startTime": "2025-05-27T01:30:14-05:00"
}
```

#### Get Analysis Status
```http
GET /api/analyze/{analysisId}/status
```
Response:
```json
{
  "status": "COMPLETED",
  "progress": 100,
  "startTime": "2025-05-27T01:30:14-05:00",
  "endTime": "2025-05-27T01:35:14-05:00"
}
```

#### Get Analysis Results
```http
GET /api/analyze/{analysisId}/results
```
Response:
```json
{
  "riskAreas": [
    {
      "file": "src/main/java/com/example/Service.java",
      "riskScore": 7.5,
      "patterns": ["complex-logic", "security-sensitive"],
      "suggestions": [
        "Add unit tests for error handling",
        "Include security testing"
      ]
    }
  ]
}
```

### Test Generation

#### Generate Tests
```http
POST /api/generate-tests
```
Request:
```json
{
  "analysisId": "123",
  "filePattern": ".*Service\\.java$"
}
```
Response:
```json
{
  "generationId": "456",
  "status": "IN_PROGRESS"
}
```

#### Get Generated Tests
```http
GET /api/generate-tests/{generationId}
```
Response:
```json
{
  "tests": [
    {
      "file": "src/test/java/com/example/ServiceTest.java",
      "content": "// Test code here",
      "type": "UNIT_TEST",
      "coverage": ["method1", "method2"]
    }
  ]
}
```

## Error Responses

### Common Error Structure
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": {
      "field": "Additional information"
    }
  }
}
```

### Common Error Codes
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `409`: Conflict
- `422`: Unprocessable Entity
- `500`: Internal Server Error

## Rate Limiting
- Rate limit: 100 requests per minute
- Headers:
  ```http
  X-RateLimit-Limit: 100
  X-RateLimit-Remaining: 95
  X-RateLimit-Reset: 1590000000
  ```

## Pagination
For endpoints that return lists, use:
```http
GET /api/endpoint?page=0&size=20&sort=field,direction
```

Response includes:
```json
{
  "content": [],
  "totalElements": 100,
  "totalPages": 5,
  "size": 20,
  "number": 0
}
```

## Versioning
API versioning is handled through the URL:
```http
https://api.testsage.com/v1/endpoint
```
