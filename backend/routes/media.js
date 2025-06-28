const express = require('express');
const router = express.Router();
const { MediaBlock } = require('../models');

// Add Media
router.post('/', async (req, res) => {
  try {
    const media = await MediaBlock.create(req.body);
    res.status(201).json(media);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get Media by Apartment
router.get('/apartment/:apartmentId', async (req, res) => {
  try {
    const media = await MediaBlock.findAll({
      where: { apartment_id: req.params.apartmentId }
    });
    res.json(media);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete Media
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await MediaBlock.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Media not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;