# System Architecture

## Overview
The Labour Market Intelligence & Curriculum Alignment Platform (LMI-CAP) addresses **Problem Statement 26134** by forming a continuous, evidence-based closed-loop feedback system connecting Government / State Skill Development Missions, Training Institutes / Academia, Industry / Employers, Trainers, and Students.

```
       INDUSTRY REQUISITIONS & VACANCIES
                      ↓
       AI DATA PROCESSING & TAXONOMY
                      ↓
       LABOUR DEMAND & SHORTAGE SIGNALS
                      ↓
       COURSE & CURRICULUM ALIGNMENT (Score %)
                      ↓
       AI RECOMMENDATIONS (Human-in-the-Loop)
                      ↓
       DISTRICT CAPACITY & EQUIPMENT PLANNING
                      ↓
       STUDENT CAREER PATHWAYS & ASSESSMENTS
                      ↓
       PLACEMENT OUTCOMES & EMPLOYER FEEDBACK
                      ↓
           CONTINUOUS RE-CALIBRATION
```

## Layers
1. **Presentation Layer**: Next.js 14 App Router, React 18, Tailwind CSS, Lucide icons, Recharts for responsive visualizations.
2. **Application & API Layer**: RESTful endpoints with Zod input validation, cookie and header-based JWT authentication, and RBAC guards.
3. **Intelligence & AI Service Layer**: Pluggable `AIProvider` supporting deterministic `LocalRuleNLPProvider`, external LLMs (Gemini / OpenAI), taxonomy normalization, synonym matching, and confidence calculation.
4. **Data Persistence Layer**: Prisma ORM with SQLite for zero-setup instant local execution, seamlessly convertible to PostgreSQL for enterprise scale.
