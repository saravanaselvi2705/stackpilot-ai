import { Router } from 'express';
import * as finCtrl from '../controllers/financeController';
import { authenticateJWT } from '../middleware/auth';
import { requirePermission } from '../middleware/rbac';
import { PERMISSIONS } from '../constants/permissions';

const router = Router();

router.use(authenticateJWT);

router.get('/invoices', requirePermission(PERMISSIONS.FINANCE_MANAGE), finCtrl.getInvoices);
router.post('/invoices', requirePermission(PERMISSIONS.FINANCE_MANAGE), finCtrl.createInvoice);
router.patch('/invoices/:id/status', requirePermission(PERMISSIONS.FINANCE_MANAGE), finCtrl.updateInvoiceStatus);

router.get('/quotations', requirePermission(PERMISSIONS.FINANCE_MANAGE), finCtrl.getQuotations);
router.post('/quotations', requirePermission(PERMISSIONS.FINANCE_MANAGE), finCtrl.createQuotation);

router.get('/expenses', requirePermission(PERMISSIONS.FINANCE_MANAGE), finCtrl.getExpenses);
router.post('/expenses', requirePermission(PERMISSIONS.FINANCE_MANAGE), finCtrl.createExpense);

router.get('/profit-loss', requirePermission(PERMISSIONS.FINANCE_MANAGE), finCtrl.getProfitLossDashboard);

export default router;
