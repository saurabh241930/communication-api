// emailQueue.ts
import sendEmail from '../handlers/email.handler';
import QueueServices from './queue.service';
import { PrismaClient } from '@prisma/client'
import { Job } from 'bull';
import TemplateService from './template.service';

const prisma = new PrismaClient();
const templateService = new TemplateService();



class EmailQueue {
    private queueServices: QueueServices;


    constructor(queueServices: QueueServices) {
        this.queueServices = queueServices;

        this.queueServices.processQueue('email_notification', async (emailJob: any, done: () => void) => {
            console.log('Processing email notification task');
            const responseObj =  await templateService.getTemplate(emailJob.data.payload.email_details.templateName);
            emailJob.data.payload.email_details.body = responseObj?.text;
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
