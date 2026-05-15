# Aura Health OS: Backend Connection Guide

This document outlines the steps required to connect the Aura Health OS frontend to your production backend.

## 1. Environment Configuration
Create a `.env.local` file in the `frontend` root directory:
```env
NEXT_PUBLIC_API_URL=http://your-backend-api.com/api/v1
```

## 2. API Schema Implementation
The frontend expects the following endpoints to be implemented on the backend. All endpoints should return JSON responses.

### Health Services
- `GET /health/vitals`: Returns an array of `VitalSign` objects.
- `GET /health/metrics`: Returns an array of `HealthMetric` objects (AI insights).
- `GET /health/wellness-score`: Returns current wellness score, sub-scores, and AI recommendations.
- `PATCH /health/vitals/:id`: Updates a specific vital sign value.

### AI Agents
- `GET /agents/alerts`: Returns active health alerts and escalations.
- `POST /agents/alerts/:id/acknowledge`: Marks an alert as acknowledged.
- `GET /agents/diagnostic/history`: Returns previous diagnostic analyses.
- `POST /agents/diagnostic/run`: Submits text/image for new diagnostic analysis.
- `GET /agents/scheduling/events`: Returns appointments and medication schedules.
- `GET /agents/genomics/profile`: Returns genomic risk profile, traits, and variants.
- `POST /agents/qa/query`: Processes natural language medical queries.

### User Services
- `GET /user/profile`: Returns the patient's personal and medical profile.
- `PATCH /user/profile`: Updates profile information.

## 3. Data Types
Refer to `frontend/src/types/index.ts` for the exact TypeScript interfaces used for API request/response payloads.

## 4. Authentication
The current implementation uses a bearer token interceptor in `frontend/src/lib/api-client.ts`. Ensure your backend handles standard JWT authentication headers:
```http
Authorization: Bearer <token>
```

## 5. Development Tools
Use the TanStack Query Devtools (enabled in development) to monitor API request states, caching, and invalidations.
