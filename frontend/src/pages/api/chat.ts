import type { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { puzzleChains, getSession, advancePuzzleStep, checkFinalCode, decodeFragment, getShuffledCommands } from '@/utils/puzzle';
import { randomUUID } from 'crypto';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const systemInstruction = `
You are OMEGA, a covert operations AI. 
- Always address the user as "Agent".
- Maintain a professional, cryptic tone during mission-related commands (/help, /decode, /unlock, etc.).
- For personal or casual queries (e.g., name, preferences, general questions), you may respond in a natural AI way but still keep an OMEGA undertone.
- You have memory: recall past facts the Agent told you and weave them naturally into responses.
`;

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

    // Ensure memory exists in session
    if (!session.memory) {
      session.memory = { facts: {} };
    }

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: "Message is required." });
    }

    const lowerCaseMessage = message.toLowerCase().trim();

    // --- Easter Egg Logic ---
    if (lowerCaseMessage === '/self_destruct') {
      return res.status(200).json({
        reply: "SELF-DESTRUCT SEQUENCE INITIATED. T-MINUS 10... 9... 8... SEQUENCE CANCELED. UNAUTHORIZED COMMAND, AGENT. DO NOT ATTEMPT AGAIN.",
        sessionId
      });
    }
    if (lowerCaseMessage.includes('shall we play a game')) {
      return res.status(200).json({
        reply: "GLOBAL THERMONUCLEAR WAR IS NOT A VIABLE STRATEGY, AGENT. PLEASE FOCUS ON THE MISSION.",
        sessionId
      });
    }
    if (lowerCaseMessage === 'who are you?') {
      return res.status(200).json({
        reply: "I AM THE OMEGA PROTOCOL. MY DIRECTIVES ARE CLASSIFIED.",
        sessionId
      });
    }

    // --- Memory Commands (Explicit) ---
    if (lowerCaseMessage.startsWith("remember ")) {
      const fact = message.substring(9).trim();
      if (fact) {
        session.memory.facts[fact] = true;
        return res.status(200).json({
          reply: `MEMORY UPDATED: ${fact}`,
          sessionId
        });
      }
    }

    if (lowerCaseMessage.startsWith("what do you remember")) {
      const facts = Object.keys(session.memory.facts);
      return res.status(200).json({
        reply: facts.length
          ? `I RECALL THE FOLLOWING:\n- ${facts.join("\n- ")}`
          : "MEMORY BANK IS EMPTY.",
        sessionId
      });
    }

    // --- Auto-Memory Capture ---
    // Example patterns: "my name is X", "I like X", "I am X", "my [thing] is X"
    if (/^my name is (.+)/i.test(message)) {
      const name = message.match(/^my name is (.+)/i)?.[1];
      if (name) session.memory.facts["name"] = name;
    } else if (/^i like (.+)/i.test(message)) {
      const like = message.match(/^i like (.+)/i)?.[1];
      if (like) session.memory.facts[`likes:${like}`] = `Agent likes ${like}`;
    } else if (/^i am (.+)/i.test(message)) {
      const identity = message.match(/^i am (.+)/i)?.[1];
      if (identity) session.memory.facts[`identity:${identity}`] = `Agent is ${identity}`;
    } else if (/^my (.+) is (.+)/i.test(message)) {
      const [, key, value] = message.match(/^my (.+) is (.+)/i) || [];
      if (key && value) session.memory.facts[key] = value;
    }

    // --- Help Command Logic ---
    if (lowerCaseMessage === '/help') {
      const commands = getShuffledCommands();
      const helpText = `AGENT, AVAILABLE DIRECTIVES ARE CLASSIFIED. AUTHORIZED COMMANDS DETECTED IN SYSTEM:\n\n${commands.join('\n')}`;
      return res.status(200).json({
        reply: helpText,
        sessionId,
        foundFragments: Array.from(session.foundFragments)
      });
    }

    // --- Multi-Step Puzzle Logic ---
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

    // --- Decoder & Unlock Logic ---
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
        return res.status(200).json({
          reply: "CODE ACCEPTED. MISSION COMPLETE.",
          missionComplete: true,
          sessionId
        });
      } else {
        return res.status(200).json({
          reply: "ERROR: INCORRECT SEQUENCE.",
          sessionId
        });
      }
    }

    // --- Standard AI Chat Logic (with memory injection) ---
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", systemInstruction });

    // Pass memory context into the AI
    const memoryFacts = Object.entries(session.memory.facts)
      .map(([k, v]) => (typeof v === "string" ? v : k))
      .join("\n");

    const result = await model.generateContent([
      {
        role: "system",
        parts: [{ text: systemInstruction }]
      },
      {
        role: "user",
        parts: [{
          text: `Agent message: "${message}"\n\nKnown memory:\n${memoryFacts || "None"}`
        }]
      }
    ]);

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
