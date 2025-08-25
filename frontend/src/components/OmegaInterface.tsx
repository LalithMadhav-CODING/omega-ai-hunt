import React, { useState, useEffect, useRef } from 'react';
import { getNextHint } from '@/utils/puzzle';

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
    const [sessionId, setSessionId] = useState<string | null>(null);
    
    // State for the hint box
    const [showHint, setShowHint] = useState(false);
    const [hintText, setHintText] = useState('');

    // Ref for the input element for auto-focus
    const inputRef = useRef<HTMLInputElement>(null);

    const showUnlockConsole = foundFragments.length === 4 && !missionComplete;

    // Effect to trigger the hint box
    useEffect(() => {
        const messageCount = messages.length;
        if (messageCount > 1 && messageCount % 6 === 0 && !missionComplete) {
            setHintText(getNextHint(foundFragments));
            setShowHint(true);
        }
        // Auto-focus the input after a new message is received
        inputRef.current?.focus();
    }, [messages, foundFragments, missionComplete]);

    const handleHintClick = () => {
        if (!hintText) return;
        setMessages(prev => [...prev, { role: 'bot', content: hintText }]);
        setShowHint(false);
    };

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);
        setShowHint(false);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: input, sessionId }),
            });

            if (!response.ok) throw new Error('Network response was not ok');

            const data = await response.json();
            const botMessage: Message = { role: 'bot', content: data.reply || 'Error: No reply.' };
            setMessages(prev => [...prev, botMessage]);

            if (data.sessionId) setSessionId(data.sessionId);
            if (data.foundFragments) setFoundFragments(data.foundFragments);
            if (data.missionComplete) setMissionComplete(true);

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
                        {/* This handles newlines from the /help command */}
                        {msg.content.split('\n').map((line, i) => <span key={i}>{line}<br/></span>)}
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
                        ref={inputRef} // Assign the ref here
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
            
            {showHint && (
                <div className="hint-box" onClick={handleHintClick}>
                    <div className="glitch-hint" data-text="HINT">HINT</div>
                </div>
            )}
        </div>
    );
};

export default OmegaInterface;