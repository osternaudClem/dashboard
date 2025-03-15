/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { subHours, subMinutes } from 'date-fns';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 🔹 Create an Admin User
  const hashedPassword = await bcrypt.hash('password123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@example.com',
      password: hashedPassword,
    },
  });

  console.log(`✅ Created User: ${user.email}`);

  // 🔹 Create a Project
  const project = await prisma.project.upsert({
    where: { name: 'My First Project' },
    update: {},
    create: {
      name: 'My First Project',
      description: 'This is my first project.',
      url: 'https://myproject.com',
      userId: user.id, // Link project to user
    },
  });

  console.log(`✅ Created Project: ${project.name}`);

  // 🔹 Create an App inside the Project
  const app = await prisma.app.upsert({
    where: { id: 'unique-app-id' },
    update: {},
    create: {
      name: 'My First App',
      projectId: project.id, // Link app to project
    },
  });

  console.log(`✅ Created App: ${app.name} with API Key: ${app.apiKey}`);

  generateFakeHttpLogs(app.id);

  console.log('🎉 Seeding complete!');
}

/**
 * Generates fake HTTP logs for the last 24 hours.
 */
async function generateFakeHttpLogs(appId: string) {
  console.log('📊 Generating fake HTTP logs...');

  const logs = [];
  const statusCodes = [200, 201, 304, 403, 404, 500];
  const methods = ['GET', 'POST', 'PUT', 'DELETE'];
  const urls = ['/api/users', '/api/projects', '/api/tasks', '/api/auth'];

  // Generate logs for the past 14 days (2 weeks)
  for (let h = 0; h < 24 * 14; h++) {
    const timestamp = subHours(new Date(), h);
    const totalRequests = Math.floor(Math.random() * 41); // Between 0 and 40 requests per hour

    for (let j = 0; j < totalRequests; j++) {
      logs.push({
        appId,
        source: 'api',
        method: methods[Math.floor(Math.random() * methods.length)],
        url: urls[Math.floor(Math.random() * urls.length)],
        statusCode: statusCodes[Math.floor(Math.random() * statusCodes.length)],
        headers: JSON.stringify({
          'User-Agent': 'Mozilla/5.0',
          'Content-Type': 'application/json',
        }),
        params: j % 2 === 0 ? JSON.stringify({ id: Math.floor(Math.random() * 100) }) : '{}',
        query: j % 2 === 0 ? JSON.stringify({ page: 1 }) : '{}',
        body: j % 2 === 0 ? JSON.stringify({ key: 'value' }) : '{}',
        response: JSON.stringify({ message: 'OK' }),
        ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
        userAgent: 'Mozilla/5.0',
        timestamp: subMinutes(timestamp, Math.floor(Math.random() * 60)), // Spread requests within the hour
      });
    }
  }

  await prisma.httpLog.createMany({ data: logs });

  console.log(`✅ Inserted ${logs.length} fake logs for app ${appId}`);
}

// main()
//   .catch((error) => {
//     console.error('Error seeding database:', error);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });

generateFakeHttpLogs('cm89xxwfn0004wlo5n2kbzwgq');
