import { useRef, useState } from "react";
import BrandMark from '@/components/common/BrandMark';

// ── 3 slides ──────────────────────────────────────────────────────────────────
const SLIDES = [
  {
    id: 0,
    
    headline: ["WATCH.", "RACE.", "DOMINATE."],
    accentIndex: 1,
    body: "Find your movie by watching trailers, dont know what to watch? use the built in AI recommendation engine to find your next movie to watch. save your list and compete.",
    visual: "hero",
  },
  {
    id: 1,
    
    headline: ["LOG FILMS.", "EARN POINTS.", "RANK UP."],
    accentIndex: 2,
    body: "",
    visual: "leaderboard",
  },
  {
    id: 2,
    
    headline: [],
    accentIndex: 2,
    body: "",
    visual: "cta",
  },
];

// ── SVG Icons (no emojis) ─────────────────────────────────────────────────────
function FilmIcon({ size = 56 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#e8621a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="3" />
      <circle cx="12" cy="12" r="4" />
      <path d="M2 8h4M18 8h4M2 16h4M18 16h4" />
    </svg>
  );
}

function TrophyIcon({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#e8621a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4.5a2.5 2.5 0 010-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 000-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 19.24 7 20v2" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 19.24 17 20v2" />
      <path d="M18 2H6v7a6 6 0 1012 0V2z" />
    </svg>
  );
}

function RocketIcon({ size = 56 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#e8621a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z" />
      <path d="M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  );
}

// ── Slide visuals ─────────────────────────────────────────────────────────────
function SlideVisual({ type, active }) {
  const base = {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 200,
    position: "relative",
  };

  if (type === "hero")
    return null;

  if (type === "leaderboard")
    return (
      <div style={base}>
        <div style={{ width: 250 }}>
          {[
            { rank: "1", name: "FilmFreak_99", pts: "12,440", you: false },
            { rank: "2", name: "CineStalker", pts: "11,220", you: false },
            { rank: "3", name: "YOU", pts: "9,880", you: true },
          ].map((row, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 14px",
                borderRadius: 12,
                background: row.you ? "rgba(232,98,26,0.1)" : "rgba(255,255,255,0.03)",
                border: row.you
                  ? "1px solid rgba(232,98,26,0.3)"
                  : "1px solid rgba(255,255,255,0.05)",
                marginBottom: 8,
                opacity: active ? 1 : 0,
                transform: active ? "translateY(0)" : "translateY(10px)",
                transition: `all 0.5s ease ${i * 0.12}s`,
              }}
            >
              <span
                style={{
                  fontFamily: "'Bebas Neue',Impact,sans-serif",
                  fontSize: 18,
                  color: row.rank === "1" ? "#e8621a" : "rgba(255,255,255,0.25)",
                  width: 20,
                  textAlign: "center",
                }}
              >
                {row.rank}
              </span>
              {/* Avatar circle */}
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: row.you
                    ? "linear-gradient(135deg, #e8621a, #c04a18)"
                    : "rgba(255,255,255,0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11,
                  fontWeight: 800,
                  color: row.you ? "#fff" : "rgba(255,255,255,0.4)",
                  flexShrink: 0,
                }}
              >
                {row.name[0]}
              </div>
              <span
                style={{
                  flex: 1,
                  fontFamily: "'Bebas Neue',Impact,sans-serif",
                  fontSize: 13,
                  color: row.you ? "#e8621a" : "#fff",
                  letterSpacing: 0.5,
                }}
              >
                {row.name}
              </span>
              <span
                style={{
                  fontFamily: "'Bebas Neue',Impact,sans-serif",
                  fontSize: 12,
                  color: "rgba(255,255,255,0.4)",
                }}
              >
                {row.pts}
              </span>
            </div>
          ))}
        </div>
      </div>
    );

  if (type === "cta")
    return (
      <div style={base}>
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              filter: "drop-shadow(0 0 24px rgba(232,98,26,0.6))",
            }}
          >
            <RocketIcon size={64} />
          </div>
          <div
            style={{
              display: "flex",
              gap: 24,
              opacity: active ? 1 : 0,
              transform: active ? "translateY(0)" : "translateY(12px)",
              transition: "all 0.6s ease 0.15s",
            }}
          >
            {[
              { num: "120+", label: "RACERS" },
              { num: "2.4M", label: "FILMS" },
              { num: "5+", label: "COUNTRIES" },
            ].map((s) => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontFamily: "'Bebas Neue',Impact,sans-serif",
                    fontSize: 22,
                    color: "#e8621a",
                    letterSpacing: -0.5,
                  }}
                >
                  {s.num}
                </div>
                <div
                  style={{
                    fontFamily: "'Bebas Neue',Impact,sans-serif",
                    fontSize: 9,
                    letterSpacing: 2,
                    color: "rgba(255,255,255,0.3)",
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );

  return null;
}

