const rot13 = (str: string): string => {
  return str.replace(/[a-zA-Z]/g, (c) => {
    const code = c.charCodeAt(0);
    const base = code < 97 ? 65 : 97;
    return String.fromCharCode(((code - base + 13) % 26) + base);
  });
};

const DECODED_PHRASE = "DECRYPT PROTOCOL OMEGA NOW";
export const SECRET_KEY = rot13(DECODED_PHRASE);

export const puzzleFragments = [
  { trigger: "/scan_network", fragment: "DECRYPT", encoded: rot13("DECRYPT") },
  { trigger: "/trace_signal", fragment: "PROTOCOL", encoded: rot13("PROTOCOL") },
  { trigger: "/breach_firewall", fragment: "OMEGA", encoded: rot13("OMEGA") },
  { trigger: "/execute_payload", fragment: "NOW", encoded: rot13("NOW") },
];

// List of all commands for the /help message
export const allCommands = [
    ...puzzleFragments.map(p => p.trigger),
    '/unlock [sequence]',
    '/help',
    // Filler commands for theme
    '/query_database',
    '/check_status',
    '/clear_logs',
];

// Function to determine the next hint for the user
export const getNextHint = (foundFragments: string[]): string => {
    const nextFragment = puzzleFragments.find(p => !foundFragments.includes(p.fragment));
    if (nextFragment) {
        return `HINT: Try using the command: ${nextFragment.trigger}`;
    }
    if (foundFragments.length === puzzleFragments.length) {
        return `HINT: All fragments acquired. Use /unlock [DECODED PHRASE] to complete the mission.`;
    }
    return "HINT: No further intel available at this time.";
};


// --- Session Management ---
const userSessions = new Map<string, Set<string>>();

export const addFragmentToSession = (sessionId: string, fragment: string) => {
  if (!userSessions.has(sessionId)) {
    userSessions.set(sessionId, new Set());
  }
  userSessions.get(sessionId)?.add(fragment);
};

export const getFoundFragments = (sessionId: string): string[] => {
  const fragments = userSessions.get(sessionId);
  return fragments ? Array.from(fragments) : [];
};

export const checkFinalCode = (submission: string): boolean => {
    return submission.toUpperCase() === DECODED_PHRASE;
}
