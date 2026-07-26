import { transporter } from "./mailer";
import {
  getWelcomeEmailTemplate,
  getInvitationEmailTemplate,
  getForgotPasswordEmailTemplate,
  getPasswordChangedEmailTemplate,
  getAccountStatusEmailTemplate,
} from "./emailTemplates";

export class EmailService {
  private static async send(to: string, subject: string, html: string) {
    try {
      await transporter.verify();
      console.log("SMTP connection verified successfully");
    } catch (verifyError: any) {
      console.error("SMTP verification error:", {
        message: verifyError.message,
        code: verifyError.code,
        response: verifyError.response,
        responseCode: verifyError.responseCode,
        stack: verifyError.stack,
      });
      throw verifyError;
    }

    try {
      const info = await transporter.sendMail({
        from: process.env.SMTP_FROM || "StackPilot AI <noreply@stackpilot.ai>",
        to,
        subject,
        html,
      });
      console.log(`Email sent to ${to}: ${info.messageId}`);
      return info;
    } catch (sendError: any) {
      console.error("Failed to send email:", {
        to,
        subject,
        message: sendError.message,
        code: sendError.code,
        response: sendError.response,
        responseCode: sendError.responseCode,
        stack: sendError.stack,
      });
      throw sendError;
    }
  }

  static async sendWelcome(to: string, name: string) {
    const { subject, html } = getWelcomeEmailTemplate(name);
    return this.send(to, subject, html);
  }

  static async sendInvitation(to: string, name: string, tempPass: string, loginUrl: string) {
    const { subject, html } = getInvitationEmailTemplate(name, tempPass, loginUrl);
    return this.send(to, subject, html);
  }

  static async sendForgotPassword(to: string, name: string, resetUrl: string) {
    const { subject, html } = getForgotPasswordEmailTemplate(name, resetUrl);
    return this.send(to, subject, html);
  }

  static async sendPasswordChanged(to: string, name: string) {
    const { subject, html } = getPasswordChangedEmailTemplate(name);
    return this.send(to, subject, html);
  }

  static async sendAccountStatus(to: string, name: string, active: boolean) {
    const { subject, html } = getAccountStatusEmailTemplate(name, active);
    return this.send(to, subject, html);
  }
}
