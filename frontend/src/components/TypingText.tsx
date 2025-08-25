import { useState, useEffect } from 'react';

const TypingText = ({ text, onComplete }: { text: string, onComplete: () => void }) => {
    const [displayedText, setDisplayedText] = useState('');

    useEffect(() => {
        setDisplayedText(''); // Reset on new text
        let i = 0;
        const intervalId = setInterval(() => {
            if (i < text.length) {
                setDisplayedText(prev => prev + text.charAt(i));
                i++;
            } else {
                clearInterval(intervalId);
                onComplete(); // Notify the parent component that typing is finished
            }
        }, 30); // Adjust typing speed here (milliseconds)

        return () => clearInterval(intervalId);
    }, [text, onComplete]);

    return <span>{displayedText}<span className="typing-cursor">_</span></span>;
};

export default TypingText;