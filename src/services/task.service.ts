// task.service.ts
import { $Enums, PrismaClient, TaskType } from '@prisma/client';
import { Job } from 'bull';

const prisma = new PrismaClient();

class TaskService {
  async getTasks() {
    return prisma.task.findMany();
  }

  async getTaskById(id: string) {
    return prisma.task.findUnique({
      where: { id },
    });
  }

  async updateTaskStatus(job: Job, jobStatus: Boolean) {
    const {id , name } = job;
    let jobType: $Enums.TaskType;
    switch (name) {
      case "email_notification":
        jobType = "EMAIL"
        break;
      case "sms_notification":
        jobType = "SMS"
        break;
      case "whatsapp_notification":
        jobType = "WHATSAPP"
        break;
      default:
        jobType = "EMAIL"
        break;
    }
      try {
          // Attempt to update the task status to 'COMPLETED' or 'FAILED
          const updatedTask = await prisma.task.update({
            where: { jobId: String(id), type: jobType },
            data: { status: jobStatus ? 'COMPLETED' : 'FAILED' },
          });
          return updatedTask;
      } catch (updateError) {
        throw updateError
      }
  }

}

export default TaskService;