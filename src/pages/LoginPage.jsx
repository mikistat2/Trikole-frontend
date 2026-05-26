import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '@/api';
import { useAuthStore } from '@/store/auth.store';
import { useGoogleLogin } from '@react-oauth/google';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleGoogleClick = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setGoogleLoading(true);
      setError('');
      try {
        const res = await authApi.googleLogin(tokenResponse.access_token);
        setAuth(res.data.user, res.data.token);
        navigate('/');
      } catch (err) {
        setError(err.response?.data?.error || 'Google sign-in failed');
      } finally {
        setGoogleLoading(false);
      }
    },
    onError: () => {
      setError('Google sign-in failed or was cancelled');
    }
  });

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await authApi.login(form);
      setAuth(res.data.user, res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-[#f0ece4] font-['Barlow','sans-serif'] p-4 relative overflow-hidden">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,900&display=swap');`}</style>
      {/* Background grain & vignette like landing page */}
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='512' height='512' filter='url(%23n)'/%3E%3C/svg%3E")`, opacity: 0.04, backgroundRepeat: 'repeat', backgroundSize: '180px' }} />
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 100% 100% at 50% 50%, transparent 28%, rgba(10,10,10,0.6) 100%)" }} />

      <div className="w-full max-w-[420px] bg-[#111] rounded-[22px] border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.8)] relative z-10 px-[30px] pb-[26px] pt-[28px] animate-slide-up">
        {/* Close/Back button */}
        <button onClick={() => navigate('/')} className="absolute top-[14px] right-[14px] bg-white/10 text-[#f0ece4]/65 w-[30px] h-[30px] rounded-full text-[12px] flex items-center justify-center hover:bg-white/20 transition-colors">✕</button>

        <div className="flex flex-col items-center gap-[18px] mb-6">
          <span className="font-['Bebas_Neue','Barlow',sans-serif] text-[26px] font-black tracking-[0.02em] text-[#f0ece4]">
            Trickole
          </span>
        </div>

        <p className="text-[18px] font-extrabold tracking-[-0.02em] text-center mb-[18px]">Welcome back, Racer</p>

        {error && (
          <div className="mb-5 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-[10px] text-[13px] text-red-400 animate-fade-in text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col">
          <label className="block text-[12px] font-semibold text-[#f0ece4]/50 mb-[5px] tracking-[0.03em]">Email</label>
          <input
            type="email" required
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            className="block w-full bg-white/5 border border-white/10 rounded-[10px] py-[10px] px-[13px] text-[14px] text-[#f0ece4] mb-[13px] outline-none focus:border-[#e85d24]/50 placeholder-white/20 transition-colors"
            placeholder="you@example.com"
          />

          <label className="block text-[12px] font-semibold text-[#f0ece4]/50 mb-[5px] tracking-[0.03em]">Password</label>
          <input
            type="password" required
            value={form.password}
            onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
            className="block w-full bg-white/5 border border-white/10 rounded-[10px] py-[10px] px-[13px] text-[14px] text-[#f0ece4] outline-none focus:border-[#e85d24]/50 placeholder-white/20 transition-colors"
            placeholder="••••••••"
          />

          <div className="flex justify-end mb-[18px] mt-2">
            <a href="#" className="text-[12px] text-[#e85d24] no-underline hover:underline">Forgot password?</a>
          </div>

          <button type="submit" disabled={loading || googleLoading} className="w-full flex items-center justify-center bg-[#e85d24] text-white py-[12px] px-[24px] rounded-[11px] text-[15px] font-bold shadow-[0_8px_26px_rgba(232,93,36,0.36)] hover:scale-[1.02] hover:shadow-[0_10px_30px_rgba(232,93,36,0.45)] transition-all disabled:opacity-50 disabled:scale-100">
            {loading ? 'Logging in...' : 'Log in →'}
          </button>
        </form>

        <div className="flex items-center gap-[12px] my-[18px]">
          <span className="flex-1 h-[1px] bg-white/10" />
          <span className="text-[12px] text-[#f0ece4]/30">or</span>
          <span className="flex-1 h-[1px] bg-white/10" />
        </div>

        <button
          onClick={handleGoogleClick}
          disabled={googleLoading || loading}
          className="w-full flex items-center justify-center gap-[10px] bg-white/5 border border-white/10 text-[#f0ece4] rounded-[10px] py-[10px] text-[14px] font-semibold hover:bg-white/10 transition-colors mb-[18px] disabled:opacity-50"
        >
          {googleLoading ? (
            <span className="w-4 h-4 border-2 border-[#f0ece4]/30 border-t-[#f0ece4] rounded-full animate-spin" />
          ) : (
            <svg width="17" height="17" viewBox="0 0 24 24" className="shrink-0">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
          )}
          {googleLoading ? 'Signing in...' : 'Continue with Google'}
        </button>

        <p className="text-center text-[13px] text-[#f0ece4]/40 m-0">
          Don't have an account?{' '}
          <button onClick={() => navigate('/register')} className="bg-transparent border-none text-[#e85d24] text-[13px] font-bold cursor-pointer p-0 hover:underline">
            Sign up free
          </button>
        </p>
      </div>
    </div>
  );
}
