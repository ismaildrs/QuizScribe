import { getTranscript } from "@/lib/getTranscribe";
import { prisma } from "@/prisma";
import { NextResponse } from "next/server";

export async function POST(req) {
  const body = await req.json();
  console.log(body);
  const videoId = body.videoId;
  const prompt = body.prompt || "";
  const folderId = body.folderId; // Folder ID where the video belongs
  const title = body.title || "Untitled Video"; // Optional title for the video
  const url = body.url || ""; // YouTube URL
  const thumbnail = body.thumbnail;

  // Validate required fields
  if (!videoId || !folderId) {
    return NextResponse.json(
      { message: "VideoId and folderId is required" },
      { status: 400 }
    );
  }

  try {
    console.log("Processing videoId:", videoId);

    // Fetch transcript
    const result = await getTranscript(videoId, prompt);
    const { summary, flashCards, quizzes } = result; // Assuming the API returns these fields
    console.log(result);

    // Save video and related data to the database
    const savedVideo = await prisma.video.create({
      data: {
        title,
        url,
        thumbnail,
        summary,
        folderId,
        flashcards: {
          create: flashCards.map((fc) => ({
            question: fc.question,
            answer: fc.answer,
          })),
        },
        quizzes: {
          create: quizzes.map((quiz) => ({
            question: quiz.question,
            options: quiz.options,
          })),
        },
      },
      include: {
        flashcards: true,
        quizzes: true,
      },
    });

    return NextResponse.json(
      { message: "Video saved successfully", savedVideo },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json(
      { message: "Error: " + e.message },
      { status: 500 }
    );
  }
}
