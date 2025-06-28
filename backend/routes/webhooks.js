const express = require('express');
const router = express.Router();
const sequelize = require('../config/bd');
const Sequelize = require(' sequelize');
const { Booking, User, UserCountHistory, Apartment, ApartmentHistory } = require('../models');

// Функция обновления цен для пользователей
async function updateApartmentPricesForUser(user, operation) {
    console.log("sdjsds");
    const transaction = await sequelize.transaction();

    try {
        // Получаем текущее количество верифицированных пользователей
        const currentUsers = await User.count({
            where: { verified: true },
            transaction
        });

        // Получаем последнее сохраненное количество
        const lastHistory = await UserCountHistory.findOne({
            order: [['recorded_at', 'DESC']],
            transaction
        });

        // Если это первая запись в истории
        if (!lastHistory) {
            await UserCountHistory.create({
                total_users: currentUsers
            }, { transaction });
            await transaction.commit();
            return;
        }

        // Определяем регионы через бронирования пользователя
        let targetRegions = new Set();

        if (operation === 'INSERT' || operation === 'UPDATE') {
            const bookings = await Booking.findAll({
                where: { user_id: user.id },
                include: [{
                    model: Apartment,
                    attributes: ['region']
                }],
                transaction
            });

            bookings.forEach(booking => {
                if (booking.Apartment) {
                    targetRegions.add(booking.Apartment.region);
                }
            });
        } else if (operation === 'DELETE') {
            // Для удаления используем предварительно сохраненные регионы
            targetRegions = user.affectedRegions || new Set();
        }

        // Если нет регионов - выходим
        if (targetRegions.size === 0) {
            await transaction.commit();
            return;
        }

        // Изменяем цены в затронутых регионах
        const regionsArray = Array.from(targetRegions);
        if (currentUsers > lastHistory.total_users) {
            // Увеличиваем цены на 5%
            await Apartment.update({
                price: Sequelize.literal('price * 1.05'),
                last_updated: Sequelize.fn('NOW')
            }, {
                where: {
                    region: regionsArray,
                    booking_status: 'available'
                },
                transaction
            });
        } else if (currentUsers < lastHistory.total_users) {
            // Уменьшаем цены на 3%
            await Apartment.update({
                price: Sequelize.literal('price * 0.97'),
                last_updated: Sequelize.fn('NOW')
            }, {
                where: {
                    region: regionsArray,
                    booking_status: 'available'
                },
                transaction
            });
        }

        // Обновляем историю пользователей
        await UserCountHistory.create({
            total_users: currentUsers
        }, { transaction });

        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        console.error('Ошибка при обновлении цен:', error);
    }
}

// Функция для пересчета всех цен
async function recalculateAllPrices() {
    const transaction = await sequelize.transaction();

    try {
        const currentUsers = await User.count({
            where: { verified: true },
            transaction
        });

        await UserCountHistory.create({
            total_users: currentUsers
        }, { transaction });

        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        console.error('Ошибка при пересчете цен:', error);
    }
}

// Функция отмены последнего изменения цены
async function revertLastPriceChange() {
    const transaction = await sequelize.transaction();

    try {
        // Находим последнее изменение
        const lastChange = await ApartmentHistory.findOne({
            order: [['createdAt', 'DESC']],
            transaction
        });

        if (!lastChange) {
            await transaction.commit();
            return;
        }

        // Определяем коэффициент изменения
        const priceChange = lastChange.new_price - lastChange.old_price;
        const changeRatio = priceChange > 0 ? 1.05 : 0.97;

        // Отменяем изменение
        await Apartment.update({
            price: Sequelize.literal(`price / ${changeRatio}`)
        }, {
            where: { id: lastChange.apartment_id },
            transaction
        });

        // Удаляем запись из истории
        await lastChange.destroy({ transaction });

        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        console.error('Ошибка при отмене изменения цены:', error);
    }
}


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
            switch (stageId) {
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

// Хуки для модели User
User.afterCreate(async (user) => {
    if (user.verified) {
        await updateApartmentPricesForUser(user, 'INSERT');
    }
});

User.afterUpdate(async (user) => {
    if (user.changed('verified')) {
        await updateApartmentPricesForUser(user, 'UPDATE');
    }
});

User.afterDestroy(async (user) => {
    // Получаем регионы перед удалением
    const bookings = await Booking.findAll({
        where: { user_id: user.id },
        include: [{
            model: Apartment,
            attributes: ['region']
        }]
    });

    const affectedRegions = new Set(
        bookings
            .filter(b => b.Apartment)
            .map(b => b.Apartment.region)
    );

    // Сохраняем регионы для использования в функции обновления
    user.affectedRegions = affectedRegions;
    await updateApartmentPricesForUser(user, 'DELETE');
});

// Хук для логирования изменений цен
Apartment.afterUpdate(async (apartment) => {
    if (apartment.changed('price')) {
        await ApartmentHistory.create({
            apartment_id: apartment.id,
            old_price: apartment.previous('price'),
            new_price: apartment.price,
            change_reason: 'Автоматическая корректировка цены'
        });
    }
});



module.exports = router;