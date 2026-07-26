import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import * as db from '../models';

// ===================================
// COMPANIES
// ===================================
export const getCompanies = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { search } = req.query;
    const filter: any = { isDeleted: false };
    if (search && typeof search === 'string') {
      filter.name = { $regex: search, $options: 'i' };
    }
    const companies = await db.Company.find(filter).sort({ createdAt: -1 });
    return res.status(200).json(companies);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const createCompany = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, domain, industry, size, address, phone, email } = req.body;
    if (!name) return res.status(400).json({ error: 'Company name is required' });

    const company = new db.Company({
      name,
      domain,
      industry,
      size,
      address,
      phone,
      email,
    });
    await company.save();

    if (req.user) {
      await new db.ActivityLog({
        userId: req.user.id,
        userName: req.user.email,
        userRole: req.user.role,
        action: 'CRM Action',
        details: `Created company "${company.name}"`,
      }).save();
    }

    return res.status(201).json(company);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateCompany = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const company = await db.Company.findOneAndUpdate(
      { _id: id, isDeleted: false },
      req.body,
      { new: true }
    );
    if (!company) return res.status(404).json({ error: 'Company not found' });
    return res.status(200).json(company);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteCompany = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const company = await db.Company.findByIdAndUpdate(id, { isDeleted: true, deletedAt: new Date() }, { new: true });
    if (!company) return res.status(404).json({ error: 'Company not found' });
    return res.status(200).json({ message: 'Company soft-deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// ===================================
// CLIENTS & CONTACTS
// ===================================
export const getClients = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { search, status } = req.query;
    const filter: any = { isDeleted: false };
    if (search && typeof search === 'string') {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { companyName: { $regex: search, $options: 'i' } },
      ];
    }
    if (status && typeof status === 'string') filter.status = status;

    const clients = await db.Client.find(filter).sort({ createdAt: -1 });
    return res.status(200).json(clients);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const createClient = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, email, companyName, phone, value, status, tags, notes } = req.body;
    if (!name || !email) return res.status(400).json({ error: 'Name and email are required' });

    const client = new db.Client({
      name,
      email,
      companyName,
      phone,
      value: value || 0,
      status: status || 'Lead',
      tags: tags || [],
      notes,
    });
    await client.save();

    if (req.user) {
      await new db.ActivityLog({
        userId: req.user.id,
        userName: req.user.email,
        userRole: req.user.role,
        action: 'CRM Action',
        details: `Created client "${client.name}" (${client.email})`,
      }).save();
    }

    return res.status(201).json(client);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateClient = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const client = await db.Client.findOneAndUpdate({ _id: id, isDeleted: false }, req.body, { new: true });
    if (!client) return res.status(404).json({ error: 'Client not found' });
    return res.status(200).json(client);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteClient = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const client = await db.Client.findByIdAndUpdate(id, { isDeleted: true, deletedAt: new Date() }, { new: true });
    if (!client) return res.status(404).json({ error: 'Client not found' });
    return res.status(200).json({ message: 'Client soft-deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// ===================================
// LEADS & DEALS PIPELINE
// ===================================
export const getLeads = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { search, status, source } = req.query;
    const filter: any = { isDeleted: false };
    if (search && typeof search === 'string') {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { companyName: { $regex: search, $options: 'i' } },
      ];
    }
    if (status && typeof status === 'string') filter.status = status;
    if (source && typeof source === 'string') filter.source = source;

    const leads = await db.Lead.find(filter).populate('ownerId', 'name email avatarUrl').sort({ createdAt: -1 });
    return res.status(200).json(leads);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const createLead = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, companyName, email, phone, status, source, value, notes, ownerId } = req.body;
    if (!name || !email) return res.status(400).json({ error: 'Lead name and email are required' });

    const lead = new db.Lead({
      name,
      companyName,
      email,
      phone,
      status: status || 'New',
      source: source || 'Website',
      value: value || 0,
      notes,
      ownerId: ownerId || (req.user ? req.user.id : undefined),
    });
    await lead.save();

    if (req.user) {
      await new db.ActivityLog({
        userId: req.user.id,
        userName: req.user.email,
        userRole: req.user.role,
        action: 'CRM Action',
        details: `Created new lead "${lead.name}" (${lead.companyName || 'N/A'})`,
      }).save();
    }

    return res.status(201).json(lead);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateLead = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const lead = await db.Lead.findOneAndUpdate({ _id: id, isDeleted: false }, req.body, { new: true });
    if (!lead) return res.status(404).json({ error: 'Lead not found' });
    return res.status(200).json(lead);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const getDeals = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { stage } = req.query;
    const filter: any = { isDeleted: false };
    if (stage && typeof stage === 'string') filter.stage = stage;

    const deals = await db.Deal.find(filter)
      .populate('clientId', 'name email companyName')
      .populate('ownerId', 'name email avatarUrl')
      .sort({ createdAt: -1 });

    return res.status(200).json(deals);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const createDeal = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { title, clientId, leadId, stage, value, probability, expectedCloseDate, notes } = req.body;
    if (!title) return res.status(400).json({ error: 'Deal title is required' });

    const deal = new db.Deal({
      title,
      clientId,
      leadId,
      stage: stage || 'New',
      value: value || 0,
      probability: probability || 50,
      expectedCloseDate,
      ownerId: req.user ? req.user.id : undefined,
      notes,
    });
    await deal.save();

    return res.status(201).json(deal);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateDealStage = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { stage } = req.body;
    if (!stage) return res.status(400).json({ error: 'Stage is required' });

    const deal = await db.Deal.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { stage },
      { new: true }
    );
    if (!deal) return res.status(404).json({ error: 'Deal not found' });

    if (req.user) {
      await new db.ActivityLog({
        userId: req.user.id,
        userName: req.user.email,
        userRole: req.user.role,
        action: 'CRM Action',
        details: `Moved deal "${deal.title}" to stage ${stage}`,
      }).save();
    }

    return res.status(200).json(deal);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// ===================================
// CRM DASHBOARD & METRICS
// ===================================
export const getCRMDashboard = async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const totalLeads = await db.Lead.countDocuments({ isDeleted: false });
    const wonLeads = await db.Lead.countDocuments({ status: 'Won', isDeleted: false });
    const lostLeads = await db.Lead.countDocuments({ status: 'Lost', isDeleted: false });
    const openDealsCount = await db.Deal.countDocuments({ stage: { $nin: ['Won', 'Lost'] }, isDeleted: false });

    const conversionRate = totalLeads > 0 ? ((wonLeads / totalLeads) * 100).toFixed(1) : '0.0';

    const deals = await db.Deal.find({ isDeleted: false });
    const wonDealsValue = deals.filter(d => d.stage === 'Won').reduce((acc, d) => acc + (d.value || 0), 0);
    const pipelineValue = deals.filter(d => d.stage !== 'Lost').reduce((acc, d) => acc + (d.value || 0), 0);

    return res.status(200).json({
      totalLeads,
      wonLeads,
      lostLeads,
      openDealsCount,
      conversionRate: parseFloat(conversionRate),
      wonDealsValue,
      pipelineValue,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// CSV Export
export const exportLeadsCSV = async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const leads = await db.Lead.find({ isDeleted: false });
    const header = 'ID,Name,CompanyName,Email,Phone,Status,Source,Value\n';
    const rows = leads.map(l => 
      `"${l._id}","${l.name}","${l.companyName || ''}","${l.email}","${l.phone || ''}","${l.status}","${l.source}",${l.value || 0}`
    ).join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="leads_export.csv"');
    return res.status(200).send(header + rows);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
