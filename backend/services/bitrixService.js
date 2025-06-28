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
            TYPE_ID: contactData.role==='user'? 'CLIENT':'ADMIN',
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
}

module.exports = new BitrixService();