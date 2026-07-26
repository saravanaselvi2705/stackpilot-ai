# StackPilot AI — User & Administrator Manual

Welcome to the **StackPilot AI User & Administrator Manual**. This guide covers core feature workflows and administration functions.

---

## 1. Authentication & System Administration

### 1.1 First-Time Login
1. Navigate to `http://localhost:5173/login`.
2. Login using Super Admin credentials:
   - **Email**: `admin@stackpilot.ai`
   - **Password**: `password123`
3. Access **Settings → User Management** to invite team members and assign granular RBAC roles.

---

## 2. CRM Module Workflow

### 2.1 Lead-to-Deal Conversion
1. **Companies & Clients**: Add client profiles under **CRM → Clients**.
2. **Leads Management**: Track incoming inquiries in the Leads table.
3. **Deals Pipeline**: Move deals through Kanban stages: `New` ➔ `Qualified` ➔ `Proposal` ➔ `Negotiation` ➔ `Won`.
4. **CSV Export**: Click **Export Leads CSV** to download client pipelines.

---

## 3. Jira-Style Task Management

### 3.1 Managing Tasks & Subtasks
1. Open **Task Management**.
2. View tasks in **Kanban Board** or **Backlog View**.
3. Create tasks, set **Story Points**, log time (`loggedTime`), and add subtask checklists.
4. Use `@name` mentions in task comment threads to automatically trigger real-time user notifications.

---

## 4. Finance & Invoicing

### 4.1 Creating & Sending Invoices
1. Navigate to **Finance → Invoices**.
2. Click **New Invoice**, select client, add line items, tax percentage, and discount.
3. Toggle status to `Sent` or `Paid` to update the real-time **Profit & Loss Dashboard**.

---

## 5. AI Studio & Document Management (DMS)

### 5.1 Document Approval & AI Generation
1. In **Documentation**, create folders and upload project documents. Toggle approval status between `Pending`, `Approved`, and `Rejected`.
2. In **AI Studio**, select **SRS Generator** or **Meeting Minutes Generator** to convert prompts or meeting notes into professional markdown documentation.
