# CareOps AI — Healthcare Call Intelligence & Operations Platform

> **Autonomous Clinical Telephony Processing, NLU Intent Classification, and Departmental Workflow Dispatch**

CareOps AI transforms chaotic patient phone calls into structured, verified hospital actions in real time. Designed as an operational intelligence console for hospital command centers, nursing supervisors, and departmental leads, CareOps AI ensures zero dropped follow-ups, instantaneous prior-authorization initiation, and continuous SLA enforcement.

---

## 1. Project Overview

Hospitals receive thousands of patient calls daily regarding post-op complications, prescription renewals, billing disputes, and insurance hurdles. In legacy healthcare systems, these conversations are transcribed manually or lost in disconnected voicemail queues.

**CareOps AI** introduces a real-time, deterministic intelligence pipeline:

```
Patient Call
     ↓
Dual-Channel Speech Processing (Whisper-v3 Diarization)
     ↓
AI Conversation Understanding (NLU Clinical Parser)
     ↓
Summary + Intent Detection + Sentiment Scoring + Priority Classification
     ↓
Action & Commitment Extraction (Transcript-Grounded)
     ↓
Autonomous Department Routing (Reception, Insurance, Billing, Pharmacy, Triage)
     ↓
Task Tracking & SLA Countdown Engine (4-Column Kanban)
     ↓
Hospital Operations Intelligence Dashboard & Compliance Ledger
```

---

## 2. Frontend Architecture

The platform is engineered around a **Clean Feature-Based Architecture** built for Phase 1 mock demonstration and seamless Phase 2 backend replacement without modifying any UI components.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           UI Layer (App Router)                         │
│   /landing • /dashboard • /calls • /calls/[id] • /actions • /analytics  │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
┌────────────────────────────────────▼────────────────────────────────────┐
│                    Shared UI & Antigravity Design System                 │
│      Button, Card, Badge, Modal, Tabs, LiveWaveform, AudioPlayer, Stat   │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
┌────────────────────────────────────▼────────────────────────────────────┐
│                       Feature Modules & State                           │
│  src/features/ai-intelligence   src/features/workflow   src/features/platform │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
┌────────────────────────────────────▼────────────────────────────────────┐
│                   Mock Service Layer (API Contract Compliant)           │
│   mockCallService.ts • mockCallsService.ts • mockTasksService.ts        │
│   mockAuthService.ts • mockUserService.ts  • mockAnalyticsService.ts    │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │ (Phase 2 Clean Replacement Point)
┌────────────────────────────────────▼────────────────────────────────────┐
│                      Future Production Backend APIs                     │
│               FastAPI / Go Telephony / Epic FHIR / PostgreSQL           │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Feature List

### Module 1: AI Intelligence Frontend
- **Live Call Telephony Monitor**: Real-time dual-channel audio waveforms, live speaking status, and encrypted recording indicators.
- **Interactive Call Simulator**: Sandbox modal allowing judges to trigger an inbound telephony stream and watch diarization, clinical intent detection, and task generation live.
- **Synchronized Audio Scrubber**: Interactive player with speed adjustments (1x, 1.25x, 1.5x) and timestamped scrubbers.
- **Clinical Summary & Structured Points**: Auto-generated concise summaries, clinical flags, and prior-auth status.
- **Multi-Label Intent Detection**: Classifies across *Appointment Request*, *Insurance Query*, *Complaint*, *Billing Issue*, *Medicine Refill*, and *Emergency Concern*.
- **Vocal Stress & Sentiment Gauge**: Real-time valence spectrum from *Angry* to *Positive* with normalized score (-1.0 to +1.0).
- **Grounded Evidence Viewer**: Cryptographically anchors every extracted action to exact verbatim quotes from the patient conversation.
- **Verbal Commitment Tracker**: Monitors promises made to patients (e.g., *"We will call you back by 10:00 AM"*) with owner tracking and fulfillment checkboxes.

### Module 2: Workflow Frontend
- **Call Management System**: Search, filter by priority/department/status, sort, and pagination.
- **Kanban Board**: 4-column swimlane (*Pending Triage*, *Assigned to Staff*, *In Active Progress*, *Completed & Verified*).
- **Live SLA Countdown Engine**: Real-time remaining hours countdown with warning thresholds and breach alerts.
- **Manager Escalation Watchlist**: Immediate surfacing of overdue tasks with 1-click supervisor escalation.
- **Autonomous Department Routing**: Visual matrix illustrating intent-to-department rules with target SLAs and auto-assignees.
- **Staff Assignment Modal**: 1-click assignment of personnel to active tasks with workload balances.

