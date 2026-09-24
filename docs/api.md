# REST API Documentation

All API responses follow standard structured envelopes:
```json
{
  "success": true,
  "data": { ... }
}
```
In case of error:
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable explanation"
  }
}
```

## Key Endpoints
- `POST /api/auth/login`: Authenticate and receive JWT cookie & token payload.
- `POST /api/auth/register`: Create user with role-specific profile.
- `GET /api/auth/me`: Retrieve current logged-in identity and unread notifications.
- `GET /api/jobs`: Query active vacancies filtered by sector or district.
- `POST /api/jobs`: Post new job requisition with normalized competencies.
- `POST /api/jobs/extract-skills`: Extract skills from unstructured text using AI.
- `POST /api/jobs/import-csv`: Batch ingestion of job vacancies from CSV.
- `GET /api/skills/demand`: Calculate live demand score and shortage/oversupply indicators.
- `GET /api/courses`: Retrieve courses with module breakdown and capacity.
- `GET /api/courses/:id/alignment`: Calculate mathematical skill coverage % vs live industry demand.
- `POST /api/courses/:id/recommendations`: Trigger AI curriculum recommendation generator.
- `PATCH /api/curriculum/recommendations/:id`: Human-in-the-loop approval or rejection.
- `GET /api/districts/:id/analysis`: Micro-level district vacancy and training capacity metrics.
- `POST /api/district-plans`: Generate authorized annual district training plan.
- `GET /api/trainers/gaps`: Compute instructor skill deficits vs industry requirements.
- `GET /api/equipment/gaps`: Audit lab workstation deficit against 1:4 student ratio.
- `POST /api/student/parse-resume`: AI parsing of resume text into technical skills.
- `GET /api/student/career-pathways`: Dynamic career pathway progression with readiness %.
- `POST /api/student/assessments/submit`: Evaluate assessment quiz and award verified badge.
- `GET /api/analytics/overview`: Aggregate KPI statistics for dashboards.
