// --- 1. The Encoders ---
const rot13 = (str: string): string => {
  return str.replace(/[a-zA-Z]/g, (c) => {
    const code = c.charCodeAt(0);
    const base = code < 97 ? 65 : 97;
    return String.fromCharCode(((code - base + 13) % 26) + base);
  });
};

// --- 2. The Puzzle Definition ---
const DECODED_PHRASE = "DECRYPT PROTOCOL OMEGA NOW";
export const SECRET_KEY = rot13(DECODED_PHRASE);

export const puzzleFragments = [
  { trigger: "/scan_network", fragment: "DECRYPT", encoded: rot13("DECRYPT") },
  { trigger: "/trace_signal", fragment: "PROTOCOL", encoded: rot13("PROTOCOL") },
  { trigger: "/breach_firewall", fragment: "OMEGA", encoded: rot13("OMEGA") },
  { trigger: "/execute_payload", fragment: "NOW", encoded: rot13("NOW") },
];

// --- 3. Session Management ---
// A simple in-memory store to track user progress.
const userSessions = new Map<string, Set<string>>();

// Function to add a found fragment to a specific user's session.
export const addFragmentToSession = (sessionId: string, fragment: string) => {
  if (!userSessions.has(sessionId)) {
    userSessions.set(sessionId, new Set());
  }
  userSessions.get(sessionId)?.add(fragment);
};

// Function to get the fragments a specific user has already found.
export const getFoundFragments = (sessionId: string): string[] => {
  const fragments = userSessions.get(sessionId);
  return fragments ? Array.from(fragments) : [];
};

// Function to check if a specific user has found all fragments.
export const hasFoundAllFragments = (sessionId: string): boolean => {
    return getFoundFragments(sessionId).length === puzzleFragments.length;
}

// Function to check if the user's final submission is correct.
export const checkFinalCode = (submission: string): boolean => {
    return submission.toUpperCase() === DECODED_PHRASE;
}