### Module 3: Platform Frontend
- **Role-Based Persona Switcher**: Instant switching between *Admin*, *Doctor*, *Receptionist*, *Insurance Employee*, and *Manager*.
- **Staff Access Governance Table**: Full CRUD user management with role assignment and capacity analytics.
- **Notification Center**: Filterable inbox for *Critical Calls*, *Escalations*, *Deadline Warnings*, and *New Tasks*.
- **Recharts Analytics Suite**:
  - Telephony Volume vs. Action Velocity (Area Chart)
  - Clinical Intent Distribution (Donut Chart)
  - Department Workload Capacities (Bar Chart)
  - Resolution Time vs. Target SLA (Comparison Bar Chart)
- **Global Command Palette (`Ctrl+K`)**: Omnisearch across Patients, Calls, Tasks, Departments, and Staff.
- **Certified Reporting**: Instant CSV dataset generation and audit-ready PDF dossiers.
- **Immutable Audit Timeline**: Chronological event ledger from SIP call arrival to resolution.

---

## 4. Folder Structure

```
src/
├── app/
│   ├── actions/page.tsx             # Kanban workflow & SLA management
│   ├── analytics/page.tsx           # Recharts operations analytics
│   ├── auth/
│   │   ├── login/page.tsx           # Role-based preset login
│   │   └── signup/page.tsx          # Staff onboarding
│   ├── calls/
│   │   ├── [id]/page.tsx            # Deep call intelligence dossier
│   │   └── page.tsx                 # Searchable calls table
│   ├── dashboard/page.tsx           # Executive operations console
│   ├── landing/page.tsx             # Product story & live demo showcase
│   ├── notifications/page.tsx       # Triage alerts inbox
│   ├── settings/page.tsx            # Platform thresholds & EHR bridges
│   ├── users/page.tsx               # Staff & RBAC governance
│   ├── globals.css                  # Antigravity Tailwind 4 styling
│   ├── layout.tsx                   # Root HTML shell & metadata
│   └── page.tsx                     # Landing root entry
├── features/
│   ├── ai-intelligence/
│   │   ├── components/
│   │   │   ├── ActionExtractor.tsx
│   │   │   ├── AISummaryCard.tsx
│   │   │   ├── CommitmentTracker.tsx
│   │   │   ├── EvidenceViewer.tsx
│   │   │   ├── IntentDetector.tsx
│   │   │   ├── LiveCallMonitor.tsx
│   │   │   ├── LiveCallSimulatorModal.tsx
│   │   │   ├── PriorityBadge.tsx
│   │   │   └── SentimentGauge.tsx
│   │   └── mockCallService.ts       # AI service abstraction
│   ├── platform/
│   │   ├── components/
│   │   │   ├── AnalyticsCharts.tsx
│   │   │   ├── AuditTimeline.tsx
│   │   │   ├── NotificationDropdown.tsx
│   │   │   ├── ReportsExporter.tsx
│   │   │   └── UserManagementTable.tsx
│   │   ├── mockAnalyticsService.ts
│   │   ├── mockAuditService.ts
│   │   ├── mockAuthService.ts
│   │   ├── mockNotificationsService.ts
│   │   └── mockUserService.ts
│   └── workflow/
│       ├── components/
│       │   ├── CallTable.tsx
│       │   ├── DepartmentRoutingUI.tsx
│       │   ├── EscalationBanner.tsx
│       │   ├── KanbanBoard.tsx
│       │   ├── SLATrackerCard.tsx
│       │   └── TaskCard.tsx
│       ├── mockCallsService.ts
│       └── mockTasksService.ts
└── shared/
    ├── components/
    │   ├── common/
    │   │   ├── AudioPlayer.tsx
    │   │   ├── LiveWaveform.tsx
    │   │   └── StatCard.tsx
    │   ├── layout/
    │   │   ├── AppShell.tsx
    │   │   ├── CommandPalette.tsx
    │   │   ├── Header.tsx
    │   │   └── Sidebar.tsx
    │   └── ui/
    │       ├── Badge.tsx
    │       ├── Button.tsx
    │       ├── Card.tsx
    │       ├── Input.tsx
    │       ├── Modal.tsx
    │       └── Tabs.tsx
    ├── types/
    │   ├── action.ts
    │   ├── analytics.ts
    │   ├── audit.ts
    │   ├── call.ts
    │   ├── notification.ts
    │   └── user.ts
    └── utils/
        ├── cn.ts
        ├── export.ts
        └── formatters.ts
```

