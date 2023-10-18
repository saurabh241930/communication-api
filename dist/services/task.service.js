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
// task.service.ts
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class TaskService {
    getTasks() {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.task.findMany();
        });
    }
    getTaskById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.task.findUnique({
                where: { id },
            });
        });
    }
    updateTaskStatus(job, jobStatus) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, name } = job;
            let jobType;
            switch (name) {
                case "email_notification":
                    jobType = "EMAIL";
                    break;
                case "sms_notification":
                    jobType = "SMS";
                    break;
                case "whatsapp_notification":
                    jobType = "WHATSAPP";
                    break;
                default:
                    jobType = "EMAIL";
                    break;
            }
            try {
                // Attempt to update the task status to 'COMPLETED' or 'FAILED
                const updatedTask = yield prisma.task.update({
                    where: { jobId: String(id), type: jobType },
                    data: { status: jobStatus ? 'COMPLETED' : 'FAILED' },
                });
                return updatedTask;
            }
            catch (updateError) {
                throw updateError;
            }
        });
    }
}
exports.default = TaskService;
