import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import prompts from 'prompts';
import { isRegistrationEnabled } from '../config';

const prisma = new PrismaClient();

async function createUser() {
  try {
    if (!isRegistrationEnabled()) {
      // eslint-disable-next-line no-console
      console.log('❌ Registration is disabled');
      return;
    }

    const response = await prompts([
      {
        type: 'text',
        name: 'username',
        message: 'Enter username:',
        validate: (value) => value.length >= 3 || 'Username must be at least 3 characters',
      },
      {
        type: 'text',
        name: 'email',
        message: 'Enter email:',
        validate: (value) => /\S+@\S+\.\S+/.test(value) || 'Invalid email format',
      },
      {
        type: 'password',
        name: 'password',
        message: 'Enter password:',
        validate: (value) => value.length >= 8 || 'Password must be at least 8 characters',
      },
      {
        type: 'select',
        name: 'role',
        message: 'Select role:',
        choices: [
          { title: 'Admin', value: 'admin' },
          { title: 'User', value: 'user' },
        ],
      },
    ]);

    // Hash the password
    const hashedPassword = await bcrypt.hash(response.password, 10);

    // Create the user
    const user = await prisma.user.create({
      data: {
        id: crypto.randomUUID(),
        name: response.username,
        email: response.email,
        emailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        accounts: {
          create: {
            id: crypto.randomUUID(),
            providerId: 'credentials',
            accountId: response.email,
            password: hashedPassword,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        },
      },
    });

    // eslint-disable-next-line no-console
    console.log('✅ User created successfully:', {
      id: user.id,
      name: user.name,
      email: user.email,
      role: response.role,
    });
  } catch (error) {
    console.error('Error creating user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createUser();
