import { prisma } from "@/lib/prisma/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import {
  authOptions,
  ExtendedSession,
} from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    const session: ExtendedSession | null = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const projects = await prisma.project.findMany({
      where: { userId: session.user.id },
      include: { apps: true },
    });

    return NextResponse.json(projects, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch projects", details: (error as Error).message },
      { status: 500 }
    );
  }
}
