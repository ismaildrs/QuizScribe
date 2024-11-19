import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { NextResponse } from "next/server";

export const GET = auth(async function GET(req) {
  try {
    if (!req.auth) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 },
      );
    }

    const userId = req.auth.userId; // Assuming `auth` middleware adds `userId` to `req.auth`

    // Fetch folders for the authenticated user
    const folders = await prisma.folder.findMany({
      where: { userId },
      include: {
        videos: true, // Optionally include related videos
      },
    });

    return NextResponse.json(folders, { status: 200 });
  } catch (error) {
    console.error("Error fetching folders:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 },
    );
  }
});
