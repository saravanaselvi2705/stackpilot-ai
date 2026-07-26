"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditLog = exports.ActivityLog = exports.Tenant = exports.AutomationRule = exports.SEOReport = exports.Keyword = exports.BlogPost = exports.Notification = exports.Payment = exports.Quotation = exports.Expense = exports.Invoice = exports.UserStory = exports.Requirement = exports.Folder = exports.Document = exports.Meeting = exports.Sprint = exports.Task = exports.Project = exports.Activity = exports.Deal = exports.Lead = exports.Contact = exports.Client = exports.Company = exports.Permission = exports.Role = exports.User = void 0;
const mongoose_1 = require("mongoose");
// User Schema
const UserSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ['Super Admin', 'Admin', 'Project Manager', 'Business Analyst', 'Developer', 'QA/Tester', 'SEO Executive', 'Finance', 'Client'],
        default: 'Developer'
    },
    tenantId: { type: String, default: 'default-tenant' },
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
    workload: { type: Number, default: 0 },
    capacity: { type: Number, default: 40 },
    leaveStatus: { type: String, enum: ['Active', 'On Leave', 'Vacation'], default: 'Active' },
    onlineStatus: { type: String, enum: ['Online', 'Offline', 'Away'], default: 'Offline' },
    twoFAEnabled: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    mustChangePassword: { type: Boolean, default: false },
    lastLogin: { type: Date },
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    passwordResetToken: { type: String, default: null },
    passwordResetExpires: { type: Date, default: null },
    invited: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
}, { timestamps: true });
UserSchema.index({ role: 1 });
UserSchema.index({ isActive: 1 });
UserSchema.index({ tenantId: 1 });
// Role Schema
const RoleSchema = new mongoose_1.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String },
    permissions: [{ type: String }]
}, { timestamps: true });
// Permission Schema
const PermissionSchema = new mongoose_1.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String },
    module: { type: String, required: true }
}, { timestamps: true });
// Company Schema
const CompanySchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    domain: { type: String },
    industry: { type: String },
    size: { type: String },
    address: { type: String },
    phone: { type: String },
    email: { type: String },
    tenantId: { type: String, default: 'default-tenant' },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
}, { timestamps: true });
// Client Schema
const ClientSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    companyId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Company' },
    companyName: { type: String },
    phone: { type: String },
    status: { type: String, enum: ['Lead', 'Active', 'Inactive'], default: 'Lead' },
    value: { type: Number, default: 0 },
    tags: [{ type: String }],
    notes: { type: String },
    tenantId: { type: String, default: 'default-tenant' },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
}, { timestamps: true });
// Contact Schema
const ContactSchema = new mongoose_1.Schema({
    clientId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Client' },
    companyId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Company' },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    designation: { type: String },
    isPrimary: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });
// Lead Schema
const LeadSchema = new mongoose_1.Schema({
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
    ownerId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    value: { type: Number, default: 0 },
    notes: { type: String },
    tenantId: { type: String, default: 'default-tenant' },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
}, { timestamps: true });
// Deal Schema
const DealSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    clientId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Client' },
    companyId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Company' },
    leadId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Lead' },
    stage: {
        type: String,
        enum: ['New', 'Qualified', 'Proposal', 'Negotiation', 'Won', 'Lost'],
        default: 'New'
    },
    value: { type: Number, default: 0 },
    probability: { type: Number, default: 50 },
    expectedCloseDate: { type: Date },
    ownerId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    notes: { type: String },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });
// Activity Schema
const ActivitySchema = new mongoose_1.Schema({
    entityType: { type: String, enum: ['Lead', 'Deal', 'Client', 'Project'], required: true },
    entityId: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    type: { type: String, enum: ['Call', 'Meeting', 'Email', 'Note'], required: true },
    title: { type: String, required: true },
    description: { type: String },
    performedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    dueDate: { type: Date },
    status: { type: String, enum: ['Pending', 'Completed'], default: 'Completed' },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });
