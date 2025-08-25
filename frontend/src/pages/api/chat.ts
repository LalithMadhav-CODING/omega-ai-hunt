import type { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenerativeAI } from "@google/generative-ai";

// It will be read from Vercel's environment variables.
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { message } = req.body;

    // Basic validation
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: "Message is required and must be a string." });
    }

    // Access the Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(message);
    const responseText = result.response.text();

    // Send the AI's response back to the frontend
    return res.status(200).json({ reply: responseText });

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    // Send a generic error message to the frontend
    return res.status(500).json({ error: "Failed to get a response from the AI." });
  }
}