import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // 🔹 Create an Admin User
  const hashedPassword = await bcrypt.hash("password123", 10);
  const user = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      username: "admin",
      email: "admin@example.com",
      password: hashedPassword,
    },
  });

  console.log(`✅ Created User: ${user.email}`);

  // 🔹 Create a Project
  const project = await prisma.project.upsert({
    where: { name: "My First Project" },
    update: {},
    create: {
      name: "My First Project",
      description: "This is my first project.",
      url: "https://myproject.com",
      userId: user.id, // Link project to user
    },
  });

  console.log(`✅ Created Project: ${project.name}`);

  // 🔹 Create an App inside the Project
  const app = await prisma.app.upsert({
    where: { id: "unique-app-id" },
    update: {},
    create: {
      name: "My First App",
      projectId: project.id, // Link app to project
    },
  });

  console.log(`✅ Created App: ${app.name} with API Key: ${app.apiKey}`);

  console.log("🎉 Seeding complete!");
}

main()
  .catch((error) => {
    console.error("Error seeding database:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
