# CareOps AI

> **AI-powered healthcare operations intelligence platform that converts conversations into actionable workflows.**

CareOps AI transforms chaotic, unstructured clinical phone calls and healthcare communications into structured, verified hospital actions in real time. Designed for hospital command centers, physicians, intake staff, and operational administrators, CareOps AI guarantees zero dropped patient commitments, immediate triage, automated appointment scheduling, and continuous SLA compliance.

---

## Problem Statement

Modern healthcare facilities handle thousands of inbound phone calls, triage inquiries, and post-discharge consultations every day:

1. **Critical Information Trapped in Voice Audio**: Vital clinical details (such as post-operative fever, medication intolerances, or wound drainage) are buried inside lengthy voice conversations.
2. **Manual Documentation Bottlenecks**: Healthcare workers spend hours manually transcribing calls, leading to documentation backlogs, clinician burnout, and delayed care delivery.
3. **Dropped Commitments & Missed SLAs**: Verbal promises made over the phone (*"We will check with the doctor and call you back by noon"*) are frequently forgotten or lost in disconnected voicemail queues.
4. **Disjointed Departmental Handoffs**: Front desk intake, insurance prior-authorization desks, nursing triage, and clinical staff operate in silos without a centralized, synchronized operational ledger.

---

## Solution

CareOps AI introduces an autonomous, real-time intelligence and workflow pipeline that captures and parses healthcare conversations into deterministic hospital outcomes:

- **Structured Clinical Summaries**: Auto-generates concise, medically grounded conversation summaries highlighting patient concerns and acute symptoms.
- **Transcript-Anchored Action Items**: Extracts explicit commitments and tasks verified against verbatim timestamps in patient speech.
- **Autonomous Department Routing**: Automatically classifies intents and dispatches tasks to the appropriate hospital division (Front Desk, Cardiology, Surgical Recovery, Prior-Auth).
- **End-to-End Workflow & SLA Management**: Synchronizes patient bookings, physician queues, and real-time operational metrics across an authenticated MongoDB backend.

```
Healthcare Conversation (Telephony / Patient Input)
                     ↓
Dual-Channel Audio & NLU Intent Classification
                     ↓
Structured Clinical Extraction (Symptoms, Commitments, Urgency)
                     ↓
Autonomous Department Dispatch (Reception • Doctor • Insurance • Manager)
                     ↓
Real-Time MongoDB Synchronization & Live Clinical Dashboards
```

---

## Key Features

### 1. Frontend Implementation
- **Solarpunk Healthcare Design System**: Modern, eco-futuristic UI engineered with Tailwind CSS, custom glassmorphism tokens, and responsive layout primitives.
- **Multi-Role Tailored Dashboards**: Specialized views for every hospital stakeholder with route guards and role-specific workflows.
- **Patient Experience Portal**: Self-service portal where verified patients inspect their EHR medical records, schedule consultations with real database physicians, view doctor recommendations, and receive real-time appointment alerts.
- **Doctor / Clinician Station**: Live clinical queue populated directly from MongoDB appointments, displaying assigned patient rosters, AI-synthesized chief complaints, triage urgency, and consultation trackers.
- **Reception & Intake Gateway**: Centralized front-desk intake ledger, doctor availability schedules, patient registration modals, and telephony action queues.
- **Insurance & Prior-Auth Desk**: Revenue cycle management view featuring prior-authorization ticket tracking, EDI clearinghouse status, and carrier compliance metrics.
- **Department Operations Manager Console**: Department-level oversight displaying active staff counts, team workload distribution, capacity metrics, and SLA escalation incident response.
- **Hospital Executive Master Console (Admin)**: Full governance suite with user provisioning, doctor profile creation, status toggling (Active/Suspended), and patient census analytics.

### 2. Backend & Core Services (Node.js + Express + MongoDB)
- **Enterprise Authentication & JWT Engine**: Secure bcrypt password hashing, token validation, session persistence, and unified `/api/v1/auth/me` identity resolution.
- **Role-Based Access Control (RBAC)**: Strict server-side route guards enforcing granular permissions across 6 distinct hospital roles.
- **User Management System**: Complete administrative CRUD suite with role-scoping, department filters, and automatic doctor profile provisioning.
- **Patient Management System**: Patient record creation with auto-generated MRN identifiers, contact details, assigned primary care physicians, and secure self-service access.
- **Doctor Management & Scheduling**: Physician directory querying, specialization filtering, availability slot scheduling, and patient roster assignments.
- **Live Appointment Engine**: End-to-end appointment lifecycle management (create, view, reschedule, cancel) connecting patients, physicians, and receptionists through MongoDB.

