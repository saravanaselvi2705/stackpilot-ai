"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiGenerateBugReport = exports.aiGenerateTestCases = exports.aiGenerateRequirements = exports.getSEOReport = exports.createInvoice = exports.getInvoices = void 0;
__exportStar(require("./authController"), exports);
__exportStar(require("./userController"), exports);
__exportStar(require("./roleController"), exports);
__exportStar(require("./profileController"), exports);
__exportStar(require("./auditController"), exports);
__exportStar(require("./crmController"), exports);
__exportStar(require("./projectController"), exports);
__exportStar(require("./taskController"), exports);
__exportStar(require("./teamController"), exports);
__exportStar(require("./notificationController"), exports);
__exportStar(require("./dashboardController"), exports);
const db = __importStar(require("../models"));
// FINANCE CONTROLLERS
const getInvoices = async (req, res) => {
    try {
        const invoices = await db.Invoice.find();
        res.status(200).json(invoices);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getInvoices = getInvoices;
const createInvoice = async (req, res) => {
    try {
        const { clientId, clientName, clientEmail, projectId, projectName, dueDate, items, taxRate, discount } = req.body;
        const subtotal = items.reduce((acc, item) => acc + (item.rate * item.quantity), 0);
        const taxAmount = subtotal * ((taxRate || 0) / 100);
        const total = subtotal + taxAmount - (discount || 0);
        const invoiceNumber = `INV-${Date.now().toString().slice(-6)}`;
        const invoice = new db.Invoice({
            invoiceNumber,
            clientId,
            clientName,
            clientEmail,
            projectId,
            projectName,
            dueDate,
            items: items.map((item) => ({ ...item, amount: item.rate * item.quantity })),
            subtotal,
            taxRate: taxRate || 0,
            taxAmount,
            discount: discount || 0,
            total,
            status: 'Sent'
        });
        await invoice.save();
        res.status(201).json(invoice);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.createInvoice = createInvoice;
// SEO CONTROLLERS
const getSEOReport = async (req, res) => {
    try {
        const reports = await db.SEOReport.find().sort({ date: -1 }).limit(10);
        res.status(200).json(reports);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getSEOReport = getSEOReport;
// AI CONTROLLERS
const aiGenerateRequirements = (req, res) => {
    const { prompt } = req.body;
    if (!prompt)
        return res.status(400).json({ error: 'Prompt is required' });
    const text = `# Business and Functional Requirements for "${prompt}"
  
## 1. Overview
The proposed solution aims to satisfy: ${prompt}.

## 2. Business Requirements (BRQ)
- **BRQ-101**: Users must be able to securely authenticate and access their profiles.
- **BRQ-102**: System should track key metrics and display real-time analytics.
- **BRQ-103**: Support administrative audits, logging, and user access levels.

## 3. Functional Requirements (FRQ)
- **FRQ-201**: The system shall process API transactions within 500ms latency.
- **FRQ-202**: A collapsible navigation sidebar should render role-specific navigation controls.
- **FRQ-203**: AI generation output must be editable and exportable to PDF/Markdown format.

## 4. Non-Functional Requirements (NFR)
- **NFR-301 (Security)**: All data in transit must be encrypted using TLS 1.3.
- **NFR-302 (Scalability)**: Autoscale servers when CPU load exceeds 75%.
- **NFR-303 (Aesthetics)**: Modern premium dark theme with rounded cards and subtle gradients.
`;
    res.status(200).json({ content: text });
};
exports.aiGenerateRequirements = aiGenerateRequirements;
const aiGenerateTestCases = (req, res) => {
    const { prompt } = req.body;
    if (!prompt)
        return res.status(400).json({ error: 'Prompt is required' });
    const text = `# Automated & Manual Test Suite for "${prompt}"

| Test ID | Test Category | Description | Preconditions | Test Steps | Expected Result |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-01** | Functional | User Login validation | User is registered | 1. Input valid email<br>2. Input password<br>3. Click login | User session created, JWT saved. |
| **TC-02** | Boundary | API Input bounds validation | API is online | 1. Send request with empty payload<br>2. Submit | Response 400 Bad Request returned. |
| **TC-03** | Security | Unauthenticated Page Access | User is logged out | 1. Direct navigate to /dashboard<br>2. Load | System redirects to /login. |
| **TC-04** | UI/UX | Dark theme rendering | Device viewport > 1200px | 1. View application dashboard<br>2. Inspect color codes | BG matches #020617, Cards #0F172A. |
`;
    res.status(200).json({ content: text });
};
exports.aiGenerateTestCases = aiGenerateTestCases;
const aiGenerateBugReport = (req, res) => {
    const { prompt } = req.body;
    if (!prompt)
        return res.status(400).json({ error: 'Prompt is required' });
    const text = `# Bug Report: Exception in "${prompt}"

**Bug ID**: BUG-${Date.now().toString().slice(-4)}
**Severity**: High
**Priority**: Medium
**Status**: Open
**Reporter**: StackPilot AI Agent

### Description
An unhandled exception occurred in the feature stack during runtime. This affects normal flow and results in UI blocking.

### Steps to Reproduce
1. Navigate to the feature panel: "${prompt}"
2. Trigger the action without completing prerequisite fields.
3. Observe browser console / server logs.

### Expected Behavior
The interface should catch the invalid state, display a premium toast notification warning, and disable the execute button.

### Actual Behavior
\`\`\`js
TypeError: Cannot read properties of undefined (reading 'map')
    at FeatureContainer.tsx:142
    at renderWithHooks (react-dom.development.js:15486)
\`\`\`

### Suggested Fix
Ensure array verification occurs before accessing \`.map()\` properties:
\`\`\`ts
if (!items || items.length === 0) {
  return <EmptyState title="No items found" />;
}
\`\`\`
`;
    res.status(200).json({ content: text });
};
exports.aiGenerateBugReport = aiGenerateBugReport;
