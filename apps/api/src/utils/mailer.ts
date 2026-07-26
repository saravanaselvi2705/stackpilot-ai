import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export function validateSMTPConfig() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM;

  if (!host) {
    throw new Error("SMTP Configuration Error: SMTP_HOST environment variable is not configured.");
  }
  if (!port || isNaN(Number(port))) {
    throw new Error("SMTP Configuration Error: SMTP_PORT environment variable is not configured or invalid.");
  }
  if (!user) {
    throw new Error("SMTP Configuration Error: SMTP_USER environment variable is not configured.");
  }
  if (!pass) {
    throw new Error("SMTP Configuration Error: SMTP_PASS environment variable is not configured.");
  }

  // Gmail compatibility validation
  if (host.toLowerCase() === "smtp.gmail.com") {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user)) {
      throw new Error(
        `SMTP Configuration Error: Gmail SMTP requires SMTP_USER to be a valid email address (e.g. user@gmail.com). Received: '${user}'`
      );
    }
  }

  // SMTP_FROM validation
  if (from) {
    const fromEmailMatch = from.match(/<([^>]+)>/) || [null, from];
    const emailCandidate = (fromEmailMatch[1] || from).trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailCandidate)) {
      throw new Error(
        `SMTP Configuration Error: SMTP_FROM environment variable must contain a valid email address. Received: '${from}'`
      );
    }
  }
}

export function createMailerTransporter() {
  validateSMTPConfig();

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

// Export transporter proxy so configuration is dynamically loaded and validated
export const transporter = new Proxy({} as nodemailer.Transporter, {
  get(_target, prop, receiver) {
    const instance = createMailerTransporter();
    const value = Reflect.get(instance, prop, receiver);
    if (typeof value === "function") {
      return value.bind(instance);
    }
    return value;
  }
});