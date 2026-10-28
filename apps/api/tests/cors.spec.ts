import { corsOptions } from '../src/middleware/security';

describe('CORS Security Configuration Suite', () => {
  const originalEnv = { ...process.env };

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  const checkCorsOrigin = (originHeader: string | undefined): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      const originFn = corsOptions.origin as (
        origin: string | undefined,
        callback: (err: Error | null, allow?: boolean) => void
      ) => void;

      originFn(originHeader, (err, allow) => {
        if (err) {
          reject(err);
        } else {
          resolve(!!allow);
        }
      });
    });
  };

  describe('Production Environment (NODE_ENV=production)', () => {
    it('Req 2: Throws error if FRONTEND_URL is missing or empty in production', async () => {
      process.env.NODE_ENV = 'production';
      delete process.env.FRONTEND_URL;

      await expect(checkCorsOrigin('https://stackpilot-ai.com')).rejects.toThrow(
        /FRONTEND_URL environment variable is required in production mode/i
      );
    });

    it('Req 1 & 2: Allows origin matching FRONTEND_URL in production', async () => {
      process.env.NODE_ENV = 'production';
      process.env.FRONTEND_URL = 'https://app.stackpilot.ai';

      const result = await checkCorsOrigin('https://app.stackpilot.ai');
      expect(result).toBe(true);
    });

    it('Req 1 & 2: Supports multiple comma-separated origins in FRONTEND_URL', async () => {
      process.env.NODE_ENV = 'production';
      process.env.FRONTEND_URL = 'https://app.stackpilot.ai, https://admin.stackpilot.ai';

      const res1 = await checkCorsOrigin('https://app.stackpilot.ai');
      const res2 = await checkCorsOrigin('https://admin.stackpilot.ai');

      expect(res1).toBe(true);
      expect(res2).toBe(true);
    });

    it('Req 2 & 3: Blocks localhost origins in production if not in FRONTEND_URL', async () => {
      process.env.NODE_ENV = 'production';
      process.env.FRONTEND_URL = 'https://app.stackpilot.ai';

      await expect(checkCorsOrigin('http://localhost:5173')).rejects.toThrow(
        /not allowed by FRONTEND_URL configuration in production/i
      );
    });

    it('Req 2: Blocks unauthorized external origins in production', async () => {
      process.env.NODE_ENV = 'production';
      process.env.FRONTEND_URL = 'https://app.stackpilot.ai';

      await expect(checkCorsOrigin('https://attacker.com')).rejects.toThrow(
        /not allowed by FRONTEND_URL configuration in production/i
      );
    });
  });

  describe('Development Environment (NODE_ENV=development)', () => {
    it('Req 3: Allows localhost origins in development mode', async () => {
      process.env.NODE_ENV = 'development';
      process.env.FRONTEND_URL = 'http://localhost:5173';

      const res1 = await checkCorsOrigin('http://localhost:5173');
      const res2 = await checkCorsOrigin('http://localhost:3000');
      const res3 = await checkCorsOrigin('http://127.0.0.1:5173');

      expect(res1).toBe(true);
      expect(res2).toBe(true);
      expect(res3).toBe(true);
    });

    it('Allows non-browser requests without origin header', async () => {
      process.env.NODE_ENV = 'production';
      process.env.FRONTEND_URL = 'https://app.stackpilot.ai';

      const result = await checkCorsOrigin(undefined);
      expect(result).toBe(true);
    });
  });
});
