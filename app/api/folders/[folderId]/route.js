import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { NextResponse } from "next/server";

export const GET = auth(async function GET(req, { params }) {
  try {
    if (!req.auth) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 },
      );
    }

    const userId = req.auth.userId;
    const folderId = params.folderId;

    console.log("Fetching folder:", { folderId }); // Debug log

    // Fetch the specific folder and verify ownership
    const folder = await prisma.folder.findUnique({
      where: {
        id: folderId,
        userId: userId, // Add userId to ensure user owns the folder
      },
      include: {
        videos: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!folder) {
      console.log("No folder found for:", { folderId }); // Debug log
      return NextResponse.json(
        { message: "Folder not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(folder, {status:200});
  } catch (error) {
    console.error("Error fetching folder:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 },
    );
  }
});
