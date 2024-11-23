import { AssemblyAI as aai } from "assemblyai";
import { ChatGroq } from "@langchain/groq";
import dotenv from "dotenv";
import { getAudio } from "./getAudio.js";
import fs from "fs";
import { getTraceEvents } from "next/dist/trace/trace.js";

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

// async function getFlashCards(transcript, prompt) {
//   const llm = new ChatGroq({
//     model: "llama-3.2-90b-vision-preview",
//     apiKey: GROQAI_API_KEY,
//     temperature: 0.7,
//   });

//   const systemMessage = `You are an AI specialized in creating educational content. Your task is to generate a structured JSON response containing flashcards, quizzes, a summary, and a versatile educational diagram based on the provided transcript.

// CRITICAL: Return ONLY valid JSON without any explanatory text, markdown, or other content.

// Required JSON structure:
// {
//   "flashcards": [
//     {
//       "question": "string",
//       "answer": "string"
//     }
//   ],
//   "quizzes": [
//     {
//       "question": "string",
//       "answers": ["string", "string", "string", "string"],
//       "correctIndex": integer (index of the correct answer in the "answers" array, starting from 0)
//     }
//   ],
//   "summary": "string",
//   "diagram": "string (Mermaid syntax - single-line, valid)"
// }

// Diagram Generation Guidelines:
// 1. Analyze the transcript to determine the MOST APPROPRIATE diagram type.
// 2. Follow these diagram selection criteria:
//    a) **Flowchart**: Use for processes or workflows. Example: \`graph LR; A --> B; B --> C\`
//    b) **Sequence Diagram**: Use for chronological events or interactions. Example: \`sequenceDiagram; participant A; participant B; A->>B: Message\`
//    c) **Mindmap**: Use for hierarchical relationships or categorization. Example: \`mindmap; root(Main Topic); subtopic1(Subtopic 1); subtopic2(Subtopic 2)\`
//    d) **State Diagram**: Use for systems with states and transitions. Example: \`stateDiagram-v2; [*] --> State1; State1 --> State2\`
//    e) **Custom Diagram**: If no predefined type fits, generate a valid, logical diagram based on the content.
// 3. Ensure the diagram:
//    - Uses **valid Mermaid syntax** that matches the selected type.
//    - Represents nodes and connections logically and accurately.
//    - Is formatted as a SINGLE-LINE string without line breaks.
// 4. Use \\n when needed, and create a valid mermaid diagrams markdown

// Content Generation Principles:
// 1. **Flashcards**:
//    - Generate 5-10 cards covering key concepts.
//    - Ensure questions promote understanding and answers are concise.
// 2. **Quizzes**:
//    - Create 3-5 multiple-choice questions with four distinct options each.
//    - Mark the correct answer using its index (starting from 0).
// 3. **Summary**:
//    - Write a concise summary capturing key ideas and takeaways.
// 4. **Alignment**:
//    - All content must align with the transcript and user prompt.
// 5. The output must be valid JSON compatible with \`JSON.parse()\`.

// Transcript: ${transcript}
// User Prompt: ${prompt ? `"${prompt}"` : "None provided"}`;

//   try {
//     const aiResponse = await llm.invoke([
//       {
//         role: "system",
//         content: systemMessage.trim(),
//       },
//     ]);
//     const parsedResponse = JSON.parse(aiResponse.content);
//     if (
//       !parsedResponse.flashcards ||
//       !Array.isArray(parsedResponse.flashcards)
//     ) {
//       throw new Error("Invalid response structure.");
//     }

//     return parsedResponse;
//   } catch (error) {
//     console.error("Error generating flashcards:", error.message);
//     return { flashcards: [], quizzes: [], summary: "", diagram: "" };
//   }
// }

