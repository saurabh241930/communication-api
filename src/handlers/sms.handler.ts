import axios from 'axios';
import { Job } from 'bull';

const smsConfig = {
    baseUrl: 'https://xx423.api.infobip.com/sms/2/text/advanced',
    apiKey: 'Your-API-Key', // Replace with your actual API key
};

const sendSMS = async (smsJob: Job) => {
    const { mobileNo, message } = smsJob.data.payload.message_details;

    const headers = {
        Authorization: `Bearer ${smsConfig.apiKey}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
    };

    const requestData = {
        messages: [
            {
                from: 'EAIAST',
                destinations: [{ to: mobileNo }],
                text: message,
                regional: {
                    indiaDlt: {
                        contentTemplateId: '1107168683139873298',
                        principalEntityId: '1101434900000011288',
                    },
                },
            },
        ],
    };

    try {
        const response = await axios.post(smsConfig.baseUrl, requestData, { headers });
        await smsJob.moveToCompleted('done', true);
        return response.data;
    } catch (error) {
        console.error('Failed to send SMS:', error);
        return error;
    }
};

export default sendSMS;
