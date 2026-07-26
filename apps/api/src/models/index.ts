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

  twoFAEnabled: {
    type: Boolean,
    default: false
  },

  isActive: {
    type: Boolean,
    default: true
  },

  mustChangePassword: {
    type: Boolean,
    default: false
  },

  lastLogin: {
    type: Date
  },

  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },

  passwordResetToken: {
    type: String,
    default: null
  },

  passwordResetExpires: {
    type: Date,
    default: null
  },

  invited: {
    type: Boolean,
    default: false
  },
}, { timestamps: true });

UserSchema.index({ role: 1 });
UserSchema.index({ isActive: 1 });
UserSchema.index({ department: 1 });

// Role Schema
const RoleSchema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  permissions: [{ type: String }] // array of permission keys
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
  address: { type: String }
}, { timestamps: true });

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
  notes: { type: String }
}, { timestamps: true });

// Project Schema
const ProjectSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ['Planning', 'Active', 'On Hold', 'Completed'], default: 'Planning' },
  priority: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium' },
  budget: { type: Number, default: 0 },
  spent: { type: Number, default: 0 },
  startDate: { type: Date },
  endDate: { type: Date },
  team: [{
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    role: { type: String }
  }],
  health: { type: String, enum: ['Healthy', 'At Risk', 'Critical'], default: 'Healthy' },
  client: { type: String }
}, { timestamps: true });

// Task Schema
const TaskSchema = new Schema({
  projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ['Backlog', 'Todo', 'In Progress', 'In Review', 'Done'], default: 'Todo' },
  priority: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium' },
  assigneeId: { type: Schema.Types.ObjectId, ref: 'User' },
  dueDate: { type: Date },
  labels: [{ type: String }],
  estimatedTime: { type: Number, default: 0 },
  checklist: [{
    text: { type: String, required: true },
    done: { type: Boolean, default: false }
  }],
  comments: [{
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    userName: { type: String, required: true },
    userAvatar: { type: String },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  }],
  attachments: [{
    name: { type: String, required: true },
    url: { type: String, required: true },
    size: { type: String },
    createdAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

// Meeting Schema
const MeetingSchema = new Schema({
  title: { type: String, required: true },
  projectId: { type: Schema.Types.ObjectId, ref: 'Project' },
  date: { type: Date, required: true },
  duration: { type: Number, default: 30 }, // in minutes
  attendees: [{ type: String }], // emails or ids
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

// Notification Schema
const NotificationSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['info', 'success', 'warning', 'error'], default: 'info' },
  read: { type: Boolean, default: false }
}, { timestamps: true });

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
export const Project = model('Project', ProjectSchema);
export const Task = model('Task', TaskSchema);
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
export const AuditLog = ActivityLog; // Alias for consistency
