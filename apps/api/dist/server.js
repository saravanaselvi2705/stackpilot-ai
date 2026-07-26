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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const auth_1 = require("./middleware/auth");
const security_1 = require("./middleware/security");
const ctrl = __importStar(require("./controllers"));
const routes_1 = __importDefault(require("./routes"));
const seed_1 = require("./utils/seed");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/stackpilot';
// Security Middleware
app.use(security_1.helmetSecurity);
app.use((0, security_1.rateLimiter)({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use(security_1.sanitizeInputs);
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true,
}));
app.use(express_1.default.json());
// Serve static file uploads (avatars)
app.use('/uploads', express_1.default.static(path_1.default.join(process.cwd(), 'uploads')));
// Modular API Router
app.use('/api', routes_1.default);
// Legacy Route Compatibility Endpoints
app.post('/api/auth/login', ctrl.login);
app.post('/api/auth/forgot-password', ctrl.forgotPassword);
app.post('/api/auth/reset-password', ctrl.resetPassword);
app.get('/api/auth/profile', auth_1.authenticateJWT, ctrl.getProfile);
app.put('/api/auth/profile', auth_1.authenticateJWT, ctrl.updateProfile);
// Project routes
app.get('/api/projects', auth_1.authenticateJWT, ctrl.getProjects);
app.post('/api/projects', auth_1.authenticateJWT, ctrl.createProject);
// Task routes
app.get('/api/tasks', auth_1.authenticateJWT, ctrl.getTasks);
app.post('/api/tasks', auth_1.authenticateJWT, ctrl.createTask);
app.put('/api/tasks/:id', auth_1.authenticateJWT, ctrl.updateTask);
// CRM routes
app.get('/api/crm/leads', auth_1.authenticateJWT, ctrl.getLeads);
app.post('/api/crm/leads', auth_1.authenticateJWT, ctrl.createLead);
// Finance routes
app.get('/api/finance/invoices', auth_1.authenticateJWT, ctrl.getInvoices);
app.post('/api/finance/invoices', auth_1.authenticateJWT, ctrl.createInvoice);
// SEO routes
app.get('/api/seo/reports', auth_1.authenticateJWT, ctrl.getSEOReport);
// AI routes
app.post('/api/ai/requirements', auth_1.authenticateJWT, ctrl.aiGenerateRequirements);
app.post('/api/ai/testcases', auth_1.authenticateJWT, ctrl.aiGenerateTestCases);
app.post('/api/ai/bugreport', auth_1.authenticateJWT, ctrl.aiGenerateBugReport);
// Centralized error handler
app.use(security_1.errorHandler);
// Connect to MongoDB & start server
mongoose_1.default.connect(MONGODB_URI)
    .then(() => {
    console.log('Connected to MongoDB.');
    (0, seed_1.seedDatabase)();
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})
    .catch(err => {
    console.warn('MongoDB connection failed. Continuing in fallback mode...');
    console.error(err);
    app.listen(PORT, () => {
        console.log(`Server running in fallback mode on port ${PORT}`);
    });
});
