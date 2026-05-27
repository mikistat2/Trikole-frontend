import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IS_APP } from "@/utils/platform";
import MobileLanding from "@/components/common/MobileLanding";
import BrandMark from "@/components/common/BrandMark";

function useMediaQuery(query) {
  const getMatches = () => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;
    return window.matchMedia(query).matches;
  };

  const [matches, setMatches] = useState(getMatches);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;

    const media = window.matchMedia(query);
    const onChange = (e) => setMatches(e.matches);

    setMatches(media.matches);

    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    }

    media.addListener(onChange);
    return () => media.removeListener(onChange);
  }, [query]);

  return matches;
}

/* ── DATA ──────────────────────────────────────────────── */
const MOVIES_SAFE = [
  {
    title: "Interstellar",
    year: 2014,
    genre: "Sci-Fi",
    rating: "PG-13",
    score: 96,
    director: "Christopher Nolan",
    poster: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    trailer: "https://www.youtube.com/embed/zSWdZVtXT7E?autoplay=1",
    pts: 480,
  },
  {
    title: "The Dark Knight",
    year: 2008,
    genre: "Action",
    rating: "PG-13",
    score: 94,
    director: "Christopher Nolan",
    poster: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    trailer: "https://www.youtube.com/embed/EXeTwQWrcwY?autoplay=1",
    pts: 460,
  },
  {
    title: "Parasite",
    year: 2019,
    genre: "Thriller",
    rating: "R",
    score: 98,
    director: "Bong Joon Ho",
    poster: "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
    trailer: "https://www.youtube.com/embed/5xH0HfJHsaY?autoplay=1",
    pts: 440,
  },
  {
    title: "La La Land",
    year: 2016,
    genre: "Musical",
    rating: "PG-13",
    score: 93,
    director: "Damien Chazelle",
    poster: "https://image.tmdb.org/t/p/w500/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg",
    trailer: "https://www.youtube.com/embed/0pdqf4P9MB8?autoplay=1",
    pts: 420,
  },
  {
    title: "Top Gun: Maverick",
    year: 2022,
    genre: "Action",
    rating: "PG-13",
    score: 95,
    director: "Joseph Kosinski",
    poster: "https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg",
    trailer: "https://www.youtube.com/embed/giXco2jaZ_4?autoplay=1",
    pts: 410,
  },
];

const LEADERBOARD = [
  { rank: 1, name: "FilmFreak_99", score: 4820, country: "🇺🇸", avatar: "F" },
  { rank: 2, name: "CineQueen", score: 4310, country: "🇬🇧", avatar: "C" },
  { rank: 3, name: "RacerX", score: 3990, country: "🇩🇪", avatar: "R" },
  { rank: 4, name: "MovieMike", score: 3450, country: "🇯🇵", avatar: "M" },
  { rank: 5, name: "CinephileK", score: 3100, country: "🇧🇷", avatar: "C" },
];

/* ── MAIN COMPONENT ────────────────────────────────────── */
export default function LandingPage() {
  const navigate = useNavigate();
  const isMobileWeb = useMediaQuery("(max-width: 640px)");

  if (IS_APP) return <AppLandingPage />;

  if (isMobileWeb) {
    return (
      <MobileLanding
        onGetStarted={() => navigate("/register")}
        onLogin={() => navigate("/login")}
      />
    );
  }

  return <WebLandingPage />;
}

function WebLandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileTab, setMobileTab] = useState("home");
  const navigate = useNavigate();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const openAuth = (tab) => { navigate(`/${tab}`); };

  return (
    <div style={S.root}>
      <style>{CSS}</style>

      {/* ── NAV ── */}
      <nav style={{ ...S.nav, ...(scrolled ? S.navScrolled : {}) }}>
        <div style={S.navInner}>
          <Logo />
          <div style={S.navLinks}>
            {["#features", "#movies", "#leaderboard", "#mobile"].map((h, i) => (
              <a key={h} href={h} style={S.navLink}>{["Features","Movies","Leaderboard","App"][i]}</a>
            ))}
          </div>
          <div style={S.navAuth}>
            <button onClick={() => openAuth("login")} style={S.navBtnOutline}>Log in</button>
            <button onClick={() => openAuth("register")} style={S.navBtnFill}>Sign up free</button>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={S.hero}>
        <div style={S.heroBg} />
        <Grain opacity={0.042} />
        <div style={S.heroVignette} />

        <div style={S.heroLayout}>
          {/* Left: text */}
          <div style={S.heroText}>
            <h1 style={S.heroH1} className="fade-up d1">
              Watch.<br />
              <em style={S.heroEm}>Race.</em><br />
              Dominate.
            </h1>
            <p style={S.heroSub} className="fade-up d2">
              Watch trailers find what suits you right here, dont know what to watch? let our AI find your next obsession, save your movies and compete.
            </p>
            <div style={S.heroCtas} className="fade-up d3">
              <button onClick={() => openAuth("register")} style={S.ctaPrimary}>Start Racing Free →</button>
              <a href="#mobile" style={S.ctaSecondary}><AndroidIcon />Download App</a>
            </div>
            <div style={S.heroStats} className="fade-up d4">
              {[["120 +","Racers"],["2.4M","Films Logged"],["11 +","Countries"]].map(([n,l]) => (
                <div key={l} style={S.heroStat}>
                  <span style={S.heroStatNum}>{n}</span>
                  <span style={S.heroStatLabel}>{l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        
      </section>

      {/* ── FEATURES ── */}
      <section id="features" style={S.section}>
        <div style={S.inner}>
          
          <h2 style={S.sH2}>What you can do with<br /><span style={S.accent}>Tric</span>kole</h2>
          <div style={S.featureGrid}>
            {[
              
              { icon: RaceIcon, title:"Global Race", desc:"Compete live on a worldwide leaderboard. Runtime, rarity, genre streaks all earn you points." },
              { icon: TrailersIcon, title:"Watch Trailers", desc:"Browse and watch HD trailers directly in the app before you log or decide your next watch." },
              { icon: RoomsIcon, title:"Competition Rooms", desc:"Create private rooms with custom rules — director marathons, genre sprints, decade challenges." },
              { icon: AiIcon, title:"AI Recommendations", desc:"AI studies every film you log and surfaces movies you'll love before you know you want them." },
              { icon: MobileIcon, title:"Native Android App", desc:"Capacitor-powered app. Same experience, offline-capable, push notifications for room events." },
            ].map((f, i) => (
              <div key={f.title} className="feature-card" style={{ ...S.featureCard, animationDelay: `${i * 0.09}s` }}>
                <div style={{ ...S.featureIcon, color: "#e85d24" }}>
                  <f.icon />
                </div>
                <h3 style={S.featureTitle}>{f.title}</h3>
                <p style={S.featureDesc}>{f.desc}</p>
                <div style={S.featureGlow} />
              </div>
            ))}
          </div>
        </div>
      </section>

     
      

      

      {/* ── FINAL CTA ── */}
      <section style={S.ctaSection}>
        <div style={S.ctaBg} />
        <Grain opacity={0.038} />
        <div style={{ ...S.inner, textAlign:"center", position:"relative", zIndex:1 }}>
          <h2 style={{ ...S.sH2, fontSize:"clamp(38px,5.5vw,72px)", marginBottom:16 }}>
            Your race starts<br /><span style={S.accent}>right now.</span>
          </h2>
          <p style={{ ...S.sectionSub, maxWidth:460, margin:"0 auto 40px" }}>
            Free to join. Free to race. 120 + film lovers already on the global board.
          </p>
          <div style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap" }}>
            <button onClick={() => openAuth("register")} style={{ ...S.ctaPrimary, fontSize:16, padding:"15px 34px" }}>Create Free Account</button>
            <button onClick={() => openAuth("login")} style={S.ctaGhost}>I have an account</button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={S.footer}>
        <div style={{ ...S.inner, textAlign:"center" }}>
          <Logo />
          <p style={{ fontSize:13, color:"rgba(240,236,228,0.28)", margin:"12px 0 20px" }}>The world's fastest growing movie community.</p>
          <div style={{ display:"flex", gap:24, justifyContent:"center", flexWrap:"wrap", marginBottom:22 }}>
            {["Privacy","Terms","Support","Press","API"].map(l => (
              <a key={l} href="#" onClick={(e) => e.preventDefault()} style={{ fontSize:13, color:"rgba(240,236,228,0.38)", textDecoration:"none" }}>{l}</a>
            ))}
          </div>
          <p style={{ fontSize:12, color:"rgba(240,236,228,0.16)" }}>© 2025 Trickole. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}

/* ── APP LANDING PAGE ──────────────────────────────────── */
function AppLandingPage() {
  const navigate = useNavigate();
  const openAuth = (tab) => { navigate(`/${tab}`); };

  return (
    <div style={{ ...S.root, height:"100dvh", overflow:"hidden", display:"flex", flexDirection:"column", position:"relative" }}>
      <style>{CSS}</style>
      
      {/* Background with blurry poster collage */}
      <div style={{ position:"absolute", inset:0, zIndex:0 }}>
        <img
          src="/landing-bg.png"
          alt=""
          style={{ width:"100%", height:"100%", objectFit:"cover", filter:"blur(4px) brightness(0.3)" }}
        />
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom, rgba(10,10,10,0.4) 0%, rgba(10,10,10,0.7) 40%, rgba(10,10,10,0.95) 70%, #0a0a0a 100%)" }} />
        <Grain opacity={0.04} />
      </div>

      {/* Content */}
      <div style={{ position:"relative", zIndex:1, flex:1, display:"flex", flexDirection:"column", padding:"50px 28px 40px" }}>
        
        {/* Logo */}
        <div style={{ textAlign:"center", marginTop:20 }} className="fade-up d0">
          <Logo small={false} />
        </div>

        {/* Spacer */}
        <div style={{ flex:1 }} />

        {/* Hero Text */}
        <div style={{ textAlign:"center", marginBottom:48 }}>
          <div className="cr-badge fade-up d1" style={{ marginBottom:20, background:"rgba(232,93,36,0.15)", borderColor:"rgba(232,93,36,0.4)" }}>The global movie race</div>
          <h1 style={{ ...S.heroH1, fontSize: "clamp(46px, 14vw, 64px)", marginBottom:16, lineHeight:0.95 }} className="fade-up d2">
            Watch. <br/><em style={S.heroEm}>Race.</em><br />Dominate.
          </h1>
          <p style={{ ...S.heroSub, fontSize:15, marginBottom:0, padding:"0 10px" }} className="fade-up d3">
            Watch trailers find what suits you right here, dont know what to watch? let our AI find your next obsession, save your movies and compete.
          </p>
        </div>

        {/* Buttons */}
        <div style={{ display:"flex", flexDirection:"column", gap:14, width:"100%" }} className="fade-up d4">
          <button onClick={() => openAuth("register")} style={{ ...S.ctaPrimary, justifyContent:"center", padding:"18px", fontSize:16, width:"100%", borderRadius:16 }}>
            Create Free Account
          </button>
          <button onClick={() => openAuth("login")} style={{ ...S.ctaGhost, justifyContent:"center", padding:"18px", fontSize:16, width:"100%", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:16 }}>
            Log in
          </button>
        </div>
        
        <p style={{ textAlign:"center", fontSize:11, color:"rgba(240,236,228,0.3)", marginTop:28 }} className="fade-up d4">
          By continuing, you agree to our Terms & Privacy Policy
        </p>
      </div>
    </div>
  );
}


/* ── APP SCREEN ─────────────────────────────────────────── */
function AppScreenContent({ tab, onTabChange, onAuth }) {
  return (
    <div style={AS.screen}>
      <div style={AS.statusBar}>
        <span style={{ fontSize:10, fontWeight:700 }}>9:41</span>
        <div style={{ display:"flex", gap:4, alignItems:"center", fontSize:9 }}>
          <span>●●●</span><span>WiFi</span><span>🔋</span>
        </div>
      </div>
      <div style={AS.content}>
        {tab === "home"    && <AppHome onAuth={onAuth} />}
        {tab === "browse"  && <AppBrowse />}
        {tab === "race"    && <AppRace />}
        {tab === "profile" && <AppProfile onAuth={onAuth} />}
      </div>
      <div style={AS.bottomNav}>
        {[{id:"home",icon:"⊞",label:"Home"},{id:"browse",icon:"🎬",label:"Browse"},{id:"race",icon:"🏁",label:"Race"},{id:"profile",icon:"👤",label:"Me"}].map(t => (
          <button key={t.id} style={{ ...AS.tabBtn, ...(tab === t.id ? AS.tabActive : {}) }} onClick={() => onTabChange(t.id)}>
            <span style={{ fontSize:16 }}>{t.icon}</span>
            <span style={{ fontSize:9, fontWeight: tab === t.id ? 700 : 500 }}>{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function AppHome({ onAuth }) {
  return (
    <div style={{ padding:"10px 13px", flex:1, overflowY:"auto" }}>
      <div style={{ marginBottom:12 }}>
        <p style={{ fontSize:10, color:"rgba(240,236,228,0.45)", margin:"0 0 1px" }}>Welcome back,</p>
        <h2 style={{ fontSize:17, fontWeight:900, margin:0, letterSpacing:"-0.02em" }}>Racer 👋</h2>
      </div>
      <div style={{ background:"linear-gradient(135deg, #e85d24, #c04a18)", borderRadius:14, padding:13, marginBottom:11 }}>
        <p style={{ fontSize:9, opacity:0.7, margin:"0 0 3px", textTransform:"uppercase", letterSpacing:"0.06em" }}>Today's score</p>
        <p style={{ fontSize:26, fontWeight:900, margin:"0 0 9px", letterSpacing:"-0.03em", fontFamily:"monospace" }}>+480 pts</p>
        <div style={{ display:"flex", gap:7 }}>
          <div style={{ flex:1, background:"rgba(255,255,255,0.2)", borderRadius:8, padding:"5px 8px", fontSize:10, fontWeight:700, textAlign:"center" }}>Browse</div>
          <div style={{ flex:1, background:"rgba(255,255,255,0.2)", borderRadius:8, padding:"5px 8px", fontSize:10, fontWeight:700, textAlign:"center" }}>My List (3)</div>
        </div>
      </div>
      <p style={{ fontSize:9, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:"rgba(240,236,228,0.35)", marginBottom:7 }}>Continue Watching</p>
      <div style={{ background:"rgba(255,255,255,0.05)", borderRadius:11, padding:9, display:"flex", gap:9, alignItems:"center", marginBottom:11 }}>
        <img src={MOVIES_SAFE[0].poster} style={{ width:36, height:52, borderRadius:6, objectFit:"cover", flexShrink:0 }} />
        <div style={{ flex:1 }}>
          <p style={{ fontSize:11, fontWeight:700, margin:"0 0 2px" }}>Oppenheimer</p>
          <p style={{ fontSize:9, color:"rgba(240,236,228,0.4)", margin:0 }}>3h · Drama · +480 pts</p>
        </div>
        <div style={{ background:"#e85d24", borderRadius:7, padding:"4px 9px", fontSize:9, fontWeight:700 }}>Log ✓</div>
      </div>
      <p style={{ fontSize:9, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:"rgba(240,236,228,0.35)", marginBottom:7 }}>Your Rank</p>
      <div style={{ background:"rgba(232,93,36,0.08)", border:"1px solid rgba(232,93,36,0.18)", borderRadius:11, padding:"9px 12px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div>
          <p style={{ fontSize:18, fontWeight:900, margin:0, color:"#e85d24" }}>#4,821</p>
          <p style={{ fontSize:9, color:"rgba(240,236,228,0.4)", margin:0 }}>Global · 3,100 pts</p>
        </div>
        <span style={{ fontSize:20 }}>🏁</span>
      </div>
    </div>
  );
}

function AppBrowse() {
  return (
    <div style={{ padding:"10px 13px", flex:1, overflowY:"auto" }}>
      <p style={{ fontSize:13, fontWeight:900, margin:"0 0 9px", letterSpacing:"-0.01em" }}>Trending Now</p>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:7 }}>
        {MOVIES_SAFE.slice(0,4).map((m, i) => (
          <div key={m.title} style={{ borderRadius:10, overflow:"hidden", position:"relative" }}>
            <img src={m.poster} alt={m.title} style={{ width:"100%", aspectRatio:"2/3", objectFit:"cover", display:"block" }} />
            <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 50%)" }} />
            <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:6 }}>
              <div style={{ background:"#e85d24", borderRadius:3, padding:"1px 5px", display:"inline-block", fontSize:7, fontWeight:700, marginBottom:2 }}>▶ TRAILER</div>
              <p style={{ fontSize:9, fontWeight:700, margin:0, lineHeight:1.2 }}>{m.title}</p>
              <p style={{ fontSize:7, color:"rgba(240,236,228,0.5)", margin:"1px 0 0" }}>+{m.pts} pts</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AppRace() {
  return (
    <div style={{ padding:"10px 13px", flex:1, overflowY:"auto" }}>
      <p style={{ fontSize:13, fontWeight:900, margin:"0 0 10px" }}>🏆 Global Race</p>
      {LEADERBOARD.map((p, i) => (
        <div key={p.name} style={{ display:"flex", alignItems:"center", gap:7, padding:"7px 0", borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
          <span style={{ fontSize:13, width:18 }}>{["🏆","🥈","🥉","⭐","⭐"][i]}</span>
          <div style={{ width:26, height:26, borderRadius:"50%", background:"linear-gradient(135deg,#e85d24,#c04a18)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:800, flexShrink:0 }}>{p.avatar}</div>
          <span style={{ flex:1, fontSize:11, fontWeight:600 }}>{p.name} {p.country}</span>
          <span style={{ fontSize:12, fontWeight:900, color:"#e85d24" }}>{p.score.toLocaleString()}</span>
        </div>
      ))}
      <div style={{ marginTop:12, background:"rgba(232,93,36,0.07)", border:"1px solid rgba(232,93,36,0.18)", borderRadius:11, padding:10, textAlign:"center" }}>
        <p style={{ fontSize:10, color:"rgba(240,236,228,0.45)", margin:"0 0 3px" }}>Your position</p>
        <p style={{ fontSize:19, fontWeight:900, color:"#e85d24", margin:0 }}>#4,821</p>
      </div>
    </div>
  );
}

function AppProfile({ onAuth }) {
  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:12, padding:"0 20px" }}>
      <div style={{ width:56, height:56, borderRadius:"50%", background:"linear-gradient(135deg,#e85d24,#c04a18)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24 }}>🎬</div>
      <div style={{ textAlign:"center" }}>
        <p style={{ fontSize:13, fontWeight:800, margin:"0 0 3px" }}>Join Trickole</p>
        <p style={{ fontSize:10, color:"rgba(240,236,228,0.4)", margin:0 }}>Log films & climb the global board</p>
      </div>
      <button onClick={onAuth} style={{ background:"#e85d24", border:"none", color:"#fff", borderRadius:10, padding:"9px 22px", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>Log in / Sign up</button>
    </div>
  );
}

/* ── TINY COMPONENTS ─────────────────────────────────── */
function Logo({ small }) {
  return <BrandMark imageSize={small ? 18 : 24} textSize={small ? 20 : 30} />;
}
function Eyebrow({ children }) {
  return <p style={{ fontSize:11, fontWeight:700, letterSpacing:"0.18em", textTransform:"uppercase", color:"#e85d24", marginBottom:12 }}>{children}</p>;
}
function Grain({ opacity = 0.04 }) {
  return <div style={{ position:"absolute", inset:0, opacity, backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='512' height='512' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundRepeat:"repeat", backgroundSize:"180px", pointerEvents:"none" }} />;
}
function RaceIcon({ size = 30 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 5h4l2.2 2.2L14.4 5H20" /><path d="M4 19h4l2.2-2.2L14.4 19H20" /><path d="M6 7v10" /><path d="M18 7v10" /><path d="M8 9h8" /><path d="M8 15h8" /><path d="M10 11h4" /><path d="M10 13h4" /></svg>;
}
function TrailersIcon({ size = 30 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 4h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z" /><path d="M10 8l6 4-6 4V8Z" /></svg>;
}
function RoomsIcon({ size = 30 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M7 7l10 10" /><path d="M17 7L7 17" /><path d="M5 5l4 4" /><path d="M15 15l4 4" /><path d="M19 5l-4 4" /><path d="M9 15l-4 4" /></svg>;
}
function AiIcon({ size = 30 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="6" width="12" height="12" rx="3" /><path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3" /><path d="M10 10h.01M14 10h.01M10 14h4" /></svg>;
}
function MobileIcon({ size = 30 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="7" y="3" width="10" height="18" rx="2.2" /><path d="M10 6h4" /><path d="M11 18h2" /><path d="M9 9h6M9 12h6M9 15h6" /></svg>;
}
function AndroidIcon({ size = 18 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={{ marginRight:8, flexShrink:0 }}><path d="M3.18 23.76A1.12 1.12 0 0 0 4.1 24c.36 0 .72-.09 1.05-.27L20 15.28l-3.57-3.57-13.25 11.05ZM1.12 1.15A2.12 2.12 0 0 0 .75 2.28v19.44a2.12 2.12 0 0 0 .37 1.13L12.48 12 1.12 1.15ZM20.66 10.38l-2.82-1.64-4 3.26 4 4 2.83-1.64a2.26 2.26 0 0 0 0-4.02ZM4.1.27A2.26 2.26 0 0 0 3.18 0L16.43 13.29l3.57-3.57L5.15.54A2.22 2.22 0 0 0 4.1.27Z"/></svg>;
}
function FilmStrip({ bottom }) {
  return (
    <div style={{ position:"absolute", [bottom ? "bottom" : "top"]:0, left:0, right:0, height:26, display:"flex", gap:2, overflow:"hidden", opacity:0.28, pointerEvents:"none" }}>
      {[...Array(14)].map((_,i) => <div key={i} style={{ flex:1, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.05)", borderRadius:2 }} />)}
    </div>
  );
}

/* ── STYLES ──────────────────────────────────────────── */
const S = {
  root: { background:"#0a0a0a", color:"#f0ece4", fontFamily:"'Barlow','Helvetica Neue',sans-serif", overflowX:"hidden", minHeight:"100vh" },
  accent: { color:"#e85d24" },

  nav: { position:"fixed", top:0, left:0, right:0, zIndex:200, transition:"all 0.4s", borderBottom:"1px solid transparent" },
  navScrolled: { background:"rgba(10,10,10,0.93)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(232,93,36,0.12)" },
  navInner: { maxWidth:1200, margin:"0 auto", padding:"16px 32px", display:"flex", alignItems:"center", gap:24 },
  navLinks: { display:"flex", gap:22, marginLeft:"auto" },
  navLink: { color:"rgba(240,236,228,0.52)", textDecoration:"none", fontSize:14, fontWeight:500, transition:"color 0.2s" },
  navAuth: { display:"flex", gap:10 },
  navBtnOutline: { background:"transparent", border:"1px solid rgba(255,255,255,0.18)", color:"#f0ece4", padding:"7px 17px", borderRadius:8, fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"inherit", transition:"border-color 0.2s" },
  navBtnFill: { background:"#e85d24", border:"none", color:"#fff", padding:"7px 17px", borderRadius:8, fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit" },

  hero: { minHeight:"100vh", display:"flex", alignItems:"center", position:"relative", overflow:"hidden", paddingTop:80 },
  heroBg: { position:"absolute", inset:0, backgroundImage:"url('/landing-bg.png')", backgroundPosition:"center", backgroundSize:"cover", backgroundRepeat:"no-repeat", filter:"brightness(0.55) saturate(0.92)" },
  heroVignette: { position:"absolute", inset:0, background:"radial-gradient(ellipse 100% 100% at 50% 50%, transparent 28%, rgba(10,10,10,0.6) 100%)" },
  heroLayout: { maxWidth:980, margin:"0 auto", padding:"0 40px", display:"grid", gridTemplateColumns:"1fr", gap:28, alignItems:"center", position:"relative", zIndex:1, width:"100%" },
  heroText: { minWidth:0, maxWidth:700 },
  heroH1: { fontSize:"clamp(46px,6vw,84px)", fontWeight:900, lineHeight:0.93, letterSpacing:"-0.04em", margin:"0 0 22px", fontFamily:"'Bebas Neue','Barlow',sans-serif" },
  heroEm: { color:"#e85d24", fontStyle:"normal" },
  heroSub: { fontSize:16, color:"rgba(240,236,228,0.56)", lineHeight:1.7, marginBottom:30, fontWeight:400 },
  heroCtas: { display:"flex", gap:13, alignItems:"center", marginBottom:42, flexWrap:"wrap" },
  heroStats: { display:"flex", gap:30 },
  heroStat: { display:"flex", flexDirection:"column", gap:2 },
  heroStatNum: { fontSize:27, fontWeight:900, letterSpacing:"-0.03em", fontFamily:"'Bebas Neue','Barlow',sans-serif" },
  heroStatLabel: { fontSize:10, color:"rgba(240,236,228,0.38)", fontWeight:500, letterSpacing:"0.06em", textTransform:"uppercase" },

  scrollLine: { width:1, height:36, background:"linear-gradient(to bottom, rgba(232,93,36,0.7), transparent)" },
  scrollText: { fontSize:10, letterSpacing:"0.14em", textTransform:"uppercase", color:"rgba(240,236,228,0.3)" },

  section: { padding:"96px 0" },
  sectionDark: { padding:"96px 0", background:"rgba(232,93,36,0.02)", borderTop:"1px solid rgba(232,93,36,0.07)", borderBottom:"1px solid rgba(232,93,36,0.07)" },
  inner: { maxWidth:1200, margin:"0 auto", padding:"0 40px" },
  sH2: { fontSize:"clamp(28px,3.8vw,50px)", fontWeight:900, lineHeight:1.05, letterSpacing:"-0.03em", margin:"0 0 18px", fontFamily:"'Bebas Neue','Barlow',sans-serif" },
  sectionSub: { fontSize:16, color:"rgba(240,236,228,0.5)", lineHeight:1.7, marginBottom:28 },

  featureGrid: { display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(210px, 1fr))", gap:16, marginTop:44 },
  featureCard: { background:"rgba(255,255,255,0.027)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:18, padding:"26px 22px", position:"relative", overflow:"hidden", cursor:"default", transition:"border-color 0.3s, transform 0.3s, background 0.3s" },
  featureIcon: { fontSize:30, display:"block", marginBottom:12 },
  featureTitle: { fontSize:15, fontWeight:800, marginBottom:7, letterSpacing:"-0.02em" },
  featureDesc: { fontSize:13, color:"rgba(240,236,228,0.5)", lineHeight:1.65, margin:0 },
  featureGlow: { position:"absolute", bottom:-50, right:-50, width:130, height:130, borderRadius:"50%", background:"radial-gradient(circle, rgba(232,93,36,0.09) 0%, transparent 70%)", pointerEvents:"none" },

  movieGrid: { display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(175px, 1fr))", gap:14, marginTop:36 },
  movieTile: { background:"rgba(255,255,255,0.025)", borderRadius:14, overflow:"hidden", border:"1px solid rgba(255,255,255,0.06)", cursor:"pointer", transition:"transform 0.25s, border-color 0.25s" },
  moviePosterWrap: { position:"relative", aspectRatio:"2/3", overflow:"hidden" },
  moviePosterImg: { width:"100%", height:"100%", objectFit:"cover", display:"block", transition:"transform 0.4s" },
  movieTileGrad: { position:"absolute", inset:0, background:"rgba(0,0,0,0)", transition:"background 0.3s" },
  moviePlayOverlay: { position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:7, opacity:0, transition:"opacity 0.3s", background:"rgba(0,0,0,0.48)" },
  moviePlayCircle: { width:42, height:42, borderRadius:"50%", background:"rgba(232,93,36,0.9)", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff" },
  movieTileScore: { position:"absolute", top:8, right:8, background:"rgba(0,0,0,0.72)", borderRadius:6, padding:"2px 7px", fontSize:11, fontWeight:800, color:"#f08a5d" },
  movieTileInfo: { padding:"11px 11px 10px" },
  genrePill: { fontSize:9, fontWeight:700, letterSpacing:"0.07em", textTransform:"uppercase", color:"#e85d24", background:"rgba(232,93,36,0.12)", borderRadius:4, padding:"2px 6px" },
  ratingPill: { fontSize:9, fontWeight:700, color:"rgba(240,236,228,0.28)", background:"rgba(255,255,255,0.06)", borderRadius:4, padding:"2px 6px" },
  movieTileTitle: { fontSize:13, fontWeight:800, margin:"0 0 3px", lineHeight:1.2 },
  movieTileMeta: { fontSize:11, color:"rgba(240,236,228,0.35)", margin:"0 0 9px" },
  moviePts: { fontSize:12, fontWeight:900, color:"#e85d24" },
  logBtn: { background:"#e85d24", border:"none", color:"#fff", borderRadius:7, padding:"5px 12px", fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:"inherit" },

  lbLayout: { display:"grid", gridTemplateColumns:"1fr 1fr", gap:76, alignItems:"center" },
  lbCard: { background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:20, overflow:"hidden" },
  lbCardHead: { display:"flex", alignItems:"center", justifyContent:"space-between", padding:"13px 17px", borderBottom:"1px solid rgba(255,255,255,0.05)", background:"rgba(232,93,36,0.05)" },
  livePill: { display:"flex", alignItems:"center", gap:5, fontSize:10, fontWeight:700, color:"#e85d24", letterSpacing:"0.1em" },
  liveDot: { width:5, height:5, borderRadius:"50%", background:"#e85d24", animation:"pulse 1.5s infinite" },
  lbRow: { display:"flex", alignItems:"center", gap:9, padding:"11px 17px", position:"relative", transition:"background 0.2s" },
  lbTopBar: { position:"absolute", left:0, top:0, bottom:0, width:3, background:"linear-gradient(to bottom,#e85d24,#c04a18)", borderRadius:"0 2px 2px 0" },
  lbAvatar: { width:30, height:30, borderRadius:"50%", background:"linear-gradient(135deg,#e85d24,#c04a18)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:800, flexShrink:0 },
  lbNum: { fontSize:17, fontWeight:900, color:"#e85d24", letterSpacing:"-0.02em", fontFamily:"'Bebas Neue','Barlow',sans-serif" },
  lbFoot: { padding:"9px 17px", textAlign:"center", borderTop:"1px solid rgba(255,255,255,0.05)", fontSize:11, color:"rgba(240,236,228,0.28)" },

  mobileLayout: { display:"grid", gridTemplateColumns:"1fr 1fr", gap:76, alignItems:"center" },
  phoneMockupWrap: { display:"flex", justifyContent:"center", position:"relative" },
  phoneMockup: { width:258, height:538, borderRadius:36, background:"#111", border:"2px solid rgba(255,255,255,0.11)", position:"relative", overflow:"hidden", boxShadow:"0 60px 120px rgba(0,0,0,0.7), inset 0 0 0 1px rgba(255,255,255,0.04)" },
  phoneNotch: { position:"absolute", top:9, left:"50%", transform:"translateX(-50%)", width:88, height:21, background:"#111", borderRadius:12, zIndex:10, border:"1.5px solid rgba(255,255,255,0.08)" },
  phoneScreen: { position:"absolute", inset:0, background:"#0c0c0c", borderRadius:34, overflow:"hidden", display:"flex", flexDirection:"column" },
  phoneHomeBar: { position:"absolute", bottom:6, left:"50%", transform:"translateX(-50%)", width:96, height:4, background:"rgba(255,255,255,0.22)", borderRadius:2 },
  phoneGlow: { position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:340, height:500, borderRadius:"50%", background:"radial-gradient(ellipse, rgba(232,93,36,0.13) 0%, transparent 70%)", pointerEvents:"none", zIndex:-1 },
  mobileList: { listStyle:"none", padding:0, margin:"0 0 28px", display:"flex", flexDirection:"column", gap:11 },
  mobileListItem: { display:"flex", alignItems:"center", gap:11, fontSize:14, color:"rgba(240,236,228,0.68)", fontWeight:500 },
  mobileListDot: { width:6, height:6, borderRadius:"50%", background:"#e85d24", flexShrink:0 },
  downloadBtn: { display:"inline-flex", alignItems:"center", gap:8, background:"#e85d24", color:"#fff", padding:"14px 26px", borderRadius:14, textDecoration:"none", border:"none", cursor:"pointer", fontFamily:"inherit", boxShadow:"0 10px 40px rgba(232,93,36,0.4)", transition:"transform 0.2s, box-shadow 0.2s", marginBottom:12 },
  downloadNote: { fontSize:12, color:"rgba(240,236,228,0.28)", margin:0 },

  ctaSection: { padding:"116px 0", position:"relative", overflow:"hidden" },
  ctaBg: { position:"absolute", inset:0, background:"url('/landing-bg.png') center/cover no-repeat, radial-gradient(ellipse 90% 80% at 50% 50%, rgba(232,93,36,0.14) 0%, transparent 65%), linear-gradient(180deg,#0a0a0a,#0f0d0b,#0a0a0a)" },
  ctaPrimary: { display:"inline-flex", alignItems:"center", background:"#e85d24", color:"#fff", padding:"12px 24px", borderRadius:11, fontSize:14, fontWeight:700, textDecoration:"none", border:"none", cursor:"pointer", fontFamily:"inherit", boxShadow:"0 8px 26px rgba(232,93,36,0.36)", transition:"transform 0.2s, box-shadow 0.2s", letterSpacing:"0.01em" },
  ctaSecondary: { display:"inline-flex", alignItems:"center", color:"rgba(240,236,228,0.62)", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", padding:"12px 20px", borderRadius:11, fontSize:14, fontWeight:600, textDecoration:"none", transition:"background 0.2s" },
  ctaGhost: { background:"transparent", border:"1px solid rgba(255,255,255,0.14)", color:"rgba(240,236,228,0.58)", padding:"15px 26px", borderRadius:11, fontSize:15, fontWeight:600, cursor:"pointer", fontFamily:"inherit", transition:"border-color 0.2s" },
  footer: { borderTop:"1px solid rgba(255,255,255,0.05)", padding:"46px 0 26px", background:"#080808" },

  backdrop: { position:"fixed", inset:0, background:"rgba(0,0,0,0.88)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:20, backdropFilter:"blur(10px)" },
  trailerBox: { background:"#111", border:"1px solid rgba(255,255,255,0.1)", borderRadius:20, width:"100%", maxWidth:760, overflow:"hidden", boxShadow:"0 40px 100px rgba(0,0,0,0.8)" },
  trailerHead: { display:"flex", alignItems:"flex-start", justifyContent:"space-between", padding:"18px 22px 14px" },
  trailerEmbed: { width:"100%", aspectRatio:"16/9", background:"#000" },
  trailerFoot: { display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 22px" },
  closeBtn: { background:"rgba(255,255,255,0.08)", border:"none", color:"rgba(240,236,228,0.65)", width:30, height:30, borderRadius:"50%", fontSize:12, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"inherit", zIndex:2 },
};

const AS = {
  screen: { display:"flex", flexDirection:"column", height:"100%", background:"#0c0c0c", color:"#f0ece4", fontFamily:"'Barlow',sans-serif" },
  statusBar: { display:"flex", justifyContent:"space-between", alignItems:"center", padding:"26px 13px 5px", fontSize:10, color:"rgba(240,236,228,0.65)", flexShrink:0 },
  content: { flex:1, overflowY:"auto", display:"flex", flexDirection:"column" },
  bottomNav: { display:"flex", background:"#111", borderTop:"1px solid rgba(255,255,255,0.07)", flexShrink:0 },
  tabBtn: { flex:1, background:"transparent", border:"none", color:"rgba(240,236,228,0.3)", padding:"7px 0 9px", display:"flex", flexDirection:"column", alignItems:"center", gap:2, cursor:"pointer", fontFamily:"inherit", transition:"color 0.2s" },
  tabActive: { color:"#e85d24" },
};

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,900&display=swap');
  * { box-sizing: border-box; }
  html { scroll-behavior: smooth; }
  body { margin: 0; }

  @keyframes fadeInUp {
    from { opacity:0; transform:translateY(28px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes pulse {
    0%,100% { opacity:1; transform:scale(1); }
    50% { opacity:0.32; transform:scale(0.62); }
  }
  @keyframes bounce {
    0%,100% { transform:translateX(-50%) translateY(0); }
    50% { transform:translateX(-50%) translateY(9px); }
  }

  .fade-up { animation: fadeInUp 0.72s ease both; }
  .d0 { animation-delay:0.07s; }
  .d1 { animation-delay:0.2s; }
  .d2 { animation-delay:0.35s; }
  .d3 { animation-delay:0.5s; }
  .d4 { animation-delay:0.65s; }

  .cr-badge {
    display: inline-flex; align-items: center;
    background: rgba(232,93,36,0.09); border: 1px solid rgba(232,93,36,0.24);
    color: #f08a5d; border-radius: 100px; padding: 5px 15px;
    font-size: 12px; font-weight: 600; letter-spacing: 0.04em;
    margin-bottom: 20px;
  }

  .scroll-cue {
    position: absolute; bottom: 34px; left: 50%;
    transform: translateX(-50%);
    display: flex; flex-direction: column; align-items: center; gap: 6px; z-index: 10;
  }
  .bounce { animation: bounce 2.5s ease-in-out infinite; }

  .feature-card:hover {
    border-color: rgba(232,93,36,0.3) !important;
    transform: translateY(-5px);
    background: rgba(232,93,36,0.038) !important;
  }
  .movie-tile:hover { transform: translateY(-4px); border-color: rgba(232,93,36,0.3) !important; }
  .movie-tile:hover img { transform: scale(1.07); }
  .movie-tile:hover .movie-play-overlay { opacity: 1 !important; }
  .lb-row:hover { background: rgba(255,255,255,0.03); }

  input:focus { border-color: rgba(232,93,36,0.5) !important; }
  input::placeholder { color: rgba(240,236,228,0.22); }

  @media (max-width: 860px) {
    .hero-layout { grid-template-columns: 1fr !important; }
    .lb-layout, .mobile-layout { grid-template-columns: 1fr !important; gap: 48px !important; }
  }
`;
