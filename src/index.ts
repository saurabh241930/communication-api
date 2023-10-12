import express from 'express';
import bodyParser from 'body-parser';
import EmailQueue from './services/email.service';
import QueueServices from './services/queue.service';
import UserService from './services/user.service';
import TaskService from './services/task.service'; // Import task service
import cors from 'cors'; // Import the cors middleware
import SmsQueue from './services/sms.service';
import WhatsAppQueue from './services/whatsapp.service';
import { PrismaClient } from '@prisma/client'
import TemplateService from './services/template.service';

const prisma = new PrismaClient()

const app = express();
const userService = new UserService(); // Instantiate the user service
const taskService = new TaskService(); // Instantiate the task service
const templateService = new TemplateService(); 



app.use(bodyParser.json());

// Enable CORS for all routes
app.use(cors());



app.post('/process', async (req, res) => {
  const { service_type, execution_type, payload } = req.body;
  let queueOpts;
  if (service_type === "email") {
    queueOpts = {
      limiter: {
        max: 100,
        duration: 10000,
      },
      prefix: 'EMAIL-TASK',
      defaultJobOptions: {
        attempts: 3,
        removeOnComplete: false,
      },
    };
    const { email_details } = payload;
    const queueServices = new QueueServices(queueOpts);
    const emailQueue = new EmailQueue(queueServices);

    await emailQueue.addEmailToQueue(req.body);

    res.status(200).json({ message: 'Email task added to the queue.' });
  } else if (service_type === "sms") {
    queueOpts = {
      limiter: {
        max: 100,
        duration: 10000,
      },
      prefix: 'SMS-TASK',
      defaultJobOptions: {
        attempts: 3,
        removeOnComplete: false,
      },
    };
    const queueServices = new QueueServices(queueOpts);
    const smsQueue = new SmsQueue(queueServices);

    await smsQueue.addSmsToQueue(req.body)

    res.status(200).json({ message: 'SMS task added to the queue.' });
  } else if(service_type === "whatsapp"){
    queueOpts = {
      limiter: {
        max: 100,
        duration: 10000,
      },
      prefix: 'WHATSAPP-TASK',
      defaultJobOptions: {
        attempts: 3,
        removeOnComplete: false,
      },
    };
    const queueServices = new QueueServices(queueOpts);
    const whatsAppQueue = new WhatsAppQueue(queueServices);

    await whatsAppQueue.addWhatsAppToQueue(req.body)

    res.status(200).json({ message: 'WhatsApp task added to the queue.' });
  } else {
    res.status(400).json({ message: 'Unsupported service_type.' });
  }
});


app.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    await userService.createUser(username, email, password);
    res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "failed" });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const { token, user } = await userService.loginUser(username, password);
    res.status(200).json({ token, user });
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "failed" });
  }
});

app.get('/tasks', async (req, res) => {
  try {
    const tasks = await taskService.getTasks();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Read a specific task by ID
app.get('/tasks/:taskId', async (req, res) => {
  const { taskId } = req.params;

  try {
    const task = await taskService.getTaskById(taskId);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/add-template', async (req, res) => {
  try {
    const newTemplate = await templateService.addTemplate(req.body);

    res.status(201).json({ message: 'Template created successfully', template: newTemplate });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Failed to create the template' });
  }
});

app.listen(5001, () => console.log('Started queue server on port 5001'));
