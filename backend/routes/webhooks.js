const express = require('express');
const router = express.Router();
const { Booking } = require('../models');

// Вебхук для обновления сделок
router.post('/bitrix-deal-update', async (req, res) => {
  const { event, data } = req.body;
  
  if (event === 'ONCRMDEALUPDATE' && data.FIELDS) {
    try {
      const dealId = data.FIELDS.ID;
      const stageId = data.FIELDS.STAGE_ID;
      
      const booking = await Booking.findOne({ where: { bitrix_deal_id: dealId } });
      if (!booking) return res.status(404).send('Booking not found');
      
      let status;
      switch(stageId) {
        case 'WON': status = 'confirmed'; break;
        case 'LOSE': status = 'canceled'; break;
        default: status = 'pending';
      }
      
      await booking.update({ status });
      res.status(200).send('OK');
    } catch (error) {
      console.error('Webhook error:', error);
      res.status(500).send('Internal error');
    }
  } else {
    res.status(400).send('Invalid request');
  }
});

module.exports = router;