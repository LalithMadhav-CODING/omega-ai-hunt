import React, { useState, useEffect, useRef, useCallback } from 'react';
import TypingText from './TypingText';
import ScanningAnimation from './ScanningAnimation'; // Import the new component

type Message = { role: 'user' | 'bot'; content: string; };

// Decoder Component (no changes needed)
const Decoder = ({ onDecode }: { onDecode: (fragment: string) => Promise<void> }) => {
    const [encodedInput, setEncodedInput] = useState('');
    const [isDecoding, setIsDecoding] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleDecode = async () => {
        if (!encodedInput.trim()) return;
        setIsDecoding(true);
        setProgress(0);
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
            <label htmlFor="decoder-input">DECODE TERMINAL</label>
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
        { role: 'bot', content: 'OMEGA INTERFACE ONLINE. BEGIN BY SCANNING THE NETWORK OR USE /help FOR A LIST OF DIRECTIVES.' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [foundFragments, setFoundFragments] = useState<string[]>([]);
    const [missionComplete, setMissionComplete] = useState(false);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [scanType, setScanType] = useState<string | null>(null); // State for animation
    const inputRef = useRef<HTMLInputElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    const showUnlockConsole = foundFragments.length === 4 && !missionComplete;

    const sendMessage = useCallback(async (messageText: string) => {
        if (!messageText.trim() || isLoading) return;

        const isUserMessage = !messageText.startsWith('/decode');
        if (isUserMessage) {
            setMessages(prev => [...prev, { role: 'user', content: messageText }]);
        }
        
        // Trigger scanning animation based on command
        if (messageText.startsWith('/scan_network')) setScanType('network');
        else if (messageText.startsWith('/scan_biometrics')) setScanType('biometric');
        
        setIsLoading(true);
        if (isUserMessage) setInput('');

        try {
            // Add a small delay for the animation to be visible
            if (scanType) {
                await new Promise(resolve => setTimeout(resolve, 2500));
            }

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
            setScanType(null); // Hide animation after response
        }
    }, [isLoading, sessionId, scanType]);
    
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        sendMessage(input);
    };
    
    useEffect(() => {
        if (contentRef.current) {
            contentRef.current.scrollTop = contentRef.current.scrollHeight;
        }
    }, [messages]);

    useEffect(() => {
        if (!isLoading) {
            inputRef.current?.focus();
        }
    }, [isLoading]);

    return (
        <>
            <ScanningAnimation scanType={scanType} />
            <div className="omega-interface">
                <div className="omega-header">
                    <h1>// OMEGA AI HUNT //</h1>
                </div>
                <div className="fragment-display">
                    DECODED FRAGMENTS: [ {foundFragments.join(' | ')} ]
                </div>
                <div className="omega-content" ref={contentRef}>
                    {messages.map((msg, index) => (
                        <p key={index}>
                            <strong>{msg.role === 'user' ? '> ' : ''}</strong>
                            {(msg.role === 'bot' && index === messages.length - 1 && isLoading && !scanType) ? (
                                <TypingText 
                                    text={msg.content} 
                                    onComplete={() => setIsLoading(false)} 
                                />
                            ) : (
                                msg.content.split('\n').map((line, i) => <span key={index + '-' + i}>{line}<br/></span>)
                            )}
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
                    <form className="omega-input-area" onSubmit={handleSubmit}>
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Enter directive..."
                            disabled={isLoading}
                        />
                        <button type="submit" disabled={isLoading}>
                            {isLoading ? 'PROCESSING...' : 'TRANSMIT'}
                        </button>
                    </form>
                )}
            </div>
        </>
    );
};

export default OmegaInterface;