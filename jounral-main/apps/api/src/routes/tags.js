import express from 'express';
import Tag from '../models/Tag.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.use(requireAuth);

router.get('/', async (req, res) => {
  try {
    const tags = await Tag.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(tags);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch tags' });
  }
});

router.post('/', async (req, res) => {
  const { name } = req.body;
  if (!name?.trim()) {
    return res.status(400).json({ message: 'Tag name is required' });
  }

  try {
    const tag = await Tag.findOne({ userId: req.user.id, name: name.trim() });
    if (tag) {
      return res.status(200).json(tag);
    }

    const newTag = await Tag.create({ userId: req.user.id, name: name.trim() });
    res.status(201).json(newTag);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create tag' });
  }
});

router.delete('/:tagId', async (req, res) => {
  try {
    const tag = await Tag.findOneAndDelete({ 
      _id: req.params.tagId, 
      userId: req.user.id 
    });
    
    if (!tag) {
      return res.status(404).json({ message: 'Tag not found' });
    }
    
    res.json({ message: 'Tag deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete tag' });
  }
});

export default router;
