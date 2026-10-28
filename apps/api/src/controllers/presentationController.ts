import { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import path from 'path';
import fs from 'fs';
import { PresentationRequest } from '../models';

export const createPresentationRequest = async (req: Request, res: Response) => {
  try {
    const { name, companyName, email, phone } = req.body;

    if (!name || !email) {
      return res.status(400).json({ success: false, message: 'Name and email are required to download the presentation deck.' });
    }

    // 1. Save lead to MongoDB
    const newRequest = await PresentationRequest.create({
      name: name.trim(),
      companyName: companyName ? companyName.trim() : '',
      email: email.trim(),
      phone: phone ? phone.trim() : ''
    });

    // 2. Configure Nodemailer Transporter if SMTP is provided
    if (process.env.SMTP_HOST && process.env.SMTP_USER) {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined,
          secure: process.env.SMTP_PORT === '465',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        const attachments = [];
        const pptxPath = path.join(process.cwd(), 'public/assets/StackPilot-AI-Enterprise-Deck.pptx');
        const pdfPath = path.join(process.cwd(), 'public/assets/StackPilot-AI-Enterprise-Deck.pdf');

        if (fs.existsSync(pptxPath)) {
          attachments.push({ filename: 'StackPilot-AI-Enterprise-Deck.pptx', path: pptxPath });
        }
        if (fs.existsSync(pdfPath)) {
          attachments.push({ filename: 'StackPilot-AI-Enterprise-Deck.pdf', path: pdfPath });
        }

        await transporter.sendMail({
          from: `"StackPilot AI Team" <${process.env.SMTP_FROM_EMAIL || 'no-reply@stackpilot.ai'}>`,
          to: email,
          subject: 'Your StackPilot AI Enterprise Presentation Deck',
          html: `
            <div style="font-family: sans-serif; color: #0f172a; max-width: 600px; line-height: 1.6;">
              <h2 style="color: #22c55e;">StackPilot AI Enterprise</h2>
              <p>Hi ${name},</p>
              <p>Thank you for downloading the StackPilot AI Product Presentation Deck. Attached you will find both the editable PowerPoint presentation (.pptx) and the executive PDF document.</p>
              <p>You can also download it directly at any time: <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/assets/StackPilot-AI-Enterprise-Deck.pptx" style="color: #22c55e; font-weight: bold;">Download PPTX Deck</a></p>
              <br/>
              <p>Best Regards,<br/><strong>The StackPilot AI Team</strong></p>
            </div>
          `,
          attachments
        });
      } catch (mailErr) {
        console.warn('Presentation email dispatch warning (SMTP offline or misconfigured):', mailErr);
      }
    }

    res.status(201).json({
      success: true,
      data: newRequest,
      downloadUrl: '/assets/StackPilot-AI-Enterprise-Deck.pptx',
      message: 'Lead captured successfully and deck ready for download'
    });

  } catch (error) {
    console.error('Error in createPresentationRequest:', error);
    res.status(500).json({ success: false, message: 'Server error processing request' });
  }
};

export const downloadPresentationDeck = (req: Request, res: Response) => {
  try {
    const format = req.query.format === 'pdf' ? 'pdf' : 'pptx';
    const filename = format === 'pdf' ? 'StackPilot-AI-Enterprise-Deck.pdf' : 'StackPilot-AI-Enterprise-Deck.pptx';
    const filePath = path.join(process.cwd(), 'public/assets', filename);

    if (fs.existsSync(filePath)) {
      res.download(filePath, filename);
    } else {
      res.status(404).json({ success: false, message: 'Presentation file not found' });
    }
  } catch (err) {
    console.error('Error serving presentation deck:', err);
    res.status(500).json({ success: false, message: 'Failed to download presentation deck' });
  }
};
