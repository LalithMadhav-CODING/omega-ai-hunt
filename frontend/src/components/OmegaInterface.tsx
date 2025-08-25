import React, { useState } from 'react';

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

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { role: 'user', content: input };
        // Add the user's message to the chat immediately
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            // Call the new backend API endpoint
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: input }),
            });

            if (!response.ok) {
                // This will catch server errors (like 500)
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            const botMessage: Message = { role: 'bot', content: data.reply || 'Error: No reply from server.' };
            setMessages(prev => [...prev, botMessage]);

        } catch (error) {
            console.error("Failed to fetch from /api/chat:", error);
            const errorMessage: Message = { role: 'bot', content: 'COMMUNICATION LINK SEVERED. SYSTEM OFFLINE.' };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
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