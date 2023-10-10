import { Job } from "bull";

const axios = require('axios');

// Define your WhatsApp API endpoint and authentication header
const whatsappConfig = {
  baseUrl: 'https://api.interakt.ai/v1/public/message/',
  authHeader: 'Basic Tjh0REw2ZjJ1UkdoNi03QWkwWG1wOGVRZ3NYTmY1VXF5QzE3Z0F2NnF0UTo=',
};

// Function to send a WhatsApp message
const sendWhatsAppMessage = async (whatsAppJob: Job) => {
    const {phone_number, callback_data, template_name, language_code} = whatsAppJob.data.payload.whatsapp_details;
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
    const response = await axios.post(whatsappConfig.baseUrl, requestData, { headers });
    console.log('WhatsApp message sent successfully:', response.data);
    await whatsAppJob.moveToCompleted('done', true);
    return response.data;
  } catch (error) {
    console.error('Failed to send WhatsApp message:', error);
    return error;
  }
};

export default sendWhatsAppMessage;