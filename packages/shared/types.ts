export type UserRole =
  | 'Super Admin'
  | 'Admin'
  | 'Project Manager'
  | 'Business Analyst'
  | 'Developer'
  | 'Tester'
  | 'SEO Executive'
  | 'Finance'
  | 'Client';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  department?: string;
  designation?: string;
  phone?: string;
  joiningDate?: string;
  status?: 'Active' | 'Inactive';
  skills?: string[];
  experience?: string;
  availability?: 'Available' | 'Busy' | 'On Leave';
  twoFAEnabled: boolean;
  createdAt: string;
}

export interface Client {
  _id: string;
  name: string;
  email: string;
  companyId?: string;
  companyName?: string;
  phone?: string;
  status: 'Lead' | 'Active' | 'Inactive' | 'Archived';
  value?: number;
  tags?: string[];
  notes?: string;
  createdAt: string;
}

export interface Company {
  _id: string;
  name: string;
  domain?: string;
  industry?: string;
  size?: string;
  address?: string;
  createdAt: string;
}

export interface Project {
  _id: string;
  name: string;
  description: string;
  status: 'Planning' | 'Active' | 'On Hold' | 'Completed';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  budget: number;
  spent: number;
  startDate: string;
  endDate: string;
  team: { userId: string; role: string }[];
  health: 'Healthy' | 'At Risk' | 'Critical';
  client?: string;
  createdAt: string;
}

export type SprintStatus = 'Planning' | 'Active' | 'Completed' | 'Archived';

export interface Sprint {
  _id: string;
  id?: string;
  projectId: string;
  projectName?: string;
  name: string;
  goal: string;
  description?: string;
  startDate: string;
  endDate: string;
  status: SprintStatus;
  capacity: number;
  storyPoints?: number;
  velocity?: number;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SprintReport {
  sprintId: string;
  sprintName: string;
  projectName: string;
  totalTasks: number;
  completedTasks: number;
  carryForwardTasks: number;
  blockedTasks: number;
  totalStoryPoints: number;
  completedStoryPoints: number;
  velocity: number;
  capacity: number;
  burndown: { day: string; remainingPoints: number; idealPoints: number }[];
  burnup: { day: string; completedPoints: number; totalPoints: number }[];
  teamPerformance: { name: string; avatar?: string; assigned: number; completed: number; points: number }[];
}

export interface Release {
  _id: string;
  projectId: string;
  projectName?: string;
  version: string;
  sprintId?: string;
  sprintName?: string;
  releaseNotes: string;
  releaseDate: string;
  status: 'Planned' | 'In Progress' | 'Deployed' | 'Rolled Back';
  createdAt: string;
  updatedAt?: string;
}

export interface TaskActivity {
  id: string;
  type: 'created' | 'status_changed' | 'assignee_changed' | 'priority_changed' | 'attachment_added' | 'checklist_updated' | 'comment_added' | 'time_logged' | 'sprint_changed';
  user: string;
  userAvatar?: string;
  text: string;
  timestamp: string;
}

export interface TaskAttachment {
  id: string;
  name: string;
  url: string;
  size: string;
  type?: 'image' | 'pdf' | 'docx' | 'excel' | 'zip' | 'other';
  createdAt: string;
}

export interface TaskChecklistItem {
  id: string;
  text: string;
  done: boolean;
}

export interface TaskComment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  text: string;
  createdAt: string;
  attachments?: TaskAttachment[];
}

export type TaskStatus = 'Backlog' | 'Todo' | 'In Progress' | 'In Review' | 'Done' | 'Blocked' | 'Cancelled';
export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Critical';

export interface Task {
  _id: string;
  taskId?: string; // e.g. "SP-101"
  projectId: string;
  projectName?: string;
  sprintId?: string;
  sprintName?: string;
  sprint?: string; // legacy support
  epicId?: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId?: string;
  assigneeName?: string;
  assigneeAvatar?: string;
  reporterId?: string;
  reporterName?: string;
  reporterAvatar?: string;
  dueDate?: string;
  storyPoints?: number;
  estimatedTime?: number; // Estimated hours
  loggedTime?: number; // Logged hours
  remainingTime?: number; // Logged vs Estimated hours
  labels?: string[];
  checklist?: TaskChecklistItem[];
  comments?: TaskComment[];
  attachments?: TaskAttachment[];
  activity?: TaskActivity[];
  createdAt: string;
  updatedAt?: string;
}

export interface Meeting {
  _id: string;
  title: string;
  projectId?: string;
  date: string;
  duration: number; // in minutes
  attendees: string[]; // user IDs or emails
  agenda?: string;
  notes?: string;
  type: 'Video' | 'Call' | 'In-Person';
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  createdAt: string;
}

export interface Document {
  _id: string;
  title: string;
  content: string;
  type: 'SRS' | 'PRD' | 'FSD' | 'Technical' | 'Meeting Notes' | 'Knowledge Base' | 'FAQ' | 'Contract' | 'Policy' | 'SOP' | 'Other';
  category?: 'Project Documents' | 'Contracts' | 'SRS' | 'PRD' | 'Meeting Notes' | 'Policies' | 'Knowledge Base' | 'SOPs' | 'Client Documents' | 'HR Documents';
  projectId?: string;
  projectName?: string;
  createdBy: string;
  authorName?: string;
  version: number;
  tags?: string[];
  history?: { version: number; updatedBy: string; updatedAt: string; changeLog: string }[];
  createdAt: string;
  updatedAt?: string;
}

export interface Requirement {
  _id: string;
  projectId: string;
  title: string;
  description: string;
  type: 'Business' | 'Functional' | 'Non-Functional';
  status: 'Draft' | 'Approved' | 'Rejected' | 'Implemented';
  acceptanceCriteria?: string[];
  dependencies?: string[];
  version: number;
  createdAt: string;
}

