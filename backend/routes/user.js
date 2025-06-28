const express = require('express');
const router = express.Router();
const { User } = require('../models');

// Create User
router.post('/', async (req, res) => {
    try {
        const { email, full_name, password, phone, verified} = req.body;

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


        const user = await User.create({ email, full_name, password ,phone, verified});


        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get All Users
router.get('/', async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get Single User
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
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
router.put('/:id', async (req, res) => {
    try {
        const [updated] = await User.update(req.body, {
            where: { id: req.params.id }
        });
        if (updated) {
            const user = await User.findByPk(req.params.id);
            res.json(user);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete User
router.delete('/:id', async (req, res) => {
    try {
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