---

## 5. Design System: Antigravity Healthcare Aesthetics

CareOps AI uses the **Antigravity Design System** crafted specifically for deep operational monitoring:
- **Backgrounds**: Deep graphite and navy (`#080c14`, `#090d16`, `#0f172a`).
- **Glassmorphism**: Multi-layered backdrop blurs (`backdrop-blur-xl`) with ultra-fine borders (`border-white/10`, `border-cyan-500/20`).
- **Healthcare Cyan Accents**: Primary action glow (`#06b6d4`, `#22d3ee`).
- **AI Purple Highlights**: Natural language model inference badges (`#8b5cf6`, `#a855f7`).
- **Clinical Urgency Accents**: Amber for high warnings (`#f59e0b`), Rose/Red for emergency triage (`#ef4444`).
- **Micro-Interactions**: Real-time pulsing status pings, audio bar animations, and tactile active-scale button presses.

---

## 6. Component Documentation

| Component | Module | Description |
|---|---|---|
| `LiveCallMonitor` | AI Intelligence | In-flight active telephony monitor with live audio bars and streaming transcript |
| `LiveCallSimulatorModal` | AI Intelligence | Interactive sandbox simulating live inbound patient speech and real-time task generation |
| `AudioPlayer` | Shared Common | Interactive audio scrubber with waveform visualization, rate toggle (1x-1.5x), and timestamps |
| `AISummaryCard` | AI Intelligence | Structured NLU summary, key bullet points, and clinical flags |
| `IntentDetector` | AI Intelligence | 6-way clinical intent classifier with primary and secondary confidence ratings |
| `SentimentGauge` | AI Intelligence | Acoustic and lexical emotional valence meter (-1.0 to +1.0) |
| `CommitmentTracker` | AI Intelligence | Audit log of verbal promises delivered to patient with fulfillment toggles |
| `EvidenceViewer` | AI Intelligence | Side-by-side explainability grounding AI actions directly to transcript text |
| `KanbanBoard` | Workflow | 4-column operational swimlane for hospital action items |
| `TaskCard` | Workflow | Rich task card with department pills, assignee avatars, SLA countdowns, and escalation controls |
| `CallTable` | Workflow | Searchable, filterable, paginated enterprise data grid of all hospital calls |
| `DepartmentRoutingUI` | Workflow | Visual flow showing intent-to-department routing rules and target SLAs |
| `SLATrackerCard` | Workflow | Live countdown deadline monitor highlighting breached and warning tasks |
| `EscalationBanner` | Workflow | High-priority supervisor banner for overdue or high-risk tasks |
| `AnalyticsCharts` | Platform | Recharts data visualizations for call volumes, intent breakdown, workloads, and SLAs |
| `ReportsExporter` | Platform | Export utilities for Call, Department, and Performance reports (CSV & PDF) |
| `UserManagementTable` | Platform | Full CRUD table for hospital personnel, roles, and department queues |
| `CommandPalette` | Shared Layout | Omnisearch dialog (`Ctrl+K`) searching patients, calls, tasks, departments, and staff |

---

## 7. Mock Service Explanation

To guarantee decoupled development, all feature data is served through asynchronous mock services that mirror HTTP network latency and return type-safe domain models:

- `mockCallService.ts`: Serves live active call sessions, streaming simulations, and NLU intelligence.
- `mockCallsService.ts`: Manages multi-scenario call catalogs (insurance delay, post-op fever, duplicate billing, medication renewal, acute emergency).
- `mockTasksService.ts`: Implements stateful task lifecycle updates (`updateTaskStatus`), assignments (`assignTask`), and escalations (`escalateTask`).
- `mockAuthService.ts`: Provides user session state with 1-click role persona switching.
- `mockUserService.ts`: Manages staff roster with add, edit, and delete handlers.
- `mockNotificationsService.ts`: Stores real-time triage alerts with unread counter management.
- `mockAnalyticsService.ts`: Generates metrics, volume trends, and SLA compliance data.
- `mockAuditService.ts`: Supplies immutable audit trail events for every call.

---

## 8. API Contract Documentation

The frontend types defined in `src/shared/types/` serve as the binding contract for backend engineers:

