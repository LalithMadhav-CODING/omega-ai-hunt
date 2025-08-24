import React, { useState } from 'react';

const OmegaInterface = () => {
    // NOTE: This will be connected to the Gemini API in the next PR.
    // For now, it just echoes the user's message.
    const [messages, setMessages] = useState([
        { role: 'bot', content: 'STATUS: SECURE CONNECTION ESTABLISHED.' },
        { role: 'bot', content: 'OMEGA INTERFACE ONLINE. AWAITING DIRECTIVE...' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const newMessages = [...messages, { role: 'user', content: input }];
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);

        // Placeholder for backend call
        setTimeout(() => {
            setMessages([
                ...newMessages,
                { role: 'bot', content: `ECHO: ${input}` }
            ]);
            setIsLoading(false);
        }, 1000);
    };

    return (
        <div className="omega-interface">
            <div className="omega-header">
                <h1>// OMEGA AI HUNT //</h1>
            </div>
            <div className="omega-content">
                {messages.map((msg, index) => (
                    <p key={index}>
                        <strong>{msg.role === 'user' ? '> ' : ''}</strong>
                        {msg.content}
                    </p>
                ))}
            </div>
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
        </div>
    );
};

export default OmegaInterface;
