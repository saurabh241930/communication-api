// emailQueue.ts
import sendSMS from '../handlers/sms.handler';
import QueueServices from './queue.service';
import { PrismaClient } from '@prisma/client'
import { Job } from 'bull';

const prisma = new PrismaClient()



class SmsQueue {
    private queueServices: QueueServices;


    constructor(queueServices: QueueServices) {
        this.queueServices = queueServices;

        this.queueServices.processQueue('sms_notification', async (smsJob, done) => {
            console.log('Processing sms notification task');
            await sendSMS(smsJob);
            done();
        });
    }

    async addSmsToQueue(requestObject: object) {
        const job: Job = await this.queueServices.addToQueue('sms_notification', requestObject);
        const task = await prisma.task.create({
            data: {
                jobId: String(job.id),
                type: 'SMS',
                status: 'PENDING',
                requestPayload: requestObject,
                source: '',
                batch: ''

            }
        });
        console.log('The sms has been added to the queue...');
    }
}

export default SmsQueue;