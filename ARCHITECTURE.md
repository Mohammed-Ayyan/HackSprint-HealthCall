# CareOps AI — Technical Architecture & Visual Documentation

This document provides a comprehensive architectural blueprint of the **CareOps AI** healthcare operations platform. All diagrams use GitHub-native Mermaid syntax to visually articulate system boundaries, communication protocols, database schemas, and request lifecycles.

---

## Table of Contents
1. [High-Level System Architecture](#1-high-level-system-architecture)
2. [Complete Data Flow Diagram](#2-complete-data-flow-diagram)
3. [Authentication & Session Flow](#3-authentication--session-flow)
4. [Role-Based Access Control (RBAC) Flow](#4-role-based-access-control-rbac-flow)
5. [Database Relationship Model (ERD)](#5-database-relationship-model-erd)
6. [Feature Architecture Tree](#6-feature-architecture-tree)
7. [Frontend-to-Backend Layered Flow](#7-frontend-to-backend-layered-flow)
8. [Deployment & Infrastructure Architecture](#8-deployment--infrastructure-architecture)
9. [Complete End-to-End Request Lifecycle](#9-complete-end-to-end-request-lifecycle)
10. [Module Ownership & Implementation Status](#10-module-ownership--implementation-status)

---

## 1. High-Level System Architecture

CareOps AI is structured into decoupled, loosely bound layers: client UI, an API and middleware gateway, encapsulated domain services, and persistence databases.

```mermaid
graph TD
    subgraph Client_Layer ["Client Tier (Browser & Telephony)"]
        User["Hospital Users (Patients, Doctors, Staff)"]
        Telephony["SIP / VoIP Inbound Telephony Stream"]
    end

    subgraph Frontend_App ["Frontend Application (Next.js 16 App Router)"]
        NextApp["React 19 Shell & App Router"]
        AuthContext["Auth Context & Session Store"]
        APIServices["Feature API Client Services"]
        NextApp --> AuthContext
        NextApp --> APIServices
    end

    subgraph API_Gateway ["Express API Gateway (Port 5000)"]
        CORS["CORS & Request Body Sanitizer"]
        AuthMW["JWT Verification Middleware"]
        RBACMW["Role-Based Route Guard"]
        CORS --> AuthMW --> RBACMW
    end

    subgraph Backend_Services ["Backend Domain Services Layer"]
        AuthSvc["Auth Service"]
        UserSvc["User Service"]
        PatSvc["Patient Service"]
        DocSvc["Doctor Service"]
        AptSvc["Appointment Service"]
    end

    subgraph Persistence ["Persistence Layer"]
        MongoDB[("MongoDB 7.0 Enterprise Database")]
        UsersCol[("Collection: users")]
        DocsCol[("Collection: doctors")]
        PatsCol[("Collection: patients")]
        AptsCol[("Collection: appointments")]
        MongoDB --> UsersCol
        MongoDB --> DocsCol
        MongoDB --> PatsCol
        MongoDB --> AptsCol
    end

    User --> NextApp
    Telephony --> NextApp
    APIServices -->|"HTTP REST (Bearer JWT)"| CORS
    RBACMW --> AuthSvc
    RBACMW --> UserSvc
    RBACMW --> PatSvc
    RBACMW --> DocSvc
    RBACMW --> AptSvc

    AuthSvc --> MongoDB
    UserSvc --> MongoDB
    PatSvc --> MongoDB
    DocSvc --> MongoDB
    AptSvc --> MongoDB
```

---

## 2. Complete Data Flow Diagram

This diagram traces how unstructured healthcare phone calls are parsed, transformed into clinical action items, and routed to hospital departments for completion.

```mermaid
flowchart TD
    A["Inbound Patient Call"] --> B["Dual-Channel Speech Audio Processing"]
    B --> C["AI Conversation Understanding & NLP"]
    C --> D["Clinical Summary Generation"]
    C --> E["Multi-Label Intent Detection"]
    C --> F["Vocal Stress & Sentiment Scoring"]
    
    D --> G["Transcript-Anchored Action Item Extraction"]
    E --> G
    F --> G

    G --> H{"Autonomous Department Classifier"}
    
    H -->|"Clinical Complaint / Follow-Up"| I["Doctor Station Queue"]
    H -->|"Appointment Booking Request"| J["Reception & Intake Gateway"]
    H -->|"Prior-Authorization Inquiry"| K["Insurance & Prior-Auth Desk"]
    H -->|"SLA Violation / Overdue Case"| L["Department Manager Escalation"]

    I --> M["Clinician Review & Action Execution"]
    J --> N["Slot Confirmation in MongoDB"]
    K --> O["EDI Carrier Submission"]
    L --> P["Supervisor Intervention & Rebalancing"]

    M --> Q["Task Verified & Completed"]
    N --> Q
    O --> Q
    P --> Q
```

---

## 3. Authentication Flow

CareOps AI uses stateless, cryptographically signed JSON Web Tokens (JWT) verified against bcrypt-hashed passwords in MongoDB.

```mermaid
sequenceDiagram
    autonumber
    actor User as User (Staff / Patient)
    participant UI as Next.js Login Screen
    participant ClientAuth as authService / sessionStore
    participant API as /api/v1/auth/login
    participant Controller as AuthController
    participant Service as AuthService
    participant DB as MongoDB (User Model)

    User->>UI: Enters Email and Password
    UI->>ClientAuth: login(email, password)
    ClientAuth->>API: POST /api/v1/auth/login { email, password }
    API->>Controller: login(req, res)
    Controller->>Service: authenticateUser(email, password)
    Service->>DB: User.findOne({ email }).select('+password')
    DB-->>Service: Returns User document (with password hash)
    
    alt User Not Found
        Service-->>Controller: Throws 401 Invalid Credentials
        Controller-->>API: 401 Unauthorized
        API-->>UI: Displays "Invalid email or password"
    else User Exists
        Service->>Service: bcrypt.compare(password, user.password)
        alt Password Mismatch
            Service-->>Controller: Throws 401 Invalid Credentials
            Controller-->>API: 401 Unauthorized
            API-->>UI: Displays "Invalid email or password"
        else Password Valid
            Service->>Service: signJwtToken({ id, role, email })
            Service->>DB: User.updateOne({ lastActive: Date.now() })
            Service-->>Controller: Returns { user, token }
            Controller-->>API: HTTP 200 { success: true, user, token }
            API-->>ClientAuth: Stores token in sessionStore & Cookies
            ClientAuth-->>UI: Updates AuthContext & Hydrates User State
            UI->>UI: Redirects to designated Role Dashboard
        end
    end
```

---

## 4. Role-Based Access Control (RBAC) Flow

Every request is intercepted by the server-side RBAC middleware stack (`verifyToken` and `requireRole`). Unauthorized attempts receive immediate `403 Forbidden` errors.

```mermaid
flowchart TD
    Req["Incoming HTTP Request"] --> TokenCheck{"verifyToken: Valid JWT?"}
    
    TokenCheck -->|"No / Expired"| Err401["401 Unauthorized: Invalid Token"]
    TokenCheck -->|"Yes: Valid User Identity"| RoleCheck{"requireRole: Matches Role?"}

    RoleCheck -->|"Insufficient Role"| Err403["403 Forbidden: Access Denied"]
    
    RoleCheck -->|"Authorized"| RouteDispatch{"Target Endpoint Module"}

    RouteDispatch -->|"Patient Role"| ModPatient["Patient Portal: /api/v1/patients/me, /api/v1/appointments"]
    RouteDispatch -->|"Doctor Role"| ModDoctor["Doctor Station: /api/v1/doctors/me, assigned patient rosters"]
    RouteDispatch -->|"Receptionist Role"| ModReception["Intake Desk: Universal patient directory, master scheduling"]
    RouteDispatch -->|"Insurance Role"| ModInsurance["Claims Desk: Prior-authorization data, carrier status"]
    RouteDispatch -->|"Manager Role"| ModManager["Manager Command: Division staff overview, SLA metrics"]
    RouteDispatch -->|"Admin Role"| ModAdmin["Master Console: Global user CRUD, status toggle, audit logs"]
```

---

## 5. Database Relationship Model (ERD)

The core MongoDB schema is designed around the central `User` identity model, with 1:1 linked role profiles (`Doctor`, `Patient`) and relational references across `Appointment` documents.

```mermaid
erDiagram
    USER ||--o| DOCTOR : "provisions 1:1"
    USER ||--o| PATIENT : "provisions 1:1"
    USER ||--o{ APPOINTMENT : "attends as patient/doctor"
    DOCTOR ||--o{ PATIENT : "assigned to roster"
    DOCTOR ||--o{ APPOINTMENT : "conducts consultation"
    PATIENT ||--o{ APPOINTMENT : "books appointment"

    USER {
        ObjectId _id PK
        string name
        string email UK
        string password "bcrypt hash"
        string role "ADMIN | DOCTOR | PATIENT | RECEPTIONIST | INSURANCE | MANAGER"
        string department
        string phone
        string status "ACTIVE | SUSPENDED | INACTIVE"
        date lastActive
        date createdAt
    }

    DOCTOR {
        ObjectId _id PK
        ObjectId userId FK "1:1 Ref to User"
        string name
        string email
        string specialization
        string department
        string status "ACTIVE | ON_LEAVE"
        array availability "Day, startTime, endTime slots"
        array assignedPatients "Refs to Patient"
        date createdAt
    }

    PATIENT {
        ObjectId _id PK
        ObjectId userId FK "1:1 Ref to User"
        string mrn UK "Medical Record Number"
        string name
        string email
        string phone
        date dateOfBirth
        string gender
        string insuranceProvider
        string insuranceStatus
        ObjectId assignedDoctor FK "Ref to Doctor"
        string medicalSummary
        date createdAt
    }

    APPOINTMENT {
        ObjectId _id PK
        ObjectId patientId FK "Ref to Patient"
        ObjectId patientUserId FK "Ref to User"
        string patientName
        string patientEmail
        string mrn
        ObjectId doctorId FK "Ref to Doctor"
        string doctorName
        string doctorSpecialty
        string date "e.g. 18 October"
        string time "e.g. 11:00 AM"
        string location "Pavilion / Suite"
        string type "In-Person Consultation | Telehealth"
        string status "confirmed | pending | rescheduled | completed | cancelled"
        string instructions
        date createdAt
    }
```

---

## 6. Feature Architecture

Visual taxonomy of CareOps AI modules and their respective sub-components:

```mermaid
graph TD
    Root["CareOps AI Platform"]

    Root --> ModAuth["1. Authentication & RBAC Engine"]
    ModAuth --> AuthJWT["JWT Token Generator & Verifier"]
    ModAuth --> AuthBcrypt["Bcrypt Password Hasher"]
    ModAuth --> AuthSession["Next.js SessionStore & Cookies"]
    ModAuth --> AuthGuard["Client RoleGuard & Server Middleware"]

    Root --> ModUser["2. User Management Module"]
    ModUser --> UserCRUD["Staff Onboarding & Directory"]
    ModUser --> UserDept["Departmental Scoping"]
    ModUser --> UserProv["Auto-Provisioning of Doctor/Patient Profiles"]
    ModUser --> UserStatus["Status Lifecycle (Active/Suspended/Inactive)"]

    Root --> ModPatient["3. Patient Management Module"]
    ModPatient --> PatMRN["Deterministic MRN Generator"]
    ModPatient --> PatDirectory["Universal Patient Directory (Staff View)"]
    ModPatient --> PatSelf["Self-Service Personal Health Record"]
    ModPatient --> PatAssigned["Primary Care Physician Assignment"]

    Root --> ModDoctor["4. Doctor Management Module"]
    ModDoctor --> DocRoster["Clinician Directory & Specializations"]
    ModDoctor --> DocSchedule["Weekly Availability Scheduler"]
    ModDoctor --> DocQueue["Assigned Patient Roster & Notes"]

    Root --> ModAppointment["5. Live Appointments Engine"]
    ModAppointment --> AptBook["Real-Time Consultation Booking Modal"]
    ModAppointment --> AptSync["Multi-Role Synchronization (Doctor & Reception)"]
    ModAppointment --> AptLifecycle["Reschedule & Cancellation Handlers"]

    Root --> ModWorkflow["6. Telephony Workflow Engine"]
    ModWorkflow --> WfCalls["Call Event Ingestion (/api/v1/calls)"]
    ModWorkflow --> WfRouting["Intent-to-Department Routing Rules"]
    ModWorkflow --> WfSLA["SLA Countdown Timers & Breach Detection"]
    ModWorkflow --> WfKanban["4-Column Operational Kanban Board"]

    Root --> ModAnalytics["7. Operational Intelligence Suite"]
    ModAnalytics --> AnVolume["Call Volume vs Action Velocity"]
    ModAnalytics --> AnIntent["Multi-Label Intent Distribution"]
    ModAnalytics --> AnWorkload["Departmental Staff Load Capacity"]
```

---

## 7. Frontend-Backend Communication Flow

Every interaction follows a clean multi-tier structure to separate UI concerns from HTTP transport and database queries:

```mermaid
flowchart LR
    subgraph UI_Layer ["React UI Layer"]
        Comp["React Component (AppointmentManager)"]
    end

    subgraph Client_Service ["Client Service Layer"]
        Service["apiAppointmentService.ts"]
        TokenHelper["sessionStore.getClientToken()"]
    end

    subgraph API_Route ["HTTP Transport & Routing"]
        Route["Express Route (/api/v1/appointments)"]
        VerifyMW["verifyToken & requireRole Middleware"]
    end

    subgraph Backend_Controller ["Controller & Logic Layer"]
        Ctrl["appointment.controller.js"]
        Svc["appointment.service.js"]
    end

    subgraph Database_Layer ["Database Layer"]
        Model["Appointment.js (Mongoose Model)"]
        MongoDB[("MongoDB (careops db)")]
    end

    Comp -->|"Calls requestAppointment()"| Service
    Service -.->|"Reads Bearer Token"| TokenHelper
    Service -->|"fetch() HTTP POST"| Route
    Route --> VerifyMW
    VerifyMW --> Ctrl
    Ctrl --> Svc
    Svc --> Model
    Model --> MongoDB
    MongoDB -->> Model
    Model -->> Svc
    Svc -->> Ctrl
    Ctrl -->> Route
    Route -->>|"HTTP 201 JSON"| Service
    Service -->>|"Returns Typed DTO"| Comp
```

---

## 8. Deployment Architecture

This diagram illustrates the production-ready infrastructure deployment model:

```mermaid
graph TD
    subgraph Client_Boundary ["Client Devices"]
        Mobile["Mobile Web (iOS/Android)"]
        Desktop["Hospital Workstations (Chrome/Firefox)"]
    end

    subgraph Edge_Network ["Edge & CDN Layer (Vercel / Cloudflare)"]
        CDN["Global Edge CDN & SSL Termination"]
        NextServer["Next.js SSR & Server Components"]
        CDN --> NextServer
    end

    subgraph Application_Cluster ["Application Cluster (Container / VM)"]
        Nginx["Reverse Proxy (Nginx / Cloud Load Balancer)"]
        NodeBackend["Node.js Express API Instances (Cluster Mode)"]
        WorkflowNode["Prisma Workflow Engine Instance"]
        Nginx --> NodeBackend
        Nginx --> WorkflowNode
    end

    subgraph Database_Cluster ["Managed Persistence Tier"]
        MongoPrimary[("MongoDB Atlas Primary Node")]
        MongoSecondary[("MongoDB Atlas Secondary Replica")]
        PostgresDB[("PostgreSQL Database (Prisma/Supabase)")]
        MongoPrimary -.->|"Async Replication"| MongoSecondary
    end

    Mobile --> CDN
    Desktop --> CDN
    NextServer -->|"Internal Private VPC"| Nginx
    NodeBackend -->|"Mongoose Connection Pool"| MongoPrimary
    WorkflowNode -->|"Prisma Pooler Connection"| PostgresDB
```

---

## 9. Complete End-to-End Request Lifecycle

### Walkthrough: Patient Books Consultation Slot

```mermaid
sequenceDiagram
    autonumber
    actor Patient as Logged-In Patient (Rahul Sharma)
    participant UI as AppointmentManager.tsx
    participant DocClient as apiDoctorService.ts
    participant AptClient as apiAppointmentService.ts
    participant Express as Express Gateway
    participant AptCtrl as AppointmentController
    participant AptSvc as AppointmentService
    participant Mongo as MongoDB
    actor Doctor as Doctor (Dr. Sameer)
    participant DocUI as DoctorQueueTable.tsx

    Note over Patient, UI: Step 1: Browse Available Physicians
    Patient->>UI: Opens Consultation Booking Modal
    UI->>DocClient: getDoctors()
    DocClient->>Express: GET /api/v1/doctors (Bearer JWT)
    Express->>Mongo: Doctor.find({ status: "ACTIVE" })
    Mongo-->>Express: Returns Doctors: [Sameer, Ayyan, Elena, Rahul]
    Express-->>UI: Populates dropdown with real database doctors

    Note over Patient, UI: Step 2: Book Appointment
    Patient->>UI: Selects "Sameer", Date: "18 October", Time: "11:00 AM"
    Patient->>UI: Clicks "Submit Consultation Request"
    UI->>AptClient: createAppointment(payload)
    AptClient->>Express: POST /api/v1/appointments (Bearer JWT)
    Express->>AptCtrl: createAppointment(req, res)
    AptCtrl->>AptSvc: createAppointment({ patientId, doctorId, date, time... })
    AptSvc->>Mongo: Appointment.create({...})
    Mongo-->>AptSvc: Returns persisted document (_id: 6ace38d2...)
    AptSvc-->>AptCtrl: Appointment DTO
    AptCtrl-->>Express: HTTP 201 Created
    Express-->>AptClient: JSON Response
    AptClient-->>UI: Updates patient appointments state
    UI-->>Patient: Displays confirmed booking banner

    Note over Doctor, DocUI: Step 3: Clinician Queue Receives Update
    Doctor->>DocUI: Opens /doctor/dashboard
    DocUI->>Express: GET /api/v1/appointments (Doctor Bearer JWT)
    Express->>Mongo: Appointment.find({ doctorId: Doctor.id })
    Mongo-->>Express: Returns Rahul Sharma appointment
    Express-->>DocUI: Renders Rahul Sharma in Live Clinical Queue
```

---

## 10. Module Ownership & Implementation Status

| Module | Architectural Purpose | Database / Tech | Current Status |
|---|---|---|---|
| **Authentication & RBAC** | Secure identity verification, password hashing, and role route guards | Express, JWT, bcryptjs, MongoDB | **Completed (100% Verified)** |
| **User Management** | Administrative staff CRUD, role assignment, and lifecycle toggling | Express, MongoDB `User` model | **Completed (100% Verified)** |
| **Patient Management** | Patient record creation, MRN assignment, and EHR self-service | Express, MongoDB `Patient` model | **Completed (100% Verified)** |
| **Doctor Management** | Physician directory, specialization search, and roster assignments | Express, MongoDB `Doctor` model | **Completed (100% Verified)** |
| **Appointments Engine** | Consultation slot booking, scheduling, and multi-portal sync | Express, MongoDB `Appointment` model | **Completed (100% Verified)** |
| **Workflow Engine** | Relational telephony call event logs, intent routing rules, and SLA tracking | Express, Prisma ORM, PostgreSQL | **Implemented & Tested** |
| **AI Telephony Intelligence** | Audio waveform analysis, diarization scrubbing, and speech NLU | Python FastAPI, Whisper-v3 | **Planned (Q1 2027 Roadmap)** |
| **EHR Interoperability** | Bidirectional sync with hospital EHR systems via HL7 FHIR | SMART on FHIR, HL7 v2 bridges | **Planned (Q2 2027 Roadmap)** |