### Call Model
```typescript
interface Call {
  id: string;
  callNumber: string;
  patient: {
    id: string;
    name: string;
    age: number;
    gender: string;
    phone: string;
    mrn: string;
    insuranceProvider: string;
  };
  duration: string;
  durationSeconds: number;
  timestamp: string;
  status: "in-progress" | "analyzed" | "triaged" | "archived";
  priority: "critical" | "high" | "medium" | "low";
  intent: "Appointment Request" | "Insurance Query" | "Complaint" | "Billing Issue" | "Medicine Refill" | "Emergency Concern";
  secondaryIntents?: string[];
  sentiment: "positive" | "neutral" | "concerned" | "frustrated" | "angry";
  sentimentScore: number; // -1.0 to +1.0
  summary: {
    overview: string;
    keyPoints: string[];
    clinicalFlags: string[];
    insurancePending: boolean;
    confidenceScore: number;
  };
  transcript: {
    id: string;
    speaker: "agent" | "patient" | "system";
    speakerName: string;
    text: string;
    timestamp: string;
    offsetSeconds: number;
    sentiment?: string;
    highlighted?: boolean;
  }[];
  actions: ActionExtraction[];
  commitments: Commitment[];
  assignedDepartment: string;
  agentName: string;
  slaRemainingHours: number;
}
```

### Action Item Model
```typescript
interface ActionItem {
  id: string;
  callId: string;
  patientName: string;
  patientMrn: string;
  task: string;
  description: string;
  department: "Reception" | "Insurance" | "Customer Support" | "Billing" | "Pharmacy" | "Emergency Triage" | "Clinical Team";
  priority: "critical" | "high" | "medium" | "low";
  deadline: string;
  status: "pending" | "assigned" | "in-progress" | "completed";
  assignedTo?: {
    id: string;
    name: string;
    avatar: string;
    role: string;
  };
  evidenceQuote: string;
  sla: {
    totalHours: number;
    remainingHours: number;
    deadlineTimestamp: string;
    isBreached: boolean;
    isWarning: boolean;
  };
  isEscalated: boolean;
  escalatedTo?: string;
  escalationReason?: string;
  createdAt: string;
  updatedAt: string;
}
```

---

## 9. Backend Integration Guide

Three backend developers can take ownership of individual modules without conflicting:

### Backend Developer 1: AI Intelligence
- **Endpoints to implement**:
  - `GET /api/v1/ai/live-call`
  - `WS /api/v1/ai/stream-call/{call_id}` (WebSocket for diarized audio transcript chunks)
  - `GET /api/v1/ai/intelligence/{call_id}`
- **Service file to swap**: `src/features/ai-intelligence/mockCallService.ts`

### Backend Developer 2: Workflow & Operations
- **Endpoints to implement**:
  - `GET /api/v1/calls` (with query filters `search`, `priority`, `department`, `status`, `intent`, `page`)
  - `GET /api/v1/calls/{id}`
  - `GET /api/v1/tasks` (with Kanban filter params)
  - `PATCH /api/v1/tasks/{id}/status`
  - `POST /api/v1/tasks/{id}/assign`
  - `POST /api/v1/tasks/{id}/escalate`
- **Service files to swap**:
  - `src/features/workflow/mockCallsService.ts`
  - `src/features/workflow/mockTasksService.ts`

### Backend Developer 3: Platform & Administration
- **Endpoints to implement**:
  - `GET /api/v1/platform/users`
  - `POST /api/v1/platform/users`
  - `PATCH /api/v1/platform/users/{id}`
  - `DELETE /api/v1/platform/users/{id}`
  - `GET /api/v1/platform/notifications`
  - `PATCH /api/v1/platform/notifications/{id}/read`
  - `GET /api/v1/platform/analytics/summary`
  - `GET /api/v1/platform/analytics/trends`
- **Service files to swap**:
  - `src/features/platform/mockAuthService.ts`
  - `src/features/platform/mockUserService.ts`
  - `src/features/platform/mockNotificationsService.ts`
  - `src/features/platform/mockAnalyticsService.ts`
  - `src/features/platform/mockAuditService.ts`

---

## 10. Instructions for Replacing Mock Services with Real APIs

Replacing a mock service requires **zero modifications to components or pages**.

### Example: Replacing `mockCallsService.ts`

1. Create `src/features/workflow/apiCallsService.ts`:

```typescript
import { Call } from "@/shared/types/call";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.careops.ai/v1";

export const apiCallsService = {
  async getCalls(filters?: Record<string, string>): Promise<Call[]> {
    const params = new URLSearchParams(filters);
    const res = await fetch(`${API_BASE_URL}/calls?${params.toString()}`);
    if (!res.ok) throw new Error("Failed to fetch calls");
    return res.json();
  },

  async getCallById(id: string): Promise<Call> {
    const res = await fetch(`${API_BASE_URL}/calls/${id}`);
    if (!res.ok) throw new Error("Failed to fetch call details");
    return res.json();
  },
};
```

