# CareOps AI — Healthcare Workflow Engine Backend

Core operational backend responsible for telephony event ingestion, departmental workflow routing, SLA enforcement, and multi-tier task escalation.

---

## 1. Module Overview & Tech Stack

- **Runtime**: Node.js (v20+ / v22+)
- **Language**: TypeScript (v5.7+) with strict type checking
- **Database**: PostgreSQL
- **ORM / Query Engine**: Prisma ORM (v5.22+)
- **Execution / Tooling**: `tsx`, `typescript`

```
workflow-engine/
├── prisma/
│   ├── migrations/
│   │   ├── 20261013120000_init_workflow_engine/
│   │   │   └── migration.sql       # Initial PostgreSQL DDL migration
│   │   └── migration_lock.toml     # Provider lock (postgresql)
│   ├── schema.prisma               # Relational data schema & models
│   └── seed.ts                     # Database seed (departments, employees, baseline task)
├── src/
│   ├── config/
│   │   └── env.ts                  # Typed environment configuration
│   ├── db/
│   │   └── client.ts               # PrismaClient singleton instance
│   ├── types/
│   │   └── index.ts                # Domain types, DTOs & Prisma re-exports
│   └── index.ts                    # Module entry point & health check
├── .env.example                    # Environment template
├── package.json                    # Scripts & dependencies
└── tsconfig.json                   # Strict TS compiler configuration
```

---

## 2. Relational Database Architecture

### Data Models & Constraints

| Entity | Primary Key | Key Foreign Keys & Attributes | Indexes |
|---|---|---|---|
| **`Call`** | `id` (UUID) | `patient_name`, `patient_phone`, `patient_mrn` (optional), `transcript`, `summary`, `detected_intent`, `priority` (Enum), `sentiment` (Enum), `call_timestamp`, `created_at`, `updated_at` | Primary Key |
| **`Department`** | `id` (VarChar 50) | `name`, `manager_id` (FK -> `Employee.id`, SetNull on delete), timestamps | Primary Key |
| **`Employee`** | `id` (UUID) | `department_id` (FK -> `Department.id`), `full_name`, `email` (Unique), `role` (Enum), `is_active`, `active_tasks_count` (Default 0), timestamps | `department_id`, `email` (Unique) |
| **`Task`** | `id` (UUID) | `call_id` (FK -> `Call.id`, Cascade), `department_id` (FK -> `Department.id`), `assigned_employee_id` (FK -> `Employee.id`, SetNull), `title`, `description`, `status` (Enum), `priority` (Enum), `escalation_level` (Enum), timestamps & deadlines | `status`, `deadline_at`, `call_id`, `department_id`, `assigned_employee_id` |
| **`TaskNote`** | `id` (UUID) | `task_id` (FK -> `Task.id`, Cascade), `author_id` (FK -> `Employee.id`, SetNull), `note`, `created_at` | `task_id`, `author_id` |
| **`TaskTimeline`** | `id` (UUID) | `task_id` (FK -> `Task.id`, Cascade), `actor_id` (UUID optional), `event_type`, `message`, `metadata` (JSONB), `created_at` | `task_id`, `actor_id` |

### Enums
- **`Priority`**: `LOW`, `MEDIUM`, `HIGH`, `URGENT`
- **`Sentiment`**: `POSITIVE`, `NEUTRAL`, `NEGATIVE`, `CRITICAL`
- **`EmployeeRole`**: `STAFF`, `MANAGER`, `ADMINISTRATOR`
- **`TaskStatus`**: `PENDING`, `ASSIGNED`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`
- **`EscalationLevel`**: `NONE`, `MANAGER`, `ADMINISTRATOR`

---

## 3. Environment Setup

Create `.env` inside `workflow-engine/` by copying the template:

```bash
cp .env.example .env
```

Set the database connection string:
```ini
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/careops_db?schema=public"
PORT=4000
NODE_ENV=development
```

---

## 4. Setup, Migration & Seeding Commands

From within the `workflow-engine` directory:

### 1. Install Dependencies
```bash
npm install
```

### 2. Generate Prisma Client
```bash
npm run db:generate
# Or: npx prisma generate
```

### 3. Run Database Migrations
To apply pending migrations to your PostgreSQL database:
```bash
# In development (with interactive migration tracker):
npm run db:migrate
# Or: npx prisma migrate dev

# In CI/CD or production environments:
npm run db:migrate:deploy
# Or: npx prisma migrate deploy
```

### 4. Seed the Database
Executes `prisma/seed.ts` to populate baseline departments and departmental staff:
```bash
npm run db:seed
# Or: npx tsx prisma/seed.ts
```

### 5. Inspect Data via Prisma Studio (Optional)
```bash
npm run db:studio
```

---

## 5. Seeded Baseline Entities

Running the seed script provisions:
- **Baseline Departments**:
  - `reception` — Reception Team (Manager: Mark Hansen)
  - `insurance` — Insurance Department (Manager: Michael Chang)
  - `customer_support` — Customer Support (Manager: David Ross)
  - `clinical_triage` — Clinical Triage (Manager: Dr. Robert Chen)
- **Default Employees** across all 3 roles (`STAFF`, `MANAGER`, `ADMINISTRATOR`) in each department.
- **End-to-End Exemplar Record**: An inbound urgent call, clinical triage task, nurse clinical note, and 3 timeline audit events demonstrating full relational integrity.
