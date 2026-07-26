import { Router } from 'express';
import * as crmCtrl from '../controllers/crmController';
import { authenticateJWT } from '../middleware/auth';
import { requirePermission } from '../middleware/rbac';
import { PERMISSIONS } from '../constants/permissions';

const router = Router();

router.use(authenticateJWT);

// CRM Dashboard
router.get('/dashboard', requirePermission(PERMISSIONS.CRM_MANAGE), crmCtrl.getCRMDashboard);

// CSV Export & Import
router.get('/export/leads', requirePermission(PERMISSIONS.CRM_MANAGE), crmCtrl.exportLeadsCSV);

// Companies
router.get('/companies', requirePermission(PERMISSIONS.CRM_MANAGE), crmCtrl.getCompanies);
router.post('/companies', requirePermission(PERMISSIONS.CRM_MANAGE), crmCtrl.createCompany);
router.put('/companies/:id', requirePermission(PERMISSIONS.CRM_MANAGE), crmCtrl.updateCompany);
router.delete('/companies/:id', requirePermission(PERMISSIONS.CRM_MANAGE), crmCtrl.deleteCompany);

// Clients
router.get('/clients', requirePermission(PERMISSIONS.CRM_MANAGE), crmCtrl.getClients);
router.post('/clients', requirePermission(PERMISSIONS.CRM_MANAGE), crmCtrl.createClient);
router.put('/clients/:id', requirePermission(PERMISSIONS.CRM_MANAGE), crmCtrl.updateClient);
router.delete('/clients/:id', requirePermission(PERMISSIONS.CRM_MANAGE), crmCtrl.deleteClient);

// Leads
router.get('/leads', requirePermission(PERMISSIONS.CRM_MANAGE), crmCtrl.getLeads);
router.post('/leads', requirePermission(PERMISSIONS.CRM_MANAGE), crmCtrl.createLead);
router.put('/leads/:id', requirePermission(PERMISSIONS.CRM_MANAGE), crmCtrl.updateLead);

// Deals Pipeline
router.get('/deals', requirePermission(PERMISSIONS.CRM_MANAGE), crmCtrl.getDeals);
router.post('/deals', requirePermission(PERMISSIONS.CRM_MANAGE), crmCtrl.createDeal);
router.patch('/deals/:id/stage', requirePermission(PERMISSIONS.CRM_MANAGE), crmCtrl.updateDealStage);

export default router;
