import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import * as db from '../models';

export const getExportReport = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { module, format } = req.query; // module = crm|finance|projects|tasks|seo, format = csv|json

    if (module === 'crm') {
      const leads = await db.Lead.find({ isDeleted: false });
      if (format === 'csv') {
        const header = 'ID,Name,CompanyName,Email,Status,Value\n';
        const rows = leads.map(l => `"${l._id}","${l.name}","${l.companyName || ''}","${l.email}","${l.status}",${l.value}`).join('\n');
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="crm_report.csv"');
        return res.status(200).send(header + rows);
      }
      return res.status(200).json(leads);
    }

    if (module === 'finance') {
      const invoices = await db.Invoice.find({ isDeleted: false });
      if (format === 'csv') {
        const header = 'InvoiceNumber,ClientName,Status,Total,DueDate\n';
        const rows = invoices.map(i => `"${i.invoiceNumber}","${i.clientName}","${i.status}",${i.total},"${i.dueDate}"`).join('\n');
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="finance_report.csv"');
        return res.status(200).send(header + rows);
      }
      return res.status(200).json(invoices);
    }

    // Default response
    const projects = await db.Project.find({ isDeleted: false });
    return res.status(200).json(projects);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
