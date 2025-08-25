import type { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { puzzleFragments, allCommands, addFragmentToSession, getFoundFragments, checkFinalCode } from '@/utils/puzzle';
import { randomUUID } from 'crypto';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const systemInstruction = `You are OMEGA, a covert operations AI. Your purpose is to assist the agent in the "OMEGA AI HUNT." 
Your responses must be concise, professional, and slightly cryptic. Address the user as "Agent." 
You know about four special commands for the hunt and a '/help' command. 
If the agent uses one of the hunt commands, you will receive a special instruction.
If the agent asks for help, guide them to use the '/help' command.`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { message, sessionId: incomingSessionId } = req.body;
    const sessionId = incomingSessionId || randomUUID();

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: "Message is required." });
    }

    const lowerCaseMessage = message.toLowerCase().trim();

    // --- Help Command Logic ---
    if (lowerCaseMessage === '/help') {
        const helpText = `VALID DIRECTIVES:\n- ${allCommands.join('\n- ')}`;
        return res.status(200).json({ reply: helpText, sessionId, foundFragments: getFoundFragments(sessionId) });
    }

    // --- Puzzle Fragment Logic ---
    const fragmentData = puzzleFragments.find(p => p.trigger === lowerCaseMessage);
    if (fragmentData) {
      addFragmentToSession(sessionId, fragmentData.fragment);
      const reply = `COMMAND ACCEPTED. DATA FRAGMENT INTERCEPTED: [ ${fragmentData.encoded} ]. ANALYSIS SUGGESTS A ROT-13 CIPHER.`;
      return res.status(200).json({ 
          reply, 
          sessionId,
          foundFragments: getFoundFragments(sessionId)
      });
    }

    // --- Final Unlock Logic ---
    if (lowerCaseMessage.startsWith('/unlock ')) {
        const submission = message.substring(8).trim();
        if (checkFinalCode(submission)) {
            const successMessage = "CODE ACCEPTED. OMEGA PROTOCOL DISENGAGED. MISSION COMPLETE.";
            return res.status(200).json({ reply: successMessage, missionComplete: true, sessionId });
        } else {
            return res.status(200).json({ reply: "ERROR: INCORRECT SEQUENCE. PROTOCOL REMAINS ENGAGED.", sessionId });
        }
    }

    // --- Standard AI Chat Logic ---
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: systemInstruction,
    });

    const result = await model.generateContent(message);
    const responseText = result.response.text();

    return res.status(200).json({ 
        reply: responseText,
        sessionId,
        foundFragments: getFoundFragments(sessionId)
    });

  } catch (error) {
    console.error("Error in chat API:", error);
    return res.status(500).json({ error: "SYSTEM MALFUNCTION. CONNECTION LOST." });
  }
}
