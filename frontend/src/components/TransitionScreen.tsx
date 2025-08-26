import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const TransitionScreen = () => {
    const [isVisible, setIsVisible] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const handleStartTransition = (event: CustomEvent) => {
            const { detail: path } = event;
            setIsVisible(true);

            // Wait for the fade-in to complete, then fade to black and redirect
            setTimeout(() => {
                // This is where you would fade to black, but for simplicity we just redirect
                router.push(path);
                // Hide the screen after redirecting
                setTimeout(() => setIsVisible(false), 500);
            }, 2500); // Duration of the glitch text
        };

        window.addEventListener('startTransition', handleStartTransition as EventListener);

        return () => {
            window.removeEventListener('startTransition', handleStartTransition as EventListener);
        };
    }, [router]);

    const text = "FIND THE SECRET IF YOU CAN";

    return (
        <div className={`transition-overlay ${isVisible ? 'visible' : ''}`}>
            <h1 className="glitch-text" data-text={text}>
                {text}
            </h1>
        </div>
    );
};

export default TransitionScreen;