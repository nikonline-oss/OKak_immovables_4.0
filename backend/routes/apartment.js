const express = require('express');
const router = express.Router();
const { Apartment, Developer, MediaBlock } = require('../models');

// Create Apartment
router.post('/', async (req, res) => {
  try {
    const apartment = await Apartment.create(req.body);
    res.status(201).json(apartment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get All Apartments
router.get('/', async (req, res) => {
  try {
    const apartments = await Apartment.findAll({
      include: [Developer, MediaBlock]
    });
    res.json(apartments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Apartments by Region
router.get('/region/:region', async (req, res) => {
  try {
    const apartments = await Apartment.findAll({
      where: { region: req.params.region },
      include: [MediaBlock]
    });
    res.json(apartments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Single Apartment
router.get('/:id', async (req, res) => {
  try {
    const apartment = await Apartment.findByPk(req.params.id, {
      include: [Developer, MediaBlock]
    });
    if (apartment) {
      res.json(apartment);
    } else {
      res.status(404).json({ error: 'Apartment not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Apartment
router.put('/:id', async (req, res) => {
  try {
    const [updated] = await Apartment.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const apartment = await Apartment.findByPk(req.params.id);
      res.json(apartment);
    } else {
      res.status(404).json({ error: 'Apartment not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete Apartment
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Apartment.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Apartment not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;