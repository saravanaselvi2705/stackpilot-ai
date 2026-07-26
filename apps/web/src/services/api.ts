import axios from 'axios';
import type { User, Project, Task, Client, Invoice, Document, SEOReport, BlogPost, Keyword, ActivityLog, Notification, UserRole, Enquiry, PresentationRequest } from '../../../../packages/shared/types';

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

// System Super Admin User
const DEFAULT_USERS: User[] = [
  { _id: 'u-1', name: 'Super Admin', email: 'admin@stackpilot.ai', role: 'Super Admin', avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Admin', department: 'Administration', availability: 'Available', twoFAEnabled: false, createdAt: new Date().toISOString() },
  { _id: 'u-2', name: 'Alexander Wright', email: 'alex@stackpilot.ai', role: 'Super Admin', avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Alex', department: 'Executive', availability: 'Available', twoFAEnabled: false, createdAt: new Date().toISOString() }
];

const DEFAULT_PROJECTS: Project[] = [];
const DEFAULT_TASKS: Task[] = [];
const DEFAULT_LEADS: Client[] = [];
const DEFAULT_INVOICES: Invoice[] = [];
const DEFAULT_SEO_REPORTS: SEOReport[] = [];
const DEFAULT_DOCUMENTS: Document[] = [];
const DEFAULT_ENQUIRIES: Enquiry[] = [];
const DEFAULT_PRESENTATION_REQUESTS: PresentationRequest[] = [];

// Helper to load/save mock database to localStorage
class LocalDatabase {
  private get<T>(key: string, defaults: T[]): T[] {
    const data = localStorage.getItem(`sp_${key}`);
    if (!data) {
      if (localStorage.getItem('sp_demo_mode') === null) {
        localStorage.setItem('sp_demo_mode', 'false');
      }
      const isDemoMode = localStorage.getItem('sp_demo_mode') === 'true';
      const actualDefaults = (isDemoMode || key === 'users') ? defaults : [];
      localStorage.setItem(`sp_${key}`, JSON.stringify(actualDefaults));
      return actualDefaults;
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

  getEnquiries(): Enquiry[] { return this.get<Enquiry>('enquiries', DEFAULT_ENQUIRIES); }
  saveEnquiries(d: Enquiry[]) { this.save('enquiries', d); }

  getPresentationRequests(): PresentationRequest[] { return this.get<PresentationRequest>('presentation_requests', DEFAULT_PRESENTATION_REQUESTS); }
  savePresentationRequests(d: PresentationRequest[]) { this.save('presentation_requests', d); }

  getNotifications(): Notification[] {
    return this.get<Notification>('notifications', []);
  }
  saveNotifications(d: Notification[]) { this.save('notifications', d); }

  getActivities(): ActivityLog[] {
    return this.get<ActivityLog>('activities', []);
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
    },

    async delete(id: string): Promise<void> {
      try {
        if (!API.isMockMode) {
          await apiClient.delete(`/projects/${id}`);
        }
      } catch { }
      const list = mockDB.getProjects().filter(p => p._id !== id);
      mockDB.saveProjects(list);
      await API.adminDelete('Projects', id);
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
    },

    async delete(id: string): Promise<void> {
      try {
        if (!API.isMockMode) {
          await apiClient.delete(`/tasks/${id}`);
        }
      } catch { }
      const list = mockDB.getTasks().filter(t => t._id !== id);
      mockDB.saveTasks(list);
      await API.adminDelete('Tasks', id);
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
    },

    async deleteReport(reportId: string): Promise<void> {
      const reports = mockDB.getSEOs().filter(r => r._id !== reportId);
      mockDB.saveSEOs(reports);
      await API.adminDelete('Reports', reportId);
    }
  },

  calendar: {
    async deleteEvent(eventId: string): Promise<void> {
      await API.adminDelete('Calendar', eventId);
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

  enquiries: {
    async create(data: Omit<Enquiry, '_id' | 'status' | 'createdAt'>): Promise<Enquiry> {
      const enquiries = mockDB.getEnquiries();
      const newEnquiry: Enquiry = {
        _id: `enq-${Date.now()}`,
        ...data,
        status: 'New',
        createdAt: new Date().toISOString()
      };
      enquiries.push(newEnquiry);
      mockDB.saveEnquiries(enquiries);

      // Log activity
      const activities = mockDB.getActivities();
      activities.unshift({
        _id: `act-${Date.now()}`,
        userId: 'u-system',
        userName: data.name,
        userRole: 'Client',
        action: 'New Lead Enquiry Submitted',
        details: `Enquiry from ${data.email} (${data.companyName}) sent to creovixstack@gmail.com`,
        createdAt: new Date().toISOString()
      });
      mockDB.saveActivities(activities);

      return newEnquiry;
    },
    async list(): Promise<Enquiry[]> {
      return mockDB.getEnquiries();
    },
    async delete(id: string): Promise<void> {
      const list = mockDB.getEnquiries().filter(e => e._id !== id);
      mockDB.saveEnquiries(list);
    }
  },

  presentationRequests: {
    async create(data: Omit<PresentationRequest, '_id' | 'status' | 'createdAt'>): Promise<PresentationRequest> {
      const requests = mockDB.getPresentationRequests();
      const newReq: PresentationRequest = {
        _id: `pr-${Date.now()}`,
        ...data,
        status: 'Pending',
        createdAt: new Date().toISOString()
      };
      requests.push(newReq);
      mockDB.savePresentationRequests(requests);

      // Log activity
      const activities = mockDB.getActivities();
      activities.unshift({
        _id: `act-${Date.now()}`,
        userId: 'u-system',
        userName: data.name,
        userRole: 'Client',
        action: 'Presentation Requested',
        details: `Presentation request from ${data.email} (${data.companyName}) sent to creovixstack@gmail.com`,
        createdAt: new Date().toISOString()
      });
      mockDB.saveActivities(activities);

      return newReq;
    },
    async list(): Promise<PresentationRequest[]> {
      return mockDB.getPresentationRequests();
    },
    async delete(id: string): Promise<void> {
      const list = mockDB.getPresentationRequests().filter(r => r._id !== id);
      mockDB.savePresentationRequests(list);
    }
  },

  adminDelete: async (module: string, recordId: string, performerName = 'Super Admin'): Promise<void> => {
    const activities = mockDB.getActivities();
    activities.unshift({
      _id: `act-${Date.now()}`,
      userId: 'u-1',
      userName: performerName,
      userRole: 'Super Admin',
      action: `Permanent Delete: ${module}`,
      details: `Record ID ${recordId} was permanently deleted from module ${module}.`,
      createdAt: new Date().toISOString()
    });
    mockDB.saveActivities(activities);
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
