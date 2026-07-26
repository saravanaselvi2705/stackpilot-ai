import { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';

// Simple in-memory rate limiter middleware
const requestCounts = new Map<string, { count: number; resetTime: number }>();

export const rateLimiter = (options = { windowMs: 15 * 60 * 1000, max: 100 }) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.socket.remoteAddress || '127.0.0.1';
    const now = Date.now();

    let record = requestCounts.get(ip);

    if (!record || now > record.resetTime) {
      record = { count: 1, resetTime: now + options.windowMs };
      requestCounts.set(ip, record);
    } else {
      record.count += 1;
    }

    if (record.count > options.max) {
      return res.status(429).json({
        error: 'Too many requests from this IP, please try again after 15 minutes.'
      });
    }

    next();
  };
};

// Mongo Injection & Basic Input Sanitizer
export const sanitizeInputs = (req: Request, _res: Response, next: NextFunction) => {
  const sanitize = (obj: any): any => {
    if (!obj || typeof obj !== 'object') return obj;
    for (const key of Object.keys(obj)) {
      if (key.startsWith('$') || key.includes('.')) {
        delete obj[key];
      } else if (typeof obj[key] === 'object') {
        sanitize(obj[key]);
      }
    }
    return obj;
  };

  if (req.body) sanitize(req.body);
  if (req.query) sanitize(req.query);
  if (req.params) sanitize(req.params);

  next();
};

export const helmetSecurity = helmet({
  contentSecurityPolicy: false,
});

export const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled Error:', err);
  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {})
  });
};
