import { useEffect, useState } from 'react';

export default function AnimatedSplash({ onComplete }) {
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Duration of logo scale animation + pause (1.5 seconds)
    const timer = setTimeout(() => {
      setIsFadingOut(true);
    }, 1800);

    // Duration of final fade out transition (400ms)
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 2200);

    return () => {
      clearTimeout(timer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#0a0a0a',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        transition: 'opacity 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
        opacity: isFadingOut ? 0 : 1,
        pointerEvents: 'none',
      }}
    >
      <style>{`
        @keyframes splashGrow {
          0% {
            opacity: 0;
            transform: scale(0.65) translateY(10px);
            filter: blur(8px);
          }
          15% {
            opacity: 0.3;
          }
          100% {
            opacity: 1;
            transform: scale(1);
            filter: blur(0px);
          }
        }
        @keyframes splashPulse {
          0%, 100% {
            filter: drop-shadow(0 0 15px rgba(232, 93, 36, 0.15));
          }
          50% {
            filter: drop-shadow(0 0 35px rgba(232, 93, 36, 0.4));
          }
        }
        .splash-logo-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          animation: 
            splashGrow 1.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards,
            splashPulse 2.5s ease-in-out infinite alternate;
        }
        .splash-logo {
          width: 96px;
          height: 96px;
          object-fit: contain;
          margin-bottom: 20px;
        }
        .splash-text {
          font-family: 'Bebas Neue', 'Barlow', sans-serif;
          font-size: 36px;
          font-weight: 900;
          color: #f0ece4;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }
        .splash-accent {
          color: #e85d24;
        }
      `}</style>

      <div className="splash-logo-container">
        <img
          src="/Trickole-logo.png"
          alt="Trickole Logo"
          className="splash-logo"
        />
        <div className="splash-text">
          Trick<span className="splash-accent">ole</span>
        </div>
      </div>
    </div>
  );
}
