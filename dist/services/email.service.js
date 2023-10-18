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
// emailQueue.ts
const email_handler_1 = __importDefault(require("../handlers/email.handler"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class EmailQueue {
    constructor(queueServices) {
        this.queueServices = queueServices;
        this.queueServices.processQueue('email_notification', (emailJob, done) => __awaiter(this, void 0, void 0, function* () {
            console.log('Processing email notification task');
            yield (0, email_handler_1.default)(emailJob);
            done();
        }));
    }
    addEmailToQueue(requestObject) {
        return __awaiter(this, void 0, void 0, function* () {
            const job = yield this.queueServices.addToQueue('email_notification', requestObject);
            const task = yield prisma.task.create({
                data: {
                    jobId: String(job.id),
                    type: 'EMAIL',
                    status: 'PENDING',
                    requestPayload: requestObject,
                    source: '',
                    batch: ''
                }
            });
            console.log('The email has been added to the queue...');
        });
    }
}
exports.default = EmailQueue;
