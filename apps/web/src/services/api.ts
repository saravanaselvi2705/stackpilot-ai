import axios from 'axios';
import type { User, Project, Task, Client, Invoice, Document, SEOReport, BlogPost, Keyword, ActivityLog, Notification, UserRole } from '../../../../packages/shared/types';

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

// Standard mock data seeding
const DEFAULT_USERS: User[] = [
  { _id: 'u-1', name: 'Alexander Wright', email: 'alex@stackpilot.ai', role: 'Super Admin', avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Alex', department: 'Executive', availability: 'Available', twoFAEnabled: false, createdAt: new Date().toISOString() },
  { _id: 'u-2', name: 'Sarah Connor', email: 'sarah@stackpilot.ai', role: 'Project Manager', avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Sarah', department: 'Management', availability: 'Available', twoFAEnabled: false, createdAt: new Date().toISOString() },
  { _id: 'u-3', name: 'Marcus Aurelius', email: 'marcus@stackpilot.ai', role: 'Developer', avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Marcus', department: 'Engineering', availability: 'Available', twoFAEnabled: false, createdAt: new Date().toISOString() },
  { _id: 'u-4', name: 'Diana Prince', email: 'diana@stackpilot.ai', role: 'Tester', avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Diana', department: 'QA', availability: 'Available', twoFAEnabled: false, createdAt: new Date().toISOString() },
  { _id: 'u-5', name: 'Bruce Wayne', email: 'bruce@stackpilot.ai', role: 'Business Analyst', avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Bruce', department: 'Strategy', availability: 'Available', twoFAEnabled: false, createdAt: new Date().toISOString() },
  { _id: 'u-6', name: 'Peter Parker', email: 'peter@stackpilot.ai', role: 'SEO Executive', avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Peter', department: 'Marketing', availability: 'Available', twoFAEnabled: false, createdAt: new Date().toISOString() },
  { _id: 'u-7', name: 'Tony Stark', email: 'tony@stackpilot.ai', role: 'Finance', avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Tony', department: 'Finance', availability: 'Available', twoFAEnabled: true, createdAt: new Date().toISOString() },
  { _id: 'u-8', name: 'Guillermo Rauch', email: 'guillermo@vercel.com', role: 'Client', avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Guillermo', department: 'Vercel', availability: 'Available', twoFAEnabled: false, createdAt: new Date().toISOString() },
];

const DEFAULT_PROJECTS: Project[] = [
  {
    _id: 'p-1',
    name: 'Next.js 16 Optimization Suite',
    description: 'Build performance analytics and instrumentation dashboard for core React Server Components compiler.',
    status: 'Active',
    priority: 'High',
    budget: 95000,
    spent: 34000,
    startDate: '2026-06-01',
    endDate: '2026-09-30',
    health: 'Healthy',
    client: 'Vercel Inc.',
    team: [
      { userId: 'u-2', role: 'Project Manager' },
      { userId: 'u-3', role: 'Lead Developer' },
      { userId: 'u-4', role: 'Senior QA' }
    ],
    createdAt: new Date().toISOString()
  },
  {
    _id: 'p-2',
    name: 'Enterprise CRM Migration',
    description: 'Migrating global customer pipelines and interactions history from HubSpot CRM to corporate nodes.',
    status: 'Planning',
    priority: 'Medium',
    budget: 45000,
    spent: 0,
    startDate: '2026-07-15',
    endDate: '2026-11-30',
    health: 'Healthy',
    client: 'Stripe Inc.',
    team: [
      { userId: 'u-2', role: 'Project Manager' },
      { userId: 'u-5', role: 'Business Analyst' }
    ],
    createdAt: new Date().toISOString()
  },
  {
    _id: 'p-3',
    name: 'SEO & Search Indexing Engine',
    description: 'Optimize search positioning, automate GBP review templates, and build keyword intelligence graphs.',
    status: 'Active',
    priority: 'Low',
    budget: 30000,
    spent: 12000,
    startDate: '2026-05-10',
    endDate: '2026-08-30',
    health: 'Healthy',
    client: 'Acme Corp',
    team: [
      { userId: 'u-6', role: 'SEO Lead' }
    ],
    createdAt: new Date().toISOString()
  }
];

const DEFAULT_TASKS: Task[] = [
  {
    _id: 't-1',
    projectId: 'p-1',
    title: 'Configure Webpack/Turbopack custom instrumentation hooks',
    description: 'Inject compiler hooks to capture performance timings during Server Component static assembly.',
    status: 'In Progress',
    priority: 'High',
    assigneeId: 'u-3',
    dueDate: '2026-07-12',
    labels: ['Engineering', 'Compiler'],
    checklist: [
      { id: 'c-1', text: 'Define hook hooks in webpack.ts config', done: true },
      { id: 'c-2', text: 'Register metric receivers', done: false },
      { id: 'c-3', text: 'Add unit tests for output outputs', done: false }
    ],
    comments: [
      { id: 'm-1', userId: 'u-2', userName: 'Sarah Connor', text: 'Please ensure this is backwards compatible with Next 15.', createdAt: new Date().toISOString() }
    ],
    attachments: [
      { id: 'a-1', name: 'webpack_hooks_v2.pdf', url: '#', size: '2.4 MB', createdAt: new Date().toISOString() }
    ],
    estimatedTime: 12,
    createdAt: new Date().toISOString()
  },
  {
    _id: 't-2',
    projectId: 'p-1',
    title: 'Draft requirement specification for BA review',
    description: 'Detailed user flows and specifications for performance metrics widgets.',
    status: 'Todo',
    priority: 'Medium',
    assigneeId: 'u-5',
    dueDate: '2026-07-18',
    labels: ['Requirements'],
    checklist: [],
    comments: [],
    estimatedTime: 4,
    createdAt: new Date().toISOString()
  },
  {
    _id: 't-3',
    projectId: 'p-1',
    title: 'Validate telemetry pipeline outputs',
    description: 'Ensure compiler outputs correctly publish via API telemetry client to backend database.',
    status: 'Backlog',
    priority: 'Critical',
    assigneeId: 'u-4',
    dueDate: '2026-08-05',
    labels: ['QA', 'Integration'],
    checklist: [],
    comments: [],
    estimatedTime: 16,
    createdAt: new Date().toISOString()
  },
  {
    _id: 't-4',
    projectId: 'p-2',
    title: 'Database schema mapping from HubSpot entities',
    description: 'Extract lead tables and map them to Mongoose models defined in StackPilot.',
    status: 'Todo',
    priority: 'High',
    assigneeId: 'u-3',
    dueDate: '2026-07-25',
    labels: ['Database', 'Migration'],
    checklist: [],
    comments: [],
    estimatedTime: 6,
    createdAt: new Date().toISOString()
  }
];

const DEFAULT_LEADS: Client[] = [
  { _id: 'l-1', name: 'Elon Musk', email: 'elon@tesla.com', companyName: 'Tesla Motors', phone: '+1 (555) 420-6969', status: 'Lead', value: 850000, tags: ['Enterprise', 'Automotive'], notes: 'Interested in AI-driven task dispatch scheduler integration.', createdAt: new Date().toISOString() },
  { _id: 'l-2', name: 'Guillermo Rauch', email: 'guillermo@vercel.com', companyName: 'Vercel Inc.', phone: '+1 (555) 019-2834', status: 'Active', value: 120000, tags: ['Enterprise', 'Key Client'], notes: 'Already signed. Standard next.js optimizer contract active.', createdAt: new Date().toISOString() },
  { _id: 'l-3', name: 'Patrick Collison', email: 'patrick@stripe.com', companyName: 'Stripe Inc.', phone: '+1 (555) 987-6543', status: 'Lead', value: 340000, tags: ['Fintech', 'Prospect'], notes: 'Evaluating CRM module against internal tools.', createdAt: new Date().toISOString() },
  { _id: 'l-4', name: 'Sam Altman', email: 'sam@openai.com', companyName: 'OpenAI', phone: '+1 (555) 111-2222', status: 'Inactive', value: 500000, tags: ['AI Partner'], notes: 'Requires high SLA compliance details before renewal.', createdAt: new Date().toISOString() }
];

const DEFAULT_INVOICES: Invoice[] = [
  {
    _id: 'i-1',
    invoiceNumber: 'INV-2026-001',
    clientId: 'l-2',
    clientName: 'Guillermo Rauch',
    clientEmail: 'guillermo@vercel.com',
    projectId: 'p-1',
    projectName: 'Next.js 16 Optimization Suite',
    issueDate: '2026-06-15',
    dueDate: '2026-07-15',
    items: [
      { description: 'Initial Architecture Planning Phase', quantity: 1, rate: 15000, amount: 15000 },
      { description: 'Vite and Tailwind Template Setup', quantity: 1, rate: 8000, amount: 8000 }
    ],
    subtotal: 23000,
    taxRate: 18,
    taxAmount: 4140,
    discount: 1000,
    total: 26140,
    status: 'Sent',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'i-2',
    invoiceNumber: 'INV-2026-002',
    clientId: 'l-2',
    clientName: 'Guillermo Rauch',
    clientEmail: 'guillermo@vercel.com',
    projectId: 'p-1',
    projectName: 'Next.js 16 Optimization Suite',
    issueDate: '2026-07-01',
    dueDate: '2026-08-01',
    items: [
      { description: 'Milestone 1 Developer Deliverables', quantity: 1, rate: 25000, amount: 25000 }
    ],
    subtotal: 25000,
    taxRate: 18,
    taxAmount: 4500,
    discount: 0,
    total: 29500,
    status: 'Paid',
    createdAt: new Date().toISOString()
  }
];

const DEFAULT_SEO_REPORTS: SEOReport[] = [
  {
    _id: 's-1',
    date: new Date().toISOString(),
    clicks: 14850,
    impressions: 492000,
    ctr: 3.02,
    avgPosition: 11.8,
    healthScore: 94,
    checklist: [
      { id: 'sc-1', task: 'Add structured JSON-LD schema to landing page', done: true },
      { id: 'sc-2', task: 'Verify Google Business Profile setup', done: true },
      { id: 'sc-3', task: 'Index blog post URLs manually via search console', done: true },
      { id: 'sc-4', task: 'Resolve 404 broken links on documentation page', done: false }
    ],
    competitors: [
      { name: 'Monday.com', visibility: 41.2, rank: 1 },
      { name: 'Jira Software', visibility: 37.8, rank: 2 },
      { name: 'Linear.app', visibility: 28.5, rank: 3 },
      { name: 'StackPilot AI', visibility: 22.4, rank: 4 }
    ],
    createdAt: new Date().toISOString()
  }
];

const DEFAULT_DOCUMENTS: Document[] = [
  {
    _id: 'd-1',
    title: 'StackPilot AI SRS (Software Requirement Specification)',
    content: `# Software Requirement Specification for StackPilot AI
## 1. Introduction
This document lists system requirements for the StackPilot AI unified platform.

## 2. Overall Description
StackPilot AI is a multi-tenant business hub containing CRM, Sprint boards, SEO index trackers, and AI helper utilities.

## 3. System Features
- **Client Pipeline**: Multi-phase pipeline board containing dragging cards.
- **AI Workspace**: Generation templates for software requirements, bug descriptions, and test logs.`,
    type: 'SRS',
    projectId: 'p-1',
    createdBy: 'u-5',
    version: 1,
    history: [
      { version: 1, updatedBy: 'Bruce Wayne', updatedAt: new Date().toISOString(), changeLog: 'Initial System Document Draft' }
    ],
    createdAt: new Date().toISOString()
  }
];

// Helper to load/save mock database to localStorage
class LocalDatabase {
  private get<T>(key: string, defaults: T[]): T[] {
    const data = localStorage.getItem(`sp_${key}`);
    if (!data) {
      localStorage.setItem(`sp_${key}`, JSON.stringify(defaults));
      return defaults;
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

  getNotifications() {
    const key = 'notifications';
    const defaults: Notification[] = [
      { _id: 'n-1', userId: 'u-1', title: 'Sprint planning initialized', message: 'Sarah Connor scheduled Sprint Planning 3 meetings.', type: 'info', read: false, createdAt: new Date().toISOString() },
      { _id: 'n-2', userId: 'u-1', title: 'Invoice Paid', message: 'Invoice INV-2026-002 was paid by Guillermo Rauch.', type: 'success', read: false, createdAt: new Date().toISOString() }
    ];
    return this.get(key, defaults);
  }
  saveNotifications(d: Notification[]) { this.save('notifications', d); }

  getActivities() {
    const key = 'activities';
    const defaults: ActivityLog[] = [
      { _id: 'act-1', userId: 'u-2', userName: 'Sarah Connor', userRole: 'Project Manager', action: 'Update Task status', details: 'Changed task t-1 to In Progress', createdAt: new Date().toISOString() },
      { _id: 'act-2', userId: 'u-7', userName: 'Tony Stark', userRole: 'Finance', action: 'Approve Invoice', details: 'Paid status marked for invoice INV-2026-002', createdAt: new Date().toISOString() }
    ];
    return this.get(key, defaults);
  }
  saveActivities(d: ActivityLog[]) { this.save('activities', d); }
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
      const newTask: Task = {
        _id: `t-${Date.now()}`,
        projectId: t.projectId || 'p-1',
        title: t.title || 'New Task',
        description: t.description || '',
        status: t.status || 'Todo',
        priority: t.priority || 'Medium',
        assigneeId: t.assigneeId,
        dueDate: t.dueDate,
        labels: t.labels || [],
        checklist: [],
        comments: [],
        attachments: [],
        estimatedTime: t.estimatedTime || 0,
        createdAt: new Date().toISOString()
      };

      tasks.push(newTask);
      mockDB.saveTasks(tasks);

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
      const updated = { ...oldTask, ...updates };
      tasks[idx] = updated;
      mockDB.saveTasks(tasks);

      // Log status changes
      if (updates.status && updates.status !== oldTask.status) {
        const cachedUser = localStorage.getItem('stackpilot_user');
        if (cachedUser) {
          const u = JSON.parse(cachedUser);
          const acts = mockDB.getActivities();
          acts.unshift({
            _id: `act-${Date.now()}`,
            userId: u._id,
            userName: u.name,
            userRole: u.role,
            action: 'Move Task',
            details: `Moved task "${updated.title}" from ${oldTask.status} to ${updated.status}`,
            createdAt: new Date().toISOString()
          });
          mockDB.saveActivities(acts);
        }
      }

      return updated;
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
      const updated = { ...leads[idx], ...updates };
      leads[idx] = updated;
      mockDB.saveLeads(leads);
      return updated;
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
    }
  },

  notifications: {
    async list(): Promise<Notification[]> {
      return mockDB.getNotifications();
    },

    async markAsRead(id: string): Promise<void> {
      const notifs = mockDB.getNotifications();
      const n = notifs.find(item => item._id === id);
      if (n) {
        n.read = true;
        mockDB.saveNotifications(notifs);
      }
    }
  },

  logs: {
    async list(): Promise<ActivityLog[]> {
      return mockDB.getActivities();
    }
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
