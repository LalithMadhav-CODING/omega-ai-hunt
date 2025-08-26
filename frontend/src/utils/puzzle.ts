const rot13 = (str: string): string => {
  return str.replace(/[a-zA-Z]/g, (c) => {
    const code = c.charCodeAt(0);
    const base = code < 97 ? 65 : 97;
    return String.fromCharCode(((code - base + 13) % 26) + base);
  });
};

const DECODED_PHRASE = "DECRYPT PROTOCOL OMEGA NOW";
export const SECRET_KEY = rot13(DECODED_PHRASE);

// --- New Puzzle Definition with Vague Hints ---
export const puzzleChains = {
  DECRYPT: {
    fragment: "DECRYPT",
    encoded: rot13("DECRYPT"),
    steps: [
      { command: "/scan_network", response: "Network scan initiated... Encrypted node detected broadcasting on frequency 77.5 MHz. Signal isolation is possible." },
      { command: "/isolate_frequency 77.5", response: "Frequency isolated. A repeating data packet has been found within the signal." },
      { command: "/capture_packet", response: `Packet captured. Payload is encrypted. DATA FRAGMENT ACQUIRED: [ ${rot13("DECRYPT")} ]. Use the DECODE terminal.` }
    ]
  },
  PROTOCOL: {
    fragment: "PROTOCOL",
    encoded: rot13("PROTOCOL"),
    steps: [
      { command: "/trace_signal", response: "Signal trace active... A vulnerable entry point has been located at IP 192.168.1.101." },
      { command: "/exploit_port 192.168.1.101", response: "Exploit successful. Root access granted. System logs are now accessible." },
      { command: "/parse_logs", response: `Logs parsed. A hidden directive was found. DATA FRAGMENT ACQUIRED: [ ${rot13("PROTOCOL")} ]. Use the DECODE terminal.` }
    ]
  },
  OMEGA: {
    fragment: "OMEGA",
    encoded: rot13("OMEGA"),
    steps: [
      { command: "/breach_firewall", response: "Firewall breach initiated... Security protocols require a decryption key. Intel suggests the key is a classified project name." },
      { command: "/query_directives", response: "Directives queried. Found reference to 'Project Chimera'. This may be the key." },
      { command: "/use_key chimera", response: `Key accepted. Firewall bypassed. DATA FRAGMENT ACQUIRED: [ ${rot13("OMEGA")} ]. Use the DECODE terminal.` }
    ]
  },
  NOW: {
    fragment: "NOW",
    encoded: rot13("NOW"),
    steps: [
      { command: "/execute_payload", response: "Payload execution requires authentication. Biometric signature scan is necessary." },
      { command: "/scan_biometrics", response: "Biometric scan active... Signature does not match authorized personnel. A forced override may be possible." },
      { command: "/force_override", response: `Override successful. Payload executed. DATA FRAGMENT ACQUIRED: [ ${rot13("NOW")} ]. Use the DECODE terminal.` }
    ]
  }
};

// --- Helper function to shuffle an array ---
const shuffleArray = <T>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

// --- New Shuffled Command List for /help ---
export const getShuffledCommands = (): string[] => {
    const missionCommands = Object.values(puzzleChains).flatMap(chain => chain.steps.map(step => step.command));
    const systemCommands = ['/unlock [sequence]', '/decode [fragment]', '/help'];
    // FIX: Use Array.from() for compatibility with older TS targets
    return shuffleArray(Array.from(new Set([...missionCommands, ...systemCommands])));
};


// --- Session Management (no changes needed here) ---
interface UserSession {
  foundFragments: Set<string>;
  puzzleProgress: { [key: string]: number };
}
const userSessions = new Map<string, UserSession>();

const ensureSession = (sessionId: string) => {
  if (!userSessions.has(sessionId)) {
    userSessions.set(sessionId, {
      foundFragments: new Set(),
      puzzleProgress: { DECRYPT: 0, PROTOCOL: 0, OMEGA: 0, NOW: 0 }
    });
  }
  return userSessions.get(sessionId)!;
};

export const getSession = (sessionId: string) => ensureSession(sessionId);
export const advancePuzzleStep = (sessionId: string, fragmentKey: string) => {
  const session = ensureSession(sessionId);
  session.puzzleProgress[fragmentKey]++;
};
export const addDecodedFragment = (sessionId: string, fragment: string) => {
    const session = ensureSession(sessionId);
    session.foundFragments.add(fragment);
};
export const checkFinalCode = (submission: string): boolean => {
    return submission.toUpperCase() === DECODED_PHRASE;
};
export const decodeFragment = (sessionId: string, encodedFragment: string): string | null => {
    for (const key in puzzleChains) {
        const chain = puzzleChains[key as keyof typeof puzzleChains];
        if (chain.encoded === encodedFragment.toUpperCase()) {
            addDecodedFragment(sessionId, chain.fragment);
            return chain.fragment;
        }
    }
    return null;
};