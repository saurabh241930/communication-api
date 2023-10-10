// emailQueue.ts
import sendEmail from '../handlers/email.handler';
import QueueServices from './queue.service';
import { PrismaClient } from '@prisma/client'
import { Job } from 'bull';

const prisma = new PrismaClient()



class EmailQueue {
    private queueServices: QueueServices;


    constructor(queueServices: QueueServices) {
        this.queueServices = queueServices;

        this.queueServices.processQueue('email_notification', async (emailJob, done) => {
            console.log('Processing email notification task');
            await sendEmail(emailJob);
            done();
        });
    }

    async addEmailToQueue(requestObject: object) {
        const job: Job = await this.queueServices.addToQueue('email_notification', requestObject);
        const task = await prisma.task.create({
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
    }
}

export default EmailQueue;
