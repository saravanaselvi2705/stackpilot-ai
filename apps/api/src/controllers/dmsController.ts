import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import * as db from '../models';

export const getFolders = async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const folders = await db.Folder.find({ isDeleted: false }).sort({ name: 1 });
    return res.status(200).json(folders);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const createFolder = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, parentId, projectId } = req.body;
    if (!name) return res.status(400).json({ error: 'Folder name is required' });

    const folder = new db.Folder({
      name,
      parentId,
      projectId,
      createdBy: req.user ? req.user.id : undefined,
    });
    await folder.save();
    return res.status(201).json(folder);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const getDocuments = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { folderId, projectId, type } = req.query;
    const filter: any = { isDeleted: false };
    if (folderId) filter.folderId = folderId;
    if (projectId) filter.projectId = projectId;
    if (type) filter.type = type;

    const docs = await db.Document.find(filter)
      .populate('createdBy', 'name email avatarUrl')
      .sort({ createdAt: -1 });

    return res.status(200).json(docs);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const createDocument = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { title, content, type, folderId, projectId, sharedWithClients, tags } = req.body;
    if (!title) return res.status(400).json({ error: 'Document title is required' });

    const doc = new db.Document({
      title,
      content,
      type: type || 'Technical',
      folderId,
      projectId,
      createdBy: req.user ? req.user.id : undefined,
      sharedWithClients: sharedWithClients || [],
      tags: tags || [],
      version: 1,
      approvalStatus: 'Approved',
    });

    await doc.save();
    return res.status(201).json(doc);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateDocumentApproval = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { approvalStatus } = req.body;
    const doc = await db.Document.findByIdAndUpdate(id, { approvalStatus }, { new: true });
    if (!doc) return res.status(404).json({ error: 'Document not found' });
    return res.status(200).json(doc);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
