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
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    service: 'hotmail',
    auth: {
        user: 'sp241930@outlook.com',
        pass: 'pqudyvmdbitagqnb',
    },
});
const sendEmail = (emailJob) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { from, to, subject, text } = emailJob.data.payload.email_details;
        const mailDetails = {
            from,
            to,
            subject,
            text
        };
        yield transporter.sendMail(mailDetails);
        yield emailJob.moveToCompleted('done', true);
        console.log('Email sent successfully...');
    }
    catch (error) {
        yield emailJob.moveToFailed({ message: 'Task processing failed..' });
        console.error(error);
    }
});
exports.default = sendEmail;
