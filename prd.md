# Product Requirements Document (PRD) - StackPilot AI (v1.0.6)

## 1. Executive Summary
StackPilot AI is a high-performance, enterprise-grade project management, CRM, and operations hub designed to streamline client management, project execution, requirements engineering, AI document generation, quality assurance, financial billing, and system administration. 

The platform features an adaptive visual design supporting both a modern **High-Contrast White & Emerald Green theme** (`#22C55E`) and an enterprise **Dark Slate & Cyan theme** with glassmorphic cards, smooth animations, and WCAG AA accessible contrast.

The core value proposition of StackPilot AI is bridging non-technical client executives, project managers, QA engineers, developers, and financial coordinators in a single unified workspace with plain-language business terminology and automated AI acceleration.

---

## 2. User Roles & Personas

StackPilot AI operates on a role-based access control (RBAC) and permission model:

| Role | Business Persona | Core Focus in Platform |
| :--- | :--- | :--- |
| **Super Administrator** | Business Owners & System Operators | System audit logs, security settings, organization setup, API keys, role permissions. |
| **Project Manager** | Team Leads & Delivery Managers | Project pipeline, sprint planning, task boards, workload planner, approvals. |
| **Lead Developer / Engineer** | Technical Lead & Software Engineers | Enterprise task board, code review, AI Tools, technical docs, requirements. |
| **QA / Automation Engineer** | Test Lead & Quality Auditor | QA testing column, bug reporter, test case generation, audit trails. |
| **Finance Lead** | Billing & Financial Coordinator | Invoice generation, revenue reports, client billing, PDF export, contracts. |
| **Client Executive** | Customers & Project Sponsors | Project visibility, requirements sign-off, shared documents, contract reviews. |
| **Business Analyst / SEO** | Requirements & Growth Specialist | SRS/BRD creator, reports hub, SEO analytics, project specifications. |

---

## 3. Product Features & Requirements

### 3.1. Navigation, Sidebar & Universal Search
- **Sidebar Navigation:** Access to all core modules via a collapsible, high-contrast left sidebar navigation with role-based module filtering and micro-animations.
- **Universal Search:** Header search bar with 300ms debounced auto-complete searching across projects, tasks, clients, and technical documentation.
- **Role Switcher & Theme Toggle:** Quick role switcher in the header to simulate views, and light/dark theme toggle.

### 3.2. Executive Dashboard
- **Requirement:** Operational overview summarizing key business metrics, active tasks, client revenue pipelines, and recent activity logs.
- **Key Elements:**
  - Dynamic visual charts for revenue growth and project performance telemetry.
  - Key Performance Indicator (KPI) cards (Active Projects, Monthly Invoiced, Open Leads, Pending Tasks).
  - Role-customized summary panels for PM, Dev, Finance, and Client views.

### 3.3. My Work (Personal Workspace)
- **Requirement:** Personal focus dashboard for individual team members to manage assigned tasks, pending approvals, and personal daily agenda.
- **Features:** Assigned task checklist, due date notifications, personal productivity metrics, and rapid status updates.

### 3.4. CRM & Client Management
- **Requirement:** Sales pipeline to track lead intake, client communications, meetings, negotiations, and closed deals.
- **Stages:**
  - *Leads* (Intake & incoming requests)
  - *Meeting Scheduled* (Discovery calls & demos)
  - *Proposal Sent* (Commercial offers)
  - *Negotiation* (Contract terms & pricing)
  - *Won / Active Client* (Converted project accounts)
- **Features:** Drag-and-drop pipeline cards, client details drawer, agreement logs.

### 3.5. Projects & Sprint Management
- **Requirement:** Workspace project tracking with sprint planner, timeline/Gantt views, budget allocation, and sprint velocity metrics.
- **Features:**
  - Project creation modal with budget, deadline, and assigned team leads.
  - Sprint lifecycle manager (Sprint Planning, Active Sprint, Sprint Retrospective).
  - Health indicators (On Track, At Risk, Delayed).

### 3.6. Enterprise Task Management (v1.0.6 Edition)
- **Requirement:** 7-column enterprise Kanban board and list view designed for modern cross-functional teams.
- **7 Operational Columns:**
  1. *Backlog* (Unscheduled requests)
  2. *Planning* (Sprint allocation & specification)
  3. *In Progress* (Active execution)
  4. *Code Review* (Peer code verification)
  5. *QA Testing* (Quality Assurance & test execution)
  6. *Blocked* (Impediments requiring resolution)
  7. *Completed* (Verified & delivered)
