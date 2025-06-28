const express = require('express');
const router = express.Router();
const { Developer, User } = require('../models');

// Create Developer
router.post('/', async (req, res) => {
  try {
    const developer = await Developer.create(req.body);
    res.status(201).json(developer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get All Developers
router.get('/', async (req, res) => {
  try {
    const developers = await Developer.findAll({ include: [User] });
    res.json(developers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Single Developer
router.get('/:id', async (req, res) => {
  try {
    const developer = await Developer.findByPk(req.params.id, { include: [User] });
    if (developer) {
      res.json(developer);
    } else {
      res.status(404).json({ error: 'Developer not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Developer
router.put('/:id', async (req, res) => {
  try {
    const [updated] = await Developer.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const developer = await Developer.findByPk(req.params.id);
      res.json(developer);
    } else {
      res.status(404).json({ error: 'Developer not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete Developer
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Developer.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Developer not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;