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
            const fullUrl = `${this.apiUrl}/${method}`;
            if (method === 'crm.contact.add') {
                console.log(process.env.BITRIX_API_URL_CONTACT_ADD);
                fullUrl = `${this.apiUrl}/${process.env.BITRIX_API_URL_CONTACT_ADD}/${method}`;
            }

            // Преобразуем параметры в строку
            const data = qs.stringify(params);

            console.log('Bitrix Request URL:', fullUrl);
            console.log('Bitrix Request Data:', data);

            const response = await axios.get(
                `${fullUrl}?${data}`);

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
            TYPE_ID: 'CLIENT',
            ASSIGNED_BY_ID: 1, // ID ответственного пользователя
            SOURCE_ID: 'WEB'
        };

        if (contactData.phone) {
            fields.PHONE = [{ VALUE: contactData.phone, VALUE_TYPE: 'WORK' }];
        }

        const result = await this.call('crm.contact.add', { fields });
        return result.result; // Возвращаем ID созданного контакта
    }

    // Проверка подключения
    async testConnection() {
        try {
            const response = await this.call('crm.contact.fields');
            return {
                success: true,
                fields: response.result
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
}

module.exports = new BitrixService();