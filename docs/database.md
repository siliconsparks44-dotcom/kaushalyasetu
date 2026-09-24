# Database Schema & Entity Relationships

The data model uses Prisma ORM and is compatible with both SQLite and PostgreSQL.

## Core Entities
- **User**: Multi-role system authentication (ADMIN, EMPLOYER, INSTITUTE, TRAINER, STUDENT).
- **Organization**: Government departments, enterprise employers, and polytechnics/ITIs.
- **Skill**: Standardized taxonomy items with canonical names, categories, and sectors.
- **SkillAlias**: Synonyms mapping (e.g. "JS" -> "JavaScript", "BMS" -> "Battery Management Systems").
- **Job & JobSkill**: Active employer postings with proficiency levels, experience, and openings.
- **Course & CourseSkill**: Academic vocational courses, duration, intake capacity, and mapped competencies.
- **CourseModule**: Module titles with required practical and theory hours.
- **Curriculum & CurriculumVersion**: Versioning history (`v1.0`, `v1.1`, etc.) with human audit sign-off.
- **CurriculumRecommendation**: AI-driven actions (`ADD`, `UPDATE`, `INCREASE_PRACTICAL`, `CONSIDER`, `REVIEW`) with status `PENDING`, `APPROVED`, or `REJECTED`.
- **TrainingCapacity**: District-level seat intake vs annual vacancies and placement rates.
- **DistrictPlan & DistrictPlanRecommendation**: Annual capacity expansions, trainer upskilling quotas, and equipment acquisitions.
- **Equipment**: Workstation inventory, operational status, and student-to-bench adequacy tracking.
- **Trainer & TrainerSkill**: Instructor qualifications, verified skills, and deficit analysis.
- **Student**: Profiles with AI resume parsing, career pathways, and quiz assessments.
- **Placement & EmployerFeedback**: Post-course hiring metrics and employer satisfaction ratings.
- **AuditLog**: Complete immutable trace of all administrative decisions.
