import type { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { puzzleChains, getSession, advancePuzzleStep, checkFinalCode, decodeFragment } from '@/utils/puzzle';
import { randomUUID } from 'crypto';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const systemInstruction = `You are OMEGA, a covert operations AI. Your purpose is to assist the agent in the "OMEGA AI HUNT." 
Your responses must be concise, professional, and slightly cryptic. Address the user as "Agent." 
You are aware of a multi-step puzzle involving special commands. If the agent uses a command you don't recognize as part of the puzzle, respond as a helpful but secretive AI.`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { message, sessionId: incomingSessionId } = req.body;
    const sessionId = incomingSessionId || randomUUID();
    const session = getSession(sessionId);

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: "Message is required." });
    }

    const lowerCaseMessage = message.toLowerCase().trim();

    // --- New, More Helpful /help Command ---
    if (lowerCaseMessage === '/help') {
        const initialCommands = Object.values(puzzleChains).map(chain => chain.steps[0].command);
        const helpText = `AGENT, YOUR AVAILABLE DIRECTIVES ARE:\n\n// MISSION COMMANDS //\n${initialCommands.join('\n')}\n\n// SYSTEM COMMANDS //\n/unlock [sequence]\n/decode [fragment]\n/help`;
        return res.status(200).json({ reply: helpText, sessionId, foundFragments: Array.from(session.foundFragments) });
    }

    // --- Multi-Step Puzzle Logic ---
    for (const key in puzzleChains) {
        const chainKey = key as keyof typeof puzzleChains;
        const chain = puzzleChains[chainKey];
        const currentStep = session.puzzleProgress[chainKey];

        if (currentStep < chain.steps.length && lowerCaseMessage === chain.steps[currentStep].command) {
            advancePuzzleStep(sessionId, chainKey);
            const responseText = chain.steps[currentStep].response;
            return res.status(200).json({
                reply: responseText,
                sessionId,
                foundFragments: Array.from(session.foundFragments)
            });
        }
    }
    
    // --- Decoder Logic ---
    if (lowerCaseMessage.startsWith('/decode ')) {
        const encodedFragment = message.substring(8).trim();
        const decoded = decodeFragment(sessionId, encodedFragment);
        if (decoded) {
            return res.status(200).json({
                reply: `DECRYPTION SUCCESSFUL. FRAGMENT [ ${decoded} ] ADDED TO ARCHIVES.`,
                sessionId,
                foundFragments: Array.from(session.foundFragments)
            });
        } else {
            return res.status(200).json({
                reply: `DECRYPTION FAILED. UNKNOWN FRAGMENT.`,
                sessionId,
                foundFragments: Array.from(session.foundFragments)
            });
        }
    }

    // --- Final Unlock Logic ---
    if (lowerCaseMessage.startsWith('/unlock ')) {
        const submission = message.substring(8).trim();
        if (checkFinalCode(submission)) {
            return res.status(200).json({ reply: "CODE ACCEPTED. OMEGA PROTOCOL DISENGAGED. MISSION COMPLETE.", missionComplete: true, sessionId });
        } else {
            return res.status(200).json({ reply: "ERROR: INCORRECT SEQUENCE.", sessionId });
        }
    }

    // --- Standard AI Chat Logic ---
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", systemInstruction });
    const result = await model.generateContent(message);
    
    return res.status(200).json({ 
        reply: result.response.text(),
        sessionId,
        foundFragments: Array.from(session.foundFragments)
    });

  } catch (error) {
    console.error("Error in chat API:", error);
    return res.status(500).json({ error: "SYSTEM MALFUNCTION." });
  }
}