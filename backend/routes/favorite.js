const express = require('express');
const router = express.Router();
const { Favorite, Apartment } = require('../models');

// Add to Favorites
router.post('/', async (req, res) => {
  try {
    // Check if already favorited
    const existing = await Favorite.findOne({
      where: {
        user_id: req.body.user_id,
        apartment_id: req.body.apartment_id
      }
    });
    
    if (existing) {
      return res.status(400).json({ error: 'Already in favorites' });
    }
    
    const favorite = await Favorite.create(req.body);
    res.status(201).json(favorite);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get User Favorites
router.get('/user/:userId', async (req, res) => {
  try {
    const favorites = await Favorite.findAll({
      where: { user_id: req.params.userId },
      include: [Apartment]
    });
    res.json(favorites);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Remove from Favorites
router.delete('/', async (req, res) => {
  try {
    const deleted = await Favorite.destroy({
      where: {
        user_id: req.body.user_id,
        apartment_id: req.body.apartment_id
      }
    });
    
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Favorite not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;