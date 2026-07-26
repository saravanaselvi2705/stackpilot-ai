import { Schema, model } from 'mongoose';

// User Schema
const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['Super Admin', 'Admin', 'Project Manager', 'Business Analyst', 'Developer', 'QA/Tester', 'SEO Executive', 'Finance', 'Client'],
    default: 'Developer'
  },
  customPermissions: [{ type: String }],
  avatarUrl: { type: String },
  department: { type: String, default: 'General' },
  skills: [{ type: String }],
  experience: { type: String },
  availability: {
    type: String,
    enum: ['Available', 'Busy', 'On Leave'],
    default: 'Available'
  },
  workload: { type: Number, default: 0 }, // Hours assigned per week
  capacity: { type: Number, default: 40 }, // Total available hours per week
  leaveStatus: { type: String, enum: ['Active', 'On Leave', 'Vacation'], default: 'Active' },
  onlineStatus: { type: String, enum: ['Online', 'Offline', 'Away'], default: 'Offline' },

  twoFAEnabled: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  mustChangePassword: { type: Boolean, default: false },
  lastLogin: { type: Date },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  passwordResetToken: { type: String, default: null },
  passwordResetExpires: { type: Date, default: null },
  invited: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date, default: null },
}, { timestamps: true });

UserSchema.index({ role: 1 });
UserSchema.index({ isActive: 1 });
UserSchema.index({ department: 1 });
UserSchema.index({ isDeleted: 1 });

// Role Schema
const RoleSchema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  permissions: [{ type: String }]
}, { timestamps: true });

// Permission Schema
const PermissionSchema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  module: { type: String, required: true }
}, { timestamps: true });

// Company Schema
const CompanySchema = new Schema({
  name: { type: String, required: true },
  domain: { type: String },
  industry: { type: String },
  size: { type: String },
  address: { type: String },
  phone: { type: String },
  email: { type: String },
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date, default: null },
}, { timestamps: true });

CompanySchema.index({ isDeleted: 1 });

// Client Schema
const ClientSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  companyId: { type: Schema.Types.ObjectId, ref: 'Company' },
  companyName: { type: String },
  phone: { type: String },
  status: { type: String, enum: ['Lead', 'Active', 'Inactive'], default: 'Lead' },
  value: { type: Number, default: 0 },
  tags: [{ type: String }],
  notes: { type: String },
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date, default: null },
}, { timestamps: true });

ClientSchema.index({ status: 1 });
ClientSchema.index({ isDeleted: 1 });

// Contact Schema
const ContactSchema = new Schema({
  clientId: { type: Schema.Types.ObjectId, ref: 'Client' },
  companyId: { type: Schema.Types.ObjectId, ref: 'Company' },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  designation: { type: String },
  isPrimary: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

ContactSchema.index({ clientId: 1, isDeleted: 1 });

// Lead Schema
const LeadSchema = new Schema({
  name: { type: String, required: true },
  companyName: { type: String },
  email: { type: String, required: true },
  phone: { type: String },
  status: {
    type: String,
    enum: ['New', 'Qualified', 'Proposal', 'Negotiation', 'Won', 'Lost'],
    default: 'New'
  },
  source: { type: String, default: 'Website' },
  ownerId: { type: Schema.Types.ObjectId, ref: 'User' },
  value: { type: Number, default: 0 },
  notes: { type: String },
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date, default: null },
}, { timestamps: true });

LeadSchema.index({ status: 1, isDeleted: 1 });
LeadSchema.index({ ownerId: 1 });

// Deal Schema
const DealSchema = new Schema({
  title: { type: String, required: true },
  clientId: { type: Schema.Types.ObjectId, ref: 'Client' },
  companyId: { type: Schema.Types.ObjectId, ref: 'Company' },
  leadId: { type: Schema.Types.ObjectId, ref: 'Lead' },
  stage: {
    type: String,
    enum: ['New', 'Qualified', 'Proposal', 'Negotiation', 'Won', 'Lost'],
    default: 'New'
  },
  value: { type: Number, default: 0 },
  probability: { type: Number, default: 50 },
  expectedCloseDate: { type: Date },
  ownerId: { type: Schema.Types.ObjectId, ref: 'User' },
  notes: { type: String },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

DealSchema.index({ stage: 1, isDeleted: 1 });

// Activity Schema (CRM interactions, meetings, calls, notes)
const ActivitySchema = new Schema({
  entityType: { type: String, enum: ['Lead', 'Deal', 'Client', 'Project'], required: true },
  entityId: { type: Schema.Types.ObjectId, required: true },
  type: { type: String, enum: ['Call', 'Meeting', 'Email', 'Note'], required: true },
  title: { type: String, required: true },
  description: { type: String },
  performedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  dueDate: { type: Date },
  status: { type: String, enum: ['Pending', 'Completed'], default: 'Completed' },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

ActivitySchema.index({ entityType: 1, entityId: 1, isDeleted: 1 });

// Project Schema
const ProjectSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ['Planning', 'Active', 'On Hold', 'Completed', 'Cancelled'], default: 'Planning' },
  priority: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium' },
  health: { type: String, enum: ['Healthy', 'At Risk', 'Delayed'], default: 'Healthy' },
  budget: { type: Number, default: 0 },
  expenses: { type: Number, default: 0 },
  revenue: { type: Number, default: 0 },
  startDate: { type: Date },
  endDate: { type: Date },
  clientId: { type: Schema.Types.ObjectId, ref: 'Client' },
  companyId: { type: Schema.Types.ObjectId, ref: 'Company' },
  projectManagerId: { type: Schema.Types.ObjectId, ref: 'User' },
  team: [{
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    role: { type: String }
  }],
  milestones: [{
    title: { type: String, required: true },
    dueDate: { type: Date },
    completed: { type: Boolean, default: false }
  }],
  documents: [{
    name: { type: String, required: true },
    url: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now }
  }],
  client: { type: String },
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date, default: null }
}, { timestamps: true });

