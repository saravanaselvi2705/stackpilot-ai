import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { authenticateJWT } from './middleware/auth';
import * as ctrl from './controllers';
import * as db from './models';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/stackpilot';

app.use(cors());
app.use(express.json());

// Public Auth routes
app.post('/api/auth/register', ctrl.register);
app.post('/api/auth/login', ctrl.login);

// Protected Auth routes
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

// Seeding function
const seedDatabase = async () => {
  try {
    const userCount = await db.User.countDocuments();
    if (userCount > 0) return; // DB already seeded

    console.log('Seeding initial data...');

    // Seed default users (with password 'password123')
    const passwordHash = await bcrypt.hash('password123', 10);

    const rolesList = ['Super Admin', 'Admin', 'Project Manager', 'Business Analyst', 'Developer', 'Tester', 'SEO Executive', 'Finance', 'Client'] as const;

    const seededUsers = [];
    for (const role of rolesList) {
      const name = role.replace(' ', '');
      const user = new db.User({
        name: `${role} User`,
        email: `${name.toLowerCase()}@stackpilot.ai`,
        password: passwordHash,
        role: role,
        avatarUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(role)}`,
        department: role === 'Finance' ? 'Accounting' : role === 'SEO Executive' ? 'Marketing' : 'Engineering',
        skills: ['React', 'TypeScript', 'Project Strategy', 'Automation'],
        experience: '5+ years in Enterprise SaaS',
        availability: 'Available',
        twoFAEnabled: false
      });
      await user.save();
      seededUsers.push(user);
    }

    console.log('Seeded Users successfully.');

    // Seed Companies
    const company = new db.Company({
      name: 'Vercel Inc',
      domain: 'vercel.com',
      industry: 'Cloud Infrastructure',
      size: '500-1000',
      address: 'San Francisco, CA'
    });
    await company.save();

    // Seed Clients
    const client = new db.Client({
      name: 'Guillermo Rauch',
      email: 'guillermo@vercel.com',
      companyId: company._id,
      companyName: company.name,
      phone: '+1 (555) 019-2834',
      status: 'Active',
      value: 120000,
      tags: ['Enterprise', 'Key Client'],
      notes: 'Interested in implementing advanced AI workflow engines.'
    });
    await client.save();

    // Seed Projects
    const project1 = new db.Project({
      name: 'Next.js 16 Optimization Suite',
      description: 'Build automated performance instrumentation dashboards for Next.js app compiler.',
      status: 'Active',
      priority: 'High',
      budget: 85000,
      spent: 34000,
      startDate: new Date('2026-06-01'),
      endDate: new Date('2026-09-30'),
      health: 'Healthy',
      client: company.name,
      team: [
        { userId: seededUsers[2]._id, role: 'Project Manager' },
        { userId: seededUsers[4]._id, role: 'Developer' }
      ]
    });
    await project1.save();

    const project2 = new db.Project({
      name: 'Enterprise CRM Migration',
      description: 'Migrating legacy client operations pipelines from HubSpot to StackPilot.',
      status: 'Planning',
      priority: 'Medium',
      budget: 45000,
      spent: 0,
      startDate: new Date('2026-07-15'),
      endDate: new Date('2026-11-30'),
      health: 'Healthy',
      client: company.name,
      team: [
        { userId: seededUsers[2]._id, role: 'Project Manager' }
      ]
    });
    await project2.save();

    // Seed Tasks
    const tasks = [
      {
        projectId: project1._id,
        title: 'Draft technical specifications for performance hooks',
        description: 'Provide a breakdown of custom compiler hooks required by client analytics layers.',
        status: 'In Progress',
        priority: 'High',
        assigneeId: seededUsers[4]._id,
        dueDate: new Date('2026-07-10'),
        labels: ['Engineering', 'Architecture']
      },
      {
        projectId: project1._id,
        title: 'Review user story acceptance criteria',
        description: 'Validate functional coverage of requirements before final engineering review.',
        status: 'Todo',
        priority: 'Medium',
        assigneeId: seededUsers[3]._id,
        dueDate: new Date('2026-07-20'),
        labels: ['Analysis']
      },
      {
        projectId: project1._id,
        title: 'Implement unit tests for compiler optimizations',
        description: 'Integrate custom test runner suites to verify sub-millisecond bundler load times.',
        status: 'Backlog',
        priority: 'Critical',
        assigneeId: seededUsers[5]._id,
        dueDate: new Date('2026-08-01'),
        labels: ['Testing']
      }
    ];

    for (const t of tasks) {
      await new db.Task(t).save();
    }

    // Seed SEO Report data
    const seoReport = new db.SEOReport({
      clicks: 14200,
      impressions: 489000,
      ctr: 2.9,
      avgPosition: 12.4,
      healthScore: 92,
      checklist: [
        { task: 'Optimized Meta tags for SEO', done: true },
        { task: 'Cleaned trailing slashes URLs', done: true },
        { task: 'Generated automated sitemap', done: false },
        { task: 'Audit Google Business Profile details', done: false }
      ],
      competitors: [
        { name: 'Monday.com', visibility: 42.1, rank: 1 },
        { name: 'Jira Software', visibility: 38.5, rank: 2 },
        { name: 'StackPilot AI', visibility: 18.2, rank: 5 }
      ]
    });
    await seoReport.save();

    // Seed Invoice
    const invoice = new db.Invoice({
      invoiceNumber: 'INV-2026-001',
      clientId: client._id,
      clientName: client.name,
      clientEmail: client.email,
      projectId: project1._id,
      projectName: project1.name,
      issueDate: new Date('2026-06-15'),
      dueDate: new Date('2026-07-15'),
      items: [
        { description: 'Initial Architecture Planning Phase', quantity: 1, rate: 15000, amount: 15000 },
        { description: 'Vite and Tailwind Template Setup', quantity: 1, rate: 8000, amount: 8000 }
      ],
      subtotal: 23000,
      taxRate: 18,
      taxAmount: 4140,
      discount: 1000,
      total: 26140,
      status: 'Sent'
    });
    await invoice.save();

    console.log('Seeded database with default collections successfully.');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

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
    console.warn('MongoDB connection failed. Continuing in offline mode (seeding bypassed)...');
    console.error(err);
    // Even if MongoDB fails, we start the Express server so endpoints can respond (with mock logic if DB queries fail)
    app.listen(PORT, () => {
      console.log(`Server running in fallback mode on port ${PORT}`);
    });
  });
