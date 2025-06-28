const bitrixService = require('../services/bitrixService');
const { User, Apartment, Booking, Developer } = require('../models');

// Синхронизация пользователя как контакта
User.afterCreate(async (user) => {
  try {
    const nameParts = user.full_name.split(' ');
    const contactId = await bitrixService.createContact({
      firstName: nameParts[0] || '',
      lastName: nameParts.slice(1).join(' ') || '',
      email: user.email,
      phone: user.phone // добавьте это поле в модель User при необходимости
    });
    
    await user.update({ bitrix_contact_id: contactId });
    console.log(`Created Bitrix24 contact #${contactId} for user ${user.id}`);
  } catch (error) {
    console.error('Bitrix contact sync failed:', error);
  }
});

// Синхронизация застройщика как компании
Developer.afterCreate(async (developer) => {
    try {
        const user = await User.findByPk(developer.user_id);
        if (!user) throw new Error('User not found for developer');

        const companyData = {
            TITLE: developer.name,
            COMPANY_TYPE: 'PARTNER', // Тип "Партнер"
            INN: developer.inn,
            ASSIGNED_BY_ID: 1, // Ответственный в Bitrix
            CONTACT_ID: user.bitrix_contact_id // Привязка к контакту
        };

        // const response = await bitrixService.createCompany(companyData);
        // await developer.update({ bitrix_company_id: response.result });
    } catch (error) {
        console.error('Bitrix company sync error:', error);
    }
});

// Синхронизация квартиры как товара
Apartment.afterCreate(async (apartment) => {
    try {
        const developer = await Developer.findByPk(apartment.developer_id);
        if (!developer) throw new Error('Developer not found');

        const productData = {
            NAME: apartment.title,
            DESCRIPTION: apartment.description,
            PRICE: apartment.price,
            CURRENCY_ID: 'RUB',
            SECTION_ID: 'REALTY', // Секция "Недвижимость"
            OWNER_ID: developer.bitrix_company_id // Привязка к компании застройщика
        };

        // const response = await bitrixService.createProduct(productData);
        await apartment.update({ bitrix_product_id: response.result });
    } catch (error) {
        console.error('Bitrix product sync error:', error);
    }
});

// Синхронизация бронирования как сделки
Booking.afterCreate(async (booking) => {
    try {
        const user = await User.findByPk(booking.user_id);
        const apartment = await Apartment.findByPk(booking.apartment_id);
        const developer = await Developer.findByPk(apartment.developer_id);

        if (!user || !apartment || !developer) {
            throw new Error('Related records not found');
        }

        const dealData = {
            TITLE: `Бронь: ${apartment.title}`,
            TYPE_ID: 'SALE', // Тип "Продажа"
            STAGE_ID: 'NEW', // Стадия "Новая"
            CONTACT_ID: user.bitrix_contact_id,
            COMPANY_ID: developer.bitrix_company_id,
            OPPORTUNITY: apartment.price, // Сумма сделки
            ASSIGNED_BY_ID: 1, // Ответственный
            UTM_SOURCE: 'RealtyPlatform', // Источник
            PRODUCTS: [{
                PRODUCT_ID: apartment.bitrix_product_id,
                PRICE: apartment.price,
                QUANTITY: 1
            }]
        };

        // const response = await bitrixService.createDeal(dealData);
        await booking.update({ bitrix_deal_id: response.result });
    } catch (error) {
        console.error('Bitrix deal sync error:', error);
    }
});

// Обновление статуса сделки при изменении бронирования
Booking.afterUpdate(async (booking) => {
    if (!booking.bitrix_deal_id || !booking.changed('status')) return;

    try {
        let stageId;
        switch (booking.status) {
            case 'confirmed': stageId = 'WON'; break; // Успешно реализовано
            case 'canceled': stageId = 'LOSE'; break; // Не реализовано
            default: stageId = 'PROCESSING'; // В работе
        }

        // await bitrixService.updateDeal(booking.bitrix_deal_id, {
        //     STAGE_ID: stageId,
        //     MODIFY_BY_ID: 1 // ID пользователя, внесшего изменение
        // });
    } catch (error) {
        console.error('Bitrix deal update error:', error);
    }
});