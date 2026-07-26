# StackPilot AI — System Architecture & Data Schema Diagram

## 🏗️ Architectural Topology

```
+-------------------------------------------------------------------+
|                        Client Browser / Frontend                  |
|                        React 19 + Vite + Tailwind                 |
+-------------------------------------------------------------------+
                                  |
                                  | HTTP / REST (JWT Auth)
                                  v
+-------------------------------------------------------------------+
|                      Nginx Reverse Proxy (Port 80/443)            |
+-------------------------------------------------------------------+
                                  |
                                  v
+-------------------------------------------------------------------+
|                   Express API Server (Node.js 20)                 |
|                                                                   |
|   +-------------------+  +-------------------+  +---------------+ |
|   | Helmet Security   |  | Rate Limiter      |  | Input Sanitize| |
|   +-------------------+  +-------------------+  +---------------+ |
|                                                                   |
|   +-------------------+  +-------------------+  +---------------+ |
|   | Auth / User CRUD  |  | CRM & Deals       |  | Project & Task| |
|   +-------------------+  +-------------------+  +---------------+ |
|   | Finance & Quotes  |  | SEO & AI Studio   |  | DMS & Calendar| |
|   +-------------------+  +-------------------+  +---------------+ |
+-------------------------------------------------------------------+
                                  |
                                  v
+-------------------------------------------------------------------+
|                    MongoDB Database (Mongoose ODM)                |
|  - Users          - Roles          - Permissions - AuditLogs      |
|  - Companies      - Clients        - Contacts    - Leads          |
|  - Deals          - Projects       - Tasks       - Sprints        |
|  - Invoices       - Expenses       - Quotations  - Folders        |
|  - Documents      - Keywords       - Tenancy     - Rules          |
+-------------------------------------------------------------------+
```

## 📊 Database ER Schema Relationships

1. **User ↔ Role & Permissions**: Users link to predefined roles (`Super Admin`, `Admin`, `Developer`) and optional `customPermissions`.
2. **CRM Pipeline**:
   - `Company` 1:N `Client`
   - `Client` 1:N `Contact`
   - `Lead` → converted to → `Deal`
3. **Projects & Tasks**:
   - `Project` 1:N `Task` (Jira-style: Epic, Story, Bug, Task)
   - `Task` 1:N `Subtask` & `Comment` (with user `@mentions`)
4. **Finance**:
   - `Client` 1:N `Invoice` & `Expense` & `Quotation`
5. **DMS**:
   - `Folder` 1:N `Document` with `version` and `approvalStatus` (`Pending`, `Approved`, `Rejected`).
