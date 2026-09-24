# KaushalyaSetu (कौशल्य सेतु)
### Labour Market Intelligence & Curriculum Alignment Platform (Problem Statement 26134)
### Problem Statement: 26134

An evidence-based full-stack intelligence and governance platform translating real-time industry demand into curriculum design, training capacity, and career pathways.

---

## 🌟 Overview
Educational and vocational skill programs frequently lag behind rapid technological advancements and changing employer expectations. KaushalyaSetu establishes a continuous, closed-loop feedback mechanism connecting:
1. **Government / Administrators & District Skill Councils**: District-level skill demand forecasting, capacity allocation, course obsolescence/oversupply flags, and multi-sector planning.
2. **Industry / Employers**: Job postings, real-time skill demand definition, candidate validation, employer surveys, and placement satisfaction feedback.
3. **Training Institutes / Academia**: Course and curriculum management, skill-to-industry alignment scoring, human-in-the-loop curriculum updates, and placement records.
4. **Trainers / Faculty**: Profile management, trainer-to-market skill gap identification, upskilling and certification tracking.
5. **Students / Trainees**: Skill profiling, AI resume parsing, career pathways with step-by-step skill gap visualizations, and course recommendations.

---

## 🚀 Quick Start Guide (Run Locally)

### Prerequisites
- **Node.js**: v18+ or v20+ (v22 verified)
- **NPM**: v9+ or v10+

### Installation & Execution
```bash
# 1. Clone / Navigate to project directory
cd /Users/harshzore/.gemini/antigravity/scratch/lmi-platform

# 2. Install dependencies
npm install

# 3. Initialize Database (SQLite by default for zero-friction local execution)
npx prisma db push

# 4. Seed realistic benchmark DEMO DATA
npm run db:seed

# 5. Run automated tests
npm run test

# 6. Start the development server
npm run dev
```

Open your browser at **`http://localhost:3000`**.

---

## 🔑 Demo Login Credentials (1-Click Login Supported)

The platform includes pre-configured demo persona buttons on the login page (`/auth/login`) for instantaneous one-click access:

| Role | Email | Password | Persona & Title |
| :--- | :--- | :--- | :--- |
| **ADMIN / GOVERNMENT** | `admin@lmi.gov.in` | `Password@123` | Dr. Ramesh Verma (State Skill Development Officer) |
| **INDUSTRY / EMPLOYER** | `employer@techcorp.com` | `Password@123` | Pooja Sharma (Talent Director, Apex Technologies) |
| **INSTITUTE / ACADEMIA** | `institute@puneiti.edu.in` | `Password@123` | Prof. Rajesh Kulkarni (Principal, Govt Polytechnic) |
| **TRAINER** | `trainer@skills.edu.in` | `Password@123` | Anand Deshmukh (Lead Vocational Instructor) |
| **STUDENT / TRAINEE** | `student@learner.org` | `Password@123` | Kavita Patil (Diploma Graduate) |

---

## 🛠️ Technology Stack
- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Lucide React, Recharts
- **Backend & APIs**: Next.js API Routes (REST architecture), Zod schema validation
- **Database & ORM**: Prisma ORM with SQLite (`file:./dev.db`) for zero-friction local execution, with instant switchability to PostgreSQL
- **Security & RBAC**: JWT session architecture, HTTP-only cookies, bcryptjs password hashing, role-based API protection
- **AI Architecture**: Pluggable provider abstraction (`AIProvider`):
  - `LocalRuleNLPProvider`: High-speed deterministic NLP, taxonomy pattern matching, and synonym resolution (runs offline with zero cost)
  - `GeminiAIProvider` / `OpenAIProvider`: External LLM provider integrations
  - Automatic fallback when API key is missing

---

## 📂 Project Architecture & Folder Structure
```
/
├── app/                        # Next.js App Router
│   ├── api/                    # 35+ REST API endpoints
│   │   ├── auth/               # Login, register, me, logout
│   │   ├── jobs/               # Postings, AI extraction, CSV import
│   │   ├── skills/             # Taxonomy & live demand calculations
│   │   ├── courses/            # Course creation, alignment % calculation
│   │   ├── curriculum/         # Human-in-the-loop recommendations review
│   │   ├── districts/          # District demand vs capacity analysis
│   │   ├── district-plans/     # Plan generator & directives
│   │   ├── trainers/           # Trainer skill deficits & workshops
│   │   ├── equipment/          # Workstation inventory & gap audits
│   │   ├── student/            # Resume parser, career pathways, quizzes
│   │   ├── employer-surveys/   # Quarterly employer demand surveys
│   │   ├── placements/         # Hiring outcomes & salaries
│   │   └── analytics/          # Cross-cutting KPI metrics
│   ├── auth/                   # Authentication pages
│   ├── dashboard/              # 5 Stakeholder Portals + Hubs
│   │   ├── admin/              # Government Policy Dashboard
│   │   ├── employer/           # Industry Hiring & Extraction
│   │   ├── institute/          # Course & Module Management
│   │   ├── alignment/          # Course-to-Industry Alignment Hub
│   │   ├── district-plans/     # District Training Planner Engine
│   │   ├── student/            # Student Pathways & Assessments
│   │   ├── trainer/            # Trainer Upskilling & Equipment
│   │   └── reports/            # Official Policy & Audit Reports
│   └── page.tsx                # Public Landing Page
├── ai/                         # Pluggable AI engine & Local NLP parser
├── components/                 # Shared UI, Navbar, Footer, Demo Banner
├── database/                   # Seed files & configurations
├── docs/                       # Complete architectural and API specs
├── lib/                        # Auth, Prisma client, skills-engine, response
├── prisma/                     # Schema with full relational models & indexes
├── scripts/                    # Automated database seeding engine
└── tests/                      # Automated test suite (9 passing tests)
```

---

## 🧪 Running Automated Tests
```bash
npm run test
```
Verifies database connectivity, normalized skill taxonomy, AI NLP extraction, alignment score formulas, human-in-the-loop governance approval, district planning calculations, placement tracking, and JWT token authorization.

---

## 🐳 Docker Deployment
```bash
docker-compose up --build -d
```
Runs the production build on port 3000.

---

## 📜 Compliance with Problem Statement 26134
- **No Mock Data Claims**: Seed and benchmark data are clearly tagged with visible `[Demo Data]` banners.
- **Human-in-the-Loop**: AI curriculum suggestions strictly require human review and approval before taking effect.
- **Evidence-Based**: Alignment scores and oversupply flags show active vacancy citations and mathematical proofs.
