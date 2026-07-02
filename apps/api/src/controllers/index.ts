import { Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest } from '../middleware/auth';
import * as db from '../models';

const JWT_SECRET = process.env.JWT_SECRET || 'stackpilot_secret_key_12345';

// AUTH CONTROLLERS
export const register = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, email, password, role } = req.body;
    const existingUser = await db.User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new db.User({
      name,
      email,
      password: hashedPassword,
      role: role || 'Developer',
      avatarUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}`,
      availability: 'Available',
      twoFAEnabled: false
    });

    await newUser.save();

    // Log Activity
    const activity = new db.ActivityLog({
      userId: newUser._id,
      userName: newUser.name,
      userRole: newUser.role,
      action: 'Register',
      details: `User registered with role ${newUser.role}`
    });
    await activity.save();

    const token = jwt.sign({ id: newUser._id, email: newUser.email, role: newUser.role }, JWT_SECRET, { expiresIn: '24h' });

    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        avatarUrl: newUser.avatarUrl,
        availability: newUser.availability,
        twoFAEnabled: newUser.twoFAEnabled,
        createdAt: newUser.createdAt
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await db.User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '24h' });

    // Log Activity
    const activity = new db.ActivityLog({
      userId: user._id,
      userName: user.name,
      userRole: user.role,
      action: 'Login',
      details: 'User logged in successfully'
    });
    await activity.save();

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
        availability: user.availability,
        twoFAEnabled: user.twoFAEnabled,
        createdAt: user.createdAt
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const user = await db.User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.status(200).json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const { name, department, skills, experience, availability, twoFAEnabled } = req.body;

    const user = await db.User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (name) user.name = name;
    if (department) user.department = department;
    if (skills) user.skills = skills;
    if (experience) user.experience = experience;
    if (availability) user.availability = availability;
    if (twoFAEnabled !== undefined) user.twoFAEnabled = twoFAEnabled;

    await user.save();
    res.status(200).json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// PROJECTS CONTROLLERS
export const getProjects = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const projects = await db.Project.find();
    res.status(200).json(projects);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createProject = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, description, priority, budget, startDate, endDate, client } = req.body;
    const newProject = new db.Project({
      name,
      description,
      priority: priority || 'Medium',
      budget: budget || 0,
      spent: 0,
      startDate,
      endDate,
      status: 'Planning',
      health: 'Healthy',
      client,
      team: req.user ? [{ userId: req.user.id, role: 'Owner' }] : []
    });

    await newProject.save();

    if (req.user) {
      await new db.ActivityLog({
        userId: req.user.id,
        userName: req.user.email,
        userRole: req.user.role,
        action: 'Create Project',
        details: `Project "${name}" was created`
      }).save();
    }

    res.status(201).json(newProject);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// TASKS CONTROLLERS
export const getTasks = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { projectId } = req.query;
    const filter = projectId ? { projectId } : {};
    const tasks = await db.Task.find(filter);
    res.status(200).json(tasks);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createTask = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { projectId, title, description, priority, assigneeId, dueDate, labels } = req.body;
    const task = new db.Task({
      projectId,
      title,
      description,
      priority: priority || 'Medium',
      status: 'Todo',
      assigneeId,
      dueDate,
      labels: labels || []
    });

    await task.save();
    res.status(201).json(task);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateTask = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const task = await db.Task.findByIdAndUpdate(id, updates, { new: true });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.status(200).json(task);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// CRM CONTROLLERS
export const getLeads = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const leads = await db.Client.find();
    res.status(200).json(leads);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createLead = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, email, companyName, phone, value, status, tags, notes } = req.body;
    const lead = new db.Client({
      name,
      email,
      companyName,
      phone,
      value: value || 0,
      status: status || 'Lead',
      tags: tags || [],
      notes
    });
    await lead.save();
    res.status(201).json(lead);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// FINANCE CONTROLLERS
export const getInvoices = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const invoices = await db.Invoice.find();
    res.status(200).json(invoices);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createInvoice = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { clientId, clientName, clientEmail, projectId, projectName, dueDate, items, taxRate, discount } = req.body;

    const subtotal = items.reduce((acc: number, item: any) => acc + (item.rate * item.quantity), 0);
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
      items: items.map((item: any) => ({ ...item, amount: item.rate * item.quantity })),
      subtotal,
      taxRate: taxRate || 0,
      taxAmount,
      discount: discount || 0,
      total,
      status: 'Sent'
    });

    await invoice.save();
    res.status(201).json(invoice);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// SEO CONTROLLERS
export const getSEOReport = async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Return latest SEO metrics
    const reports = await db.SEOReport.find().sort({ date: -1 }).limit(10);
    res.status(200).json(reports);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// AI CONTROLLERS (MOCKS WITH SMART LLM SIMULATORS)
export const aiGenerateRequirements = (req: AuthenticatedRequest, res: Response) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

  // Generate dynamic-looking software requirement list
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

export const aiGenerateTestCases = (req: AuthenticatedRequest, res: Response) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

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

export const aiGenerateBugReport = (req: AuthenticatedRequest, res: Response) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

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
