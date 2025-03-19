/* eslint-disable no-console */
import { PrismaClient } from '@prisma/client';
import prompts from 'prompts';

const prisma = new PrismaClient();

async function deleteUser() {
  try {
    const emailResponse = await prompts({
      type: 'text',
      name: 'email',
      message: 'Enter user email to delete:',
      validate: (value) => /\S+@\S+\.\S+/.test(value) || 'Invalid email format',
    });

    const user = await prisma.user.findUnique({
      where: { email: emailResponse.email },
    });

    if (!user) {
      console.error('❌ User not found');
      return;
    }

    const confirmResponse = await prompts({
      type: 'confirm',
      name: 'value',
      message: `Are you sure you want to delete user ${user.name} (${user.email})?`,
      initial: false,
    });

    if (!confirmResponse.value) {
      console.log('Operation cancelled');
      return;
    }

    await prisma.user.delete({
      where: { email: emailResponse.email },
    });

    console.log('✅ User deleted successfully');
  } catch (error) {
    console.error('Error deleting user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

deleteUser();
