import { describe, it, expect, beforeAll } from 'vitest';
import axios from 'axios';

const API_BASE_URL = process.env.API_BASE_URL || 'https://stackpilot-ai-c1p6.onrender.com';

describe('StackPilot AI - Backend API Automation & Security Suite', () => {
  let authToken: string = '';

  beforeAll(async () => {
    // Obtain JWT token
    const res = await axios.post(`${API_BASE_URL}/api/auth/login`, {
      email: 'admin@stackpilot.ai',
      password: 'password123'
    });
    authToken = res.data.token;
  });

  describe('Authentication & Access Control', () => {
    it('API-AUTH-01: Valid login returns JWT token', async () => {
      const res = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        email: 'admin@stackpilot.ai',
        password: 'password123'
      });
      expect(res.status).toBe(200);
      expect(res.data).toHaveProperty('token');
      expect(res.data.user.email).toBe('admin@stackpilot.ai');
    });

    it('API-AUTH-02: Invalid credentials return 401 Unauthorized', async () => {
      try {
        await axios.post(`${API_BASE_URL}/api/auth/login`, {
          email: 'admin@stackpilot.ai',
          password: 'wrong_password'
        });
      } catch (err: any) {
        expect(err.response.status).toBe(401);
        expect(err.response.data.error).toMatch(/invalid/i);
      }
    });

    it('API-AUTH-03: Missing Auth token on protected endpoint returns 401', async () => {
      try {
        await axios.get(`${API_BASE_URL}/api/auth/profile`);
      } catch (err: any) {
        expect(err.response.status).toBe(401);
        expect(err.response.data.error).toMatch(/unauthorized/i);
      }
    });

    it('API-AUTH-04: Malformed JWT token returns HTTP 403 Forbidden', async () => {
      try {
        await axios.get(`${API_BASE_URL}/api/auth/profile`, {
          headers: { Authorization: 'Bearer invalid_token_xyz' }
        });
      } catch (err: any) {
        expect(err.response.status).toBe(403);
      }
    });
  });

  describe('Security Vulnerability Regression Tests', () => {
    it('API-SEC-01: NoSQL Injection Payload Check on Login', async () => {
      const payload = { email: { "$gt": "" }, password: "password123" };
      const res = await axios.post(`${API_BASE_URL}/api/auth/login`, payload, { validateStatus: () => true });
      // SECURITY REQUIREMENT: NoSQL injection MUST be sanitized and rejected with 401 or 400
      expect(res.status).not.toBe(200);
    });

    it('API-SEC-02: Unhandled Mongoose CastError on Invalid Task ID', async () => {
      const res = await axios.put(
        `${API_BASE_URL}/api/tasks/invalid-mongo-id`,
        { status: 'Completed' },
        { headers: { Authorization: `Bearer ${authToken}` }, validateStatus: () => true }
      );
      // EXPECTED: 400 Bad Request instead of 500 Internal Server Error
      expect(res.status).toBe(400);
    });
  });

  describe('Core Business Modules API', () => {
    it('API-PM-01: GET /api/projects returns list of projects', async () => {
      const res = await axios.get(`${API_BASE_URL}/api/projects`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      expect(res.status).toBe(200);
      expect(Array.isArray(res.data)).toBe(true);
    });

    it('API-PM-02: GET /api/tasks returns list of workspace tasks', async () => {
      const res = await axios.get(`${API_BASE_URL}/api/tasks`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      expect(res.status).toBe(200);
      expect(Array.isArray(res.data)).toBe(true);
    });

    it('API-CRM-01: GET /api/crm/leads returns lead pipeline', async () => {
      const res = await axios.get(`${API_BASE_URL}/api/crm/leads`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      expect(res.status).toBe(200);
      expect(Array.isArray(res.data)).toBe(true);
    });

    it('API-FIN-01: GET /api/finance/invoices returns invoices list', async () => {
      const res = await axios.get(`${API_BASE_URL}/api/finance/invoices`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      expect(res.status).toBe(200);
      expect(Array.isArray(res.data)).toBe(true);
    });

    it('API-AI-01: POST /api/ai/requirements generates software specifications', async () => {
      const res = await axios.post(
        `${API_BASE_URL}/api/ai/requirements`,
        { prompt: 'Build OAuth 2.0 Auth Server' },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      expect(res.status).toBe(200);
      expect(res.data).toHaveProperty('content');
    });
  });
});
