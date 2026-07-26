import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';

export const aiChatAssistant = (req: AuthenticatedRequest, res: Response) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Message payload is required' });

  const reply = `I have analyzed your prompt: "${message}".

Based on StackPilot AI architecture:
- Recommend breaking down the task into clean controller layers.
- Verify JWT permission guards on all routes.
- Utilize Mongo indexes for fast lookups.`;

  return res.status(200).json({ reply, timestamp: new Date() });
};

export const getPromptLibrary = (_req: AuthenticatedRequest, res: Response) => {
  const prompts = [
    { title: 'SRS Generation', category: 'Documentation', prompt: 'Generate full IEEE 830 compliant SRS for...' },
    { title: 'Test Case Builder', category: 'QA', prompt: 'Create automated Playwright & Cypress test cases for...' },
    { title: 'Code Review Security Audit', category: 'Engineering', prompt: 'Review TypeScript source code for OWASP Top 10 vulnerabilities...' },
    { title: 'Client Proposal Draft', category: 'CRM', prompt: 'Draft an executive software development proposal for...' },
    { title: 'Meeting Minutes Summarizer', category: 'Management', prompt: 'Summarize transcript and extract action items with assignees...' },
  ];
  return res.status(200).json(prompts);
};

export const aiGenerateMeetingMinutes = (req: AuthenticatedRequest, res: Response) => {
  const { transcript } = req.body;
  const content = `# Executive Meeting Minutes
**Date**: ${new Date().toLocaleDateString()}
**Participants**: Project Team & Client Stakeholders

## Key Discussion Points
${transcript || 'Reviewed Sprint 2 milestones, CRM pipeline progress, and API latency targets.'}

## Action Items & Decisions
- [x] **PM**: Finalize Sprint 3 user stories.
- [x] **Dev Lead**: Implement multi-tenant schema isolation.
- [x] **QA Lead**: Execute end-to-end regression build test.`;

  return res.status(200).json({ content });
};
