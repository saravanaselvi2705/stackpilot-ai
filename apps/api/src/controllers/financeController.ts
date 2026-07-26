import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import * as db from '../models';

// Invoices
export const getInvoices = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { status, search } = req.query;
    const filter: any = { isDeleted: false };
    if (status && typeof status === 'string') filter.status = status;
    if (search && typeof search === 'string') {
      filter.$or = [
        { invoiceNumber: { $regex: search, $options: 'i' } },
        { clientName: { $regex: search, $options: 'i' } },
      ];
    }
    const invoices = await db.Invoice.find(filter).sort({ createdAt: -1 });
    return res.status(200).json(invoices);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const createInvoice = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { clientId, clientName, clientEmail, projectId, projectName, dueDate, items, taxRate, discount, recurring } = req.body;

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
      status: 'Sent',
      recurring: recurring || false,
    });

    await invoice.save();
    return res.status(201).json(invoice);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateInvoiceStatus = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const invoice = await db.Invoice.findByIdAndUpdate(id, { status }, { new: true });
    if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
    return res.status(200).json(invoice);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// Quotations / Estimates
export const getQuotations = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const quotes = await db.Quotation.find({ isDeleted: false }).sort({ createdAt: -1 });
    return res.status(200).json(quotes);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const createQuotation = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { clientId, clientName, clientEmail, items, validUntil } = req.body;
    const total = items.reduce((acc: number, i: any) => acc + (i.rate * i.quantity), 0);
    const quoteNumber = `QT-${Date.now().toString().slice(-6)}`;

    const quote = new db.Quotation({
      quoteNumber,
      clientId,
      clientName,
      clientEmail,
      items: items.map((i: any) => ({ ...i, amount: i.rate * i.quantity })),
      total,
      validUntil,
      status: 'Sent',
    });

    await quote.save();
    return res.status(201).json(quote);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// Expenses
export const getExpenses = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const expenses = await db.Expense.find({ isDeleted: false })
      .populate('projectId', 'name')
      .populate('clientId', 'name')
      .sort({ date: -1 });
    return res.status(200).json(expenses);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const createExpense = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { title, category, amount, date, projectId, clientId, receiptUrl } = req.body;
    if (!title || !amount) return res.status(400).json({ error: 'Title and amount are required' });

    const expense = new db.Expense({
      title,
      category: category || 'Software',
      amount,
      date: date || new Date(),
      projectId,
      clientId,
      receiptUrl,
      recordedBy: req.user ? req.user.id : undefined,
    });

    await expense.save();
    return res.status(201).json(expense);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// Financial Profit / Loss Dashboard Metrics
export const getProfitLossDashboard = async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const invoices = await db.Invoice.find({ isDeleted: false });
    const expenses = await db.Expense.find({ isDeleted: false });

    const totalInvoiced = invoices.reduce((acc, i) => acc + (i.total || 0), 0);
    const paidRevenue = invoices.filter(i => i.status === 'Paid').reduce((acc, i) => acc + (i.total || 0), 0);
    const outstandingRevenue = invoices.filter(i => i.status === 'Sent' || i.status === 'Overdue').reduce((acc, i) => acc + (i.total || 0), 0);
    const totalExpenses = expenses.reduce((acc, e) => acc + (e.amount || 0), 0);
    const netProfit = paidRevenue - totalExpenses;

    return res.status(200).json({
      totalInvoiced,
      paidRevenue,
      outstandingRevenue,
      totalExpenses,
      netProfit,
      margin: paidRevenue > 0 ? parseFloat(((netProfit / paidRevenue) * 100).toFixed(1)) : 0,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
