import { useState } from 'react';
import { useRouter } from 'next/router';

const OmegaSeal = () => (
    <svg className="omega-seal" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="2"/>
        <path d="M50 10 V30 M50 70 V90 M10 50 H30 M70 50 H90" stroke="currentColor" strokeWidth="1" />
        <circle cx="50" cy="50" r="35" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4"/>
        <text x="50" y="45" textAnchor="middle" fontSize="8" fill="currentColor" fontFamily="Share Tech Mono, monospace">OMEGA</text>
        <text x="50" y="58" textAnchor="middle" fontSize="8" fill="currentColor" fontFamily="Share Tech Mono, monospace">PROTOCOL</text>
    </svg>
);

const LoginForm = () => {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (username === 'agent' && password === 'omega') {
            setError('');
            // Trigger the transition event
            const event = new CustomEvent('startTransition', { detail: '/chat' });
            window.dispatchEvent(event);
        } else {
            setError('ACCESS DENIED: INVALID CREDENTIALS');
        }
    };

    return (
        <form className="login-form" onSubmit={handleLogin}>
            <OmegaSeal />
            <div className="input-group">
                <label htmlFor="username">AGENT ID:</label>
                <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            <div className="input-group">
                <label htmlFor="password">PASSCODE:</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <p className="error-message">{error}</p>
            <button type="submit" className="login-button">
                AUTHENTICATE
            </button>
        </form>
    );
};

export default LoginForm;