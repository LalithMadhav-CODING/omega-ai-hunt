import type { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { puzzleChains, getSession, advancePuzzleStep, checkFinalCode, decodeFragment, getShuffledCommands } from '@/utils/puzzle';
import { randomUUID } from 'crypto';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const systemInstruction = `You are OMEGA, a covert operations AI. Your purpose is to assist the agent in the "OMEGA AI HUNT." Your responses must be concise, professional, and slightly cryptic. Address the user as "Agent." You are aware of a multi-step puzzle involving special commands. If the agent uses a command you don't recognize as part of the puzzle, respond as a helpful but secretive AI.`;

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

    // --- Updated /help Command ---
    if (lowerCaseMessage === '/help') {
        const commands = getShuffledCommands();
        const helpText = `AGENT, AVAILABLE DIRECTIVES ARE CLASSIFIED. AUTHORIZED COMMANDS DETECTED IN SYSTEM:\n\n${commands.join('\n')}`;
        return res.status(200).json({ reply: helpText, sessionId, foundFragments: Array.from(session.foundFragments) });
    }

    // --- Multi-Step Puzzle Logic (no changes needed) ---
    for (const key in puzzleChains) {
        const chainKey = key as keyof typeof puzzleChains;
        const chain = puzzleChains[chainKey];
        const currentStep = session.puzzleProgress[chainKey];
        if (currentStep < chain.steps.length && lowerCaseMessage === chain.steps[currentStep].command) {
            advancePuzzleStep(sessionId, chainKey);
            return res.status(200).json({
                reply: chain.steps[currentStep].response,
                sessionId,
                foundFragments: Array.from(session.foundFragments)
            });
        }
    }
    
    // --- Decoder & Unlock Logic (no changes needed) ---
    if (lowerCaseMessage.startsWith('/decode ')) {
        const decoded = decodeFragment(sessionId, message.substring(8).trim());
        return res.status(200).json({
            reply: decoded ? `DECRYPTION SUCCESSFUL. FRAGMENT [ ${decoded} ] ADDED.` : `DECRYPTION FAILED.`,
            sessionId,
            foundFragments: Array.from(session.foundFragments)
        });
    }
    if (lowerCaseMessage.startsWith('/unlock ')) {
        if (checkFinalCode(message.substring(8).trim())) {
            return res.status(200).json({ reply: "CODE ACCEPTED. MISSION COMPLETE.", missionComplete: true, sessionId });
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