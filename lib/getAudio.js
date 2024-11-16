import ytdl from "@distube/ytdl-core";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

export async function getAudio(id) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const videoURL = `https://www.youtube.com/watch?v=${id}`;
  const outputDir = path.resolve(__dirname, "../data");
  const outputFilePath = path.join(outputDir, `${id}.wav`);

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  if (fs.existsSync(outputFilePath)) return outputFilePath;

  try {
    const audioStream = ytdl(videoURL, { filter: "audioonly" });
    const writeStream = fs.createWriteStream(outputFilePath);

    // Wrap the stream events in a Promise
    await new Promise((resolve, reject) => {
      audioStream.pipe(writeStream);

      writeStream.on("finish", () => {
        console.log("Done! Audio saved to:", outputFilePath);
        resolve();
      });

      writeStream.on("error", (err) => {
        console.error("Error writing the file:", err.message);
        reject(err);
      });

      audioStream.on("error", (err) => {
        console.error("Error during download:", err.message);
        reject(err);
      });
    });

    return outputFilePath; // Return after writing completes
  } catch (error) {
    console.error("An error occurred:", error.message);
    throw error; // Propagate the error to the caller
  }
}

