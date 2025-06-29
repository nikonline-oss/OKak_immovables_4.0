const express = require('express');
const router = express.Router();
const { Apartment, Developer, MediaBlock } = require('../models');
const authMiddleware = require('../middleware/authMiddleware');
const { Op } = require('sequelize');
const bitrixService = require('../services/bitrixService');

// Create Apartment with full Bitrix sync
router.post('/',authMiddleware.authenticate, async (req, res) => {
  try {
    const { developer_id } = req.body;
    // Проверяем существование застройщика
    const developer = await Developer.findByPk(developer_id);
    if (!developer) {
      return res.status(400).json({ error: 'Developer not found' });
    }

    // Создаем квартиру в нашей базе
    const apartment = await Apartment.create(req.body);
    
    // Синхронизируем с Bitrix24
    try {
      const bitrixData = {
        title: apartment.title,
        description: apartment.description,
        price: apartment.price,
        buildingId: developer.bitrix_company_id, // Используем bitrix_id застройщика
        area: apartment.region,
        rooms: apartment.rooms,
        floor: apartment.floor,
        booking_status: apartment.booking_status === 'available' ? 'AVAILABLE' : 'SOLD'
      };

      const bitrixResponse = await bitrixService.createApartment(bitrixData);
      await apartment.update({ bitrix_id: bitrixResponse.result });
    } catch (bitrixError) {
      console.error('Bitrix sync error:', bitrixError);
      // Откатываем создание, если синхронизация не удалась
      await apartment.destroy();
      return res.status(500).json({ 
        error: 'Apartment created but Bitrix sync failed',
        details: process.env.NODE_ENV === 'development' ? bitrixError.message : null
      });
    }

    // Получаем полные данные с медиа-блоками
    const createdApartment = await Apartment.findByPk(apartment.id, {
      include: [
        { model: Developer, attributes: ['id', 'name'] },
        { model: MediaBlock, attributes: ['id', 'type', 'url'] }
      ]
    });

    res.status(201).json(createdApartment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get All Apartments (from DB with optional filters)
router.get('/', async (req, res) => {
  try {
    const { 
      region, 
      min_price, 
      max_price, 
      status,
      developer_id,
      search,
      page = 1,
      limit = 20
    } = req.query;
    
    const where = {};
    if (region) where.region = region;
    if (status) where.booking_status = status;
    if (developer_id) where.developer_id = developer_id;
    
    if (min_price || max_price) {
      where.price = {};
      if (min_price) where.price[Op.gte] = min_price;
      if (max_price) where.price[Op.lte] = max_price;
    }

    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { address: { [Op.iLike]: `%${search}%` }}
      ];
    }
    
    const offset = (page - 1) * limit;
    
    const { count, rows: apartments } = await Apartment.findAndCountAll({
      where,
      include: [
        {
          model: Developer,
          attributes: ['id', 'name', 'inn', 'phone']
        },
        {
          model: MediaBlock,
          attributes: ['id', 'type', 'url', 'position'],
          order: [['position', 'ASC']]
        }
      ],
      limit: parseInt(limit),
      offset: offset,
      order: [['last_updated', 'DESC']]
    });
    
    res.json({
      data: apartments,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Single Apartment with Bitrix sync
router.get('/:id', async (req, res) => {
  try {
    const apartment = await Apartment.findByPk(req.params.id, {
      include: [
        {
          model: Developer,
          attributes: ['id', 'name', 'phone', 'email', 'bitrix_company_id']
        },
        {
          model: MediaBlock,
          attributes: ['id', 'type', 'url', 'position'],
          order: [['position', 'ASC']]
        }
      ]
    });
    
    if (!apartment) {
      return res.status(404).json({ error: 'Apartment not found' });
    }
    
    // Синхронизация статуса и цены из Bitrix
    if (apartment.bitrix_id) {
      try {
        const bitrixData = await bitrixService.getApartmentList({
          ID: apartment.bitrix_id
        });
        
        if (bitrixData.result && bitrixData.result.length > 0) {
          const bitrixApartment = bitrixData.result[0];
          const updates = {};
          
          if (bitrixApartment.PRICE && bitrixApartment.PRICE !== apartment.price) {
            updates.price = bitrixApartment.PRICE;
          }
          
          if (bitrixApartment.PROPERTY_STATUS) {
            const newStatus = bitrixApartment.PROPERTY_STATUS === 'AVAILABLE' 
              ? 'available' 
              : 'sold';
            
            if (newStatus !== apartment.booking_status) {
              updates.booking_status = newStatus;
            }
          }
          
          if (Object.keys(updates).length > 0) {
            await apartment.update({
              ...updates,
              last_updated: new Date()
            });
          }
        }
      } catch (bitrixError) {
        console.error('Bitrix sync error:', bitrixError);
      }
    }
    
    res.json(apartment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Apartment with Bitrix sync
router.put('/:id',authMiddleware.authenticate, async (req, res) => {
  try {
    const apartment = await Apartment.findByPk(req.params.id);
    if (!apartment) {
      return res.status(404).json({ error: 'Apartment not found' });
    }

    // Обновляем в нашей базе
    await apartment.update(req.body);
    
    // Синхронизируем с Bitrix
    if (apartment.bitrix_id) {
      try {
        const developer = await Developer.findByPk(apartment.developer_id);
        
        const updateData = {
          NAME: apartment.title,
          DESCRIPTION: apartment.description,
          PRICE: apartment.price,
          SECTION_ID: developer?.bitrix_company_id,
          PROPERTY_VALUES: {
            SQUARE: apartment.area,
            ROOMS: apartment.rooms,
            FLOOR: apartment.floor,
            STATUS: apartment.booking_status === 'available' ? 'AVAILABLE' : 'SOLD'
          }
        };
        
        await bitrixService.updateApartment(apartment.bitrix_id, updateData);
        await apartment.update({ last_updated: new Date() });
      } catch (bitrixError) {
        console.error('Bitrix sync error:', bitrixError);
        return res.status(500).json({ 
          error: 'Apartment updated but Bitrix sync failed',
          details: process.env.NODE_ENV === 'development' ? bitrixError.message : null
        });
      }
    }

    // Получаем обновленные данные с отношениями
    const updatedApartment = await Apartment.findByPk(apartment.id, {
      include: [
        { model: Developer, attributes: ['id', 'name'] },
        { model: MediaBlock, attributes: ['id', 'type', 'url'] }
      ]
    });

    res.json(updatedApartment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete Apartment with Bitrix sync
router.delete('/:id',authMiddleware.authenticate, async (req, res) => {
  try {
    const apartment = await Apartment.findByPk(req.params.id);
    if (!apartment) {
      return res.status(404).json({ error: 'Apartment not found' });
    }

    // Удаляем из Bitrix
    if (apartment.bitrix_id) {
      try {
        await bitrixService.deleteApartment(apartment.bitrix_id);
      } catch (bitrixError) {
        console.error('Bitrix sync error:', bitrixError);
        return res.status(500).json({ 
          error: 'Apartment not deleted from Bitrix',
          details: process.env.NODE_ENV === 'development' ? bitrixError.message : null
        });
      }
    }

    // Удаляем из нашей базы
    await apartment.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;