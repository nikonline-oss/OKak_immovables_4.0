require('dotenv').config(); 
const axios = require('axios');
const qs = require('qs');

class BitrixService {
    constructor() {
        this.apiUrl = process.env.BITRIX_API_URL;
    }

    async call(method, params = {}) {
        try {
            console.log(method);
            console.log(params);
            console.log(this.apiUrl);
            const response = await axios.post(
                `${this.apiUrl}/${method}`,
                qs.stringify(params),
                { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
            );
            return response.data;
        } catch (error) {
            console.error('Bitrix API Error:', error.response?.data || error.message);
            throw new Error('BITRIX_INTEGRATION_FAILED');
        }
    }

    // Контакты
    async createContact(fields) {
        return this.call('crm.contact.add', { fields });
    }

    async updateContact(id, fields) {
        return this.call('crm.contact.update', { id, fields });
    }

    // Компании
    async createCompany(fields) {
        return this.call('crm.company.add', { fields });
    }

    async updateCompany(id, fields) {
        return this.call('crm.company.update', { id, fields });
    }

    // Сделки
    async createDeal(fields) {
        return this.call('crm.deal.add', { fields });
    }

    async updateDeal(id, fields) {
        return this.call('crm.deal.update', { id, fields });
    }

    // Товары (для квартир)
    async createProduct(fields) {
        return this.call('crm.product.add', { fields });
    }

    async updateProduct(id, fields) {
        return this.call('crm.product.update', { id, fields });
    }
}

module.exports = new BitrixService();