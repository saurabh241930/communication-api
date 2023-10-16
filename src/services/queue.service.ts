// QueueServices.ts
import Queue from 'bull';
import { PrismaClient } from '@prisma/client';
import TaskService from '../services/task.service';

const taskService = new TaskService();
const prisma = new PrismaClient();
const REDIS_URL = 'redis://127.0.0.1:6379';

interface QueueServiceOptions {
    limiter: Queue.QueueOptions['limiter'];
    prefix: string;
    defaultJobOptions: Queue.QueueOptions['defaultJobOptions'];
}

class QueueServices {
    private queue: Queue.Queue;

    constructor(options: QueueServiceOptions) {
        this.queue = new Queue('Queue', REDIS_URL, {
            limiter: options.limiter,
            prefix: options.prefix,
            defaultJobOptions: options.defaultJobOptions,
        });

        this.queue.on('failed', async (job, err) => {
            console.log(`Job ${job.id} failed with error ${err.message}`);

            await taskService.updateTaskStatus(job, false); //To Update log status, parameters job and jobStatus 
        });

        this.queue.on('completed', async (job) => {
            console.log(`Job ${job.id} has been successfully processed`);

            await taskService.updateTaskStatus(job, true);
        });
    }

    async addToQueue(messageType: string, data: any, delay?: number): Promise<Queue.Job> {
        let job: Queue.Job;
        if (delay) {
            job = await this.queue.add(messageType, data, { delay });
        } else {
            job = await this.queue.add(messageType, data);
        }
        return job;
    }

    async processQueue(messageType: string, handler: Queue.ProcessCallbackFunction<any>) {
        this.queue.process(messageType, handler);
    }
}

export default QueueServices;