### 3. Integrated & Planned Modules
- **AI Telephony Intelligence**: Dual-channel waveform visualization, diarization scrubbing, and conversational intent detection.
- **Workflow & SLA Automation Engine**: 4-column Kanban tracking, countdown timers, and automated priority escalations.
- **Operations Analytics Suite**: Recharts-powered trend analysis for call volumes, department throughput, and SLA compliance.
- **Notification & Dispatch System**: Real-time multi-channel alerts for critical clinical events, unread physician orders, and overdue tasks.

---

## User Roles & Permissions Matrix

The CareOps AI platform enforces a strict, hierarchical Role-Based Access Control (RBAC) model across all API routes and UI views:

| Role | Primary Purpose | Authorized Modules & Permissions |
|---|---|---|
| **Patient** | Patient Care Experience | Access own profile (`/api/v1/patients/me`), browse physician directory (`/api/v1/doctors`), book and manage personal appointments (`/api/v1/appointments`), view clinical instructions. Blocked from other patients' records and administrative portals. |
| **Doctor** | Clinical Care & Consultations | View assigned patient queues, inspect clinical summaries, update patient medical notes, manage availability schedule (`/api/v1/doctors/me`), attend booked consultations. Blocked from modifying user credentials or department settings. |
| **Receptionist** | Front Desk Intake & Scheduling | Universal patient directory search, register new patients, manage global appointment calendars, reschedule/cancel slots, triage incoming phone action items. Blocked from clinical EHR write access. |
| **Insurance Employee** | RCM & Prior-Authorization | Access patient insurance demographics, adjudicate prior-authorization claims, manage carrier audit requirements, update reimbursement workflows. Blocked from altering clinical staff or medical notes. |
| **Department Manager** | Operational & SLA Oversight | Inspect department-specific staff workloads, reassign tasks, manage SLA escalation incidents, oversee throughput efficiency for their assigned division. Blocked from system-wide administration. |
| **Hospital Administrator** | Full System Governance | Global system privileges: create/suspend users, provision physician and receptionist accounts, manage hospital rules, access universal audit logs, view hospital-wide census and analytics. |

---

## Technology Stack

| Layer | Technology | Version / Tooling | Purpose |
|---|---|---|---|
| **Frontend Framework** | **Next.js** | 16.4.0 (App Router) | Server-side rendering, streaming layout shell, dynamic routing |
| **UI Library** | **React** | 19.3.0 | Component rendering, state hooks, concurrent features |
| **Language** | **TypeScript** | 5.7+ | Strict static typing across all domain models and API contracts |
| **Styling** | **Tailwind CSS** | v4 | Modern styling tokens, responsive grids, eco-futuristic theme |
| **Icons & Motion** | **Lucide React / Framer Motion** | Latest | Clinical iconography, micro-interactions, animated state transitions |
| **Charts** | **Recharts** | 3.10+ | Operational charts (Area, Donut, Bar) for hospital telemetry |
| **Backend Runtime** | **Node.js** | v20+ / v22+ | Non-blocking asynchronous server runtime |
| **API Framework** | **Express.js** | 4.21+ | RESTful API routing, controller architecture, middleware pipeline |
| **Database** | **MongoDB** | 6.0+ / 7.0+ | Document-oriented NoSQL database for flexible healthcare records |
| **ODM / Modeling** | **Mongoose** | 8.8+ | Schema validation, relationship references, indexes, middleware hooks |
| **Authentication** | **JWT & bcryptjs** | Latest | JSON Web Token issuance/verification, salt-based password hashing |
| **Workflow Engine** | **Prisma ORM + PostgreSQL** | 5.22+ | Relational telephony call event logs and SLA state tracking |
| **Testing** | **Node.js Test Runner / Supertest** | Built-in | 74 automated unit & integration test suites (100% passing) |

---

## System Architecture Overview

CareOps AI is architected as a clean, decoupled multi-tier healthcare platform:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CLIENT / BROWSER TIER                           │
│     Next.js 16 App Router • Role-Guarded Solarpunk UI Components      │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP / REST (JWT in Headers / Cookies)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        API & ROUTING GATEWAY                           │
│        CORS Policy • Token Auth Middleware • Role Authorization        │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                       BACKEND SERVICE LAYER                            │
│   AuthService • UserService • PatientService • AppointmentService      │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Mongoose ODM Queries
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        DATA PERSISTENCE TIER                           │
│            MongoDB Enterprise Database (Database: careops)             │
│    Collections: users • doctors • patients • appointments              │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Project Structure