ProjectSchema.index({ status: 1, isDeleted: 1 });
ProjectSchema.index({ projectManagerId: 1 });

// Task Schema (Jira-style)
const TaskSchema = new Schema({
  projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  sprintId: { type: Schema.Types.ObjectId, ref: 'Sprint' },
  epicId: { type: Schema.Types.ObjectId, ref: 'Task' },
  parentTaskId: { type: Schema.Types.ObjectId, ref: 'Task' },
  title: { type: String, required: true },
  description: { type: String },
  type: { type: String, enum: ['Epic', 'Story', 'Bug', 'Task'], default: 'Task' },
  status: { type: String, enum: ['Backlog', 'Todo', 'In Progress', 'In Review', 'Done'], default: 'Todo' },
  priority: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium' },
  assigneeId: { type: Schema.Types.ObjectId, ref: 'User' },
  reporterId: { type: Schema.Types.ObjectId, ref: 'User' },
  dueDate: { type: Date },
  labels: [{ type: String }],
  estimatedTime: { type: Number, default: 0 }, // in hours
  loggedTime: { type: Number, default: 0 }, // in hours
  storyPoints: { type: Number, default: 1 },
  checklist: [{
    text: { type: String, required: true },
    done: { type: Boolean, default: false }
  }],
  subtasks: [{
    title: { type: String, required: true },
    completed: { type: Boolean, default: false }
  }],
  comments: [{
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    userName: { type: String, required: true },
    userAvatar: { type: String },
    text: { type: String, required: true },
    mentions: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    createdAt: { type: Date, default: Date.now }
  }],
  attachments: [{
    name: { type: String, required: true },
    url: { type: String, required: true },
    size: { type: String },
    createdAt: { type: Date, default: Date.now }
  }],
  history: [{
    field: { type: String },
    oldValue: { type: String },
    newValue: { type: String },
    updatedBy: { type: String },
    updatedAt: { type: Date, default: Date.now }
  }],
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

TaskSchema.index({ projectId: 1, status: 1, isDeleted: 1 });
TaskSchema.index({ assigneeId: 1, isDeleted: 1 });

// Sprint Schema
const SprintSchema = new Schema({
  projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  name: { type: String, required: true },
  goal: { type: String },
  startDate: { type: Date },
  endDate: { type: Date },
  status: { type: String, enum: ['Future', 'Active', 'Closed'], default: 'Future' },
}, { timestamps: true });

// Meeting Schema
const MeetingSchema = new Schema({
  title: { type: String, required: true },
  projectId: { type: Schema.Types.ObjectId, ref: 'Project' },
  date: { type: Date, required: true },
  duration: { type: Number, default: 30 },
  attendees: [{ type: String }],
  agenda: { type: String },
  notes: { type: String },
  type: { type: String, enum: ['Video', 'Call', 'In-Person'], default: 'Video' },
  status: { type: String, enum: ['Scheduled', 'Completed', 'Cancelled'], default: 'Scheduled' }
}, { timestamps: true });

// Document Schema
const DocumentSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String },
  type: {
    type: String,
    enum: ['SRS', 'BRD', 'FSD', 'Technical', 'Meeting Minutes', 'Knowledge Base', 'FAQ'],
    required: true
  },
  projectId: { type: Schema.Types.ObjectId, ref: 'Project' },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  version: { type: Number, default: 1 },
  history: [{
    version: { type: Number },
    updatedBy: { type: String },
    updatedAt: { type: Date, default: Date.now },
    changeLog: { type: String }
  }]
}, { timestamps: true });

// Requirement Schema
const RequirementSchema = new Schema({
  projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, enum: ['Business', 'Functional', 'Non-Functional'], required: true },
  status: { type: String, enum: ['Draft', 'Approved', 'Rejected', 'Implemented'], default: 'Draft' },
  acceptanceCriteria: [{ type: String }],
  dependencies: [{ type: String }],
  version: { type: Number, default: 1 }
}, { timestamps: true });