2. In components, update the import alias or re-export:

```typescript
// in src/features/workflow/index.ts
export { apiCallsService as callsService } from "./apiCallsService";
```

All UI components continue consuming the identical TypeScript contract.

---

## 11. Complete Healthcare Operations Operating System

CareOps AI connects the entire hospital human ecosystem:

```
Patients
   ↓
Healthcare Employees
   ↓
Doctors
   ↓
Departments
   ↓
Insurance Teams
   ↓
Hospital Administration
```

### 11.1 Dedicated User Roles & Portals

| Role | Route | Purpose | Key Features |
|---|---|---|---|
| **Patient** | `/patient/dashboard` | Request tracking & communications | Upcoming appointment cards, insurance status tracker, request resolution ledger, telephony transcript summaries, unread hospital alerts |
| **Doctor** | `/doctor/dashboard` | Clinical triage & patient encounters | Live patient queue, AI clinical briefs (previous conversation, pending issue, required action), follow-up creation & dispatch |
| **Receptionist** | `/reception/dashboard` | Front-desk scheduling & intake | Appointment queue (pending/confirmed/cancelled), AI call action execution, patient registry & search, multi-provider calendar matrix |
| **Insurance Employee** | `/insurance/dashboard` | Prior-authorization & RCM | Claims ledger with SLA deadlines, AI claim conversation extract, 4-stage lifecycle timeline (`Submitted` → `Reviewed` → `Updated` → `Completed`) |
| **Department Manager** | `/manager/dashboard` | Workload balancing & SLA incident command | Team capacity matrix, employee efficiency ratings, escalation command with reassignment & priority elevation |
| **Hospital Administrator** | `/admin/dashboard` | Executive governance & compliance | Total call volume & AI accuracy metrics, user RBAC provisioning, 5-department vitality oversight, system routing rules |

---

## 12. Role Permissions Matrix

| Feature / Domain | Patient | Doctor | Receptionist | Insurance Employee | Dept Manager | Hospital Admin |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| **Personal Profile & Timeline** | View | View | View | View | View | View |
| **View Own Medical Care Briefs** | View | Full | View | Read-Only | Full | Full |
| **Book / Reschedule Appointments** | Request | Full | Full | - | Manage | Full |
| **AI Call Diarization & Audio Player** | Transcript | Full | Full | - | Full | Full |
| **Execute Front-Desk Call Actions** | - | - | Full | - | Supervise | Full |
| **Manage Prior-Auth & Claims** | Status | Co-Sign | Status | Full | Supervise | Full |
| **Assign / Reassign Staff Tasks** | - | Tasks | Intake | - | Full | Full |
| **Manage RBAC Users & Roles** | - | - | - | - | - | Full |
| **Configure AI & Routing Rules** | - | - | - | - | - | Full |

---

## 13. Solarpunk Eco-Futuristic Design Direction

CareOps AI rejects generic SaaS neon cliches and excessive blurry glassmorphism in favor of a **Solarpunk Eco-Futuristic Living System**:

- **Palette**: Deep forest moss charcoal (`#07100c`, `#0a1711`, `#12241b`), bioluminescent emerald (`#34d399`), river teal (`#2dd4bf`), solar amber (`#f59e0b`), terracotta urgency (`#f87171`).
- **Surfaces**: Solid elevated panels (`.eco-panel`), natural contrast borders (`#1b362a`), tactile depth without eye-straining glows.
- **Metaphors**: Patient Wellness Flow, Department Vitality, Operational Equilibrium.
- **Human Centricity**: Technology is quiet and assistive; medical providers and patients remain the focal point.

---

## 14. Backend Integration Roadmap & Module API Specifications

### Patient Portal Module (`/patient`)
- `GET /api/patient/overview`: Returns `PatientOverviewData` (MRN, primary PCP, insurance status, active counts).
- `GET /api/patient/appointments`: Returns array of `PatientAppointment`.
- `POST /api/patient/appointments`: Books appointment slot. Payload: `{ doctorName, date, time, type, instructions }`.
- `PUT /api/patient/appointments/:id/reschedule`: Updates appointment slot. Payload: `{ date, time }`.
- `DELETE /api/patient/appointments/:id`: Cancels appointment.
- `GET /api/patient/requests`: Returns telephony-extracted care requests.
- `GET /api/patient/communications`: Returns past telephony call records, summaries, and commitments.

