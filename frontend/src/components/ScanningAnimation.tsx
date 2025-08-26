import React from 'react';

const NetworkIcon = () => (
    <svg className="scanning-icon" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle className="ring" cx="50" cy="50" r="15" stroke="currentColor" strokeWidth="2"/>
        <circle className="ring" cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="2" style={{animationDelay: '0.5s'}}/>
        <circle className="ring" cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="2" style={{animationDelay: '1s'}}/>
    </svg>
);

const BiometricIcon = () => (
    <svg className="scanning-icon" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
         <path d="M50,25 C40,25 35,30 35,40 C35,50 40,55 50,55 C60,55 65,50 65,40 C65,30 60,25 50,25 M50,30 C55,30 60,35 60,40 C60,45 55,50 50,50 C45,50 40,45 40,40 C40,35 45,30 50,30" stroke="currentColor" strokeWidth="2" className="ring" />
         <path d="M30,60 C30,70 40,75 50,75 C60,75 70,70 70,60" stroke="currentColor" strokeWidth="2" className="ring" style={{animationDelay: '0.5s'}}/>
         <path d="M25,70 C25,80 40,85 50,85 C60,85 75,80 75,70" stroke="currentColor" strokeWidth="2" className="ring" style={{animationDelay: '1s'}}/>
    </svg>
);

const ScanningAnimation = ({ scanType }: { scanType: string | null }) => {
    const getScanDetails = () => {
        switch (scanType) {
            case 'network':
                return { icon: <NetworkIcon />, text: 'SCANNING NETWORK...' };
            case 'biometric':
                return { icon: <BiometricIcon />, text: 'SCANNING BIOMETRICS...' };
            default:
                return { icon: null, text: 'PROCESSING...' };
        }
    };

    const { icon, text } = getScanDetails();

    return (
        <div className={`scanning-overlay ${scanType ? 'visible' : ''}`}>
            {icon}
            <p className="scanning-text">{text}</p>
        </div>
    );
};

export default ScanningAnimation;