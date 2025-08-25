import React, { useState, useEffect } from 'react';

type Message = {
    role: 'user' | 'bot';
    content: string;
};

const OmegaInterface = () => {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'bot', content: 'STATUS: SECURE CONNECTION ESTABLISHED.' },
        { role: 'bot', content: 'OMEGA INTERFACE ONLINE. AWAITING DIRECTIVE...' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [foundFragments, setFoundFragments] = useState<string[]>([]);
    const [missionComplete, setMissionComplete] = useState(false);
    // State to hold the unique session ID for this user
    const [sessionId, setSessionId] = useState<string | null>(null);

    const showUnlockConsole = foundFragments.length === 4 && !missionComplete;

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // Send the current session ID with the request
                body: JSON.stringify({ message: input, sessionId }),
            });

            if (!response.ok) throw new Error('Network response was not ok');

            const data = await response.json();
            const botMessage: Message = { role: 'bot', content: data.reply || 'Error: No reply.' };
            setMessages(prev => [...prev, botMessage]);

            // If the server gives us a session ID, save it for future requests
            if (data.sessionId) {
                setSessionId(data.sessionId);
            }
            if (data.foundFragments) {
                setFoundFragments(data.foundFragments);
            }
            if (data.missionComplete) {
                setMissionComplete(true);
            }

        } catch (error) {
            console.error("Failed to fetch from /api/chat:", error);
            const errorMessage: Message = { role: 'bot', content: 'COMMUNICATION LINK SEVERED.' };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="omega-interface">
            <div className="omega-header">
                <h1>// OMEGA AI HUNT //</h1>
                <div className="fragment-display">
                    DATA FRAGMENTS: [ {foundFragments.join(' | ')} ]
                </div>
            </div>
            <div className="omega-content">
                {messages.map((msg, index) => (
                    <p key={index}>
                        <strong>{msg.role === 'user' ? '> ' : ''}</strong>
                        {msg.content}
                    </p>
                ))}
            </div>

            {showUnlockConsole && (
                <div className="unlock-console">
                    <p>SYSTEM ALERT: ALL FRAGMENTS COLLECTED. FINAL DECRYPTION PROTOCOL AVAILABLE.</p>
                    <p>ENTER FINAL SEQUENCE USING: /unlock [DECODED PHRASE]</p>
                </div>
            )}

            {missionComplete ? (
                 <div className="mission-complete-message">
                    SECRET KEY: OMEGA AI HUNT
                </div>
            ) : (
                <div className="omega-input-area">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Enter directive..."
                        disabled={isLoading}
                    />
                    <button onClick={handleSend} disabled={isLoading}>
                        {isLoading ? 'TRANSMITTING...' : 'TRANSMIT'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default OmegaInterface;
