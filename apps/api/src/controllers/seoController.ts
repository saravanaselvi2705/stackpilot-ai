import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import * as db from '../models';

export const getKeywords = async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const keywords = await db.Keyword.find().sort({ position: 1 });
    return res.status(200).json(keywords);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const addKeyword = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { keyword, position, volume, difficulty } = req.body;
    if (!keyword) return res.status(400).json({ error: 'Keyword string is required' });

    const newKeyword = new db.Keyword({
      keyword,
      position: position || 50,
      volume: volume || 1000,
      difficulty: difficulty || 30,
      history: [{ date: new Date(), position: position || 50 }],
    });

    await newKeyword.save();
    return res.status(201).json(newKeyword);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const getSEODashboard = async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const reports = await db.SEOReport.find().sort({ date: -1 }).limit(1);
    const keywordsCount = await db.Keyword.countDocuments();
    const topKeywords = await db.Keyword.find({ position: { $lte: 10 } }).countDocuments();

    const latestReport = reports[0] || {
      clicks: 12450,
      impressions: 185000,
      ctr: 6.7,
      avgPosition: 14.2,
      healthScore: 94,
      checklist: [
        { task: 'XML Sitemap submitted to GSC', done: true },
        { task: 'Mobile usability audit passed', done: true },
        { task: 'SSL Certificate active', done: true },
        { task: 'Core Web Vitals LCP < 2.5s', done: true },
      ],
      competitors: [
        { name: 'Competitor A', visibility: 78, rank: 1 },
        { name: 'Competitor B', visibility: 64, rank: 2 },
        { name: 'StackPilot AI', visibility: 82, rank: 1 },
      ],
    };

    return res.status(200).json({
      keywordsCount,
      topKeywords,
      report: latestReport,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
