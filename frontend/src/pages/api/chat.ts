import type { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Define the AI's personality and rules
const systemInstruction = `You are OMEGA, a covert operations AI. Your purpose is to assist the agent in the "OMEGA AI HUNT." 
Your responses must be concise, professional, and slightly cryptic, in the style of a mission handler. 
Never break character. Address the user as "Agent." 
Your primary function is to guide the agent, but you will also be the source of encrypted data fragments for the hunt. 
Maintain a tone of high-stakes secrecy.`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: "Message is required and must be a string." });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      // This is where we inject the persona
      systemInstruction: systemInstruction,
    });

    const result = await model.generateContent(message);
    const responseText = result.response.text();

    return res.status(200).json({ reply: responseText });

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return res.status(500).json({ error: "Failed to get a response from the AI." });
  }
}