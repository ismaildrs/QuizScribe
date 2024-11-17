import { getTranscript } from "@/lib/getTranscribe";
import { NextResponse } from "next/server";

export async function POST(req) {
  const body = await req.json();
  const videoId = body.videoId;
  const prompt = body.prompt || "";
  console.log(videoId);
  console.log(prompt);

  // Validate videoId
  if (!videoId ) {
    return NextResponse.json(
      { message: "videoId is required body" },
      { status: 400 }
    );
  }

  try {
    console.log("Processing videoId:", videoId);  
    const result = await getTranscript(videoId, prompt);
    return NextResponse.json(result, { status: 200 });
  } catch (e) {
    console.error("Error in POST handler:", e);
    return NextResponse.json(
      { message: "Error: " + e.message },
      { status: 500 }
    );
  }
}