// Project Schema
const ProjectSchema = new mongoose_1.Schema({
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
    clientId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Client' },
    companyId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Company' },
    projectManagerId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    team: [{
            userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
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
    tenantId: { type: String, default: 'default-tenant' },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null }
}, { timestamps: true });
// Task Schema
const TaskSchema = new mongoose_1.Schema({
    projectId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Project', required: true },
    sprintId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Sprint' },
    epicId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Task' },
    parentTaskId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Task' },
    title: { type: String, required: true },
    description: { type: String },
    type: { type: String, enum: ['Epic', 'Story', 'Bug', 'Task'], default: 'Task' },
    status: { type: String, enum: ['Backlog', 'Todo', 'In Progress', 'In Review', 'Done'], default: 'Todo' },
    priority: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium' },
    assigneeId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    reporterId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    dueDate: { type: Date },
    labels: [{ type: String }],
    estimatedTime: { type: Number, default: 0 },
    loggedTime: { type: Number, default: 0 },
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
            userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
            userName: { type: String, required: true },
            userAvatar: { type: String },
            text: { type: String, required: true },
            mentions: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }],
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
// Sprint Schema
const SprintSchema = new mongoose_1.Schema({
    projectId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Project', required: true },
    name: { type: String, required: true },
    goal: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
    status: { type: String, enum: ['Future', 'Active', 'Closed'], default: 'Future' },
}, { timestamps: true });
// Meeting Schema
const MeetingSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    projectId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Project' },
    date: { type: Date, required: true },
    duration: { type: Number, default: 30 },
    attendees: [{ type: String }],
    agenda: { type: String },
    notes: { type: String },
    type: { type: String, enum: ['Video', 'Call', 'In-Person'], default: 'Video' },
    status: { type: String, enum: ['Scheduled', 'Completed', 'Cancelled'], default: 'Scheduled' }
}, { timestamps: true });
// Document Schema (DMS)
const DocumentSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    content: { type: String },
    fileUrl: { type: String },
    folderId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Folder' },
    type: {
        type: String,
        enum: ['SRS', 'BRD', 'FSD', 'Technical', 'Meeting Minutes', 'Knowledge Base', 'FAQ', 'PDF', 'Contract'],
        default: 'Technical'
    },
    projectId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Project' },
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    version: { type: Number, default: 1 },
    approvalStatus: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Approved' },
    sharedWithClients: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Client' }],
    tags: [{ type: String }],
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });
// Folder Schema (DMS)
const FolderSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    parentId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Folder' },
    projectId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Project' },
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    isDeleted: { type: Boolean, default: false }
}, { timestamps: true });
// Requirement Schema
const RequirementSchema = new mongoose_1.Schema({
    projectId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Project', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, enum: ['Business', 'Functional', 'Non-Functional'], required: true },
    status: { type: String, enum: ['Draft', 'Approved', 'Rejected', 'Implemented'], default: 'Draft' },
    acceptanceCriteria: [{ type: String }],
    dependencies: [{ type: String }],
    version: { type: Number, default: 1 }
}, { timestamps: true });
// UserStory Schema
const UserStorySchema = new mongoose_1.Schema({
    requirementId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Requirement' },
    projectId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Project', required: true },
    title: { type: String, required: true },
    asA: { type: String, required: true },
    iWantTo: { type: String, required: true },
    soThat: { type: String, required: true },
    acceptanceCriteria: [{ type: String }],
    points: { type: Number, default: 1 },
    status: { type: String, enum: ['Todo', 'In Progress', 'Ready for Test', 'Done'], default: 'Todo' }
}, { timestamps: true });
// Invoice Schema
const InvoiceSchema = new mongoose_1.Schema({
    invoiceNumber: { type: String, required: true, unique: true },
    clientId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Client', required: true },
    clientName: { type: String, required: true },
    clientEmail: { type: String, required: true },
    projectId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Project' },
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
    status: { type: String, enum: ['Draft', 'Sent', 'Paid', 'Overdue', 'Cancelled'], default: 'Draft' },
    recurring: { type: Boolean, default: false },
    recurringInterval: { type: String, enum: ['Monthly', 'Quarterly', 'Yearly'], default: 'Monthly' },
    isDeleted: { type: Boolean, default: false }
}, { timestamps: true });
// Expense Schema
const ExpenseSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    category: { type: String, enum: ['Software', 'Hardware', 'Travel', 'Marketing', 'Office', 'Utilities', 'Other'], default: 'Software' },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    projectId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Project' },
    clientId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Client' },
    receiptUrl: { type: String },
    recordedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    isDeleted: { type: Boolean, default: false }
}, { timestamps: true });
// Quotation Schema
const QuotationSchema = new mongoose_1.Schema({
    quoteNumber: { type: String, required: true, unique: true },
    clientId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Client', required: true },
    clientName: { type: String, required: true },
    clientEmail: { type: String, required: true },
    items: [{
            description: { type: String, required: true },
            quantity: { type: Number, default: 1 },
            rate: { type: Number, required: true },
            amount: { type: Number, required: true }
        }],
    total: { type: Number, required: true },
    validUntil: { type: Date, required: true },
    status: { type: String, enum: ['Draft', 'Sent', 'Accepted', 'Declined'], default: 'Draft' },
    isDeleted: { type: Boolean, default: false }
}, { timestamps: true });
// Payment Schema
const PaymentSchema = new mongoose_1.Schema({
    invoiceId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Invoice', required: true },
    amount: { type: Number, required: true },
    paymentMethod: { type: String, enum: ['Stripe', 'Bank Transfer', 'PayPal', 'Credit Card', 'Razorpay'], default: 'Stripe' },
    transactionId: { type: String },
    paymentDate: { type: Date, default: Date.now },
    status: { type: String, enum: ['Success', 'Failed', 'Pending'], default: 'Success' }
}, { timestamps: true });
// Notification Schema
const NotificationSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
        type: String,
        enum: ['assignment', 'comment', 'mention', 'deadline', 'status_change', 'project_created', 'invoice_created', 'crm_update', 'info'],
        default: 'info'
    },
    entityType: { type: String },
    entityId: { type: mongoose_1.Schema.Types.ObjectId },
    read: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });
