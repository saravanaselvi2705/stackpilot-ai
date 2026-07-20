"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityLog = exports.SEOReport = exports.Keyword = exports.BlogPost = exports.Notification = exports.Payment = exports.Invoice = exports.UserStory = exports.Requirement = exports.Document = exports.Meeting = exports.Task = exports.Project = exports.Client = exports.Company = exports.Permission = exports.Role = exports.User = void 0;
const mongoose_1 = require("mongoose");
// User Schema
const UserSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ['Super Admin', 'Admin', 'Project Manager', 'Business Analyst', 'Developer', 'Tester', 'SEO Executive', 'Finance', 'Client'],
        default: 'Developer'
    },
    avatarUrl: { type: String },
    department: { type: String },
    skills: [{ type: String }],
    experience: { type: String },
    availability: { type: String, enum: ['Available', 'Busy', 'On Leave'], default: 'Available' },
    twoFAEnabled: { type: Boolean, default: false },
}, { timestamps: true });
// Role Schema
const RoleSchema = new mongoose_1.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String },
    permissions: [{ type: String }] // string permission keys
}, { timestamps: true });
// Permission Schema
const PermissionSchema = new mongoose_1.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String },
    module: { type: String }
}, { timestamps: true });
// Company Schema
const CompanySchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    domain: { type: String },
    industry: { type: String },
    size: { type: String },
    address: { type: String }
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
    notes: { type: String }
}, { timestamps: true });
// Project Schema
const ProjectSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    description: { type: String },
    status: { type: String, enum: ['Planning', 'Active', 'On Hold', 'Completed'], default: 'Planning' },
    priority: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium' },
    budget: { type: Number, default: 0 },
    spent: { type: Number, default: 0 },
    startDate: { type: Date },
    endDate: { type: Date },
    team: [{
            userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
            role: { type: String }
        }],
    health: { type: String, enum: ['Healthy', 'At Risk', 'Critical'], default: 'Healthy' },
    client: { type: String }
}, { timestamps: true });
// Task Schema
const TaskSchema = new mongoose_1.Schema({
    projectId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Project', required: true },
    title: { type: String, required: true },
    description: { type: String },
    status: { type: String, enum: ['Backlog', 'Todo', 'In Progress', 'In Review', 'Done'], default: 'Todo' },
    priority: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium' },
    assigneeId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    dueDate: { type: Date },
    labels: [{ type: String }],
    estimatedTime: { type: Number, default: 0 },
    checklist: [{
            text: { type: String, required: true },
            done: { type: Boolean, default: false }
        }],
    comments: [{
            userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
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
const MeetingSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    projectId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Project' },
    date: { type: Date, required: true },
    duration: { type: Number, default: 30 }, // in minutes
    attendees: [{ type: String }], // emails or ids
    agenda: { type: String },
    notes: { type: String },
    type: { type: String, enum: ['Video', 'Call', 'In-Person'], default: 'Video' },
    status: { type: String, enum: ['Scheduled', 'Completed', 'Cancelled'], default: 'Scheduled' }
}, { timestamps: true });
// Document Schema
const DocumentSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    content: { type: String },
    type: {
        type: String,
        enum: ['SRS', 'BRD', 'FSD', 'Technical', 'Meeting Minutes', 'Knowledge Base', 'FAQ'],
        required: true
    },
    projectId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Project' },
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    version: { type: Number, default: 1 },
    history: [{
            version: { type: Number },
            updatedBy: { type: String },
            updatedAt: { type: Date, default: Date.now },
            changeLog: { type: String }
        }]
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
    status: { type: String, enum: ['Draft', 'Sent', 'Paid', 'Overdue', 'Cancelled'], default: 'Draft' }
}, { timestamps: true });
// Payment Schema
const PaymentSchema = new mongoose_1.Schema({
    invoiceId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Invoice', required: true },
    amount: { type: Number, required: true },
    paymentMethod: { type: String, enum: ['Stripe', 'Bank Transfer', 'PayPal', 'Credit Card'], default: 'Stripe' },
    transactionId: { type: String },
    paymentDate: { type: Date, default: Date.now },
    status: { type: String, enum: ['Success', 'Failed', 'Pending'], default: 'Success' }
}, { timestamps: true });
// Notification Schema
const NotificationSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ['info', 'success', 'warning', 'error'], default: 'info' },
    read: { type: Boolean, default: false }
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
// ActivityLog Schema
const ActivityLogSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    userName: { type: String, required: true },
    userRole: { type: String, required: true },
    action: { type: String, required: true },
    details: { type: String }
}, { timestamps: true });
// Exports
exports.User = (0, mongoose_1.model)('User', UserSchema);
exports.Role = (0, mongoose_1.model)('Role', RoleSchema);
exports.Permission = (0, mongoose_1.model)('Permission', PermissionSchema);
exports.Company = (0, mongoose_1.model)('Company', CompanySchema);
exports.Client = (0, mongoose_1.model)('Client', ClientSchema);
exports.Project = (0, mongoose_1.model)('Project', ProjectSchema);
exports.Task = (0, mongoose_1.model)('Task', TaskSchema);
exports.Meeting = (0, mongoose_1.model)('Meeting', MeetingSchema);
exports.Document = (0, mongoose_1.model)('Document', DocumentSchema);
exports.Requirement = (0, mongoose_1.model)('Requirement', RequirementSchema);
exports.UserStory = (0, mongoose_1.model)('UserStory', UserStorySchema);
exports.Invoice = (0, mongoose_1.model)('Invoice', InvoiceSchema);
exports.Payment = (0, mongoose_1.model)('Payment', PaymentSchema);
exports.Notification = (0, mongoose_1.model)('Notification', NotificationSchema);
exports.BlogPost = (0, mongoose_1.model)('BlogPost', BlogPostSchema);
exports.Keyword = (0, mongoose_1.model)('Keyword', KeywordSchema);
exports.SEOReport = (0, mongoose_1.model)('SEOReport', SEOReportSchema);
exports.ActivityLog = (0, mongoose_1.model)('ActivityLog', ActivityLogSchema);
