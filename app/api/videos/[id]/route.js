import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { NextResponse } from "next/server";

export const GET = auth(async function GET(req, { params }) {
  try {
    if (!req.auth) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    const userId = req.auth.user.userId;
    const videoId = params.id;

    console.log("Fetching video:", { videoId }); // Debug log

    // Fetch the video and verify ownership through folder
    const video = await prisma.video.findFirst({
      where: {
        id: videoId,
        folder: {
          userId: userId, // Ensure user owns the folder containing the video
        },
      },
      include: {
        flashcards: {
          orderBy: {
            createdAt: "desc",
          },
        },
        quizzes: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!video) {
      console.log("No video found for:", { videoId }); // Debug log
      return NextResponse.json({ message: "Video not found" }, { status: 404 });
    }

    return NextResponse.json(video, { status: 200 });
  } catch (error) {
    console.error("Error fetching video:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
});
