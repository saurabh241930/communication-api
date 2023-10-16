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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const smsConfig = {
    baseUrl: 'https://xx423.api.infobip.com/sms/2/text/advanced',
    apiKey: 'Your-API-Key', // Replace with your actual API key
};
const sendSMS = (smsJob) => __awaiter(void 0, void 0, void 0, function* () {
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
        const response = yield axios_1.default.post(smsConfig.baseUrl, requestData, { headers });
        yield smsJob.moveToCompleted('done', true);
        return response.data;
    }
    catch (error) {
        console.error('Failed to send SMS:', error);
        return error;
    }
});
exports.default = sendSMS;