// BlogPost Schema
const BlogPostSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    status: { type: String, enum: ['Draft', 'Published', 'Scheduled'], default: 'Draft' },
    keywords: [{ type: String }],
    publishDate: { type: Date },
    authorId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });
// Keyword Schema
const KeywordSchema = new mongoose_1.Schema({
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
const SEOReportSchema = new mongoose_1.Schema({
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
// Automation Rule Schema
const AutomationRuleSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    trigger: { type: String, enum: ['task_due', 'invoice_overdue', 'lead_created', 'project_status_changed'], required: true },
    condition: { type: String },
    action: { type: String, enum: ['send_email', 'create_task', 'notify_user', 'update_status'], required: true },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });
// Tenant Schema (SaaS)
const TenantSchema = new mongoose_1.Schema({
    tenantId: { type: String, required: true, unique: true },
    companyName: { type: String, required: true },
    plan: { type: String, enum: ['Free Trial', 'Pro', 'Enterprise'], default: 'Free Trial' },
    status: { type: String, enum: ['Active', 'Suspended', 'Cancelled'], default: 'Active' },
    billingCycle: { type: String, enum: ['Monthly', 'Yearly'], default: 'Monthly' },
    maxUsers: { type: Number, default: 10 },
    maxProjects: { type: Number, default: 25 },
    stripeCustomerId: { type: String }
}, { timestamps: true });
// ActivityLog / AuditLog Schema
const ActivityLogSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    userName: { type: String, required: true },
    userRole: { type: String, required: true },
    action: { type: String, required: true },
    details: { type: String },
    ipAddress: { type: String },
    userAgent: { type: String }
}, { timestamps: true });
exports.User = (0, mongoose_1.model)('User', UserSchema);
exports.Role = (0, mongoose_1.model)('Role', RoleSchema);
exports.Permission = (0, mongoose_1.model)('Permission', PermissionSchema);
exports.Company = (0, mongoose_1.model)('Company', CompanySchema);
exports.Client = (0, mongoose_1.model)('Client', ClientSchema);
exports.Contact = (0, mongoose_1.model)('Contact', ContactSchema);
exports.Lead = (0, mongoose_1.model)('Lead', LeadSchema);
exports.Deal = (0, mongoose_1.model)('Deal', DealSchema);
exports.Activity = (0, mongoose_1.model)('Activity', ActivitySchema);
exports.Project = (0, mongoose_1.model)('Project', ProjectSchema);
exports.Task = (0, mongoose_1.model)('Task', TaskSchema);
exports.Sprint = (0, mongoose_1.model)('Sprint', SprintSchema);
exports.Meeting = (0, mongoose_1.model)('Meeting', MeetingSchema);
exports.Document = (0, mongoose_1.model)('Document', DocumentSchema);
exports.Folder = (0, mongoose_1.model)('Folder', FolderSchema);
exports.Requirement = (0, mongoose_1.model)('Requirement', RequirementSchema);
exports.UserStory = (0, mongoose_1.model)('UserStory', UserStorySchema);
exports.Invoice = (0, mongoose_1.model)('Invoice', InvoiceSchema);
exports.Expense = (0, mongoose_1.model)('Expense', ExpenseSchema);
exports.Quotation = (0, mongoose_1.model)('Quotation', QuotationSchema);
exports.Payment = (0, mongoose_1.model)('Payment', PaymentSchema);
exports.Notification = (0, mongoose_1.model)('Notification', NotificationSchema);
exports.BlogPost = (0, mongoose_1.model)('BlogPost', BlogPostSchema);
exports.Keyword = (0, mongoose_1.model)('Keyword', KeywordSchema);
exports.SEOReport = (0, mongoose_1.model)('SEOReport', SEOReportSchema);
exports.AutomationRule = (0, mongoose_1.model)('AutomationRule', AutomationRuleSchema);
exports.Tenant = (0, mongoose_1.model)('Tenant', TenantSchema);
exports.ActivityLog = (0, mongoose_1.model)('ActivityLog', ActivityLogSchema);
exports.AuditLog = exports.ActivityLog;
