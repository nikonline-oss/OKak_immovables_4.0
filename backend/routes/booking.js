const express = require('express');
const router = express.Router();
const sequelize = require('../config/bd');
const { Booking, Apartment, User } = require('../models');

// Create Booking
router.post('/', async (req, res) => {
  const t = await sequelize.transaction();
  
  try {
    // Check apartment availability
    const apartment = await Apartment.findByPk(req.body.apartment_id, { transaction: t });
    if (!apartment || apartment.booking_status !== 'available') {
      await t.rollback();
      return res.status(400).json({ error: 'Apartment not available for booking' });
    }
    
    // Update apartment status
    await apartment.update({ booking_status: 'booked' }, { transaction: t });
    
    // Create booking
    const booking = await Booking.create(req.body, { transaction: t });
    
    await t.commit();
    res.status(201).json(booking);
  } catch (error) {
    await t.rollback();
    res.status(500).json({ error: error.message });
  }
});

// Get All Bookings
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      include: [Apartment, User]
    });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Bookings by User
router.get('/user/:userId', async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      where: { user_id: req.params.userId },
      include: [Apartment]
    });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Booking Status
router.patch('/:id/status', async (req, res) => {
  try {
    const [updated] = await Booking.update(
      { status: req.body.status },
      { where: { id: req.params.id } }
    );
    
    if (updated) {
      const booking = await Booking.findByPk(req.params.id);
      res.json(booking);
    } else {
      res.status(404).json({ error: 'Booking not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete Booking
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Booking.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Booking not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;