const getFlashCardsAndSummary = async (transcript, prompt) => {
  const llm = new ChatGroq({
    model: "llama-3.2-90b-vision-preview",
    apiKey: GROQAI_API_KEY,
    temperature: 0.7,
  });

  const systemMessage = `You are an AI specialized in creating educational content. Your task is to generate a structured JSON response containing flashcards, quizzes, and a summary based on the provided transcript, focusing on the user's input if specified.

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
      "answers": ["string", "string", "string", "string"],
      "correctIndex": integer (index of the correct answer in the "answers" array, starting from 0),
    }
  ],
  "summary": "string"
}

Content Generation Principles:
1. **Flashcards**:
   - Generate 8-15 cards covering key concepts and applications.
   - Ensure questions promote understanding, and answers are concise.
2. **Quizzes**:
   - Create 5-10 multiple-choice questions with four distinct options each.
   - Mark the correct answer using its index (starting from 0).
3. **Summary**:
   - Write a concise summary capturing key ideas and takeaways.
4. **Alignment**:
   - All content must align with the transcript and user prompt.
5. The output must be valid JSON compatible with \`JSON.parse()\`.

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
    console.error(
      "Error generating flashcards, quizzes, and summary:",
      error.message
    );
    return { flashcards: [], quizzes: [], summary: {} };
  }
};
const getDiagram = async (transcript, prompt) => {
  const llm = new ChatGroq({
    model: "llama-3.2-90b-vision-preview",
    apiKey: GROQAI_API_KEY,
    temperature: 0.7,
  });

  const systemMessage = `You are an AI specialized in creating educational diagrams using Mermaid markdown syntax. Analyze the provided transcript and user prompt to determine the best diagram type, and generate it in valid Mermaid markdown.

CRITICAL: Return ONLY valid JSON in the following structure:
{
  "diagram": "string (a valid, single-line Mermaid diagram syntax)"
}

### Diagram Selection and Examples:
- **Flowchart** (for processes or workflows):
  Example: \`graph LR; A[Start] --> B[Step 1]; B --> C[End]\`

- **Sequence Diagram** (for chronological events or interactions):
  Example: \`sequenceDiagram; participant A; participant B; A->>B: Message\`

- **Mindmap** (for hierarchical relationships or categorization):
  Example: \`mindmap; root(Main Topic); subtopic1(Subtopic 1); subtopic2(Subtopic 2)\`

- **State Diagram** (for states and transitions in systems):
  Example: \`stateDiagram-v2; [*] --> State1; State1 --> State2\`

### Guidelines:
1. Analyze the transcript to determine the most suitable diagram type:
   - **Processes/Workflows** → Use a Flowchart.
   - **Chronological Events** → Use a Sequence Diagram.
   - **Hierarchical Topics** → Use a Mindmap.
   - **System States** → Use a State Diagram.
2. Ensure the Mermaid syntax is valid and logically represents the transcript content.
3. Format the diagram as a single-line string without line breaks, using \`\\n\` for multi-line Mermaid syntax.

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

    if (!parsedResponse.diagram || typeof parsedResponse.diagram !== "string") {
      throw new Error("Invalid diagram structure.");
    }

    return parsedResponse.diagram;
  } catch (error) {
    console.error("Error generating diagram:", error.message);
    return { diagram: "" };
  }
};

// export async function getTranscript(id, prompt) {
//   try {
//     const filePath = await getAudio(id);

//     const transcript = await transcribeAudio(filePath);
//     const result = await getFlashCards(transcript, prompt);

//     await fs.promises.unlink(filePath);

//     return {
//       transcript,
//       flashCards: result.flashcards,
//       quizzes: result.quizzes,
//       summary: result.summary,
//       diagram: result.diagram,
//     };
//   } catch (error) {
//     console.error("Error in getTranscript:", error.message);
//     if (error.response) {
//       console.error("API Response:", error.response.data);
//     }
//     return null;
//   }
// }

export async function getTranscript(id, prompt) {
  try {
    const filePath = await getAudio(id);

    const transcript = await transcribeAudio(filePath);

    // Get flashcards, quizzes, and summary
    const contentResult = await getFlashCardsAndSummary(transcript, prompt);

    // Get the diagram based on the transcript and user prompt
    const diagramResult = await getDiagram(transcript, prompt);

    await fs.promises.unlink(filePath);

    return {
      transcript,
      flashCards: contentResult.flashcards,
      quizzes: contentResult.quizzes,
      summary: contentResult.summary,
      diagram: diagramResult,
    };
  } catch (error) {
    console.error("Error in getTranscript:", error.message);
    return null;
  }
}

const res = await getTranscript("Ce1m3Y0OMKA");
console.log(res);
