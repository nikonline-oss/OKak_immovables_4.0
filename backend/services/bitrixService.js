require('dotenv').config();
const axios = require('axios');
const qs = require('qs');

class BitrixService {
    constructor() {
        this.apiUrl = process.env.BITRIX_API_URL;
    }

    async call(method, params = {}) {
        try {
            // Формируем правильный URL
            var fullUrl = `${this.apiUrl}/${method}`;

            const response = await axios.get(
                `${fullUrl}?${qs.stringify(params, {
                    encode: false, // Отключаем URL-кодирование
                })}`);

            console.log('Bitrix Response:', response.data);
            return response.data;
        } catch (error) {
            // Детальная обработка ошибок
            let errorDetails = {
                message: error.message,
                code: error.code,
            };

            if (error.response) {
                errorDetails = {
                    ...errorDetails,
                    status: error.response.status,
                    data: error.response.data,
                    headers: error.response.headers,
                    config: {
                        url: error.config.url,
                        method: error.config.method,
                        data: error.config.data
                    }
                };
            }

            console.error('Bitrix API Error:', JSON.stringify(errorDetails, null, 2));
            throw new Error('BITRIX_INTEGRATION_FAILED');
        }
    }
    // Создание контакта с правильным форматом
    async createContact(contactData) {
        const fields = {
            NAME: contactData.firstName,
            LAST_NAME: contactData.lastName,
            EMAIL: [{ VALUE: contactData.email, VALUE_TYPE: 'WORK' }],
            TYPE_ID: contactData.role === 'user' ? 'CLIENT' : 'ADMIN',
            SOURCE_ID: 'WEB'
        };

        if (contactData.phone) {
            fields.PHONE = [{ VALUE: contactData.phone, VALUE_TYPE: 'WORK' }];
        }

        const result = await this.call(`${process.env.BITRIX_API_URL_CONTACT_ADD}/crm.contact.add`, { fields });
        return result.result; // Возвращаем ID созданного контакта
    }

    async getContactList(filter = {}, select = [], start = 0) {
        const params = {
            filter,
            select,
            start,
        };
        return this.call(`${process.env.BITRIX_API_URL_CONTACT_LIST}/crm.contact.list`, params);
    }

    async updateContact(contactId, updateData) {
        return this.call(`${process.env.BITRIX_API_URL_CONTACT_LIST}/crm.contact.update`, { ID: contactId, fields: updateData });
    }

    async deleteContact(contactId) {
        return this.call(`${process.env.BITRIX_API_URL_CONTACT_LIST}/crm.contact.delete`, { ID: contactId });
    }

    // ========== Застройщики (как компании) ==========
    async createDeveloper(developerData) {
        const fields = {
            TITLE: developerData.name,
            ADDRESS: developerData.address,
            PHONE: [{ VALUE: developerData.phone, VALUE_TYPE: 'WORK' }],
            EMAIL: [{ VALUE: developerData.email, VALUE_TYPE: 'WORK' }],
            UF_CRM_WEB: developerData.website,
            UF_CRM_INN: developerData.inn,
            UF_CRM_VIEWS: developerData.views || 0,
            ASSIGNED_BY_ID: developerData.user_id,
        };
        return await this.call(`${process.env.BITRIX_API_URL_CONTACT_LIST}/crm.company.add`, { fields });
    }

    async getDeveloperList(filter = {}, select = [], start = 0, order = { ID: 'DESC' }) {
        const params = {
            filter,
            select,
            start,
            order
        };
        return this.call(`${process.env.BITRIX_API_URL_CONTACT_LIST}/crm.company.list`, params);
    }

    async updateDeveloper(contactId, updateData) {
        return this.call(`${process.env.BITRIX_API_URL_CONTACT_LIST}/crm.company.update`, { ID: contactId, fields: updateData });
    }

    async deleteDeveloper(contactId) {
        return this.call(`${process.env.BITRIX_API_URL_CONTACT_LIST}/crm.company.delete`, { ID: contactId });
    }

    // ========== Квартиры (как товары) ==========
    async createApartment(apartmentData) {
        const fields = {
            NAME: apartmentData.title,
            DESCRIPTION: apartmentData.description,
            PRICE: apartmentData.price,
            CURRENCY_ID: 'RUB',
            SECTION_ID: apartmentData.buildingId, // Привязка к застройщику/ЖК
            PROPERTY_VALUES: {
                SQUARE: apartmentData.area,
                ROOMS: apartmentData.rooms,
                FLOOR: apartmentData.floor,
                STATUS: apartmentData.status || 'AVAILABLE'
            }
        };
        return this.call('crm.product.add', { fields }, 'post');
    }

    async getApartmentList(filter = {}) {
        return this.call('crm.product.list', { 
            filter: { 
                ...filter,
                SECTION_ID: filter.buildingId 
            },
            select: ['ID', 'NAME', 'PRICE', 'PROPERTY_SQUARE', 'PROPERTY_ROOMS']
        });
    }
}

module.exports = new BitrixService();