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
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const email_service_1 = __importDefault(require("./services/email.service"));
const queue_service_1 = __importDefault(require("./services/queue.service"));
const user_service_1 = __importDefault(require("./services/user.service"));
const task_service_1 = __importDefault(require("./services/task.service")); // Import task service
const cors_1 = __importDefault(require("cors")); // Import the cors middleware
const sms_service_1 = __importDefault(require("./services/sms.service"));
const whatsapp_service_1 = __importDefault(require("./services/whatsapp.service"));
const app = (0, express_1.default)();
const userService = new user_service_1.default(); // Instantiate the user service
const taskService = new task_service_1.default(); // Instantiate the task service
app.use(body_parser_1.default.json());
// Enable CORS for all routes
app.use((0, cors_1.default)());
app.post('/process', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const queueServices = new queue_service_1.default(queueOpts);
        const emailQueue = new email_service_1.default(queueServices);
        yield emailQueue.addEmailToQueue(req.body);
        res.status(200).json({ message: 'Email task added to the queue.' });
    }
    else if (service_type === "sms") {
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
        const queueServices = new queue_service_1.default(queueOpts);
        const smsQueue = new sms_service_1.default(queueServices);
        yield smsQueue.addSmsToQueue(req.body);
        res.status(200).json({ message: 'SMS task added to the queue.' });
    }
    else if (service_type === "whatsapp") {
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
        const queueServices = new queue_service_1.default(queueOpts);
        const whatsAppQueue = new whatsapp_service_1.default(queueServices);
        yield whatsAppQueue.addWhatsAppToQueue(req.body);
        res.status(200).json({ message: 'WhatsApp task added to the queue.' });
    }
    else {
        res.status(400).json({ message: 'Unsupported service_type.' });
    }
}));
app.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password } = req.body;
        yield userService.createUser(username, email, password);
        res.status(201).json({ message: 'User registered successfully.' });
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ message: "failed" });
    }
}));
app.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        const { token, user } = yield userService.loginUser(username, password);
        res.status(200).json({ token, user });
    }
    catch (error) {
        console.log(error);
        res.status(401).json({ message: "failed" });
    }
}));
app.get('/tasks', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tasks = yield taskService.getTasks();
        res.status(200).json(tasks);
    }
    catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
// Read a specific task by ID
app.get('/tasks/:taskId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { taskId } = req.params;
    try {
        const task = yield taskService.getTaskById(taskId);
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.status(200).json(task);
    }
    catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
app.listen(5001, () => console.log('Started queue server on port 5001'));
