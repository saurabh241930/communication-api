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
// QueueServices.ts
const bull_1 = __importDefault(require("bull"));
const client_1 = require("@prisma/client");
const task_service_1 = __importDefault(require("../services/task.service"));
const taskService = new task_service_1.default();
const prisma = new client_1.PrismaClient();
const REDIS_URL = 'redis://127.0.0.1:6379';
class QueueServices {
    constructor(options) {
        this.queue = new bull_1.default('Queue', REDIS_URL, {
            limiter: options.limiter,
            prefix: options.prefix,
            defaultJobOptions: options.defaultJobOptions,
        });
        this.queue.on('failed', (job, err) => __awaiter(this, void 0, void 0, function* () {
            console.log(`Job ${job.id} failed with error ${err.message}`);
            yield taskService.updateTaskStatus(job, false); //To Update log status, parameters job and jobStatus 
        }));
        this.queue.on('completed', (job) => __awaiter(this, void 0, void 0, function* () {
            console.log(`Job ${job.id} has been successfully processed`);
            yield taskService.updateTaskStatus(job, true);
            console.log("view", job);
        }));
    }
    addToQueue(messageType, data, delay) {
        return __awaiter(this, void 0, void 0, function* () {
            let job;
            if (delay) {
                job = yield this.queue.add(messageType, data, { delay });
            }
            else {
                job = yield this.queue.add(messageType, data);
            }
            return job;
        });
    }
    processQueue(messageType, handler) {
        return __awaiter(this, void 0, void 0, function* () {
            this.queue.process(messageType, handler);
        });
    }
}
exports.default = QueueServices;