- **Toolbar & Filtering:** Integrated search input, Assignee filter dropdown, Priority filter (Low, Medium, High, Urgent), and Sprint selection filter.
- **Task Details Drawer:** Slide-over modal containing markdown description, checklist subtasks, time logs, priority badge, tags, and comment history.

### 3.7. Requirements Engineering & SRS Generator
- **Requirement:** AI-assisted spec builder converting unstructured client briefs into structured SRS, BRD, and User Stories.
- **Tabs:**
  - *AI Creator* (Generates specifications from prompts)
  - *Specifications List* (View and edit active requirements)
  - *Saved Archives* (Versioned specification library)

### 3.8. AI Studio & Automation Tools
- **Requirement:** Built-in AI assistants to generate software engineering and project management deliverables.
- **Capabilities:**
  - *Test Case Generator* (User Acceptance Testing & unit test matrices)
  - *Bug Reporter* (Formatted issue reports with steps to reproduce)
  - *Code Scaffold Generator* (Architecture boilerplates and interface models)

### 3.9. Documents & Knowledge Base
- **Requirement:** Centralized file repository for system documentation, meeting minutes, and technical guides.
- **Features:** Rich text & markdown editor, document category tags, PDF/DOCX exporter.

### 3.10. Timesheets & Time Tracking
- **Requirement:** Employee time-logging module to record task hours and track billable work.
- **Validation & Safety:** Strict front-end and back-end validation preventing negative hour inputs or invalid entry formats.
- **Features:** Weekly view, project-wise breakdown, submit for manager approval.

### 3.11. Approvals & Workflows
- **Requirement:** Multi-stage sign-off system for client proposals, scope changes, invoice approvals, and leave requests.
- **Features:** Actionable review list, sign-off history, automated notification triggers.

### 3.12. Audit Logs & System Telemetry
- **Requirement:** Compliance audit trail tracking critical system activities, user authentication, role changes, and file edits.
- **Fields:** Timestamp, Actor, Action Type, Target Module, IP Address, Status.

### 3.13. Reports & Analytics Hub
- **Requirement:** Centralized analytics dashboard covering project performance, team efficiency, financial health, and web technical checklists.

### 3.14. Contracts & Compliance
- **Requirement:** Contract repository to manage client agreements, NDAs, SLAs, renewal dates, and digital status badges.

### 3.15. System Health & Organization
- **Requirement:** Real-time infrastructure monitoring displaying server uptime, database connectivity status, memory utilization, and organization tenant settings.

### 3.16. Team & Workload Planner
- **Requirement:** Resource capacity tracking, team availability log, and leave request management matrix.

### 3.17. Billing & Finance Hub
- **Requirement:** Invoice generator supporting itemized billing, 18% standard tax calculation, payment status tracking, and printable PDF client invoice generator.

### 3.18. Operations Calendar
- **Requirement:** Interactive calendar view displaying sprint dates, delivery deadlines, client meetings, and scheduled maintenance windows.

### 3.19. Settings & Administration
- **Requirement:** Configuration panels for User Profile, SMTP Email setup, API Key management, security policy, and Role-Based Access Control matrix.

---

## 4. Technical & Non-Functional Requirements

### 4.1. Visual Design & Theme System
- **Themes Supported:** White & Light Green (`#22C55E`) and Enterprise Dark Slate.
- **Typography:** Google Fonts Inter & Outfit.
- **Components:** Modular React UI library with Tailwind CSS v4, smooth Framer Motion micro-animations, and glassmorphism cards.

### 4.2. Security & Compliance
- **CORS Protection:** Express backend configured with strict origin allowlist (`ORIGIN_ALLOWLIST`) and dynamic fallback handling.
- **Input Sanitation & Rate Limiting:** Security middleware using `express-rate-limit`, `helmet`, and request payload sanitation.
- **Authentication:** JWT token-based auth with secure password hashing via `bcryptjs`.

### 4.3. Bimodal Architecture & Data Persistence
- **Primary Backend:** Node.js + Express + Mongoose (MongoDB Atlas / local Mongo server).
- **Offline / Local Fallback:** Seamless API client layer with automatic fallback to localStorage / mock database provider when offline, guaranteeing uninterrupted UI demonstration.

---

## 5. Revision & Deployment Summary
- **Current Version:** v1.0.6 Enterprise Edition
- **Status:** Production-Ready & QA Audited
- **Repositories:** `saravanaselvi2705/stackpilot-ai`
