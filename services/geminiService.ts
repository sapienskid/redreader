import { GoogleGenAI } from "@google/genai";

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found in environment variables");
  }
  return new GoogleGenAI({ apiKey });
};

export const cleanText = async (rawText: string): Promise<string> => {
  const ai = getAiClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: {
        parts: [{ 
            text: `Clean the following text for a speed reading application. Remove weird formatting, excessive whitespace, and non-content artifacts. Return only the clean text.\n\nText:\n${rawText.substring(0, 8000)}` 
        }]
      },
    });
    return response.text || rawText;
  } catch (e) {
    console.warn("Clean text failed, using raw:", e);
    return rawText;
  }
};

export const summarizeText = async (text: string): Promise<string> => {
  const ai = getAiClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: {
        parts: [{ 
            text: `Summarize the following text into 3-5 concise bullet points. Return plain text only.\n\nText:\n${text.substring(0, 10000)}` 
        }]
      },
    });
    return response.text || "Could not summarize.";
  } catch (e) {
    console.error("Summarize failed:", e);
    throw new Error("Failed to summarize.");
  }
};

export const simplifyText = async (text: string): Promise<string> => {
  const ai = getAiClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: {
        parts: [{ 
            text: `Rewrite the following text to be simpler, clearer, and optimized for speed reading. Maintain the original meaning but use simpler vocabulary and shorter sentences. Do not use markdown.\n\nText:\n${text.substring(0, 10000)}` 
        }]
      },
    });
    return response.text || text;
  } catch (e) {
    console.error("Simplify failed:", e);
    throw new Error("Failed to simplify.");
  }
};