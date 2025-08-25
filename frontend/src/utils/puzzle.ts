// --- 1. The Encoders & Final Key ---
const rot13 = (str: string): string => {
  return str.replace(/[a-zA-Z]/g, (c) => {
    const code = c.charCodeAt(0);
    const base = code < 97 ? 65 : 97;
    return String.fromCharCode(((code - base + 13) % 26) + base);
  });
};

const DECODED_PHRASE = "DECRYPT PROTOCOL OMEGA NOW";
export const SECRET_KEY = rot13(DECODED_PHRASE);

// --- 2. The New Puzzle Definition ---
// Each puzzle is now a chain of steps. The final step rewards an ENCODED fragment.
export const puzzleChains = {
  DECRYPT: {
    fragment: "DECRYPT",
    encoded: rot13("DECRYPT"),
    steps: [
      { command: "/scan_network", response: "Network scan initiated... Encrypted node detected at frequency 77.5 MHz. Recommend: /isolate_frequency [frequency]" },
      { command: "/isolate_frequency 77.5", response: "Frequency isolated. Repeating data packet found. Recommend: /capture_packet" },
      { command: "/capture_packet", response: `Packet captured. Payload is encrypted. DATA FRAGMENT ACQUIRED: [ ${rot13("DECRYPT")} ]. Use the DECODE terminal.` }
    ]
  },
  PROTOCOL: {
    fragment: "PROTOCOL",
    encoded: rot13("PROTOCOL"),
    steps: [
      { command: "/trace_signal", response: "Signal trace active... Vulnerable entry point detected at IP 192.168.1.101. Recommend: /exploit_port [ip_address]" },
      { command: "/exploit_port 192.168.1.101", response: "Exploit successful. System logs acquired. Recommend: /parse_logs" },
      { command: "/parse_logs", response: `Logs parsed. Hidden directive found. DATA FRAGMENT ACQUIRED: [ ${rot13("PROTOCOL")} ]. Use the DECODE terminal.` }
    ]
  },
  OMEGA: {
    fragment: "OMEGA",
    encoded: rot13("OMEGA"),
    steps: [
      { command: "/breach_firewall", response: "Firewall breach initiated... Security requires a decryption key. Intel suggests it's a project name. Recommend: /query_directives" },
      { command: "/query_directives", response: "Directives queried. Found reference to 'Project Chimera'. Recommend: /use_key [key]" },
      { command: "/use_key chimera", response: `Key accepted. Firewall bypassed. DATA FRAGMENT ACQUIRED: [ ${rot13("OMEGA")} ]. Use the DECODE terminal.` }
    ]
  },
  NOW: {
    fragment: "NOW",
    encoded: rot13("NOW"),
    steps: [
      { command: "/execute_payload", response: "Payload execution requires authentication. A biometric signature is needed. Recommend: /scan_biometrics" },
      { command: "/scan_biometrics", response: "Biometric scan active... Signature does not match authorized personnel. An override is possible. Recommend: /force_override" },
      { command: "/force_override", response: `Override successful. Payload executed. DATA FRAGMENT ACQUIRED: [ ${rot13("NOW")} ]. Use the DECODE terminal.` }
    ]
  }
};

// --- 3. Session Management ---
// This now tracks the user's current step in each puzzle chain.
interface UserSession {
  foundFragments: Set<string>; // Stores DECODED fragments
  puzzleProgress: { [key: string]: number }; // e.g., { DECRYPT: 1, PROTOCOL: 0, ... }
}
const userSessions = new Map<string, UserSession>();

// Helper to initialize a session
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

// New function to decode a fragment and add it to the session
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
