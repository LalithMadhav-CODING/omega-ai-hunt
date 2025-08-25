import React, { useState, useEffect, useRef } from 'react';

type Message = { role: 'user' | 'bot'; content: string; };

// New Decoder Component
const Decoder = ({ onDecode }: { onDecode: (fragment: string) => Promise<void> }) => {
    const [encodedInput, setEncodedInput] = useState('');
    const [isDecoding, setIsDecoding] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleDecode = async () => {
        if (!encodedInput.trim()) return;
        setIsDecoding(true);
        setProgress(0);

        // Hacker loading bar animation
        setTimeout(() => setProgress(10), 200);
        setTimeout(() => setProgress(50), 800);
        setTimeout(() => setProgress(100), 1500);

        setTimeout(async () => {
            await onDecode(`/decode ${encodedInput}`);
            setIsDecoding(false);
            setEncodedInput('');
        }, 2000);
    };

    return (
        <div className="decoder-box">
            <label htmlFor="decoder-input">DECODE TERMINAL:</label>
            <div className="decoder-input-group">
                <input
                    id="decoder-input"
                    type="text"
                    value={encodedInput}
                    onChange={(e) => setEncodedInput(e.target.value)}
                    placeholder="Enter encrypted fragment..."
                    disabled={isDecoding}
                />
                <button onClick={handleDecode} disabled={isDecoding}>
                    {isDecoding ? 'DECODING...' : 'DECODE'}
                </button>
            </div>
            {isDecoding && (
                <div className="loading-bar-container">
                    <div className="loading-bar" style={{ width: `${progress}%` }}></div>
                </div>
            )}
        </div>
    );
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
    const inputRef = useRef<HTMLInputElement>(null);

    const showUnlockConsole = foundFragments.length === 4 && !missionComplete;

    const sendMessage = async (messageText: string) => {
        if (!messageText.trim()) return;

        const isUserMessage = !messageText.startsWith('/decode');
        if (isUserMessage) {
            setMessages(prev => [...prev, { role: 'user', content: messageText }]);
        }
        
        setIsLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: messageText, sessionId }),
            });
            if (!response.ok) throw new Error('Network response failed');
            const data = await response.json();

            setMessages(prev => [...prev, { role: 'bot', content: data.reply || 'Error' }]);
            if (data.sessionId) setSessionId(data.sessionId);
            if (data.foundFragments) setFoundFragments(data.foundFragments);
            if (data.missionComplete) setMissionComplete(true);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'bot', content: 'COMMUNICATION LINK SEVERED.' }]);
        } finally {
            setIsLoading(false);
            if (isUserMessage) setInput('');
        }
    };
    
    useEffect(() => { inputRef.current?.focus(); }, [isLoading]);

    return (
        <div className="omega-interface">
            <div className="omega-header">
                <h1>// OMEGA AI HUNT //</h1>
                <div className="fragment-display">
                    DECODED FRAGMENTS: [ {foundFragments.join(' | ')} ]
                </div>
            </div>
            <div className="omega-content">
                {messages.map((msg, index) => (
                    <p key={index}>
                        <strong>{msg.role === 'user' ? '> ' : ''}</strong>
                        {msg.content.split('\n').map((line, i) => <span key={i}>{line}<br/></span>)}
                    </p>
                ))}
            </div>
            
            <Decoder onDecode={sendMessage} />

            {showUnlockConsole && (
                <div className="unlock-console">
                    <p>ALL FRAGMENTS DECODED. USE: /unlock [DECODED PHRASE]</p>
                </div>
            )}

            {missionComplete ? (
                 <div className="mission-complete-message">SECRET KEY: OMEGA AI HUNT</div>
            ) : (
                <div className="omega-input-area">
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
                        placeholder="Enter directive..."
                        disabled={isLoading}
                    />
                    <button onClick={() => sendMessage(input)} disabled={isLoading}>
                        {isLoading ? 'TRANSMITTING...' : 'TRANSMIT'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default OmegaInterface; 