import { exportApkgFile } from "@/lib/createApkg";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    if (!body.flashcards || !body.folder) {
      return NextResponse.json(
        { message: "Folder name and flashcards are required." },
        { status: 400 }
      );
    }
    const apkgBuffer = await exportApkgFile(body.folder, body.flashcards);
    if (apkgBuffer != null) {
      return NextResponse.json({ apkg: apkgBuffer }, { status: 200 });
    }

    throw new Error("Error occurred");
  } catch (e) {
    return NextResponse.json({ message: "Error: " + e }, { status: 500 });
  }
}
