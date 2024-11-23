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

  try {
    const transcript = await client.transcripts.transcribe({ audio: filePath });

    if (transcript.status === "error") {
      throw new Error(`Transcription error: ${transcript.error}`);
    }

    if (transcript.status === "completed") {
      return transcript.text;
    }

    throw new Error("Transcription did not complete successfully.");
  } catch (error) {
    throw new Error(`Transcription failed: ${error.message}`);
  }
}

async function getEducationalContent(transcript, prompt) {
  const llm = new ChatGroq({
    model: "llama-3.2-90b-vision-preview",
    apiKey: GROQAI_API_KEY,
    temperature: 0.7,
  });

  // Template 1: Summary, Flashcards, and Quizzes Focus
  const summaryFocusedTemplate = `[STRICT JSON OUTPUT REQUIRED] You must return ONLY a valid JSON object with no additional text, comments, or explanations.

FORMAT REQUIREMENTS:
1. Use double quotes for all strings
2. No trailing commas
3. No comments or markdown
4. No explanatory text before or after the JSON
5. All string values must be properly escaped
6. Numbers must not be quoted
7. Boolean values must be true/false (not quoted)

Expected JSON Structure:
{
  "summary": "string",
  "flashcards": [
    {
      "question": "clear question text",
      "answer": "concise answer"
    }
  ],
  "quizzes": [
    {
      "question": "clear question text",
      "answers": ["option 1", "option 2", "option 3", "option 4"],
      "correctIndex": 0,
      "explanation": "why this answer is correct"
    }
  ]
}

VALIDATION CHECKLIST:
- Exactly 8-15 flashcards
- Exactly 8-10 quiz questions
- Each quiz must have exactly 4 answers
- correctIndex must be 0-3
- No null values
- No undefined values
- No empty strings
- All required fields must be present

Input Transcript: ${transcript}

REMEMBER: Return ONLY the JSON object. Any additional text will break the parser.`;

  // Template 2: Mermaid Diagram Focus
  const mermaidFocusedTemplate = `[STRICT JSON OUTPUT REQUIRED] You must return ONLY a valid JSON object with no additional text, comments, or explanations.

FORMAT REQUIREMENTS:
1. Use double quotes for all strings
2. No trailing commas
3. No comments or markdown
4. No explanatory text before or after the JSON
5. All string values must be properly escaped
6. All Mermaid syntax must be escaped properly for JSON

Expected JSON Structure:
{
  "diagram": {
    "type": "flowchart|sequence|mindmap|state",
    "mermaidSyntax": "single-line properly escaped Mermaid syntax",
    "explanation": "brief description of the diagram",
    "validationNotes": "confirmation of syntax validity"
  }
}

VALIDATION CHECKLIST:
- mermaidSyntax must be a single line (use semicolons for line breaks)
- All special characters must be properly escaped
- No null or undefined values
- All required fields must be present
- Mermaid syntax must be valid and complete

User Focus: ${prompt || "Create comprehensive overview"}
Input Transcript: ${transcript}

REMEMBER: Return ONLY the JSON object. Any additional text will break the parser.`;

  try {
    // Get summary, flashcards, and quizzes
    const summaryResponse = await llm.invoke([
      {
        role: "system",
        content: summaryFocusedTemplate.trim(),
      },
    ]);

    let summaryOutput;
    try {
      summaryOutput = JSON.parse(summaryResponse.content);
    } catch (parseError) {
      throw new Error(`Invalid JSON in summary response: ${parseError.message}`);
    }

    // Strict validation of summary output structure
    if (!Array.isArray(summaryOutput.flashcards) || 
        !Array.isArray(summaryOutput.quizzes)) {
      throw new Error("Summary response does not meet structural requirements");
    }

    // Get diagram
    const mermaidResponse = await llm.invoke([
      {
        role: "system",
        content: mermaidFocusedTemplate.trim(),
      },
    ]);

    let mermaidOutput;
    try {
      mermaidOutput = JSON.parse(mermaidResponse.content);
    } catch (parseError) {
      throw new Error(`Invalid JSON in diagram response: ${parseError.message}`);
    }

    // Strict validation of diagram output structure
    if (!mermaidOutput.diagram?.type || 
        !mermaidOutput.diagram?.mermaidSyntax || 
        !mermaidOutput.diagram?.explanation || 
        !mermaidOutput.diagram?.validationNotes) {
      throw new Error("Diagram response does not meet structural requirements");
    }

    return {
      flashcards: summaryOutput.flashcards,
      quizzes: summaryOutput.quizzes,
      summary: summaryOutput.summary,
      diagram: mermaidOutput.diagram.mermaidSyntax,
    };
  } catch (error) {
    console.error("Error generating educational content:", error.message);
    throw new Error(`Failed to generate educational content: ${error.message}`);
  }
}

export async function getTranscript(id, prompt) {
  let filePath = null;

  try {
    filePath = await getAudio(id);
    const transcript = await transcribeAudio(filePath);
    const educationalContent = await getEducationalContent(transcript, prompt);

    return {
      transcript,
      flashCards: educationalContent.flashcards,
      quizzes: educationalContent.quizzes,
      summary: educationalContent.summary,
      diagram: educationalContent.diagram,
    };
  } catch (error) {
    console.error("Error in getTranscript:", error.message);
    if (error.response) {
      console.error("API Response:", error.response.data);
    }
    throw error;
  } finally {
    if (filePath) {
      try {
        await fs.promises.unlink(filePath);
      } catch (error) {
        console.error("Error cleaning up audio file:", error.message);
      }
    }
  }
}

const result = await getTranscript("Ce1m3Y0OMKA");
console.log(result);