```
HackSprint-HealthCall/
├── backend/                             # Core Healthcare Express Backend (Port 5000)
│   ├── appointments/                   # Appointments business logic, routes & controllers
│   ├── auth/                           # Authentication controllers, service, routes
│   ├── config/                         # DB connector, role constants, environment vars
│   ├── constants/                      # Application constants and role mappings
│   ├── doctors/                        # Doctor roster controllers & services
│   ├── middleware/                     # JWT verification, RBAC guards, error handler
│   ├── models/                         # Mongoose Models: User, Doctor, Patient, Appointment
│   ├── patients/                       # Patient management logic & endpoints
│   ├── tests/                          # 74 automated unit & integration tests
│   ├── users/                          # User governance controllers & endpoints
│   ├── app.js                          # Express app configuration & route mounting
│   ├── server.js                       # HTTP server entry point
│   └── package.json                    # Backend dependencies & test scripts
├── src/                                # Next.js Frontend Application (Port 3000)
│   ├── app/                            # Next.js App Router Pages
│   │   ├── admin/dashboard/            # Hospital Executive Master Console
│   │   ├── auth/login/                 # Role-based login gateway
│   │   ├── auth/signup/                # Patient and staff registration
│   │   ├── doctor/dashboard/           # Physician clinical queue
│   │   ├── insurance/dashboard/        # RCM & Prior-Authorization desk
│   │   ├── manager/dashboard/          # Department operations command
│   │   ├── patient/dashboard/          # Patient experience portal
│   │   ├── profile/                    # Dynamic authenticated user profile
│   │   ├── reception/dashboard/        # Front-desk intake & scheduling
│   │   ├── landing/                    # Product landing page & demo
│   │   └── layout.tsx                  # Global HTML shell & context providers
│   ├── features/                       # Modular Feature Components & Services
│   │   ├── admin/                      # Admin overview cards, user table, rules
│   │   ├── doctor/                     # Doctor queue table, patient brief modal
│   │   ├── insurance/                  # Claims ledger, timeline visualizer
│   │   ├── manager/                    # Workload balancer, escalation incidents
│   │   ├── patient/                    # Appointment manager, requests, notifications
│   │   ├── platform/                   # Global authContext, sessionStore, api clients
│   │   │   ├── appointments/           # apiAppointmentService.ts
│   │   │   ├── auth/                   # authService.ts, RoleGuard.tsx
│   │   │   ├── doctors/                # apiDoctorService.ts
│   │   │   ├── patients/               # apiPatientService.ts
│   │   │   └── users/                  # apiUserService.ts
│   │   └── reception/                  # Appointment queue, patient directory
│   ├── shared/                         # Reusable UI Primitives
│   │   ├── components/layout/          # AppShell.tsx, Header, Sidebar, Navigation
│   │   ├── components/ui/              # Badge, Button, Card, Input, Modal, Tabs
│   │   └── utils/                      # Classname merge helpers (cn.ts)
│   └── utils/supabase/                 # Supabase client helpers & session middleware
├── workflow-engine/                     # Telephony Event & SLA Routing Engine (Port 4000)
│   ├── prisma/                         # PostgreSQL Schema (schema.prisma) & migrations
│   ├── src/                            # Express / Prisma telephony endpoints
│   └── scripts/start-db.js             # Embedded PostgreSQL local launcher
├── REAL_DATA_INTEGRATION_REPORT.md     # Production data migration audit report
├── ARCHITECTURE.md                     # Deep visual architecture & Mermaid diagrams
├── package.json                        # Root frontend dependencies & scripts
└── tsconfig.json                       # Path aliases (@/* -> src/*)
```

---

## API Overview

All backend endpoints are prefixed with `/api/v1` and follow standard HTTP semantics:

### 1. Authentication (`/api/v1/auth`)
| Route | Method | Access | Description |
|---|---|---|---|
| `/api/v1/auth/register` | `POST` | Public | Registers a new user account with bcrypt hashing and returns a JWT token. |
| `/api/v1/auth/login` | `POST` | Public | Validates credentials against MongoDB and returns an authenticated JWT. |
| `/api/v1/auth/me` | `GET` | Authenticated | Returns current authenticated user details and active session status. |
| `/api/v1/auth/logout` | `POST` | Authenticated | Invalidates the active session cookie/token on the client. |

### 2. User Management (`/api/v1/users`)
| Route | Method | Access | Description |
|---|---|---|---|
| `/api/v1/users` | `GET` | Admin, Manager | Lists hospital users with optional role, department, status, and search filters. |
| `/api/v1/users` | `POST` | Admin | Provisions a new staff account. Auto-provisions a `Doctor` document if role is `DOCTOR`. |
| `/api/v1/users/:id` | `GET` | Admin, Manager | Fetches detailed metadata for a single user (scoped by department for managers). |
| `/api/v1/users/:id` | `PATCH` | Admin | Updates user name, role, department, or phone. |
| `/api/v1/users/:id/status`| `PATCH` | Admin | Toggles user status between `ACTIVE` and `SUSPENDED`. |
| `/api/v1/users/:id` | `DELETE`| Admin | Performs soft deletion by marking user status as `INACTIVE`. |

