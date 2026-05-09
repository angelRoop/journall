import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Trade from '../models/Trade.js';
import { requireAuth } from '../middleware/auth.js';
import { UPLOAD_DIR } from '../config.js';

const router = express.Router();
const upload = multer({
  dest: UPLOAD_DIR,
  limits: { fileSize: 20 * 1024 * 1024 },
});

const buildResponseTrade = (trade) => ({
  ...trade.toObject(),
  id: trade._id,
});

router.use(requireAuth);

router.get('/', async (req, res) => {
  try {
    const trades = await Trade.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(trades.map(buildResponseTrade));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch trades' });
  }
});

router.get('/:tradeId', async (req, res) => {
  try {
    const trade = await Trade.findOne({ _id: req.params.tradeId, userId: req.user.id });
    if (!trade) return res.status(404).json({ message: 'Trade not found' });
    res.json(buildResponseTrade(trade));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch trade' });
  }
});

router.post('/', async (req, res) => {
  try {
    const trade = await Trade.create({ userId: req.user.id, ...req.body });
    res.status(201).json(buildResponseTrade(trade));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create trade' });
  }
});

router.put('/:tradeId', async (req, res) => {
  try {
    const trade = await Trade.findOneAndUpdate(
      { _id: req.params.tradeId, userId: req.user.id },
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!trade) return res.status(404).json({ message: 'Trade not found' });
    res.json(buildResponseTrade(trade));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update trade' });
  }
});

router.delete('/:tradeId', async (req, res) => {
  try {
    const deleted = await Trade.findOneAndDelete({ _id: req.params.tradeId, userId: req.user.id });
    if (!deleted) return res.status(404).json({ message: 'Trade not found' });
    res.json({ message: 'Trade deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete trade' });
  }
});

router.post('/:tradeId/images', upload.fields([
  { name: 'beforeEntryImage', maxCount: 1 },
  { name: 'duringTradeImage', maxCount: 1 },
  { name: 'exitImage', maxCount: 1 },
]), async (req, res) => {
  try {
    const trade = await Trade.findOne({ _id: req.params.tradeId, userId: req.user.id });
    if (!trade) return res.status(404).json({ message: 'Trade not found' });

    const updates = {};
    ['beforeEntryImage', 'duringTradeImage', 'exitImage'].forEach((field) => {
      if (req.files[field] && req.files[field][0]) {
        const file = req.files[field][0];
        const fileName = path.basename(file.path);
        const publicPath = `/uploads/${fileName}`;
        updates[field] = publicPath;
      }
    });

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: 'No image uploaded' });
    }

    Object.assign(trade, updates);
    await trade.save();
    res.json(buildResponseTrade(trade));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to upload trade images' });
  }
});

export default router;
