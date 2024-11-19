import { NextResponse } from "next/server";

export async function GET(req) {
  const searchParams = req.nextUrl.searchParams;
  const videoId = searchParams.get("videoId");

  console.log("Received videoId:", videoId);

  // Validate videoId
  if (!videoId) {
    return NextResponse.json(
      { message: "videoId is required" },
      { status: 400 }
    );
  }

  const API_KEY = process.env.YOUTUBE_API_KEY; // Ensure API key is in environment variables
  const URL = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${API_KEY}`;

  try {
    console.log("Fetching video info from YouTube API...");
    console.log(URL);
    const response = await fetch(URL);

    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.items.length === 0) {
      return NextResponse.json(
        { message: "No video found with the provided videoId" },
        { status: 404 }
      );
    }

    const video = data.items[0];
    const title = video.snippet.title;
    const thumbnail = video.snippet.thumbnails.high.url;
    const description = video.snippet.description;
    const channelTitle = video.snippet.channelTitle;
    const defaultLanguage = video.snippet.defaultLanguage;
    const tags = video.snippet.tags;

    return NextResponse.json(
      { title, thumbnail, description, channelTitle, defaultLanguage, tags },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching video info:", error);
    return NextResponse.json(
      { message: "Error: " + error.message },
      { status: 500 }
    );
  }
}