### Doctor Portal Module (`/doctor`)
- `GET /api/doctor/overview`: Returns clinician queue counts, today's schedule, and next patient time.
- `GET /api/doctor/queue`: Returns arrival queue with embedded `aiBrief` (`previousConversation`, `pendingIssue`, `requiredAction`).
- `PUT /api/doctor/queue/:id/status`: Updates patient consultation status (`Checked In`, `In Consultation`, `Pending Labs`).
- `GET /api/doctor/followups`: Returns scheduled clinician follow-ups.
- `POST /api/doctor/followups`: Schedules follow-up protocol and assigns nursing triage team.

### Receptionist Portal Module (`/reception`)
- `GET /api/reception/overview`: Intake desk counters and pending tasks.
- `GET /api/reception/appointments`: Full intake appointment queue with status filters.
- `PUT /api/reception/appointments/:id/status`: Confirms or cancels appointments.
- `GET /api/reception/call-actions`: AI-generated front-desk tasks extracted from calls.
- `PUT /api/reception/call-actions/:id/complete`: Marks call action resolved.
- `GET /api/reception/patients`: Universal patient directory lookup.
- `POST /api/reception/patients`: Registers new patient MRN and demographics.
- `GET /api/reception/schedules`: Multi-provider daily/weekly availability slots.

### Insurance Employee Module (`/insurance`)
- `GET /api/insurance/overview`: Payer queue counters (Pending, Approved, Rejected, Urgent).
- `GET /api/insurance/claims`: Claims table with amounts, deadlines, and current stage.
- `PUT /api/insurance/claims/:id/stage`: Advances claim along lifecycle (`Submitted` → `Reviewed` → `Updated` → `Completed`).
- `PUT /api/insurance/claims/:id/verify`: Submits electronic verification or appeals.

### Department Manager Module (`/manager`)
- `GET /api/manager/overview`: Total employees, active/completed tasks, overdue SLA counts, vitality score.
- `GET /api/manager/workloads`: Real-time capacity utilization and efficiency ratings per employee.
- `GET /api/manager/escalations`: Overdue commitments and SLA incidents.
- `PUT /api/manager/escalations/:id/reassign`: Reassigns incident and updates urgency tier.
- `PUT /api/manager/escalations/:id/resolve`: Clears escalation from incident command.

### Hospital Administrator Module (`/admin`)
- `GET /api/admin/overview`: Hospital-wide analytics, call throughput, and AI accuracy metrics.
- `GET /api/admin/users`: Universal staff RBAC directory.
- `POST /api/admin/users`: Provisions new account with role-specific policy bundles.
- `PUT /api/admin/users/:id/toggle-status`: Activates or deactivates user accounts.
- `GET /api/admin/departments`: 5 hospital divisions with staffing, workload, and commitments.
- `GET /api/admin/rules`: Routing thresholds, AI confidence scores, and SLA notification rules.
- `PUT /api/admin/rules/:id/toggle`: Activates or pauses hospital operating rules.

---

## 15. Getting Started

### Prerequisites
- Node.js 18+ (tested on Node v20/v26)
- npm 9+

### Installation & Run

```bash
# Install dependencies
npm install

# Run development server with Turbopack
npm run dev
```

- Open [http://localhost:3000](http://localhost:3000) for the CareOps AI Living System experience.
- Open [http://localhost:3000/dashboard](http://localhost:3000/dashboard) for the Healthcare Command Center.
- Open [http://localhost:3000/patient/dashboard](http://localhost:3000/patient/dashboard) for the Patient Portal.
- Open [http://localhost:3000/doctor/dashboard](http://localhost:3000/doctor/dashboard) for the Doctor Portal.
- Open [http://localhost:3000/reception/dashboard](http://localhost:3000/reception/dashboard) for the Reception Desk.
- Open [http://localhost:3000/insurance/dashboard](http://localhost:3000/insurance/dashboard) for the Insurance & RCM Hub.
- Open [http://localhost:3000/manager/dashboard](http://localhost:3000/manager/dashboard) for the Department Manager Portal.
- Open [http://localhost:3000/admin/dashboard](http://localhost:3000/admin/dashboard) for the Hospital Administrator Console.
- Open [http://localhost:3000/profile](http://localhost:3000/profile) for User Profile & Activity Timeline.
- Press `Ctrl + K` anywhere in the app to access Omnisearch.
- Click **"Simulate Inbound Call"** in the top navigation to trigger live streaming diarization.

