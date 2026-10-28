import axios from 'axios';
import type { User, Project, Sprint, Release, SprintReport, Task, Client, Invoice, Document, SEOReport, BlogPost, Keyword, ActivityLog, Notification, UserRole, Enquiry, PresentationRequest, ApprovalRequest, WorkflowRule, Contract, TimesheetEntry, Organization, SystemHealth } from '../../../../packages/shared/types';

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";
// Create Axios Client
export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('stackpilot_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// System Super Admin User
const DEFAULT_USERS: User[] = [
  { _id: 'u-1', name: 'Alexander Wright', email: 'alex@stackpilot.ai', role: 'Super Admin', avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Alex', department: 'Executive Management', availability: 'Available', twoFAEnabled: false, createdAt: new Date().toISOString() },
  { _id: 'u-2', name: 'Sarah Jenkins', email: 'sarah@stackpilot.ai', role: 'Project Manager', avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Sarah', department: 'Product', availability: 'Available', twoFAEnabled: false, createdAt: new Date().toISOString() },
  { _id: 'u-3', name: 'Michael Chen', email: 'michael@stackpilot.ai', role: 'Developer', avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Michael', department: 'Engineering', availability: 'Available', twoFAEnabled: false, createdAt: new Date().toISOString() },
  { _id: 'u-4', name: 'Emily Watson', email: 'emily@stackpilot.ai', role: 'Tester', avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Emily', department: 'QA', availability: 'Available', twoFAEnabled: false, createdAt: new Date().toISOString() }
];

const DEFAULT_PROJECTS: Project[] = [
  {
    _id: 'p-1',
    name: 'StackPilot SaaS',
    description: 'Enterprise AI Sprint & Task Management Platform',
    status: 'Active',
    priority: 'High',
    budget: 150000,
    spent: 42000,
    startDate: '2026-07-01',
    endDate: '2026-12-31',
    team: [{ userId: 'u-1', role: 'Super Admin' }, { userId: 'u-2', role: 'Project Manager' }],
    health: 'Healthy',
    client: 'Internal Enterprise',
    createdAt: '2026-07-01T00:00:00Z'
  },
  {
    _id: 'p-2',
    name: 'CRM Development',
    description: 'Customer Relationship & Pipeline Management System',
    status: 'Active',
    priority: 'Medium',
    budget: 95000,
    spent: 28000,
    startDate: '2026-07-15',
    endDate: '2026-11-30',
    team: [{ userId: 'u-2', role: 'Project Manager' }, { userId: 'u-3', role: 'Developer' }],
    health: 'Healthy',
    client: 'Acme Corp',
    createdAt: '2026-07-15T00:00:00Z'
  }
];

const DEFAULT_SPRINTS: Sprint[] = [
  {
    _id: 'spr-1',
    projectId: 'p-1',
    projectName: 'StackPilot SaaS',
    name: 'Sprint 1',
    goal: 'CRM Development & Task Board Redesign',
    description: 'Deliver responsive Kanban columns, Sprint Management, and modern side drawer.',
    startDate: '2026-07-30',
    endDate: '2026-08-12',
    status: 'Active',
    capacity: 40,
    storyPoints: 28,
    velocity: 24,
    createdBy: 'u-1',
    createdAt: '2026-07-29T10:00:00Z'
  },
  {
    _id: 'spr-2',
    projectId: 'p-1',
    projectName: 'StackPilot SaaS',
    name: 'Sprint 2',
    goal: 'Authentication & Core Infrastructure',
    description: 'Implement JWT auth, RBAC permissions, and team workspace configuration.',
    startDate: '2026-07-15',
    endDate: '2026-07-29',
    status: 'Completed',
    capacity: 35,
    storyPoints: 35,
    velocity: 35,
    createdBy: 'u-1',
    createdAt: '2026-07-14T09:00:00Z'
  },
  {
    _id: 'spr-3',
    projectId: 'p-1',
    projectName: 'StackPilot SaaS',
    name: 'Sprint 3',
    goal: 'Billing & Stripe Integration',
    description: 'Setup subscription tiers, invoice PDF generation, and revenue telemetry.',
    startDate: '2026-08-13',
    endDate: '2026-08-27',
    status: 'Planning',
    capacity: 45,
    storyPoints: 16,
    velocity: 0,
    createdBy: 'u-1',
    createdAt: '2026-07-30T08:00:00Z'
  }
];

const DEFAULT_RELEASES: Release[] = [
  {
    _id: 'rel-1',
    projectId: 'p-1',
    projectName: 'StackPilot SaaS',
    version: 'v1.1.0',
    sprintId: 'spr-1',
    sprintName: 'Sprint 1',
    releaseNotes: 'Agile Sprint Management, 7-column Task Board, Story Points, Activity Timeline & Sprint Reports.',
    releaseDate: '2026-08-14',
    status: 'In Progress',
    createdAt: '2026-07-30T10:00:00Z'
  },
  {
    _id: 'rel-2',
    projectId: 'p-1',
    projectName: 'StackPilot SaaS',
    version: 'v1.0.0',
    sprintId: 'spr-2',
    sprintName: 'Sprint 2',
    releaseNotes: 'Initial production release with CRM, Team Workspace, and Auth Security.',
    releaseDate: '2026-07-29',
    status: 'Deployed',
    createdAt: '2026-07-29T18:00:00Z'
  }
];
const DEFAULT_TASKS: Task[] = [
  {
    _id: 't-101',
    taskId: 'SP-101',
    projectId: 'p-1',
    projectName: 'StackPilot SaaS',
    title: 'CRM Dashboard Analytics Enhancements',
    description: 'Enhance the analytics dashboard with real-time charts and lead conversion rate telemetry.',
    status: 'In Progress',
    priority: 'High',
    assigneeId: 'u-1',
    assigneeName: 'Super Admin',
    reporterId: 'u-1',
    reporterName: 'Super Admin',
    sprint: 'Sprint 14',
    dueDate: '2026-08-05',
    checklist: [
      { id: 'chk-1', text: 'Build SVG chart renderer component', done: true },
      { id: 'chk-2', text: 'Connect real-time websocket endpoint', done: true },
      { id: 'chk-3', text: 'Write integration unit test suite', done: false }
    ],
    comments: [
      {
        id: 'c-1',
        userId: 'u-1',
        userName: 'Super Admin',
        userAvatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Admin',
        text: 'Initial wireframes for the dashboard charts look great! Make sure to support dark mode colors.',
        createdAt: '2026-07-27T10:30:00Z'
      }
    ],
    attachments: [
      {
        id: 'att-1',
        name: 'Dashboard_Telemetry_Spec.pdf',
        url: '#',
        size: '2.4 MB',
        type: 'pdf',
        createdAt: '2026-07-26T14:20:00Z'
      }
    ],
    activity: [
      { id: 'act-1', type: 'created', user: 'Super Admin', text: 'Created task SP-101', timestamp: '2026-07-26T14:00:00Z' },
      { id: 'act-2', type: 'status_changed', user: 'Super Admin', text: 'Changed status from Todo to In Progress', timestamp: '2026-07-27T09:15:00Z' }
    ],
    estimatedTime: 12,
    loggedTime: 6,
    createdAt: '2026-07-26T14:00:00Z',
    updatedAt: '2026-07-28T08:00:00Z'
  },
  {
    _id: 't-102',
    taskId: 'SP-102',
    projectId: 'p-1',
    projectName: 'StackPilot SaaS',
    title: 'OAuth 2.0 Single Sign-On Authentication',
    description: 'Implement SAML and Google SSO authentication strategy for enterprise clients.',
    status: 'Todo',
    priority: 'Critical',
    assigneeId: 'u-1',
    assigneeName: 'Super Admin',
    reporterId: 'u-1',
    reporterName: 'Super Admin',
    sprint: 'Sprint 15',
    dueDate: '2026-08-12',
    checklist: [
      { id: 'chk-10', text: 'Configure Google Developer Console credentials', done: true },
      { id: 'chk-11', text: 'Implement JWT refresh token strategy', done: false }
    ],
    comments: [],
    attachments: [],
    activity: [
      { id: 'act-10', type: 'created', user: 'Super Admin', text: 'Created task SP-102', timestamp: '2026-07-27T11:00:00Z' }
    ],
    estimatedTime: 16,
    loggedTime: 2,
    createdAt: '2026-07-27T11:00:00Z',
    updatedAt: '2026-07-27T11:00:00Z'
  },
  {
    _id: 't-103',
    taskId: 'SP-103',
    projectId: 'p-1',
    projectName: 'StackPilot SaaS',
    title: 'Mobile Responsive Layout Refactoring',
    description: 'Ensure Kanban board and workspace drawers scale cleanly on mobile viewports.',
    status: 'In Review',
    priority: 'High',
    assigneeId: 'u-1',
    assigneeName: 'Super Admin',
    sprint: 'Sprint 14',
    dueDate: '2026-07-30',
    checklist: [
      { id: 'chk-20', text: 'Test viewport breakpoints from 320px to 1024px', done: true },
      { id: 'chk-21', text: 'Verify horizontal scroll containers', done: true }
    ],
    comments: [],
    attachments: [],
    activity: [],
    estimatedTime: 8,
    loggedTime: 7.5,
    createdAt: '2026-07-25T09:00:00Z',
    updatedAt: '2026-07-28T10:00:00Z'
  },
  {
    _id: 't-104',
    taskId: 'SP-104',
    projectId: 'p-1',
    projectName: 'StackPilot SaaS',
    title: 'Stripe Webhook Payment Gateway Integration',
    description: 'Handle recurring subscription invoices and failed payment webhooks securely.',
    status: 'Done',
    priority: 'High',
    assigneeId: 'u-1',
    assigneeName: 'Super Admin',
    sprint: 'Sprint 13',
    dueDate: '2026-07-24',
    checklist: [
      { id: 'chk-30', text: 'Setup webhook listener', done: true },
      { id: 'chk-31', text: 'Verify signature verification', done: true }
    ],
    comments: [],
    attachments: [],
    activity: [],
    estimatedTime: 10,
    loggedTime: 10,
    createdAt: '2026-07-20T10:00:00Z',
    updatedAt: '2026-07-24T16:00:00Z'
  },
  {
    _id: 't-105',
    taskId: 'SP-105',
    projectId: 'p-1',
    projectName: 'StackPilot SaaS',
    title: 'GraphQL API Schema Migration',
    description: 'Prepare GraphQL schema migration definitions for backend query optimization.',
    status: 'Backlog',
    priority: 'Low',
    assigneeId: 'u-1',
    assigneeName: 'Super Admin',
    sprint: 'Sprint 16',
    dueDate: '2026-08-20',
    checklist: [],
    comments: [],
    attachments: [],
    activity: [],
    estimatedTime: 14,
    loggedTime: 0,
    createdAt: '2026-07-28T09:00:00Z',
    updatedAt: '2026-07-28T09:00:00Z'
  },
  {
    _id: 't-106',
    taskId: 'SP-106',
    projectId: 'p-1',
    projectName: 'StackPilot SaaS',
    title: 'Third-party SMS Gateway API Key Provisioning',
    description: 'Awaiting vendor API credentials and compliance verification before implementation.',
    status: 'Blocked',
    priority: 'Critical',
    assigneeId: 'u-1',
    assigneeName: 'Super Admin',
    sprint: 'Sprint 14',
    dueDate: '2026-08-01',
    checklist: [
      { id: 'chk-40', text: 'Submit vendor verification paperwork', done: true },
      { id: 'chk-41', text: 'Receive production API key', done: false }
    ],
    comments: [
      {
        id: 'c-5',
        userId: 'u-1',
        userName: 'Super Admin',
        text: 'Blocked pending carrier approval response.',
        createdAt: '2026-07-28T08:30:00Z'
      }
    ],
    attachments: [],
    activity: [
      { id: 'act-40', type: 'status_changed', user: 'Super Admin', text: 'Moved task status to Blocked', timestamp: '2026-07-28T08:30:00Z' }
    ],
    estimatedTime: 6,
    loggedTime: 2,
    createdAt: '2026-07-26T15:00:00Z',
    updatedAt: '2026-07-28T08:30:00Z'
  },
  {
    _id: 't-107',
    taskId: 'SP-107',
    projectId: 'p-1',
    projectName: 'StackPilot SaaS',
    title: 'Legacy FTP Data Ingestion Service',
    description: 'Task deprecated as client transitioned to S3 direct upload workflow.',
    status: 'Cancelled',
    priority: 'Low',
    assigneeId: 'u-1',
    assigneeName: 'Super Admin',
    sprint: 'Sprint 12',
    dueDate: '2026-07-15',
    checklist: [],
    comments: [],
    attachments: [],
    activity: [
      { id: 'act-50', type: 'status_changed', user: 'Super Admin', text: 'Cancelled task due to requirement change', timestamp: '2026-07-15T10:00:00Z' }
    ],
    estimatedTime: 8,
    loggedTime: 1,
    createdAt: '2026-07-10T12:00:00Z',
    updatedAt: '2026-07-15T10:00:00Z'
  }
];
const DEFAULT_LEADS: Client[] = [
  { _id: 'c-1', name: 'Acme Corp', email: 'contact@acme.com', companyName: 'Acme Global', phone: '+1 555-0199', status: 'Active', value: 45000, tags: ['Enterprise', 'SaaS'], notes: 'Key enterprise account', createdAt: '2026-01-15T08:00:00Z' },
  { _id: 'c-2', name: 'Starlight Tech', email: 'info@starlight.io', companyName: 'Starlight AI', phone: '+1 555-0244', status: 'Lead', value: 18000, tags: ['Startup'], notes: 'Interested in Business OS tier', createdAt: '2026-03-20T10:30:00Z' }
];

const DEFAULT_INVOICES: Invoice[] = [
  { _id: 'inv-1', invoiceNumber: 'INV-2026-001', clientId: 'c-1', clientName: 'Acme Corp', clientEmail: 'contact@acme.com', projectName: 'StackPilot SaaS', issueDate: '2026-07-01', dueDate: '2026-07-31', items: [{ description: 'Agile Sprint Engineering (Q3)', quantity: 1, rate: 12500, amount: 12500 }], subtotal: 12500, taxRate: 10, taxAmount: 1250, discount: 0, total: 13750, status: 'Paid', createdAt: '2026-07-01T09:00:00Z' },
  { _id: 'inv-2', invoiceNumber: 'INV-2026-002', clientId: 'c-2', clientName: 'Starlight Tech', clientEmail: 'info@starlight.io', projectName: 'AI Workflow Integration', issueDate: '2026-07-15', dueDate: '2026-08-15', items: [{ description: 'Custom AI Assistant Setup', quantity: 1, rate: 6500, amount: 6500 }], subtotal: 6500, taxRate: 10, taxAmount: 650, discount: 500, total: 6650, status: 'Sent', createdAt: '2026-07-15T11:00:00Z' }
];

const DEFAULT_SEO_REPORTS: SEOReport[] = [];

const DEFAULT_DOCUMENTS: Document[] = [
  { _id: 'doc-1', title: 'StackPilot AI Business OS Architecture PRD', content: 'Comprehensive Product Requirements Document for v1.1 Enterprise Business OS Upgrade including Navigation, Approvals, Workflows, Audit Logs, and Client Portal.', type: 'PRD', category: 'PRD', projectId: 'p-1', projectName: 'StackPilot SaaS', createdBy: 'u-1', authorName: 'Super Admin', version: 1, tags: ['Architecture', 'Enterprise', 'v1.1'], createdAt: '2026-07-28T09:00:00Z' },
  { _id: 'doc-2', title: 'Security & Compliance Policy 2026', content: 'Enterprise SOC2 Type II, ISO27001 compliance standards, RBAC role matrix, and encryption guidelines.', type: 'Policy', category: 'Policies', createdBy: 'u-1', authorName: 'Super Admin', version: 2, tags: ['Security', 'Compliance'], createdAt: '2026-06-10T14:00:00Z' },
  { _id: 'doc-3', title: 'Client Master Services Agreement (Acme Corp)', content: 'Legal framework and SLA agreements for Acme Corp cloud hosting and technical support services.', type: 'Contract', category: 'Contracts', createdBy: 'u-1', authorName: 'Super Admin', version: 1, tags: ['Legal', 'Acme'], createdAt: '2026-01-20T10:00:00Z' }
];

const DEFAULT_APPROVALS: ApprovalRequest[] = [
  { _id: 'app-1', type: 'Leave Approval', title: 'Annual Paid Time Off Request (3 Days)', description: 'Requesting PTO for family event from Aug 5 to Aug 7.', requestedBy: 'u-1', requestedByName: 'Super Admin', approverId: 'u-1', approverName: 'Super Admin', status: 'Approved', comments: 'Approved by PM', submittedAt: '2026-07-28T09:00:00Z', reviewedAt: '2026-07-28T11:00:00Z' },
  { _id: 'app-2', type: 'Expense Approval', title: 'AWS Cloud Infrastructure Q3 Bill ($1,450)', description: 'Monthly production cluster and RDS backup storage invoice.', requestedBy: 'u-1', requestedByName: 'Super Admin', approverId: 'u-1', approverName: 'Super Admin', amount: 1450, status: 'Pending', submittedAt: '2026-07-29T14:30:00Z' },
  { _id: 'app-3', type: 'Invoice Approval', title: 'Invoice INV-2026-002 Release Confirmation', description: 'Starlight Tech milestone 1 billing verification.', requestedBy: 'u-1', requestedByName: 'Super Admin', approverId: 'u-1', approverName: 'Super Admin', amount: 6650, status: 'Pending', submittedAt: '2026-07-30T10:00:00Z' }
];

const DEFAULT_WORKFLOWS: WorkflowRule[] = [
  { _id: 'wf-1', name: 'Auto-Generate Invoice on Task Completion', trigger: 'Task Completed', condition: 'Task Labels contain "Billable"', action: 'Generate Invoice', status: 'Active', executionCount: 14, lastExecuted: '2026-07-29T16:00:00Z', createdAt: '2026-05-01T08:00:00Z' },
  { _id: 'wf-2', name: 'Notify PM when Sprint Starts', trigger: 'Sprint Started', condition: 'Sprint Total Points > 30', action: 'Notify Manager', status: 'Active', executionCount: 8, lastExecuted: '2026-07-28T09:00:00Z', createdAt: '2026-05-15T10:00:00Z' },
  { _id: 'wf-3', name: 'Send Client Welcome Email', trigger: 'Client Onboarded', condition: 'Client Status is Active', action: 'Send Email', status: 'Active', executionCount: 5, lastExecuted: '2026-07-20T12:00:00Z', createdAt: '2026-06-01T11:00:00Z' }
];

const DEFAULT_CONTRACTS: Contract[] = [
  { _id: 'ctr-1', contractNumber: 'CTR-2026-001', title: 'Acme Enterprise Master SaaS Subscription', clientId: 'c-1', clientName: 'Acme Corp', value: 54000, startDate: '2026-01-01', endDate: '2026-12-31', status: 'Active', documentUrl: '/docs/ctr-acme.pdf', createdAt: '2026-01-01T00:00:00Z' },
  { _id: 'ctr-2', contractNumber: 'CTR-2026-002', title: 'Starlight AI Integration NDA & SLA', clientId: 'c-2', clientName: 'Starlight Tech', value: 18000, startDate: '2026-04-01', endDate: '2027-03-31', status: 'Active', documentUrl: '/docs/ctr-starlight.pdf', createdAt: '2026-04-01T00:00:00Z' }
];

const DEFAULT_TIMESHEETS: TimesheetEntry[] = [
  { _id: 'ts-1', userId: 'u-1', userName: 'Super Admin', projectId: 'p-1', projectName: 'StackPilot SaaS', taskId: 'SP-101', date: '2026-07-29', hours: 7.5, billable: true, description: 'Agile Sprint Management and Kanban column UI implementation', status: 'Approved', createdAt: '2026-07-29T18:00:00Z' },
  { _id: 'ts-2', userId: 'u-1', userName: 'Super Admin', projectId: 'p-1', projectName: 'StackPilot SaaS', taskId: 'SP-102', date: '2026-07-30', hours: 8.0, billable: true, description: 'Business OS Enterprise Navigation & Audit Log integration', status: 'Submitted', createdAt: '2026-07-30T17:00:00Z' }
];

const DEFAULT_NOTIFICATIONS_LIST: Notification[] = [
  { _id: 'notif-1', userId: 'u-1', title: 'Task Assigned', message: 'You were assigned to "Business OS Navigation Upgrade" in StackPilot SaaS', type: 'info', category: 'Task', read: false, createdAt: '2026-07-30T09:00:00Z' },
  { _id: 'notif-2', userId: 'u-1', title: 'Sprint Started', message: 'Sprint 15 "Business OS Upgrade" has officially started.', type: 'success', category: 'Sprint', read: false, createdAt: '2026-07-28T09:00:00Z' },
  { _id: 'notif-3', userId: 'u-1', title: 'Expense Approval Pending', message: 'AWS Cloud Q3 Invoice ($1,450) requires your approval.', type: 'warning', category: 'Approval', read: false, createdAt: '2026-07-29T14:30:00Z' },
  { _id: 'notif-4', userId: 'u-1', title: 'Invoice Paid', message: 'Acme Corp paid Invoice INV-2026-001 ($13,750).', type: 'success', category: 'Invoice', read: true, createdAt: '2026-07-25T11:00:00Z' }
];

const DEFAULT_AUDIT_LOGS: ActivityLog[] = [
  { _id: 'aud-1', userId: 'u-1', userName: 'Super Admin', userRole: 'Super Admin', action: 'Login', details: 'User logged in successfully from Chrome / Linux', ipAddress: '192.168.1.45', createdAt: '2026-07-30T08:00:00Z' },
  { _id: 'aud-2', userId: 'u-1', userName: 'Super Admin', userRole: 'Super Admin', action: 'Record Updated', details: 'Updated Sprint 15 status to Active', entity: 'Sprint', ipAddress: '192.168.1.45', createdAt: '2026-07-30T09:30:00Z' },
  { _id: 'aud-3', userId: 'u-1', userName: 'Super Admin', userRole: 'Super Admin', action: 'Invoice Generated', details: 'Created Invoice INV-2026-002 for Starlight Tech ($6,650)', entity: 'Invoice', ipAddress: '192.168.1.45', createdAt: '2026-07-29T15:00:00Z' },
  { _id: 'aud-4', userId: 'u-1', userName: 'Super Admin', userRole: 'Super Admin', action: 'Permission Changed', details: 'Assigned Business Analyst role permissions to Sarah Jenkins', entity: 'User', ipAddress: '192.168.1.45', createdAt: '2026-07-27T14:10:00Z' }
];

const DEFAULT_ORGANIZATION: Organization = {
  _id: 'org-1',
  name: 'StackPilot AI Inc.',
  code: 'STACKPILOT',
  domain: 'stackpilot.ai',
  plan: 'Enterprise',
  departments: [
    { id: 'dept-1', name: 'Engineering', manager: 'Alex Morgan', memberCount: 14 },
    { id: 'dept-2', name: 'Product Management', manager: 'Sarah Jenkins', memberCount: 6 },
    { id: 'dept-3', name: 'Sales & Marketing', manager: 'Marcus Vance', memberCount: 8 },
    { id: 'dept-4', name: 'Finance & Operations', manager: 'Elena Rostova', memberCount: 4 }
  ],
  status: 'Active',
  createdAt: '2025-01-01T00:00:00Z'
};

const DEFAULT_SYSTEM_HEALTH: SystemHealth = {
  serverStatus: 'Operational',
  apiLatencyMs: 24,
  dbStatus: 'Healthy',
  storageUsedGb: 142.8,
  storageMaxGb: 500,
  emailQueueCount: 0,
  activeSessions: 18,
  aiTokenCountToday: 48500,
  licenseDaysRemaining: 320
};

const DEFAULT_ENQUIRIES: Enquiry[] = [];
const DEFAULT_PRESENTATION_REQUESTS: PresentationRequest[] = [];

// Helper to load/save mock database to localStorage
class LocalDatabase {
  private get<T>(key: string, defaults: T[]): T[] {
    const data = localStorage.getItem(`sp_${key}`);
    if (!data || (JSON.parse(data).length === 0 && (key === 'tasks' || key === 'users' || key === 'sprints' || key === 'projects' || key === 'releases'))) {
      if (localStorage.getItem('sp_demo_mode') === null) {
        localStorage.setItem('sp_demo_mode', 'false');
      }
      const isDemoMode = localStorage.getItem('sp_demo_mode') === 'true';
      const actualDefaults = (isDemoMode || key === 'users' || key === 'tasks' || key === 'sprints' || key === 'projects' || key === 'releases') ? defaults : [];
      localStorage.setItem(`sp_${key}`, JSON.stringify(actualDefaults));
      return actualDefaults;
    }
    return JSON.parse(data);
  }

  private save<T>(key: string, data: T[]): void {
    localStorage.setItem(`sp_${key}`, JSON.stringify(data));
  }

  getUsers() { return this.get('users', DEFAULT_USERS); }
  saveUsers(d: User[]) { this.save('users', d); }

  getProjects() { return this.get('projects', DEFAULT_PROJECTS); }
  saveProjects(d: Project[]) { this.save('projects', d); }

  getSprints() { return this.get('sprints', DEFAULT_SPRINTS); }
  saveSprints(d: Sprint[]) { this.save('sprints', d); }

  getReleases() { return this.get('releases', DEFAULT_RELEASES); }
  saveReleases(d: Release[]) { this.save('releases', d); }

  getTasks() { return this.get('tasks', DEFAULT_TASKS); }
  saveTasks(d: Task[]) { this.save('tasks', d); }

  getLeads() { return this.get('leads', DEFAULT_LEADS); }
  saveLeads(d: Client[]) { this.save('leads', d); }

  getInvoices() { return this.get('invoices', DEFAULT_INVOICES); }
  saveInvoices(d: Invoice[]) { this.save('invoices', d); }

  getSEOs() { return this.get('seos', DEFAULT_SEO_REPORTS); }
  saveSEOs(d: SEOReport[]) { this.save('seos', d); }

  getDocs() { return this.get('docs', DEFAULT_DOCUMENTS); }
  saveDocs(d: Document[]) { this.save('docs', d); }

  getEnquiries(): Enquiry[] { return this.get<Enquiry>('enquiries', DEFAULT_ENQUIRIES); }
  saveEnquiries(d: Enquiry[]) { this.save('enquiries', d); }

  getPresentationRequests(): PresentationRequest[] { return this.get<PresentationRequest>('presentation_requests', DEFAULT_PRESENTATION_REQUESTS); }
  savePresentationRequests(d: PresentationRequest[]) { this.save('presentation_requests', d); }

  getNotifications(): Notification[] {
    return this.get<Notification>('notifications', DEFAULT_NOTIFICATIONS_LIST);
  }
  saveNotifications(d: Notification[]) { this.save('notifications', d); }

  getActivities(): ActivityLog[] {
    return this.get<ActivityLog>('activities', DEFAULT_AUDIT_LOGS);
  }
  saveActivities(d: ActivityLog[]) { this.save('activities', d); }

  getApprovals(): ApprovalRequest[] {
    return this.get<ApprovalRequest>('approvals', DEFAULT_APPROVALS);
  }
  saveApprovals(d: ApprovalRequest[]) { this.save('approvals', d); }

  getWorkflows(): WorkflowRule[] {
    return this.get<WorkflowRule>('workflows', DEFAULT_WORKFLOWS);
  }
  saveWorkflows(d: WorkflowRule[]) { this.save('workflows', d); }

  getContracts(): Contract[] {
    return this.get<Contract>('contracts', DEFAULT_CONTRACTS);
  }
  saveContracts(d: Contract[]) { this.save('contracts', d); }

  getTimesheets(): TimesheetEntry[] {
    return this.get<TimesheetEntry>('timesheets', DEFAULT_TIMESHEETS);
  }
  saveTimesheets(d: TimesheetEntry[]) { this.save('timesheets', d); }

  getOrganization(): Organization {
    const raw = localStorage.getItem('sp_organization');
    if (!raw) {
      localStorage.setItem('sp_organization', JSON.stringify(DEFAULT_ORGANIZATION));
      return DEFAULT_ORGANIZATION;
    }
    return JSON.parse(raw);
  }
  saveOrganization(d: Organization) {
    localStorage.setItem('sp_organization', JSON.stringify(d));
  }

  getSystemHealth(): SystemHealth {
    return DEFAULT_SYSTEM_HEALTH;
  }
}

const mockDB = new LocalDatabase();

// API Client Wrapper that automatically falls back to Mock DB if Backend is down
export const API = {
  isMockMode: true, // Default to mock mode first, then auto check backend availability

  async checkBackendAvailability(): Promise<boolean> {
    try {
      const res = await axios.get(`${API_URL}/auth/profile`, { timeout: 1000 }).catch(() => null);
      // If we get any HTTP status other than network failure, the server is running
      this.isMockMode = !res;
      return !this.isMockMode;
    } catch {
      this.isMockMode = true;
      return false;
    }
  },

  auth: {
    async login(email: string, password?: string): Promise<{ token: string; user: User }> {
      try {
        if (!API.isMockMode) {
          const res = await apiClient.post('/auth/login', { email, password });
          return res.data;
        }
      } catch (err) {
        console.warn('Backend call failed. Falling back to Mock DB...', err);
      }

      // Simulate network latency
      await new Promise(r => setTimeout(r, 600));

      const users = mockDB.getUsers();
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!user) {
        throw new Error('User not found. Try one of our team emails (e.g. alex@stackpilot.ai, sarah@stackpilot.ai) or sign up!');
      }

      const token = `mock_jwt_token_${user._id}_${Date.now()}`;
      localStorage.setItem('stackpilot_token', token);
      localStorage.setItem('stackpilot_user', JSON.stringify(user));

      // Log activity
      const acts = mockDB.getActivities();
      acts.unshift({
        _id: `act-${Date.now()}`,
        userId: user._id,
        userName: user.name,
        userRole: user.role,
        action: 'Login',
        details: 'User authenticated in Mock Offline Mode.',
        createdAt: new Date().toISOString()
      });
      mockDB.saveActivities(acts);

      return { token, user };
    },

    async register(name: string, email: string, role: UserRole): Promise<{ token: string; user: User }> {
      try {
        if (!API.isMockMode) {
          const res = await apiClient.post('/auth/register', { name, email, role, password: 'password123' });
          return res.data;
        }
      } catch (err) {
        console.warn('Backend register failed. Falling back to Mock DB...', err);
      }

      await new Promise(r => setTimeout(r, 600));

      const users = mockDB.getUsers();
      if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        throw new Error('Email is already registered.');
      }

      const newUser: User = {
        _id: `u-${Date.now()}`,
        name,
        email,
        role,
        avatarUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}`,
        department: 'Engineering',
        availability: 'Available',
        twoFAEnabled: false,
        createdAt: new Date().toISOString()
      };

      users.push(newUser);
      mockDB.saveUsers(users);

      const token = `mock_jwt_token_${newUser._id}_${Date.now()}`;
      localStorage.setItem('stackpilot_token', token);
      localStorage.setItem('stackpilot_user', JSON.stringify(newUser));

      // Log activity
      const acts = mockDB.getActivities();
      acts.unshift({
        _id: `act-${Date.now()}`,
        userId: newUser._id,
        userName: newUser.name,
        userRole: newUser.role,
        action: 'Register',
        details: `Created new profile for ${name} with role ${role}`,
        createdAt: new Date().toISOString()
      });
      mockDB.saveActivities(acts);

      return { token, user: newUser };
    },

    async getProfile(): Promise<User> {
      try {
        if (!API.isMockMode) {
          const res = await apiClient.get('/auth/profile');
          return res.data;
        }
      } catch { }

      const cached = localStorage.getItem('stackpilot_user');
      if (cached) return JSON.parse(cached);
      throw new Error('No user cached.');
    },

    async updateProfile(updates: Partial<User>): Promise<User> {
      try {
        if (!API.isMockMode) {
          const res = await apiClient.put('/auth/profile', updates);
          return res.data;
        }
      } catch { }

      const cached = localStorage.getItem('stackpilot_user');
      if (!cached) throw new Error('Not logged in.');
      const user = JSON.parse(cached) as User;
      const updated = { ...user, ...updates };
      localStorage.setItem('stackpilot_user', JSON.stringify(updated));

      // Update in users database
      const users = mockDB.getUsers();
      const idx = users.findIndex(u => u._id === user._id);
      if (idx !== -1) {
        users[idx] = updated;
        mockDB.saveUsers(users);
      }

      return updated;
    },

    async listUsers(onlyActive = false): Promise<User[]> {
      const users = mockDB.getUsers();
      if (onlyActive) {
        return users.filter(u => u.status !== 'Inactive');
      }
      return users;
    },

    async createUser(data: Partial<User>): Promise<User> {
      const users = mockDB.getUsers();
      const newUser: User = {
        _id: `u-${Date.now()}`,
        name: data.name || 'New Team Member',
        email: data.email || `user${Date.now()}@stackpilot.ai`,
        role: data.role || 'Developer',
        department: data.department || 'Engineering',
        designation: data.designation || 'Software Engineer',
        phone: data.phone || '',
        joiningDate: data.joiningDate || new Date().toISOString().split('T')[0],
        status: data.status || 'Active',
        avatarUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(data.name || 'User')}`,
        availability: 'Available',
        twoFAEnabled: false,
        createdAt: new Date().toISOString()
      };
      users.push(newUser);
      mockDB.saveUsers(users);

      const cachedUser = localStorage.getItem('stackpilot_user');
      const performer = cachedUser ? JSON.parse(cachedUser).name : 'Super Admin';

      const acts = mockDB.getActivities();
      acts.unshift({
        _id: `act-${Date.now()}`,
        userId: 'u-1',
        userName: performer,
        userRole: 'Super Admin',
        action: 'Add Team Member',
        details: `Added new team member ${newUser.name} (${newUser.email}) as ${newUser.role}`,
        createdAt: new Date().toISOString()
      });
      mockDB.saveActivities(acts);

      return newUser;
    },

    async updateUser(id: string, updates: Partial<User>): Promise<User> {
      const users = mockDB.getUsers();
      const idx = users.findIndex(u => u._id === id);
      if (idx === -1) throw new Error('User not found');
      const updated = { ...users[idx], ...updates };
      users[idx] = updated;
      mockDB.saveUsers(users);

      const cachedUser = localStorage.getItem('stackpilot_user');
      const performer = cachedUser ? JSON.parse(cachedUser).name : 'Super Admin';

      const acts = mockDB.getActivities();
      acts.unshift({
        _id: `act-${Date.now()}`,
        userId: 'u-1',
        userName: performer,
        userRole: 'Super Admin',
        action: 'Update Team Member',
        details: `Updated team member ${updated.name} (${updated.email})`,
        createdAt: new Date().toISOString()
      });
      mockDB.saveActivities(acts);

      return updated;
    },

    async deleteUser(id: string): Promise<void> {
      const targetUser = mockDB.getUsers().find(u => u._id === id);
      const list = mockDB.getUsers().filter(u => u._id !== id);
      mockDB.saveUsers(list);
      await API.adminDelete('Team Members', id, targetUser?.name || id);
    }
  },

  projects: {
    async list(): Promise<Project[]> {
      try {
        if (!API.isMockMode) {
          const res = await apiClient.get('/projects');
          return res.data;
        }
      } catch { }
      return mockDB.getProjects();
    },

    async create(p: Partial<Project>): Promise<Project> {
      try {
        if (!API.isMockMode) {
          const res = await apiClient.post('/projects', p);
          return res.data;
        }
      } catch { }

      const projects = mockDB.getProjects();
      const newProj: Project = {
        _id: `p-${Date.now()}`,
        name: p.name || 'Untitled Project',
        description: p.description || '',
        status: p.status || 'Planning',
        priority: p.priority || 'Medium',
        budget: p.budget || 0,
        spent: 0,
        startDate: p.startDate || new Date().toISOString().split('T')[0],
        endDate: p.endDate || new Date().toISOString().split('T')[0],
        health: 'Healthy',
        client: p.client || 'Internal',
        team: [],
        createdAt: new Date().toISOString()
      };

      projects.push(newProj);
      mockDB.saveProjects(projects);

      // Log activity
      const cachedUser = localStorage.getItem('stackpilot_user');
      if (cachedUser) {
        const u = JSON.parse(cachedUser);
        const acts = mockDB.getActivities();
        acts.unshift({
          _id: `act-${Date.now()}`,
          userId: u._id,
          userName: u.name,
          userRole: u.role,
          action: 'Create Project',
          details: `Created new project "${newProj.name}"`,
          createdAt: new Date().toISOString()
        });
        mockDB.saveActivities(acts);
      }

      return newProj;
    },

    async delete(id: string): Promise<void> {
      try {
        if (!API.isMockMode) {
          await apiClient.delete(`/projects/${id}`);
        }
      } catch { }
      const list = mockDB.getProjects().filter(p => p._id !== id);
      mockDB.saveProjects(list);
      await API.adminDelete('Projects', id);
    }
  },

  sprints: {
    async list(projectId?: string): Promise<Sprint[]> {
      try {
        if (!API.isMockMode) {
          const res = await apiClient.get('/sprints', { params: { projectId } });
          return res.data;
        }
      } catch { }

      const sprints = mockDB.getSprints();
      if (projectId) {
        return sprints.filter(s => s.projectId === projectId);
      }
      return sprints;
    },

    async create(s: Partial<Sprint>): Promise<Sprint> {
      try {
        if (!API.isMockMode) {
          const res = await apiClient.post('/sprints', s);
          return res.data;
        }
      } catch { }

      const sprints = mockDB.getSprints();
      const newSprint: Sprint = {
        _id: `spr-${Date.now()}`,
        projectId: s.projectId || 'p-1',
        projectName: s.projectName || 'StackPilot SaaS',
        name: s.name || `Sprint ${sprints.length + 1}`,
        goal: s.goal || '',
        description: s.description || '',
        startDate: s.startDate || new Date().toISOString().split('T')[0],
        endDate: s.endDate || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
        status: s.status || 'Planning',
        capacity: s.capacity || 40,
        storyPoints: s.storyPoints || 0,
        velocity: s.velocity || 0,
        createdBy: 'u-1',
        createdAt: new Date().toISOString()
      };

      sprints.push(newSprint);
      mockDB.saveSprints(sprints);
      return newSprint;
    },

    async update(id: string, updates: Partial<Sprint>): Promise<Sprint> {
      try {
        if (!API.isMockMode) {
          const res = await apiClient.put(`/sprints/${id}`, updates);
          return res.data;
        }
      } catch { }

      const sprints = mockDB.getSprints();
      const idx = sprints.findIndex(s => s._id === id);
      if (idx === -1) throw new Error('Sprint not found');

      // Rule: Only 1 active sprint per project
      if (updates.status === 'Active') {
        const targetProjId = sprints[idx].projectId;
        sprints.forEach(sp => {
          if (sp.projectId === targetProjId && sp._id !== id && sp.status === 'Active') {
            sp.status = 'Planning';
          }
        });
      }

      const updated = { ...sprints[idx], ...updates, updatedAt: new Date().toISOString() };
      sprints[idx] = updated;
      mockDB.saveSprints(sprints);
      return updated;
    },

    async delete(id: string): Promise<void> {
      try {
        if (!API.isMockMode) {
          await apiClient.delete(`/sprints/${id}`);
        }
      } catch { }

      const sprints = mockDB.getSprints().filter(s => s._id !== id);
      mockDB.saveSprints(sprints);

      // Reset sprintId on associated tasks -> Backlog
      const tasks = mockDB.getTasks();
      let changed = false;
      tasks.forEach(t => {
        if (t.sprintId === id) {
          t.sprintId = undefined;
          t.sprintName = undefined;
          t.status = 'Backlog';
          changed = true;
        }
      });
      if (changed) mockDB.saveTasks(tasks);
    },

    async start(id: string): Promise<Sprint> {
      return this.update(id, { status: 'Active' });
    },

    async complete(id: string, targetSprintId?: string): Promise<Sprint> {
      const updated = await this.update(id, { status: 'Completed' });
      // Move incomplete tasks to target sprint or Backlog
      const tasks = mockDB.getTasks();
      const targetSprint = targetSprintId ? mockDB.getSprints().find(s => s._id === targetSprintId) : undefined;
      let changed = false;
      tasks.forEach(t => {
        if (t.sprintId === id && t.status !== 'Done') {
          if (targetSprint) {
            t.sprintId = targetSprint._id;
            t.sprintName = targetSprint.name;
          } else {
            t.sprintId = undefined;
            t.sprintName = undefined;
            t.status = 'Backlog';
          }
          changed = true;
        }
      });
      if (changed) mockDB.saveTasks(tasks);
      return updated;
    },

    async archive(id: string): Promise<Sprint> {
      return this.update(id, { status: 'Archived' });
    },

    async duplicate(id: string): Promise<Sprint> {
      const sprints = mockDB.getSprints();
      const source = sprints.find(s => s._id === id);
      if (!source) throw new Error('Sprint not found');
      return this.create({
        projectId: source.projectId,
        projectName: source.projectName,
        name: `${source.name} (Copy)`,
        goal: source.goal,
        description: source.description,
        startDate: source.startDate,
        endDate: source.endDate,
        status: 'Planning',
        capacity: source.capacity
      });
    }
  },

  sprintReports: {
    async getReport(sprintId: string): Promise<SprintReport> {
      const sprints = mockDB.getSprints();
      const sprint = sprints.find(s => s._id === sprintId) || sprints[0];
      const tasks = mockDB.getTasks().filter(t => t.sprintId === sprint?._id);

      const totalTasks = tasks.length;
      const completedTasks = tasks.filter(t => t.status === 'Done').length;
      const blockedTasks = tasks.filter(t => t.status === 'Blocked').length;
      const carryForwardTasks = totalTasks - completedTasks;

      const totalStoryPoints = tasks.reduce((sum, t) => sum + (t.storyPoints || 0), 0);
      const completedStoryPoints = tasks.filter(t => t.status === 'Done').reduce((sum, t) => sum + (t.storyPoints || 0), 0);

      // Generate burndown data
      const burndown = [
        { day: 'Day 1', remainingPoints: totalStoryPoints, idealPoints: totalStoryPoints },
        { day: 'Day 3', remainingPoints: Math.max(0, totalStoryPoints - 4), idealPoints: Math.round(totalStoryPoints * 0.8) },
        { day: 'Day 6', remainingPoints: Math.max(0, totalStoryPoints - 10), idealPoints: Math.round(totalStoryPoints * 0.5) },
        { day: 'Day 9', remainingPoints: Math.max(0, totalStoryPoints - 18), idealPoints: Math.round(totalStoryPoints * 0.2) },
        { day: 'Day 14', remainingPoints: totalStoryPoints - completedStoryPoints, idealPoints: 0 },
      ];

      const burnup = [
        { day: 'Day 1', completedPoints: 0, totalPoints: totalStoryPoints },
        { day: 'Day 3', completedPoints: 4, totalPoints: totalStoryPoints },
        { day: 'Day 6', completedPoints: 10, totalPoints: totalStoryPoints },
        { day: 'Day 9', completedPoints: 18, totalPoints: totalStoryPoints },
        { day: 'Day 14', completedPoints: completedStoryPoints, totalPoints: totalStoryPoints },
      ];

      const users = mockDB.getUsers();
      const teamPerformance = users.slice(0, 4).map(u => {
        const uTasks = tasks.filter(t => t.assigneeId === u._id);
        const uDone = uTasks.filter(t => t.status === 'Done');
        const pts = uDone.reduce((acc, t) => acc + (t.storyPoints || 0), 0);
        return {
          name: u.name,
          avatar: u.avatarUrl,
          assigned: uTasks.length,
          completed: uDone.length,
          points: pts
        };
      });

      return {
        sprintId: sprint?._id || 'spr-1',
        sprintName: sprint?.name || 'Sprint 1',
        projectName: sprint?.projectName || 'StackPilot SaaS',
        totalTasks,
        completedTasks,
        carryForwardTasks,
        blockedTasks,
        totalStoryPoints,
        completedStoryPoints,
        velocity: sprint?.velocity || completedStoryPoints,
        capacity: sprint?.capacity || 40,
        burndown,
        burnup,
        teamPerformance
      };
    }
  },

  releases: {
    async list(projectId?: string): Promise<Release[]> {
      const rels = mockDB.getReleases();
      if (projectId) return rels.filter(r => r.projectId === projectId);
      return rels;
    },

    async create(r: Partial<Release>): Promise<Release> {
      const rels = mockDB.getReleases();
      const newRelease: Release = {
        _id: `rel-${Date.now()}`,
        projectId: r.projectId || 'p-1',
        projectName: r.projectName || 'StackPilot SaaS',
        version: r.version || 'v1.0.0',
        sprintId: r.sprintId,
        sprintName: r.sprintName,
        releaseNotes: r.releaseNotes || '',
        releaseDate: r.releaseDate || new Date().toISOString().split('T')[0],
        status: r.status || 'Planned',
        createdAt: new Date().toISOString()
      };
      rels.push(newRelease);
      mockDB.saveReleases(rels);
      return newRelease;
    },

    async update(id: string, updates: Partial<Release>): Promise<Release> {
      const rels = mockDB.getReleases();
      const idx = rels.findIndex(r => r._id === id);
      if (idx === -1) throw new Error('Release not found');
      const updated = { ...rels[idx], ...updates, updatedAt: new Date().toISOString() };
      rels[idx] = updated;
      mockDB.saveReleases(rels);
      return updated;
    },

    async delete(id: string): Promise<void> {
      const rels = mockDB.getReleases().filter(r => r._id !== id);
      mockDB.saveReleases(rels);
    }
  },

  tasks: {
    async list(projectId?: string): Promise<Task[]> {
      try {
        if (!API.isMockMode) {
          const res = await apiClient.get('/tasks', { params: { projectId } });
          return res.data;
        }
      } catch { }

      const tasks = mockDB.getTasks();
      if (projectId) {
        return tasks.filter(t => t.projectId === projectId);
      }
      return tasks;
    },

    async create(t: Partial<Task>): Promise<Task> {
      try {
        if (!API.isMockMode) {
          const res = await apiClient.post('/tasks', t);
          return res.data;
        }
      } catch { }

      const tasks = mockDB.getTasks();
      const cachedUser = localStorage.getItem('stackpilot_user');
      const u = cachedUser ? JSON.parse(cachedUser) : { _id: 'u-1', name: 'Super Admin' };
      const nextNum = 100 + tasks.length + 1;
      const taskIdStr = t.taskId || `SP-${nextNum}`;

      // Resolve sprint name if sprintId provided
      let sprintNameStr = t.sprintName;
      if (t.sprintId) {
        const spr = mockDB.getSprints().find(s => s._id === t.sprintId);
        if (spr) sprintNameStr = spr.name;
      }

      const statusVal = t.status || (t.sprintId ? 'Todo' : 'Backlog');
      const estTime = t.estimatedTime !== undefined ? t.estimatedTime : 4;
      const logTime = t.loggedTime || 0;

      const newTask: Task = {
        _id: `t-${Date.now()}`,
        taskId: taskIdStr,
        projectId: t.projectId || 'p-1',
        projectName: t.projectName || 'StackPilot SaaS',
        sprintId: t.sprintId,
        sprintName: sprintNameStr,
        sprint: sprintNameStr,
        title: t.title || 'New Task',
        description: t.description || '',
        status: statusVal,
        priority: t.priority || 'Medium',
        assigneeId: t.assigneeId || u._id,
        assigneeName: t.assigneeName || u.name,
        reporterId: t.reporterId || u._id,
        reporterName: t.reporterName || u.name,
        dueDate: t.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        storyPoints: t.storyPoints || 3,
        estimatedTime: estTime,
        loggedTime: logTime,
        remainingTime: Math.max(0, estTime - logTime),
        labels: t.labels || [],
        checklist: t.checklist || [],
        comments: t.comments || [],
        attachments: t.attachments || [],
        activity: [
          {
            id: `act-${Date.now()}`,
            type: 'created',
            user: u.name,
            text: `Created task ${taskIdStr}`,
            timestamp: new Date().toISOString()
          }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      tasks.push(newTask);
      mockDB.saveTasks(tasks);

      // Log system activity
      const acts = mockDB.getActivities();
      acts.unshift({
        _id: `act-${Date.now()}`,
        userId: u._id,
        userName: u.name,
        userRole: u.role || 'Super Admin',
        action: 'Create Task',
        details: `Created task "${newTask.title}" (${newTask.taskId}) in ${newTask.status}`,
        createdAt: new Date().toISOString()
      });
      mockDB.saveActivities(acts);

      return newTask;
    },

    async update(id: string, updates: Partial<Task>): Promise<Task> {
      try {
        if (!API.isMockMode) {
          const res = await apiClient.put(`/tasks/${id}`, updates);
          return res.data;
        }
      } catch { }

      const tasks = mockDB.getTasks();
      const idx = tasks.findIndex(t => t._id === id);
      if (idx === -1) throw new Error('Task not found');

      const oldTask = tasks[idx];
      const cachedUser = localStorage.getItem('stackpilot_user');
      const u = cachedUser ? JSON.parse(cachedUser) : { _id: 'u-1', name: 'Super Admin', role: 'Super Admin' };

      // Build activity timeline log
      const newActivity = [...(oldTask.activity || [])];

      if (updates.status && updates.status !== oldTask.status) {
        newActivity.unshift({
          id: `act-${Date.now()}-status`,
          type: 'status_changed',
          user: u.name,
          text: `Status changed from ${oldTask.status} to ${updates.status}`,
          timestamp: new Date().toISOString()
        });

        // Also add system log
        const acts = mockDB.getActivities();
        acts.unshift({
          _id: `act-${Date.now()}`,
          userId: u._id,
          userName: u.name,
          userRole: u.role,
          action: 'Move Task',
          details: `Moved task "${oldTask.title}" (${oldTask.taskId || oldTask._id}) from ${oldTask.status} to ${updates.status}`,
          createdAt: new Date().toISOString()
        });
        mockDB.saveActivities(acts);
      }

      if (updates.sprintId !== undefined && updates.sprintId !== oldTask.sprintId) {
        const sprints = mockDB.getSprints();
        const spr = sprints.find(s => s._id === updates.sprintId);
        const sprName = spr ? spr.name : (updates.sprintId ? 'Assigned Sprint' : 'Backlog');
        updates.sprintName = sprName;
        updates.sprint = sprName;

        newActivity.unshift({
          id: `act-${Date.now()}-sprint`,
          type: 'sprint_changed',
          user: u.name,
          text: `Moved to ${sprName}`,
          timestamp: new Date().toISOString()
        });
      }

      if (updates.assigneeId && updates.assigneeId !== oldTask.assigneeId) {
        const users = mockDB.getUsers();
        const assigneeUser = users.find(usr => usr._id === updates.assigneeId);
        const assigneeNameStr = assigneeUser ? assigneeUser.name : updates.assigneeName || updates.assigneeId;
        newActivity.unshift({
          id: `act-${Date.now()}-assignee`,
          type: 'assignee_changed',
          user: u.name,
          text: `Assignee changed to ${assigneeNameStr}`,
          timestamp: new Date().toISOString()
        });
        updates.assigneeName = assigneeNameStr;
      }

      if (updates.priority && updates.priority !== oldTask.priority) {
        newActivity.unshift({
          id: `act-${Date.now()}-priority`,
          type: 'priority_changed',
          user: u.name,
          text: `Priority changed from ${oldTask.priority} to ${updates.priority}`,
          timestamp: new Date().toISOString()
        });
      }

      if (updates.attachments && updates.attachments.length > (oldTask.attachments?.length || 0)) {
        const latestAtt = updates.attachments[updates.attachments.length - 1];
        newActivity.unshift({
          id: `act-${Date.now()}-att`,
          type: 'attachment_added',
          user: u.name,
          text: `Attached file "${latestAtt.name}"`,
          timestamp: new Date().toISOString()
        });
      }

      if (updates.checklist && updates.checklist.length !== (oldTask.checklist?.length || 0)) {
        newActivity.unshift({
          id: `act-${Date.now()}-check`,
          type: 'checklist_updated',
          user: u.name,
          text: `Updated checklist items`,
          timestamp: new Date().toISOString()
        });
      }

      if (updates.comments && updates.comments.length > (oldTask.comments?.length || 0)) {
        newActivity.unshift({
          id: `act-${Date.now()}-comment`,
          type: 'comment_added',
          user: u.name,
          text: `Added a new comment`,
          timestamp: new Date().toISOString()
        });
      }

      const est = updates.estimatedTime !== undefined ? updates.estimatedTime : (oldTask.estimatedTime || 0);
      const logTime = updates.loggedTime !== undefined ? updates.loggedTime : (oldTask.loggedTime || 0);
      updates.remainingTime = Math.max(0, est - logTime);

      if (updates.loggedTime !== undefined && updates.loggedTime !== oldTask.loggedTime) {
        newActivity.unshift({
          id: `act-${Date.now()}-time`,
          type: 'time_logged',
          user: u.name,
          text: `Logged time updated to ${logTime}h`,
          timestamp: new Date().toISOString()
        });
      }

      const updated: Task = {
        ...oldTask,
        ...updates,
        activity: newActivity,
        updatedAt: new Date().toISOString()
      };

      tasks[idx] = updated;
      mockDB.saveTasks(tasks);

      return updated;
    },

    async delete(id: string): Promise<void> {
      try {
        if (!API.isMockMode) {
          await apiClient.delete(`/tasks/${id}`);
        }
      } catch { }
      const list = mockDB.getTasks().filter(t => t._id !== id);
      mockDB.saveTasks(list);
      await API.adminDelete('Tasks', id);
    }
  },

  crm: {
    async listLeads(): Promise<Client[]> {
      try {
        if (!API.isMockMode) {
          const res = await apiClient.get('/crm/leads');
          return res.data;
        }
      } catch { }
      return mockDB.getLeads();
    },

    async createLead(l: Partial<Client>): Promise<Client> {
      try {
        if (!API.isMockMode) {
          const res = await apiClient.post('/crm/leads', l);
          return res.data;
        }
      } catch { }

      const leads = mockDB.getLeads();
      const newLead: Client = {
        _id: `l-${Date.now()}`,
        name: l.name || 'New Lead',
        email: l.email || '',
        companyName: l.companyName || '',
        phone: l.phone || '',
        status: l.status || 'Lead',
        value: l.value || 0,
        tags: l.tags || [],
        notes: l.notes || '',
        createdAt: new Date().toISOString()
      };

      leads.push(newLead);
      mockDB.saveLeads(leads);
      return newLead;
    },

    async updateLead(id: string, updates: Partial<Client>): Promise<Client> {
      const leads = mockDB.getLeads();
      const idx = leads.findIndex(l => l._id === id);
      if (idx === -1) throw new Error('Lead not found');
      const oldStatus = leads[idx].status;
      const updated = { ...leads[idx], ...updates };
      leads[idx] = updated;
      mockDB.saveLeads(leads);

      if (updates.status && updates.status !== oldStatus) {
        const cachedUser = localStorage.getItem('stackpilot_user');
        const u = cachedUser ? JSON.parse(cachedUser) : { _id: 'u-1', name: 'Super Admin', role: 'Super Admin' };
        const actionLabel = updates.status === 'Archived' ? 'Archive Client' : oldStatus === 'Archived' ? 'Restore Client' : 'Update Client Status';
        
        const acts = mockDB.getActivities();
        acts.unshift({
          _id: `act-${Date.now()}`,
          userId: u._id,
          userName: u.name,
          userRole: u.role,
          action: actionLabel,
          details: `Client "${updated.companyName || updated.name}" status updated from ${oldStatus} to ${updated.status}`,
          createdAt: new Date().toISOString()
        });
        mockDB.saveActivities(acts);
      }

      return updated;
    },

    async deleteLead(id: string): Promise<void> {
      const leads = mockDB.getLeads();
      const target = leads.find(l => l._id === id);
      const list = leads.filter(l => l._id !== id);
      mockDB.saveLeads(list);
      await API.adminDelete('Clients', target ? `${target.companyName || target.name} (${id})` : id);
    }
  },

  finance: {
    async listInvoices(): Promise<Invoice[]> {
      try {
        if (!API.isMockMode) {
          const res = await apiClient.get('/finance/invoices');
          return res.data;
        }
      } catch { }
      return mockDB.getInvoices();
    },

    async createInvoice(inv: Partial<Invoice>): Promise<Invoice> {
      try {
        if (!API.isMockMode) {
          const res = await apiClient.post('/finance/invoices', inv);
          return res.data;
        }
      } catch { }

      const invoices = mockDB.getInvoices();
      const items = inv.items || [];
      const subtotal = items.reduce((acc, it) => acc + (it.rate * it.quantity), 0);
      const taxRate = inv.taxRate || 0;
      const taxAmount = subtotal * (taxRate / 100);
      const discount = inv.discount || 0;
      const total = subtotal + taxAmount - discount;

      const newInv: Invoice = {
        _id: `i-${Date.now()}`,
        invoiceNumber: inv.invoiceNumber || `INV-2026-${Math.floor(100 + Math.random() * 900)}`,
        clientId: inv.clientId || 'l-2',
        clientName: inv.clientName || 'Mock Client',
        clientEmail: inv.clientEmail || 'client@example.com',
        projectId: inv.projectId,
        projectName: inv.projectName,
        issueDate: inv.issueDate || new Date().toISOString().split('T')[0],
        dueDate: inv.dueDate || new Date().toISOString().split('T')[0],
        items: items.map(it => ({ ...it, amount: it.rate * it.quantity })),
        subtotal,
        taxRate,
        taxAmount,
        discount,
        total,
        status: inv.status || 'Sent',
        createdAt: new Date().toISOString()
      };

      invoices.push(newInv);
      mockDB.saveInvoices(invoices);
      return newInv;
    },

    async markAsPaid(id: string): Promise<Invoice> {
      const invoices = mockDB.getInvoices();
      const idx = invoices.findIndex(i => i._id === id);
      if (idx === -1) throw new Error('Invoice not found');
      invoices[idx].status = 'Paid';
      mockDB.saveInvoices(invoices);
      return invoices[idx];
    },

    async deleteInvoice(id: string): Promise<void> {
      const list = mockDB.getInvoices().filter(i => i._id !== id);
      mockDB.saveInvoices(list);
      await API.adminDelete('Invoices', id);
    }
  },

  seo: {
    async getReport(): Promise<SEOReport[]> {
      try {
        if (!API.isMockMode) {
          const res = await apiClient.get('/seo/reports');
          return res.data;
        }
      } catch { }
      return mockDB.getSEOs();
    },

    async updateChecklist(reportId: string, checkId: string, done: boolean): Promise<SEOReport> {
      const reports = mockDB.getSEOs();
      const report = reports.find(r => r._id === reportId);
      if (!report) throw new Error('Report not found');
      const check = report.checklist.find(c => c.id === checkId);
      if (check) check.done = done;
      mockDB.saveSEOs(reports);
      return report;
    },

    async deleteReport(reportId: string): Promise<void> {
      const reports = mockDB.getSEOs().filter(r => r._id !== reportId);
      mockDB.saveSEOs(reports);
      await API.adminDelete('Reports', reportId);
    }
  },

  calendar: {
    async deleteEvent(eventId: string): Promise<void> {
      await API.adminDelete('Calendar', eventId);
    }
  },

  docs: {
    async list(): Promise<Document[]> {
      return mockDB.getDocs();
    },

    async create(doc: Partial<Document>): Promise<Document> {
      const docs = mockDB.getDocs();
      const cached = localStorage.getItem('stackpilot_user');
      const u = cached ? JSON.parse(cached) : { _id: 'u-1' };

      const newDoc: Document = {
        _id: `d-${Date.now()}`,
        title: doc.title || 'Untitled Document',
        content: doc.content || '',
        type: doc.type || 'Technical',
        projectId: doc.projectId,
        createdBy: u._id,
        version: 1,
        history: [{ version: 1, updatedBy: u.name || 'Author', updatedAt: new Date().toISOString(), changeLog: 'Created Document' }],
        createdAt: new Date().toISOString()
      };

      docs.push(newDoc);
      mockDB.saveDocs(docs);
      return newDoc;
    },

    async deleteDoc(id: string): Promise<void> {
      const list = mockDB.getDocs().filter(d => d._id !== id);
      mockDB.saveDocs(list);
      await API.adminDelete('Documents', id);
    }
  },

  notifications: {
    async list(): Promise<Notification[]> {
      return mockDB.getNotifications();
    },
    async markRead(id: string): Promise<void> {
      const list = mockDB.getNotifications();
      const item = list.find(n => n._id === id);
      if (item) {
        item.read = true;
        mockDB.saveNotifications(list);
      }
    },
    async markAsRead(id: string): Promise<void> {
      return this.markRead(id);
    },
    async markAllRead(): Promise<void> {
      const list = mockDB.getNotifications();
      list.forEach(n => { n.read = true; });
      mockDB.saveNotifications(list);
    },
    async archive(id: string): Promise<void> {
      const list = mockDB.getNotifications();
      const item = list.find(n => n._id === id);
      if (item) {
        item.archived = true;
        mockDB.saveNotifications(list);
      }
    }
  },

  logs: {
    async list(): Promise<ActivityLog[]> {
      return mockDB.getActivities();
    }
  },

  enquiries: {
    async create(data: Omit<Enquiry, '_id' | 'status' | 'createdAt'>): Promise<Enquiry> {
      const enquiries = mockDB.getEnquiries();
      const newEnquiry: Enquiry = {
        _id: `enq-${Date.now()}`,
        ...data,
        status: 'New',
        createdAt: new Date().toISOString()
      };
      enquiries.push(newEnquiry);
      mockDB.saveEnquiries(enquiries);

      // Log activity
      const activities = mockDB.getActivities();
      activities.unshift({
        _id: `act-${Date.now()}`,
        userId: 'u-system',
        userName: data.name,
        userRole: 'Client',
        action: 'New Lead Enquiry Submitted',
        details: `Enquiry from ${data.email} (${data.companyName}) sent to creovixstack@gmail.com`,
        createdAt: new Date().toISOString()
      });
      mockDB.saveActivities(activities);

      return newEnquiry;
    },
    async list(): Promise<Enquiry[]> {
      return mockDB.getEnquiries();
    },
    async delete(id: string): Promise<void> {
      const list = mockDB.getEnquiries().filter(e => e._id !== id);
      mockDB.saveEnquiries(list);
    }
  },

  presentationRequests: {
    async create(data: Omit<PresentationRequest, '_id' | 'status' | 'createdAt'>): Promise<PresentationRequest> {
      try {
        if (!API.isMockMode) {
          const res = await apiClient.post('/presentation-requests', data);
          return res.data.data || res.data;
        }
      } catch (err) {
        console.warn('Backend presentation-requests API call failed. Falling back to Mock DB...', err);
      }

      const requests = mockDB.getPresentationRequests();
      const newReq: PresentationRequest = {
        _id: `pr-${Date.now()}`,
        ...data,
        status: 'Pending',
        createdAt: new Date().toISOString()
      };
      requests.push(newReq);
      mockDB.savePresentationRequests(requests);

      // Log activity
      const activities = mockDB.getActivities();
      activities.unshift({
        _id: `act-${Date.now()}`,
        userId: 'u-system',
        userName: data.name,
        userRole: 'Client',
        action: 'Product Deck Downloaded',
        details: `PPT presentation downloaded by ${data.name} (${data.email}, ${data.companyName || 'Lead'})`,
        createdAt: new Date().toISOString()
      });
      mockDB.saveActivities(activities);

      // Automatically register captured lead in CRM leads
      try {
        const leads = mockDB.getLeads();
        const existing = leads.find(l => l.email.toLowerCase() === data.email.toLowerCase());
        if (!existing) {
          leads.unshift({
            _id: `l-${Date.now()}`,
            name: data.name,
            companyName: data.companyName || 'Prospect Org',
            email: data.email,
            phone: data.phone || '',
            status: 'Lead',
            value: 0,
            tags: ['Presentation Lead'],
            notes: 'Downloaded Product Presentation Deck (PPT) via Landing Page',
            createdAt: new Date().toISOString()
          });
          mockDB.saveLeads(leads);
        }
      } catch (leadSyncErr) {
        console.warn('Could not sync presentation lead to CRM mock DB:', leadSyncErr);
      }

      return newReq;
    },
    async list(): Promise<PresentationRequest[]> {
      return mockDB.getPresentationRequests();
    },
    async delete(id: string): Promise<void> {
      const list = mockDB.getPresentationRequests().filter(r => r._id !== id);
      mockDB.savePresentationRequests(list);
    }
  },

  approvals: {
    async list(): Promise<ApprovalRequest[]> {
      return mockDB.getApprovals();
    },
    async create(data: Omit<ApprovalRequest, '_id' | 'status' | 'submittedAt'>): Promise<ApprovalRequest> {
      const items = mockDB.getApprovals();
      const newItem: ApprovalRequest = {
        _id: `app-${Date.now()}`,
        ...data,
        status: 'Pending',
        submittedAt: new Date().toISOString()
      };
      items.unshift(newItem);
      mockDB.saveApprovals(items);
      return newItem;
    },
    async updateStatus(id: string, status: 'Approved' | 'Rejected', comments?: string): Promise<ApprovalRequest> {
      const items = mockDB.getApprovals();
      const idx = items.findIndex(a => a._id === id);
      if (idx !== -1) {
        items[idx].status = status;
        items[idx].reviewedAt = new Date().toISOString();
        if (comments) items[idx].comments = comments;
        mockDB.saveApprovals(items);
        return items[idx];
      }
      throw new Error('Approval request not found');
    }
  },

  workflows: {
    async list(): Promise<WorkflowRule[]> {
      return mockDB.getWorkflows();
    },
    async create(data: Omit<WorkflowRule, '_id' | 'executionCount' | 'createdAt'>): Promise<WorkflowRule> {
      const items = mockDB.getWorkflows();
      const newItem: WorkflowRule = {
        _id: `wf-${Date.now()}`,
        ...data,
        executionCount: 0,
        createdAt: new Date().toISOString()
      };
      items.unshift(newItem);
      mockDB.saveWorkflows(items);
      return newItem;
    },
    async toggle(id: string): Promise<WorkflowRule> {
      const items = mockDB.getWorkflows();
      const idx = items.findIndex(w => w._id === id);
      if (idx !== -1) {
        items[idx].status = items[idx].status === 'Active' ? 'Disabled' : 'Active';
        mockDB.saveWorkflows(items);
        return items[idx];
      }
      throw new Error('Workflow rule not found');
    }
  },

  contracts: {
    async list(): Promise<Contract[]> {
      return mockDB.getContracts();
    },
    async create(data: Omit<Contract, '_id' | 'createdAt'>): Promise<Contract> {
      const items = mockDB.getContracts();
      const newItem: Contract = {
        _id: `ctr-${Date.now()}`,
        ...data,
        createdAt: new Date().toISOString()
      };
      items.unshift(newItem);
      mockDB.saveContracts(items);
      return newItem;
    }
  },

  timesheets: {
    async list(): Promise<TimesheetEntry[]> {
      return mockDB.getTimesheets();
    },
    async create(data: Omit<TimesheetEntry, '_id' | 'status' | 'createdAt'>): Promise<TimesheetEntry> {
      const items = mockDB.getTimesheets();
      const newItem: TimesheetEntry = {
        _id: `ts-${Date.now()}`,
        ...data,
        status: 'Submitted',
        createdAt: new Date().toISOString()
      };
      items.unshift(newItem);
      mockDB.saveTimesheets(items);
      return newItem;
    },
    async updateStatus(id: string, status: 'Approved' | 'Rejected'): Promise<TimesheetEntry> {
      const items = mockDB.getTimesheets();
      const idx = items.findIndex(t => t._id === id);
      if (idx !== -1) {
        items[idx].status = status;
        mockDB.saveTimesheets(items);
        return items[idx];
      }
      throw new Error('Timesheet entry not found');
    }
  },



  auditLogs: {
    async list(): Promise<ActivityLog[]> {
      return mockDB.getActivities();
    },
    async create(log: Omit<ActivityLog, '_id' | 'createdAt'>): Promise<ActivityLog> {
      const list = mockDB.getActivities();
      const newLog: ActivityLog = {
        _id: `aud-${Date.now()}`,
        ...log,
        createdAt: new Date().toISOString()
      };
      list.unshift(newLog);
      mockDB.saveActivities(list);
      return newLog;
    }
  },

  organization: {
    async get(): Promise<Organization> {
      return mockDB.getOrganization();
    },
    async update(updates: Partial<Organization>): Promise<Organization> {
      const current = mockDB.getOrganization();
      const updated = { ...current, ...updates };
      mockDB.saveOrganization(updated);
      return updated;
    }
  },

  systemHealth: {
    async get(): Promise<SystemHealth> {
      return mockDB.getSystemHealth();
    }
  },

  adminDelete: async (module: string, recordId: string, performerName = 'Super Admin'): Promise<void> => {
    const activities = mockDB.getActivities();
    activities.unshift({
      _id: `act-${Date.now()}`,
      userId: 'u-1',
      userName: performerName,
      userRole: 'Super Admin',
      action: `Permanent Delete: ${module}`,
      details: `Record ID ${recordId} was permanently deleted from module ${module}.`,
      createdAt: new Date().toISOString()
    });
    mockDB.saveActivities(activities);
  },

  ai: {
    async generate(tool: string, prompt: string): Promise<string> {
      try {
        if (!API.isMockMode) {
          const res = await apiClient.post(`/ai/${tool}`, { prompt });
          return res.data.content;
        }
      } catch { }

      // Fallback AI simulation
      await new Promise(r => setTimeout(r, 1200));

      if (tool === 'requirements') {
        return `# Requirement Suite for: ${prompt}
        
## 1. System Scope
System coordinates business analytics, AI generation utilities, and team scheduling.

## 2. Business Flow
1. Users register and input their business requirements.
2. The AI module outputs structured documentation drafts.
3. Teams manage tasks through Sprint-linked Kanban boards.

## 3. Key Modules
- **CRM Portal**: Client lists, communications log, deal pipeline cards.
- **Invoice Portal**: Invoices auto-compiled based on milestones achieved.
`;
      } else if (tool === 'testcases') {
        return `# Automated QA Verification Plan: ${prompt}

| Case ID | Feature Scope | Action | Precondition | Expected Results |
| :--- | :--- | :--- | :--- | :--- |
| **QA-201** | Core API Auth | Input valid tokens in request header | User is authenticated | HTTP 200 OK with requested JSON data. |
| **QA-202** | Form validation | Click save with missing target fields | Viewport open | Highlight invalid boundaries in primary red. |
| **QA-203** | SEO Report Sync | Click sync search analytics console | GBP connected | Performance graphs render impressions. |
`;
      } else {
        return `# Bug Report: Exception in ${prompt}

**Bug Key**: BUG-SP-404
**Severity**: High
**Component**: Core Interface Router

### Description
A routing mismatch occurs when loading deep child nested routes in production static bundles.

### Stack Trace
\`\`\`js
Error: Minified React error #185; visit https://reactjs.org/docs/error-decoder.html?invariant=185
    at unstable_runWithPriority (react-dom.production.min.js:274)
    at Scheduler_runWithPriority (react.production.min.js:22)
\`\`\`

### Patch Proposal
Wrap navigation hooks in React.startTransition closures to allow background hydration:
\`\`\`ts
React.startTransition(() => {
  navigate(routePath);
});
\`\`\`
`;
      }
    }
  }
};
export default API;
