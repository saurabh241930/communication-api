import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const jwtSecret = 'your-secret-key'; // Replace with a secret key for JWT

class UserService {
    async createUser(username: string, email: string, password: string) {
        const hashedPassword = await bcrypt.hash(password, 10);
        return prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
            },
        });
    }

    async loginUser(username: string, password: string) {
        const user = await prisma.user.findUnique({ where: { username } });
        if (!user) {
            throw new Error('User not found');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid password');
        }

        const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '1h' });

        return { token, user };
    }
}

export default UserService;