// ── Main component ────────────────────────────────────────────────────────────
export default function MobileLanding({ onGetStarted, onLogin }) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const [animating, setAnimating] = useState(false);
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);
  const isLast = current === SLIDES.length - 1;

  const goTo = (nextIndex, dir) => {
    if (animating || nextIndex < 0 || nextIndex >= SLIDES.length) return;
    setDirection(dir);
    setAnimating(true);
    setTimeout(() => {
      setCurrent(nextIndex);
      setAnimating(false);
    }, 280);
  };

  const next = () => goTo(current + 1, -1);
  const prev = () => goTo(current - 1, 1);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = Math.abs(e.changedTouches[0].clientY - touchStartY.current);
    if (dy > 40) return;
    if (dx < -50) next();
    else if (dx > 50) prev();
    touchStartX.current = null;
  };

  const slide = SLIDES[current];

  return (
    <div
      id="cr-mobile-landing"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{
        fontFamily: "'Bebas Neue', Impact, sans-serif",
        background: "#0d0d0d",
        color: "#fff",
        height: "100dvh",
        width: "100%",
        overflow: "hidden",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        userSelect: "none",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        #cr-mobile-landing, #cr-mobile-landing * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
        @keyframes slideInLeft { from { opacity:0; transform: translateX(40px); } to { opacity:1; transform: translateX(0); } }
        @keyframes slideInRight { from { opacity:0; transform: translateX(-40px); } to { opacity:1; transform: translateX(0); } }
        #cr-mobile-landing .slide-enter-left { animation: slideInLeft 0.3s cubic-bezier(0.22,1,0.36,1) forwards; }
        #cr-mobile-landing .slide-enter-right { animation: slideInRight 0.3s cubic-bezier(0.22,1,0.36,1) forwards; }
      `}</style>

      {/* ── Blurry movie poster collage background ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
        }}
      >
        <img
          src="/landing-bg.png"
          alt=""
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "blur(0px) brightness(0.5)",
          }}
        />
        {/* Dark gradient overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(13,13,13,0) 0%, rgba(13,13,13,0.45) 42%, rgba(13,13,13,0.75) 78%, rgba(13,13,13,0.9) 100%)",
          }}
        />
      </div>

      {/* Subtle grain texture */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 1,
          opacity: 0.07,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.07'/%3E%3C/svg%3E")`,
        }}
      />

      {/* ── Header ── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "52px 28px 0",
          flexShrink: 0,
          position: "relative",
          zIndex: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <BrandMark imageSize={80} textSize={30} />
        </div>
        <button
          onClick={onLogin}
          style={{
            background: "transparent",
            border: "1.5px solid rgba(255,255,255,0.18)",
            borderRadius: 20,
            color: "#fff",
            padding: "7px 18px",
            fontFamily: "'Bebas Neue',Impact,sans-serif",
            fontSize: 12,
            letterSpacing: 2,
            cursor: "pointer",
          }}
        >
          LOG IN
        </button>
      </div>

      {/* ── Slide content ── */}
      <div
        key={current}
        className={animating ? "" : direction <= 0 ? "slide-enter-left" : "slide-enter-right"}
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          padding: "0 28px",
          justifyContent: "center",
          position: "relative",
          zIndex: 10,
          opacity: animating ? 0 : 1,
          transition: animating ? "opacity 0.15s ease" : "none",
        }}
      >
        {/* Headline */}
        <div style={{ lineHeight: 0.88, marginBottom: 24 }}>
          {slide.headline.map((word, i) => (
            <div
              key={i}
              style={{
                fontSize: 58,
                fontWeight: 900,
                letterSpacing: -1,
                color: i === slide.accentIndex ? "#e8621a" : "#fff",
                textShadow:
                  i === slide.accentIndex
                    ? "0 0 50px rgba(232,98,26,0.35)"
                    : "none",
              }}
            >
              {word}
            </div>
          ))}
        </div>

        {/* Visual illustration */}
        <SlideVisual type={slide.visual} active={!animating} />

        {/* Body text */}
        <p
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 15,
            lineHeight: 1.65,
            color: "fff",
            fontStyle: "italic",
            marginTop: 8,
            maxWidth: 300,
          }}
        >
          {slide.body}
        </p>
      </div>

      {/* ── Bottom navigation ── */}
      <div
        style={{
          flexShrink: 0,
          padding: "0 28px 48px",
          position: "relative",
          zIndex: 10,
        }}
      >
        {/* Dots */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 7,
            marginBottom: 28,
          }}
        >
          {SLIDES.map((_, i) => (
            <div
              key={i}
              onClick={() => goTo(i, i > current ? -1 : 1)}
              style={{
                height: 5,
                borderRadius: 3,
                width: i === current ? 28 : 6,
                background:
                  i === current ? "#e8621a" : "rgba(255,255,255,0.18)",
                transition: "all 0.35s cubic-bezier(0.22,1,0.36,1)",
                cursor: "pointer",
                boxShadow:
                  i === current ? "0 0 8px rgba(232,98,26,0.6)" : "none",
              }}
            />
          ))}
        </div>

        {isLast ? (
          /* ── Final slide: Start Now CTA ── */
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button
              onClick={onGetStarted}
              style={{
                width: "100%",
                padding: "17px 0",
                background: "#e8621a",
                border: "none",
                borderRadius: 14,
                fontFamily: "'Bebas Neue',Impact,sans-serif",
                fontSize: 18,
                letterSpacing: 2,
                color: "#fff",
                cursor: "pointer",
                boxShadow: "0 8px 32px rgba(232,98,26,0.45)",
              }}
            >
              START NOW
            </button>
            <button
              onClick={onLogin}
              style={{
                width: "100%",
                padding: "15px 0",
                background: "transparent",
                border: "1.5px solid rgba(255,255,255,0.15)",
                borderRadius: 14,
                fontFamily: "'Bebas Neue',Impact,sans-serif",
                fontSize: 16,
                letterSpacing: 2,
                color: "rgba(255,255,255,0.5)",
                cursor: "pointer",
              }}
            >
              I ALREADY HAVE AN ACCOUNT
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
