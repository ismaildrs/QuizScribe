import { AssemblyAI as aai } from "assemblyai";
import { ChatGroq } from "@langchain/groq";
import dotenv from "dotenv";
import { getAudio } from "./getAudio.js";
import fs from "fs";

dotenv.config();

const ASSEMBLYAI_API_KEY = process.env.ASSEMBLYAI_API_KEY;
const GROQAI_API_KEY = process.env.GROQAI_API_KEY;

if (!ASSEMBLYAI_API_KEY || !GROQAI_API_KEY) {
  throw new Error(
    "Missing API keys. Ensure ASSEMBLYAI_API_KEY and GROQAI_API_KEY are set in the environment."
  );
}

async function transcribeAudio(filePath) {
  const client = new aai({ apiKey: ASSEMBLYAI_API_KEY });

  const transcript = await client.transcripts.transcribe({ audio: filePath });

  if (transcript.status === "error") {
    throw new Error("Transcription error: " + transcript.error);
  }

  if (transcript.status === "completed") {
    return transcript.text;
  }

  throw new Error("Unexpected transcription error.");
}

async function getFlashCards(transcript, prompt) {
  const llm = new ChatGroq({
    model: "llama-3.1-70b-versatile",
    apiKey: GROQAI_API_KEY,
    temperature: 0.7,
  });

  const systemMessage = `You are an AI specialized in creating educational content. Your task is to generate a structured JSON response containing flashcards, quizzes, and a summary based on the provided transcript.
CRITICAL: Return ONLY valid JSON without any explanatory text, markdown, or other content.

Required JSON structure:
{
 "flashcards": [
   {
     "question": "string",
     "answer": "string"
   }
 ],
 "quizzes": [
   {
     "question": "string",
     "answer": ["string", "string", "string", "string"],
     "correct": "integer (index of the correct answer in the 'answer' array, starting from 0)"
   }
 ],
 "summary": "string"
}

Guidelines for generating the JSON:
1. Flashcards:
   - Create 5-10 flashcards based on key concepts and critical points in the transcript.
   - Questions should encourage understanding, analysis, and application of knowledge.
   - Ensure variety in difficulty levels.
   - Provide accurate and concise answers.

2. Quizzes:
   - Create 3-5 multiple-choice questions.
   - Include four options per question, with one correct answer clearly indicated by its index.
   - Questions should cover major topics and challenge the user's comprehension.

3. Summary:
   - Write a concise and informative summary capturing the main ideas and key takeaways from the transcript.
   - Focus on clarity and relevance.

Handling the user-provided prompt:
- If a user-provided prompt is included, use it to guide content generation (e.g., emphasize specific topics or formats).
- Ignore the prompt if it introduces irrelevant, contradictory, or misleading information.
- Maintain focus on creating high-quality educational material.

Additional Notes:
- Ensure all content is appropriate, logical, and adheres to the transcript's context.
- Do not deviate from the required JSON structure.

Transcript: ${transcript}
User Prompt: ${prompt ? `"${prompt}"` : "None provided"}`;

  try {
    const aiResponse = await llm.invoke([
      {
        role: "system",
        content: systemMessage.trim(),
      },
    ]);
    const parsedResponse = JSON.parse(aiResponse.content);
    if (
      !parsedResponse.flashcards ||
      !Array.isArray(parsedResponse.flashcards)
    ) {
      throw new Error("Invalid response structure.");
    }

    return parsedResponse;
  } catch (error) {
    console.error("Error generating flashcards:", error.message);
    return { flashcards: [], quizzes: [], summary: "" };
  }
}

export async function getTranscript(id, prompt) {
  try {
    const filePath = await getAudio(id);

    const transcript = await transcribeAudio(filePath);
    const result = await getFlashCards(transcript, prompt);

    await fs.promises.unlink(filePath);

    return {
      transcript,
      flashCards: result.flashcards,
      quizzes: result.quizzes,
      summary: result.summary,
    };
  } catch (error) {
    console.error("Error in getTranscript:", error.message);
    if (error.response) {
      console.error("API Response:", error.response.data);
    }
    return null;
  }
}