export interface UserStory {
  _id: string;
  requirementId?: string;
  projectId: string;
  title: string;
  asA: string;
  iWantTo: string;
  soThat: string;
  acceptanceCriteria: string[];
  points: number;
  status: 'Todo' | 'In Progress' | 'Ready for Test' | 'Done';
  createdAt: string;
}

export interface Invoice {
  _id: string;
  invoiceNumber: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  projectId?: string;
  projectName?: string;
  issueDate: string;
  dueDate: string;
  items: { description: string; quantity: number; rate: number; amount: number }[];
  subtotal: number;
  taxRate: number; // percentage
  taxAmount: number;
  discount: number; // absolute amount
  total: number;
  status: 'Draft' | 'Sent' | 'Paid' | 'Overdue' | 'Cancelled';
  createdAt: string;
}

export interface Payment {
  _id: string;
  invoiceId: string;
  amount: number;
  paymentMethod: 'Stripe' | 'Bank Transfer' | 'PayPal' | 'Credit Card';
  transactionId?: string;
  paymentDate: string;
  status: 'Success' | 'Failed' | 'Pending';
  createdAt: string;
}

export interface Notification {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  category?: 'Task' | 'Sprint' | 'Invoice' | 'Leave' | 'Approval' | 'Client' | 'Meeting' | 'AI';
  read: boolean;
  archived?: boolean;
  actionUrl?: string;
  createdAt: string;
}

export interface BlogPost {
  _id: string;
  title: string;
  content: string;
  status: 'Draft' | 'Published' | 'Scheduled';
  keywords?: string[];
  publishDate?: string;
  authorId: string;
  createdAt: string;
}

export interface Keyword {
  _id: string;
  keyword: string;
  position: number;
  volume: number;
  difficulty: number;
  history?: { date: string; position: number }[];
  createdAt: string;
}

export interface SEOReport {
  _id: string;
  date: string;
  clicks: number;
  impressions: number;
  ctr: number;
  avgPosition: number;
  healthScore: number; // 0-100
  checklist: { id: string; task: string; done: boolean }[];
  competitors?: { name: string; visibility: number; rank: number }[];
  createdAt: string;
}

export interface ActivityLog {
  _id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  details?: string;
  entity?: string;
  ipAddress?: string;
  browser?: string;
  oldValue?: string;
  newValue?: string;
  createdAt: string;
}

export interface Enquiry {
  _id: string;
  name: string;
  companyName: string;
  email: string;
  phone: string;
  businessType: string;
  employees: string;
  message?: string;
  status: 'New' | 'Contacted' | 'Closed';
  createdAt: string;
}

export interface PresentationRequest {
  _id: string;
  name: string;
  companyName: string;
  email: string;
  phone: string;
  status: 'Pending' | 'Sent';
  createdAt: string;
}

/* ==========================================================================
   STACKPILOT AI v1.1 ENTERPRISE BUSINESS OPERATING SYSTEM NEW ENTITIES
   ========================================================================== */

export type ApprovalType = 
  | 'Leave Approval'
  | 'Expense Approval'
  | 'Invoice Approval'
  | 'Purchase Approval'
  | 'Quotation Approval'
  | 'Timesheet Approval'
  | 'Document Approval'
  | 'Project Approval';

export type ApprovalStatus = 'Pending' | 'Approved' | 'Rejected' | 'Cancelled';

export interface ApprovalRequest {
  _id: string;
  type: ApprovalType;
  title: string;
  description: string;
  requestedBy: string;
  requestedByName: string;
  requestedByAvatar?: string;
  approverId: string;
  approverName: string;
  amount?: number;
  status: ApprovalStatus;
  comments?: string;
  submittedAt: string;
  reviewedAt?: string;
}

export interface WorkflowRule {
  _id: string;
  name: string;
  trigger: 'Task Completed' | 'Sprint Started' | 'Invoice Created' | 'Client Onboarded' | 'Approval Granted';
  condition: string;
  action: 'Notify Manager' | 'Generate Invoice' | 'Send Email' | 'Create Follow-up Task' | 'Export Audit Log';
  status: 'Active' | 'Disabled';
  executionCount: number;
  lastExecuted?: string;
  createdAt: string;
}

export interface Contract {
  _id: string;
  contractNumber: string;
  title: string;
  clientId: string;
  clientName: string;
  value: number;
  startDate: string;
  endDate: string;
  status: 'Draft' | 'Active' | 'Expired' | 'Terminated';
  documentUrl?: string;
  createdAt: string;
}

export interface TimesheetEntry {
  _id: string;
  userId: string;
  userName: string;
  projectId: string;
  projectName: string;
  taskId?: string;
  date: string;
  hours: number;
  billable: boolean;
  description: string;
  status: 'Submitted' | 'Approved' | 'Rejected';
  createdAt: string;
}

export interface Organization {
  _id: string;
  name: string;
  code: string;
  domain: string;
  plan: 'Startup' | 'Growth' | 'Enterprise';
  departments: { id: string; name: string; manager: string; memberCount: number }[];
  status: 'Active' | 'Trial' | 'Suspended';
  createdAt: string;
}

export interface SystemHealth {
  serverStatus: 'Operational' | 'Degraded' | 'Maintenance';
  apiLatencyMs: number;
  dbStatus: 'Healthy' | 'Busy';
  storageUsedGb: number;
  storageMaxGb: number;
  emailQueueCount: number;
  activeSessions: number;
  aiTokenCountToday: number;
  licenseDaysRemaining: number;
}
