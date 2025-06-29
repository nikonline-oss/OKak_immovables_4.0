const express = require('express');
const router = express.Router();
const sequelize = require('../config/bd');
const { Booking, Apartment, User } = require('../models');
const bitrixService = require('../services/bitrixService');

// Статусы бронирования
const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELED: 'canceled'
};

// Маппинг статусов на Bitrix
const BITRIX_STAGE_MAP = {
  [BOOKING_STATUS.PENDING]: 'NEW',
  [BOOKING_STATUS.CONFIRMED]: 'PREPARATION',
  [BOOKING_STATUS.CANCELED]: 'FAILED'
};

// Create Booking with Bitrix sync
router.post('/', async (req, res) => {
  const t = await sequelize.transaction();
  
  try {
    const { apartment_id, user_id, start_date, end_date } = req.body;

    // 1. Проверяем доступность квартиры
    const apartment = await Apartment.findByPk(apartment_id, { 
      transaction: t,
      lock: t.LOCK.UPDATE
    });
    
    if (!apartment || apartment.booking_status !== 'available') {
      await t.rollback();
      return res.status(400).json({ error: 'Apartment not available for booking' });
    }

    // 2. Проверяем пользователя
    const user = await User.findByPk(user_id, { transaction: t });
    if (!user) {
      await t.rollback();
      return res.status(400).json({ error: 'User not found' });
    }

    // 3. Создаем бронирование
    const booking = await Booking.create({
      apartment_id,
      user_id,
      start_date,
      end_date,
      status: BOOKING_STATUS.PENDING
    }, { transaction: t });

    // 4. Обновляем статус квартиры
    await apartment.update({ 
      booking_status: 'booked',
      last_updated: new Date()
    }, { transaction: t });

    // 5. Синхронизация с Bitrix24
    try {
      const dealData = {
        TITLE: `Booking #${booking.id}`,
        STAGE_ID: BITRIX_STAGE_MAP[BOOKING_STATUS.PENDING],
        TYPE_ID: 'SALE',
        CURRENCY_ID: 'RUB',
        OPPORTUNITY: apartment.price,
        CONTACT_ID: user.bitrix_contact_id,
        ASSIGNED_BY_ID: process.env.BITRIX_DEFAULT_ASSIGNEE,
        UF_CRM_APARTMENT_ID: apartment.bitrix_id,
        UF_CRM_BOOKING_ID: booking.id,
        UF_CRM_START_DATE: start_date,
        UF_CRM_END_DATE: end_date
      };

      const bitrixResponse = await bitrixService.createDeal(dealData);
      await booking.update({ bitrix_deal_id: bitrixResponse.result }, { transaction: t });
    } catch (bitrixError) {
      console.error('Bitrix sync error:', bitrixError);
      await t.rollback();
      return res.status(500).json({ 
        error: 'Booking creation failed - Bitrix integration error',
        details: process.env.NODE_ENV === 'development' ? bitrixError.message : null
      });
    }

    await t.commit();
    
    // Получаем полные данные для ответа
    const fullBooking = await Booking.findByPk(booking.id, {
      include: [
        { model: Apartment, attributes: ['id', 'title', 'price', 'address'] },
        { model: User, attributes: ['id', 'full_name', 'email'] }
      ]
    });

    res.status(201).json(fullBooking);
  } catch (error) {
    await t.rollback();
    res.status(500).json({ error: error.message });
  }
});

// Update Booking Status with Bitrix sync
router.patch('/:id/status', async (req, res) => {
  const t = await sequelize.transaction();
  
  try {
    const { status } = req.body;
    const booking = await Booking.findByPk(req.params.id, { 
      transaction: t,
      include: [Apartment, User]
    });

    if (!booking) {
      await t.rollback();
      return res.status(404).json({ error: 'Booking not found' });
    }

    // 1. Обновляем статус бронирования
    await booking.update({ status }, { transaction: t });

    // 2. Обновляем статус квартиры если бронь отменена
    if (status === BOOKING_STATUS.CANCELED && booking.Apartment) {
      await booking.Apartment.update({ 
        booking_status: 'available',
        last_updated: new Date()
      }, { transaction: t });
    }

    // 3. Синхронизация с Bitrix
    if (booking.bitrix_deal_id) {
      try {
        await bitrixService.updateDeal(booking.bitrix_deal_id, {
          STAGE_ID: BITRIX_STAGE_MAP[status] || 'NEW',
          UF_CRM_STATUS: status
        });
      } catch (bitrixError) {
        console.error('Bitrix sync error:', bitrixError);
        await t.rollback();
        return res.status(500).json({ 
          error: 'Status updated but Bitrix sync failed',
          details: process.env.NODE_ENV === 'development' ? bitrixError.message : null
        });
      }
    }

    await t.commit();
    res.json(booking);
  } catch (error) {
    await t.rollback();
    res.status(400).json({ error: error.message });
  }
});

// Get Booking by ID
router.get('/:id', async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id, {
      include: [
        { model: Apartment, attributes: ['id', 'title', 'price', 'address'] },
        { model: User, attributes: ['id', 'full_name', 'email'] }
      ]
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Синхронизация статуса из Bitrix
    if (booking.bitrix_deal_id) {
      try {
        const deal = await bitrixService.getDeal(booking.bitrix_deal_id);
        if (deal.STAGE_ID && BITRIX_STAGE_MAP[booking.status] !== deal.STAGE_ID) {
          // Находим локальный статус по Bitrix stage
          const localStatus = Object.keys(BITRIX_STAGE_MAP).find(
            key => BITRIX_STAGE_MAP[key] === deal.STAGE_ID
          );
          if (localStatus) {
            await booking.update({ status: localStatus });
            booking.status = localStatus;
          }
        }
      } catch (error) {
        console.error('Bitrix sync error:', error);
      }
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;