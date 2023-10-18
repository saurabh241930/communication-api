"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios = require('axios');
// Define your WhatsApp API endpoint and authentication header
const whatsappConfig = {
    baseUrl: 'https://api.interakt.ai/v1/public/message/',
    authHeader: 'Basic Tjh0REw2ZjJ1UkdoNi03QWkwWG1wOGVRZ3NYTmY1VXF5QzE3Z0F2NnF0UTo=',
};
// Function to send a WhatsApp message
const sendWhatsAppMessage = (whatsAppJob) => __awaiter(void 0, void 0, void 0, function* () {
    const { phone_number, callback_data, template_name, language_code } = whatsAppJob.data.payload.whatsapp_details;
    const requestData = {
        countryCode: '+91',
        phoneNumber: phone_number,
        callbackData: callback_data,
        type: 'Template',
        template: {
            name: template_name,
            languageCode: language_code,
        },
    };
    const headers = {
        'Authorization': whatsappConfig.authHeader,
        'Content-Type': 'application/json',
    };
    try {
        const response = yield axios.post(whatsappConfig.baseUrl, requestData, { headers });
        console.log('WhatsApp message sent successfully:', response.data);
        yield whatsAppJob.moveToCompleted('done', true);
        return response.data;
    }
    catch (error) {
        console.error('Failed to send WhatsApp message:', error);
        return error;
    }
});
exports.default = sendWhatsAppMessage;
