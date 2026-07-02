# Product Requirements Document (PRD) - StackPilot AI

## 1. Executive Summary
StackPilot AI is a high-performance, enterprise-grade project management and operations hub designed to streamline client management, project execution, requirements engineering, and administrative workflows. 

Initially built on a dark theme ("Deep Slate & Cyan"), the platform has undergone a complete UX/UI transformation migrating to a professional, high-contrast, high-accessibility **"White & Light Green" theme** powered by green brand accents (`#22C55E`), clean cards, premium borders, and glassmorphism.

The core value proposition of StackPilot AI is the elimination of developer-centric technical jargon in favor of clear, business-focused terminology, allowing non-technical client executives, project managers, financial coordinators, and administrators to seamlessly navigate operations.

---

## 2. User Roles & Personas
StackPilot AI operates on a role-based navigation and permission model. The primary roles are:

| Role | Business Persona | Core Focus in Platform |
| :--- | :--- | :--- |
| **Administrator** | Business Owners & System Operators | Overall workflow audit, member permissions, SMTP configuration, API keys. |
| **Project Manager** | Team Leads & Delivery Managers | Project pipeline, task boards, requirements, scheduling operations. |
| **Lead Developer** | Technical Lead / Engineer | Tasks board, AI Tools, Technical documentation, requirements review. |
| **Finance Lead** | Billing & Financial Coordinator | Invoice generation, Stripe configurations, client billing, PDF audits. |
| **Client Executive** | Customers & Project Sponsors | Project visibility, requirements verification, shared documents. |

---

## 3. Product Features & Requirements

### 3.1. Navigation & Sidebar
- **Requirement:** Access to all core modules via a collapsible, high-contrast left sidebar navigation.
- **Labels:** 
  - *Dashboard* (Overview page)
  - *Clients* (Client management & pipeline)
  - *Projects* (Workspace projects list)
  - *Tasks* (Kanban Board/List)
  - *Requirements* (AI specification hub)
  - *AI Tools* (Prompt assistants)
  - *Documents* (Docs hub)
  - *Reports* (Performance analytics)
  - *Team* (Workload Planner & Leaves)
  - *Billing* (Invoice & Finance hub)
  - *Calendar* (Operations schedule)
  - *Settings* (Global configuration)
- **Aesthetics:** Collapsible toggle with micro-animations, glassmorphism sidebar border, green accent (`#22C55E`) indicator highlights on active links.

### 3.2. Core Dashboard
- **Requirement:** A high-level operational overview summarizing revenue status, client pipeline statistics, project milestones, and upcoming tasks.
- **Key Elements:**
  - Dynamic visual charts representing revenue growth (rendered in primary green brand theme instead of legacy cyan).
  - Business metric counters (Active Projects, Monthly Invoiced, Open Leads, Active Tasks).
  - Role switcher at the top right to simulate different dashboard views for Administrator, Project Manager, Lead Developer, Finance Lead, and Client Executive.

### 3.3. Clients (CRM)
- **Requirement:** A simplified CRM sales pipeline to manage client intake, active negotiations, and finalized agreements.
- **Terminology:** Replaced technical sales terminology with clear, everyday English:
  - *Qualified Leads* -> *Leads*
  - *Demo Scheduled* -> *Meeting Scheduled*
  - *Proposal Sent* -> *Proposal Sent*
  - *Contract Negotiation* -> *Negotiation*
  - *Closed Won* -> *Won*
- **Interaction:** Visual drag-and-drop or status updates using primary green buttons (`#22C55E`) and white secondary buttons.

### 3.4. Projects & Tasks
- **Requirement:** Structured lists and Kanban boards to assign, track, and modify progress.
- **Project Terminology:** Replaced technical developer jargon (e.g., *Provisioning*, *Deploying*) with business actions (e.g., *Start Project*, *Launch*).
- **Task Terminology:** Boards grouped by operational status:
  - *Backlog* -> *Planning*
  - *In Progress* -> *In Progress*
  - *Code Review* -> *Review*
  - *Done* -> *Completed*
- **Aesthetics:** Status indicators, task priorities (Low, Medium, High), and capacity progress bars updated to use green theme variables.

### 3.5. Requirements Engineering
- **Requirement:** A structured tool to translate raw business requests into clean specification templates using AI assistants.
- **Tabs:**
  - *AI Creator* (Generates templates)
  - *Specifications* (Displays specifications list)
  - *Saved Documents* (Archive of drafts)
- **Aesthetics:** High-contrast tabs featuring a green bottom border (`#22C55E`) and dark slate text (`#111827`) when active.

### 3.6. AI Tools
- **Requirement:** Specialized workspace scripts to assist in generating project deliverables.
- **Templates:**
  - *Test Case Writer* (User Acceptance Testing / QA)
  - *Bug Reporter* (Issue logs and tickets)
  - *Code Template Generator* (Basic layout templates)
- **Branding:** Replaced all legacy cyan accent panels with light green cards (`#22C55E/10` background) and solid green buttons.

### 3.7. Documents Hub
- **Requirement:** Centralized file repository to manage internal project briefs and system documentation.
- **Features:** Rich text preview, format badge indicator, export buttons (PDF, DOCX) styled with green accents.

### 3.8. Reports
- **Requirement:** Analytics table and checklist checking checklist points (Keywords, Page speed, Mobile responsiveness) with green chart data visualization.

### 3.9. Team Workload & Time-Off
- **Requirement:** Visual roster displaying current team capacities, assigned tasks, and a time-off scheduler.
- **Features:** 
  - Capacity indicator progress bars mapping normal workloads to green (`#22C55E`) and overloaded states to red.
  - Leaves/availability log table with "Approve" actions.
  - Request Time-Off form targeting specific team members.

### 3.10. Billing (Finance)
- **Requirement:** Invoice builder supporting dynamic item rows, subtotal arithmetic, standard 18% tax calculation, and PDF preview generator.
- **PDF Preview:** Simulator showing a clean printable billing summary sheet ready to export or print.

### 3.11. Operations Calendar
- **Requirement:** Interactive calendar grid highlighting scheduled deadlines, meetings, and client follow-ups.
- **Categories:** Project Reviews, Client Check-ins, and Engineering.

### 3.12. Settings
- **Requirement:** Tabbed system settings:
  - *Profile* (User display settings)
  - *Email Settings* (SMTP credentials)
  - *API Keys* (External keys)
  - *Permissions* (Role-based access matrix)

---

## 4. Non-Functional & Design Requirements

### 4.1. Visual Branding System
- **Theme:** High-contrast White & Light Green.
- **Primary Color:** `#22C55E` (Solid Green).
- **Secondary Color:** `#ECFDF5` (Mint Green background offsets).
- **Dark Text:** `#111827` (Deep Gray/Black for high readability).
- **Cards & Containers:** White (`#FFFFFF`) or off-white (`#F9FAFB`) with borders in `#E5E7EB`.
- **Button Standards:**
  - *Primary Button:* Solid `#22C55E` background, White text.
  - *Secondary Button:* White background, Dark text (`#111827`), `#22C55E` border.

### 4.2. Accessibility
- All text-to-background combinations must meet WCAG AA contrast standards.
- Active tab text must utilize dark slate colors (`#111827` or `--color-slate-50`) when displayed on light backgrounds to prevent unreadable white-on-white text styles.

### 4.3. Technical Architecture
- **Frontend Stack:** Vite + React + TypeScript + Tailwind CSS (v4 configuration).
- **Type Safety:** Compilation checked via `tsc -b`.
- **Styling:** Custom CSS theme variable overrides mapped to Tailwind tokens in `index.css`.
