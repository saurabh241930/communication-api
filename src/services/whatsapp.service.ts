import QueueServices from './queue.service';
import { PrismaClient } from '@prisma/client'
import { Job } from 'bull';
import sendWhatsAppMessage from '../handlers/whatsapp.handler';

const prisma = new PrismaClient()



class WhatsAppQueue {
    private queueServices: QueueServices;


    constructor(queueServices: QueueServices) {
        this.queueServices = queueServices;

        this.queueServices.processQueue('whatsapp_notification', async (job, done) => {
            console.log('Processing whatsapp notification task');
            await sendWhatsAppMessage(job);
            done();
        });
    }

    async addWhatsAppToQueue(requestObject: object) {
        const job: Job = await this.queueServices.addToQueue('whatsapp_notification', requestObject);
        const task = await prisma.task.create({
            data: {
                jobId: String(job.id),
                type: 'WHATSAPP',
                status: 'PENDING',
                requestPayload: requestObject,
                source: '',
                batch: ''

            }
        });
        console.log('The whatsapp has been added to the queue...');
    }
}

export default WhatsAppQueue;
