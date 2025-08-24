import React, { useEffect, useRef } from 'react';

const MatrixBackground: React.FC<{ faint?: boolean }> = ({ faint = false }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;

    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const fontSize = 16;
    const columns = canvas.width / fontSize;
    const drops: number[] = [];
    for (let x = 0; x < columns; x++) drops[x] = 1;

    function draw() {
      ctx.fillStyle = faint ? 'rgba(0, 0, 0, 0.1)' : 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#00e5e5'; // Use teal color
      ctx.font = fontSize + 'px ' + 'Share Tech Mono, monospace';

      for (let i = 0; i < drops.length; i++) {
        const text = letters[Math.floor(Math.random() * letters.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }

    const interval = setInterval(draw, 50); // Slowed down slightly
    return () => clearInterval(interval);
  }, [faint]);

  return <canvas ref={canvasRef} id="matrix-canvas" style={{ opacity: faint ? 0.3 : 1 }} />;
};

export default MatrixBackground;