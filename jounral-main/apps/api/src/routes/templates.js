import express from 'express';
import TradeTemplate from '../models/TradeTemplate.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();
router.use(requireAuth);

router.post('/', async (req, res) => {
  const { templateName, templateData } = req.body;
  if (!templateName?.trim() || !templateData) {
    return res.status(400).json({ message: 'Template name and data are required' });
  }

  try {
    const template = await TradeTemplate.create({
      userId: req.user.id,
      templateName: templateName.trim(),
      templateData,
    });
    res.status(201).json(template);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to save template' });
  }
});

router.get('/', async (req, res) => {
  try {
    const templates = await TradeTemplate.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(templates);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch templates' });
  }
});

export default router;
