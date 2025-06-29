const express = require('express');
const router = express.Router();
const { User } = require('../models');
const { Op } = require('sequelize');
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

// / Get All Users
router.get('/', authMiddle.authenticate, async (req, res) => {
    try {
        // Получаем параметры фильтрации из query-строки
        const {
            name,
            email,
            phone,
            page = 1,
            limit = 50
        } = req.query;

        // Формируем условия для запроса
        const where = {};

        if (name) {
            where.full_name = { [Op.like]: `%${name}%` };
        }

        if (email) {
            where.email = email;
        }

        if (phone) {
            where.phone = phone;
        }

        // Рассчитываем пагинацию
        const offset = (page - 1) * limit;

        // Получаем данные из базы данных
        const { count, rows: users } = await User.findAndCountAll({
            where,
            attributes: ['id', 'full_name', 'email', 'phone', 'verified'],
            limit: parseInt(limit),
            offset: offset,
            order: [['createdAt', 'DESC']]
        });

        // Форматируем ответ
        const formattedUsers = users.map(user => ({
            id: user.id,
            name: user.full_name,
            email: user.email,
            phone: user.phone,
            verified: user.verified
        }));

        res.json({
            success: true,
            data: formattedUsers,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: count
            }
        });

    } catch (error) {
        console.error('Database users fetch error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch users from database',
            details: process.env.NODE_ENV === 'development' ? error.message : null
        });
    }
});

// Get Single User
router.get('/:id', authMiddle.authenticate, async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id, {
            attributes: { exclude: ['password'] } // Исключаем пароль из ответа
        });
        
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
router.put('/:id', authMiddle.authenticate, async (req, res) => {
    try {
        const finduser = await User.findAll({
            where: {
                bitrix_contact_id: req.params.id,
            }
        });

        const [updated] = await User.update(req.body, {
            where: { id: finduser[0].id }
        });
        if (updated) {
            const user = await User.findByPk(finduser[0].id);
            const fio = req.body.full_name.split(' ');
            console.log(await bitrixService.updateContact(user.bitrix_contact_id, { 'NAME': fio[1], 'LAST_NAME': fio[0], 'EMAIL': [{ VALUE: req.body.email, VALUE_TYPE: 'WORK' }], 'PHONE': [{ VALUE: req.body.phone, VALUE_TYPE: 'WORK' }] })); // This line is commented out
            res.json(user);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete User
router.delete('/:id', authMiddle.authenticate, authMiddle.authorize(['user']), async (req, res) => {
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