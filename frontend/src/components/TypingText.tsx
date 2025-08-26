import { useState, useEffect } from 'react';

const TypingText = ({ text, onComplete }: { text: string, onComplete: () => void }) => {
    const [displayedChars, setDisplayedChars] = useState<string[]>([]);

    useEffect(() => {
        setDisplayedChars([]); // Reset on new text
        let i = 0;
        const intervalId = setInterval(() => {
            if (i < text.length) {
                const char = text.charAt(i);
                // Push <br/> instead of raw "\n"
                setDisplayedChars(prev => [...prev, char === '\n' ? '\n' : char]);
                i++;
            } else {
                clearInterval(intervalId);
                onComplete();
            }
        }, 30); // typing speed

        return () => clearInterval(intervalId);
    }, [text, onComplete]);

    return (
        <span>
            {displayedChars.map((char, idx) =>
                char === '\n' ? <br key={idx} /> : <span key={idx}>{char}</span>
            )}
            <span className="typing-cursor">_</span>
        </span>
    );
};

export default TypingText;
