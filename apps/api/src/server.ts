import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { authenticateJWT } from './middleware/auth';
import { helmetSecurity, sanitizeInputs, rateLimiter, errorHandler } from './middleware/security';
import * as ctrl from './controllers';
import apiRoutes from './routes';
import { seedDatabase } from './utils/seed';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/stackpilot';

// Security Middleware
app.use(helmetSecurity);
app.use(rateLimiter({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use(sanitizeInputs);

app.use(
  cors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true,
  })
);
app.use(express.json());

// Serve static file uploads (avatars)
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Modular API Router
app.use('/api', apiRoutes);

// Legacy Route Compatibility Endpoints
app.post('/api/auth/login', ctrl.login);
app.post('/api/auth/forgot-password', ctrl.forgotPassword);
app.post('/api/auth/reset-password', ctrl.resetPassword);
app.get('/api/auth/profile', authenticateJWT, ctrl.getProfile);
app.put('/api/auth/profile', authenticateJWT, ctrl.updateProfile);

// Project routes
app.get('/api/projects', authenticateJWT, ctrl.getProjects);
app.post('/api/projects', authenticateJWT, ctrl.createProject);

// Task routes
app.get('/api/tasks', authenticateJWT, ctrl.getTasks);
app.post('/api/tasks', authenticateJWT, ctrl.createTask);
app.put('/api/tasks/:id', authenticateJWT, ctrl.updateTask);

// CRM routes
app.get('/api/crm/leads', authenticateJWT, ctrl.getLeads);
app.post('/api/crm/leads', authenticateJWT, ctrl.createLead);

// Finance routes
app.get('/api/finance/invoices', authenticateJWT, ctrl.getInvoices);
app.post('/api/finance/invoices', authenticateJWT, ctrl.createInvoice);

// SEO routes
app.get('/api/seo/reports', authenticateJWT, ctrl.getSEOReport);

// AI routes
app.post('/api/ai/requirements', authenticateJWT, ctrl.aiGenerateRequirements);
app.post('/api/ai/testcases', authenticateJWT, ctrl.aiGenerateTestCases);
app.post('/api/ai/bugreport', authenticateJWT, ctrl.aiGenerateBugReport);

// Centralized error handler
app.use(errorHandler);

// Connect to MongoDB & start server
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB.');
    seedDatabase();
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
