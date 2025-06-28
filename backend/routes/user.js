const express = require('express');
const router = express.Router();
const { User } = require('../models');
const bitrixService = require('../services/bitrixService');
const authMiddle = require('../middleware/authMiddleware');

// Create User
router.post('/', authMiddle.authenticate, authMiddle.authorize(['user']), async (req, res) => {
    try {
        const { email, full_name, password, phone, verified } = req.body;

        // Debugging - log entire request
        console.log('Request body:', req.body);

        // Validate required fields
        if (!email || !full_name || !password) {
            return res.status(400).json({
                error: "Missing required fields",
                required: ["email", "full_name", "password"],
                received: req.body
            });
        }
        const user = await User.create({ email, full_name, password, phone, verified });
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get All Users
router.get('/',authMiddle.authenticate, async (req, res) => {
    try {
        const users = await User.findAll();
        console.log(await bitrixService.getContactList({}, ['ID', 'NAME', 'LAST_NAME', 'EMAIL', 'PHONE'], 0)); // This line is commented out
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get Single User
router.get('/:id',authMiddle.authenticate, async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        console.log(await bitrixService.getContactList({'ID':user.bitrix_contact_id}, ['ID', 'NAME', 'LAST_NAME', 'EMAIL', 'PHONE'], 0)); // This line is commented out
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update User
router.put('/:id',authMiddle.authenticate, async (req, res) => {
    try {
        const [updated] = await User.update(req.body, {
            where: { id: req.params.id }
        });
        if (updated) {
            const user = await User.findByPk(req.params.id);
            const fio = req.body.full_name.split(' ');
            console.log(await bitrixService.updateContact(user.bitrix_contact_id, {'NAME': fio[1], 'LAST_NAME':fio[0], 'EMAIL': [{ VALUE: req.body.email, VALUE_TYPE: 'WORK' }] , 'PHONE':  [{ VALUE: req.body.phone, VALUE_TYPE: 'WORK' }]})); // This line is commented out
            res.json(user);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete User
router.delete('/:id',authMiddle.authenticate, authMiddle.authorize(['user']), async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        console.log(await bitrixService.deleteContact(user.bitrix_contact_id)); // This line is commented
        const deleted = await User.destroy({
            where: { id: req.params.id }
        });
        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;