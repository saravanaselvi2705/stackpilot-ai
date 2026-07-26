# StackPilot AI — Enterprise Project & Business Management Platform

> **Release Candidate v1.0.0** — Production-Ready Enterprise SaaS Platform

StackPilot AI is an all-in-one Enterprise Project & Business Management platform built with Node.js, Express, TypeScript, MongoDB, React, Tailwind CSS, and Vite. It combines CRM, Jira-style Task Management, Document Management (DMS), Finance, SEO Workspaces, AI Studio, Team Capacity tracking, Automation rules, and Multi-Tenant SaaS Subscriptions.

---

## 🌟 Feature Modules Summary

- **Authentication & RBAC**: JWT-based invite-only authentication, granular permissions matrix (`users.create`, `projects.create`, `finance.manage`, etc.), activity audit logging.
- **CRM**: Companies, Clients, Contacts, Leads, Deals Pipeline with Kanban stage transitions, CSV Import/Export, and CRM Dashboard KPIs.
- **Project Management**: Enterprise Projects, Health indicators (`Healthy`, `At Risk`, `Delayed`), Budget vs Expenses, Milestones manager, Team role assignments, Document repository.
- **Task Management**: Jira-style Kanban Board, Backlog, Epics, Stories, Bugs, Tasks, Subtasks, Comments with `@mentions`, Attachments, Time tracking logs, Story points.
- **Finance Management**: Invoices, Quotations/Estimates, Expenses, Recurring Invoices, Profit & Loss Dashboard, Customer Statements.
- **Document Management (DMS)**: Folder hierarchy, version control, approval workflows (`Pending`, `Approved`, `Rejected`), client sharing access.
- **SEO Workspace**: Keyword rank tracker, competitor visibility benchmarks, technical SEO audit checklist, PDF report exporter.
- **AI Studio**: AI Chat Assistant, Prompt Library, SRS Generator, Meeting Minutes Summarizer, Code Review Assistant.
- **Unified Calendar**: Aggregates Tasks, Meetings, and Milestones with Google & Outlook sync indicators.
- **Automation Engine**: Workflow rules supporting event triggers (`task_due`, `invoice_overdue`) and automated actions (`send_email`, `create_task`).
- **Commercial SaaS & Multi-Tenancy**: Organization bounds (`tenantId`), Subscription plans (`Free Trial`, `Pro`, `Enterprise`), usage limits enforcement, Stripe/Razorpay models.
- **Production Containerization**: Dockerfile, `docker-compose.yml`, Nginx reverse proxy config, `/api/health` monitoring endpoint.

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- **Node.js**: `v20.x` or later
- **MongoDB**: Local instance running at `mongodb://127.0.0.1:27017` or MongoDB Atlas URI.

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/saravanaselvi2705/stackpilot-ai.git
cd stackpilot-ai

# Install dependencies across all monorepo packages
npm install
```

### 3. Environment Configuration
Copy `.env.example` to `apps/api/.env`:
```bash
cp .env.example apps/api/.env
```

### 4. Running Dev Server
```bash
# Start backend API and database auto-seeding
npm run dev
```
Default Super Admin credentials seeded on initial launch:
- **Email**: `admin@stackpilot.ai`
- **Password**: `password123`

### 5. Production Build
```bash
npm run build
```

---

## 📚 Complete Enterprise Documentation Suite

Detailed manuals are available in the [`docs/`](./docs) directory:
- 📖 [Installation Guide](./docs/INSTALLATION.md)
- ⚙️ [Deployment Guide](./docs/DEPLOYMENT.md)
- 🏗️ [Architecture & ER Diagram](./docs/ARCHITECTURE.md)
- 📝 [User & Admin Manual](./docs/USER_MANUAL.md)
- 📡 [OpenAPI / Swagger Spec](./docs/openapi.yaml)

---

## 📄 License
Commercial Enterprise SaaS License — All Rights Reserved.
