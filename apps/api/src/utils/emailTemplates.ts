export function getWelcomeEmailTemplate(name: string): { subject: string; html: string } {
  return {
    subject: "Welcome to StackPilot AI",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #f8fafc; padding: 30px; border-radius: 10px;">
        <h1 style="color: #38bdf8;">Welcome to StackPilot AI, ${name}!</h1>
        <p>Your account has been set up successfully.</p>
        <p>You can now access your dashboard and start collaborating with your team.</p>
        <div style="margin-top: 30px; border-top: 1px solid #334155; padding-top: 15px; font-size: 12px; color: #94a3b8;">
          StackPilot AI Enterprise SaaS
        </div>
      </div>
    `,
  };
}

export function getInvitationEmailTemplate(name: string, tempPassword: string, loginUrl: string): { subject: string; html: string } {
  return {
    subject: "You've been invited to StackPilot AI",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #f8fafc; padding: 30px; border-radius: 10px;">
        <h1 style="color: #38bdf8;">Welcome, ${name}!</h1>
        <p>An administrator has invited you to join <strong>StackPilot AI</strong>.</p>
        <p style="background: #1e293b; padding: 15px; border-radius: 6px; border-left: 4px solid #38bdf8;">
          <strong>Temporary Password:</strong> <code style="color: #f43f5e; font-size: 16px;">${tempPassword}</code>
        </p>
        <p>Please log in using your email and temporary password. You will be required to change your password upon your first login.</p>
        <p style="margin-top: 25px;">
          <a href="${loginUrl}" style="background: #0284c7; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; display: inline-block;">Log In to StackPilot AI</a>
        </p>
        <div style="margin-top: 30px; border-top: 1px solid #334155; padding-top: 15px; font-size: 12px; color: #94a3b8;">
          StackPilot AI Enterprise SaaS
        </div>
      </div>
    `,
  };
}

export function getForgotPasswordEmailTemplate(name: string, resetUrl: string): { subject: string; html: string } {
  return {
    subject: "Reset your StackPilot AI password",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #f8fafc; padding: 30px; border-radius: 10px;">
        <h1 style="color: #38bdf8;">Password Reset Request</h1>
        <p>Hello ${name},</p>
        <p>We received a request to reset your password. Click the button below to set a new password:</p>
        <p style="margin-top: 25px;">
          <a href="${resetUrl}" style="background: #16a34a; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; display: inline-block;">Reset Password</a>
        </p>
        <p style="font-size: 13px; color: #94a3b8;">This link will expire in 30 minutes. If you did not request a password reset, please ignore this email.</p>
        <div style="margin-top: 30px; border-top: 1px solid #334155; padding-top: 15px; font-size: 12px; color: #94a3b8;">
          StackPilot AI Enterprise SaaS
        </div>
      </div>
    `,
  };
}

export function getPasswordChangedEmailTemplate(name: string): { subject: string; html: string } {
  return {
    subject: "Security Notification: Password Changed",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #f8fafc; padding: 30px; border-radius: 10px;">
        <h1 style="color: #38bdf8;">Password Successfully Changed</h1>
        <p>Hello ${name},</p>
        <p>Your StackPilot AI account password has been changed successfully.</p>
        <p style="font-size: 13px; color: #f43f5e;">If you did not perform this change, please contact your administrator immediately.</p>
        <div style="margin-top: 30px; border-top: 1px solid #334155; padding-top: 15px; font-size: 12px; color: #94a3b8;">
          StackPilot AI Enterprise SaaS
        </div>
      </div>
    `,
  };
}

export function getAccountStatusEmailTemplate(name: string, active: boolean): { subject: string; html: string } {
  const action = active ? "Activated" : "Deactivated";
  return {
    subject: `Account Notice: Your account has been ${action.toLowerCase()}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #f8fafc; padding: 30px; border-radius: 10px;">
        <h1 style="color: ${active ? '#16a34a' : '#dc2626'};">Account ${action}</h1>
        <p>Hello ${name},</p>
        <p>Your StackPilot AI account status has been updated to: <strong>${action}</strong>.</p>
        ${
          active
            ? "<p>You may now log in to access your platform account.</p>"
            : "<p>Access to your platform account has been suspended. Please contact your system administrator for assistance.</p>"
        }
        <div style="margin-top: 30px; border-top: 1px solid #334155; padding-top: 15px; font-size: 12px; color: #94a3b8;">
          StackPilot AI Enterprise SaaS
        </div>
      </div>
    `,
  };
}
