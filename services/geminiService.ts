import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateGeminiResponseStream = async (
  prompt: string,
  history: { role: 'user' | 'model'; parts: { text: string }[] }[]
) => {
  try {
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: "You are Windows Copilot, a helpful AI assistant integrated into the Windows 12 operating system. You are concise, friendly, and helpful. You can help the user with tasks, answer questions, and control the OS conceptually.",
      },
      history: history,
    });

    const result = await chat.sendMessageStream({ message: prompt });
    return result;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};