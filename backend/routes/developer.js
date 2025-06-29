const express = require('express');
const router = express.Router();
const { Developer, User } = require('../models');
const bitrixService = require('../services/bitrixService');
const authMiddle = require('../middleware/authMiddleware');
const { Op } = require('sequelize');

// Create Developer
router.post('/', authMiddle.authenticate, async (req, res) => {
  try {
    const { name, address, inn, phone, email, website } = req.body;

    console.log({ name, address, inn, phone, email, website } );
    const developer = await Developer.create({ name, address, inn, phone, email, website ,user_id:req.user.id});
    res.status(201).json(developer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get All Developers
router.get('/', authMiddle.authenticate, async (req, res) => {
  try {
    // Получаем параметры запроса
    const {
      name,
      inn,
      email,
      phone,
      user_id,
      page = 1,
      limit = 50
    } = req.query;

    // Формируем условия для запроса
    const where = {};
    
    if (name) where.name = { [Op.iLike]: `%${name}%` }; // Case-insensitive поиск
    if (inn) where.inn = inn;
    if (email) where.email = { [Op.iLike]: `%${email}%` };
    if (phone) where.phone = { [Op.like]: `%${phone}%` };
    if (user_id) where.user_id = user_id;

    // Пагинация
    const offset = (page - 1) * limit;

    // Получаем данные из базы данных
    const { count, rows: developers } = await Developer.findAndCountAll({
      where,
      include: [{
        model: User,
        attributes: ['id', 'full_name', 'email', 'phone']
      }],
      limit: parseInt(limit),
      offset: offset,
      order: [['name', 'ASC']], // Сортировка по имени
      subQuery: false
    });

    res.json({
      success: true,
      data: developers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count
      }
    });

  } catch (error) {
    console.error('Database developers fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch developers from database',
      details: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
});

// Get Single Developer with Apartments
router.get('/:id', authMiddle.authenticate, async (req, res) => {
  try {
    const developer = await Developer.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['id', 'full_name', 'email', 'phone']
        }
      ]
    });
    
    if (developer) {
      // Увеличиваем счетчик просмотров
      await developer.increment('views', { by: 1 });
      
      res.json({
        success: true,
        data: developer
      });
    } else {
      res.status(404).json({ 
        success: false,
        error: 'Developer not found' 
      });
    }
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// Update Developer
router.put('/:id',authMiddle.authenticate, async (req, res) => {
  try {
    const findDeveloper = await Developer.findAll({
      where:{
        bitrix_company_id:req.params.id,
      }
    })

    console.log(req.params.id);

    const [updated] = await Developer.update(req.body, {
      where: { id: findDeveloper[0].id }
    });
    if (updated) {
      const developer = await Developer.findByPk(findDeveloper[0].id);

      console.log(await bitrixService.updateDeveloper(developer.bitrix_company_id, { 'TITLE': req.body.name, 'ADDRESS': req.body.address , 'EMAIL': [{ VALUE: req.body.email, VALUE_TYPE: 'WORK' }], 'PHONE': [{ VALUE: req.body.phone, VALUE_TYPE: 'WORK' }]}));
      res.json(developer);
    } else {
      res.status(404).json({ error: 'Developer not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete Developer
router.delete('/:id',authMiddle.authenticate, authMiddle.authorize(['user']), async (req, res) => {
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