### 3. Patient Management (`/api/v1/patients`)
| Route | Method | Access | Description |
|---|---|---|---|
| `/api/v1/patients` | `GET` | Staff | Retrieves patient directory records with pagination and search. |
| `/api/v1/patients` | `POST` | Admin, Reception | Registers a new patient with MRN generation and linked User account. |
| `/api/v1/patients/me` | `GET` | Patient | Returns the logged-in patient's personal EHR record and assigned doctor. |
| `/api/v1/patients/:id`| `GET` | Staff, Self | Retrieves full demographic and clinical summary for a patient. |
| `/api/v1/patients/:id`| `PATCH` | Staff, Self | Updates contact info (or clinical notes if physician/admin). |
| `/api/v1/patients/:id`| `DELETE`| Admin | Soft-deletes a patient record. |

### 4. Doctor Management (`/api/v1/doctors`)
| Route | Method | Access | Description |
|---|---|---|---|
| `/api/v1/doctors` | `GET` | Authenticated | Lists all active doctors with specialization and department metadata. |
| `/api/v1/doctors/me` | `GET` | Doctor | Fetches the logged-in clinician's profile and assigned patient roster. |
| `/api/v1/doctors/me/availability` | `PATCH` | Doctor | Updates doctor availability hours and weekly consultation slots. |
| `/api/v1/doctors/:id/assign-patient` | `POST` | Admin, Doctor | Assigns a patient to the doctor's active clinical care roster. |

### 5. Appointments Engine (`/api/v1/appointments`)
| Route | Method | Access | Description |
|---|---|---|---|
| `/api/v1/appointments` | `GET` | Authenticated | Scoped retrieval: Patients see their bookings; Doctors see their queue; Staff see all. |
| `/api/v1/appointments` | `POST` | Patient, Staff | Books a new appointment, creates MongoDB document, links patient and doctor. |
| `/api/v1/appointments/:id` | `PATCH` | Authenticated | Reschedules an appointment date/time or updates appointment status. |
| `/api/v1/appointments/:id` | `DELETE`| Authenticated | Cancels an appointment and updates the doctor's queue in real time. |

---

## Security Architecture

1. **Cryptographic Authentication**: Passwords hashed using `bcryptjs` with auto-generated salts prior to database storage.
2. **Stateless JWT Authorization**: Secure JSON Web Tokens with strict expiry (`7d`), signed using environment secrets and delivered in `Authorization: Bearer <token>` headers and cookies.
3. **Multi-Layered RBAC Middleware**: Every protected endpoint passes through `verifyToken` and `requireRole(...)` guards before invoking controllers.
4. **Data Privacy & Tenancy Isolation**:
   - Patients can only access their own EHR record (`/api/v1/patients/me`). Requests to other patient IDs are blocked with `403 Forbidden`.
   - Doctors can only view their own patient queue and assigned clinical records.
   - Department Managers are scoped exclusively to staff within their own hospital division.
5. **Defensive Input Validation**: Server-side request sanitization guards against MongoDB operator injection and unescaped payloads.

---

## Getting Started & Local Setup

### Prerequisites
- **Node.js**: v20.x or v22.x
- **MongoDB**: Local MongoDB instance running on `mongodb://127.0.0.1:27017`

### 1. Clone & Install
```bash
git clone https://github.com/Mohammed-Ayyan/HackSprint-HealthCall.git
cd HackSprint-HealthCall

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 2. Environment Variables
Create `backend/.env`:
```env
PORT=5000
NODE_ENV=development
DATABASE_URL=mongodb://127.0.0.1:27017/careops
JWT_SECRET=careops_production_grade_jwt_secret_token_2026
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
```

Create root `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_SUPABASE_URL=https://uzvvhgvwlrznjqqjwthr.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_nUwXjbeGv_gmhiEc78kN6w_-rsQsHQP
```

### 3. Run the Platform
In Terminal 1 (Backend):
```bash
cd backend
node server.js
# Output: [CareOps DB] Connected to MongoDB: 127.0.0.1/careops (Port 5000)
```

In Terminal 2 (Frontend):
```bash
npm run dev
# Output: Ready on http://localhost:3000
```

### 4. Run Automated Tests
```bash
cd backend
npm test
# Result: 74 passing tests across Auth, Users, Patients, Doctors, and Appointments
```

---

## Future Roadmap

1. **AI Telephony Streaming (Q1 2027)**: WebRTC/SIP trunk ingestion for automated two-channel patient call transcription via Whisper-v3.
2. **Clinical Entity Recognition**: Fine-tuned BioBERT / ClinicalNLP pipeline to extract ICD-10 diagnosis codes and CPT procedural codes from speech.
3. **Autonomous Prior-Authorization Bridges**: Direct HL7 / FHIR integration to dispatch extracted surgical requests straight to major insurance clearinghouses.
4. **Predictive Hospital Load Analytics**: Time-series forecasting for emergency intake surges and clinician capacity balancing.
