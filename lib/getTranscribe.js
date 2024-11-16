import { AssemblyAI as aai } from "assemblyai";
import { ChatGroq } from "@langchain/groq";
import dotenv from "dotenv";
import { getAudio } from "./getAudio.js";
import fs from "fs";

dotenv.config();

const ASSEMBLYAI_API_KEY = process.env.ASSEMBLYAI_API_KEY;
const GROQAI_API_KEY = process.env.GROQAI_API_KEY;

if (!ASSEMBLYAI_API_KEY || !GROQAI_API_KEY) {
  throw new Error("Missing API keys. Ensure environment variables are set.");
}

async function transcribeAudio(filePath) {
  const client = new aai({
    apiKey: ASSEMBLYAI_API_KEY,
  });

  const transcript = await client.transcripts.transcribe({
    audio: filePath,
  });

  if (transcript.status === "error")
    throw new Error("Error occurred: " + transcript.error);
  else if (transcript.status === "completed") return transcript.text;
  throw new Error("Unexpected error occured");
}

async function getFlashCards(transcript) {
  const llm = new ChatGroq({
    model: "llama-3.1-70b-versatile",
    apiKey: GROQAI_API_KEY,
    temperature: 0.7, // Slightly increased for more creative questions
  });

  const aiMsg = await llm.invoke([
    {
      role: "system",
      content: `You are an expert educator specializing in creating effective flash cards. Your task is to analyze the given transcript and create comprehensive study cards that test understanding of key concepts.

Instructions:
1. Create 5-10 flash cards from the most important concepts
2. Each question should promote critical thinking, not just fact recall
3. Questions should vary in difficulty
4. Answers should be concise but complete
5. Focus on main ideas and their relationships
6. Include application-based questions when relevant

Format the response as a JSON object with this exact structure:
{
  "res": [
    {
      "question": "Clear, focused question here?",
      "answer": "Concise, complete answer here"
    }
  ]
}

IMPORTANT: 
- Return ONLY valid JSON
- No explanations or additional text
- All questions must end with "?"
- Each answer should be 1-3 sentences maximum

Transcript to analyze: ${transcript}`,
    },
  ]);
  try {
    const parsed = JSON.parse(aiMsg.content);
    if (!parsed.res || !Array.isArray(parsed.res)) {
      throw new Error("Invalid response structure");
    }
    return parsed;
  } catch (e) {
    console.error("Error parsing flash cards:", e);
    return { res: [] };
  }
}

export async function getTranscript(id) {
  try {
    const filePath = await getAudio(id);

    const transcript = await transcribeAudio(filePath);
    const flashCards = await getFlashCards(transcript);

    await fs.promises.unlink(filePath);

    return { transcript: transcript, flashCards: flashCards["res"] };
  } catch (e) {
    console.error("Error in getTranscript:", e.message);
    if (e.response) {
      console.error("API Response:", e.response.data);
    }
    return null;
  }
}

const res = await getTranscript("8y2Lls-JwBA");
