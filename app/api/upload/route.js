import { getTranscript } from "@/lib/getTranscribe";
import { NextResponse } from "next/server";

export async function GET(req) {
  const searchParams = req.nextUrl.searchParams;
  const videoId = searchParams.get("videoId");
  console.log(videoId);

  // Validate videoId
  if (!videoId) {
    return NextResponse.json(
      { message: "videoId is required body" },
      { status: 400 }
    );
  }

  try {
    console.log("Processing videoId:", videoId);
    const result = await getTranscript(videoId);
    return NextResponse.json(result, { status: 200 });
  } catch (e) {
    console.error("Error in POST handler:", e);
    return NextResponse.json(
      { message: "Error: " + e.message },
      { status: 500 }
    );
  }
}