// UserStory Schema
const UserStorySchema = new Schema({
  requirementId: { type: Schema.Types.ObjectId, ref: 'Requirement' },
  projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  title: { type: String, required: true },
  asA: { type: String, required: true },
  iWantTo: { type: String, required: true },
  soThat: { type: String, required: true },
  acceptanceCriteria: [{ type: String }],
  points: { type: Number, default: 1 },
  status: { type: String, enum: ['Todo', 'In Progress', 'Ready for Test', 'Done'], default: 'Todo' }
}, { timestamps: true });

// Invoice Schema
const InvoiceSchema = new Schema({
  invoiceNumber: { type: String, required: true, unique: true },
  clientId: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
  clientName: { type: String, required: true },
  clientEmail: { type: String, required: true },
  projectId: { type: Schema.Types.ObjectId, ref: 'Project' },
  projectName: { type: String },
  issueDate: { type: Date, default: Date.now },
  dueDate: { type: Date, required: true },
  items: [{
    description: { type: String, required: true },
    quantity: { type: Number, default: 1 },
    rate: { type: Number, required: true },
    amount: { type: Number, required: true }
  }],
  subtotal: { type: Number, required: true },
  taxRate: { type: Number, default: 0 },
  taxAmount: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  total: { type: Number, required: true },
  status: { type: String, enum: ['Draft', 'Sent', 'Paid', 'Overdue', 'Cancelled'], default: 'Draft' }
}, { timestamps: true });

// Payment Schema
const PaymentSchema = new Schema({
  invoiceId: { type: Schema.Types.ObjectId, ref: 'Invoice', required: true },
  amount: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['Stripe', 'Bank Transfer', 'PayPal', 'Credit Card'], default: 'Stripe' },
  transactionId: { type: String },
  paymentDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['Success', 'Failed', 'Pending'], default: 'Success' }
}, { timestamps: true });

// Real-time Notification Schema
const NotificationSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: {
    type: String,
    enum: ['assignment', 'comment', 'mention', 'deadline', 'status_change', 'project_created', 'invoice_created', 'crm_update', 'info'],
    default: 'info'
  },
  entityType: { type: String },
  entityId: { type: Schema.Types.ObjectId },
  read: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

NotificationSchema.index({ userId: 1, read: 1, createdAt: -1 });

// BlogPost Schema
const BlogPostSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  status: { type: String, enum: ['Draft', 'Published', 'Scheduled'], default: 'Draft' },
  keywords: [{ type: String }],
  publishDate: { type: Date },
  authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

// Keyword Schema
const KeywordSchema = new Schema({
  keyword: { type: String, required: true, unique: true },
  position: { type: Number, default: 100 },
  volume: { type: Number, default: 0 },
  difficulty: { type: Number, default: 0 },
  history: [{
    date: { type: Date, default: Date.now },
    position: { type: Number }
  }]
}, { timestamps: true });

// SEOReport Schema
const SEOReportSchema = new Schema({
  date: { type: Date, default: Date.now },
  clicks: { type: Number, default: 0 },
  impressions: { type: Number, default: 0 },
  ctr: { type: Number, default: 0 },
  avgPosition: { type: Number, default: 0 },
  healthScore: { type: Number, default: 100 },
  checklist: [{
    task: { type: String, required: true },
    done: { type: Boolean, default: false }
  }],
  competitors: [{
    name: { type: String, required: true },
    visibility: { type: Number, default: 0 },
    rank: { type: Number }
  }]
}, { timestamps: true });

// ActivityLog / AuditLog Schema
const ActivityLogSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  userName: { type: String, required: true },
  userRole: { type: String, required: true },
  action: { type: String, required: true },
  details: { type: String },
  ipAddress: { type: String },
  userAgent: { type: String }
}, { timestamps: true });

ActivityLogSchema.index({ userId: 1, createdAt: -1 });
ActivityLogSchema.index({ action: 1 });

// Exports
export const User = model('User', UserSchema);
export const Role = model('Role', RoleSchema);
export const Permission = model('Permission', PermissionSchema);
export const Company = model('Company', CompanySchema);
export const Client = model('Client', ClientSchema);
export const Contact = model('Contact', ContactSchema);
export const Lead = model('Lead', LeadSchema);
export const Deal = model('Deal', DealSchema);
export const Activity = model('Activity', ActivitySchema);
export const Project = model('Project', ProjectSchema);
export const Task = model('Task', TaskSchema);
export const Sprint = model('Sprint', SprintSchema);
export const Meeting = model('Meeting', MeetingSchema);
export const Document = model('Document', DocumentSchema);
export const Requirement = model('Requirement', RequirementSchema);
export const UserStory = model('UserStory', UserStorySchema);
export const Invoice = model('Invoice', InvoiceSchema);
export const Payment = model('Payment', PaymentSchema);
export const Notification = model('Notification', NotificationSchema);
export const BlogPost = model('BlogPost', BlogPostSchema);
export const Keyword = model('Keyword', KeywordSchema);
export const SEOReport = model('SEOReport', SEOReportSchema);
export const ActivityLog = model('ActivityLog', ActivityLogSchema);
export const AuditLog = ActivityLog;
