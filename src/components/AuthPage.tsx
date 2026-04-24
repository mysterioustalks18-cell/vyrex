import { useState } from 'react';
import {
  signInWithGoogle,
  signInWithEmail,
  signUpWithEmail,
  sendPasswordReset
} from '../lib/auth';
import { cn } from '../lib/utils';

interface AuthPageProps {
  onAuthSuccess: (user: any, userData: any) => void;
}

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" style={{marginRight:'10px',flexShrink:0}}>
    <path d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 002.38-5.88c0-.57-.05-.66-.15-1.18z" fill="#4285F4"/>
    <path d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2.04a4.8 4.8 0 01-7.18-2.54H1.83v2.07A8 8 0 008.98 17z" fill="#34A853"/>
    <path d="M4.5 10.48A4.8 4.8 0 014.5 7.5V5.43H1.83a8 8 0 000 7.14L4.5 10.48z" fill="#FBBC05"/>
    <path d="M8.98 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.95.99 12.14.2 8.98.2A8 8 0 001.83 5.43L4.5 7.5c.68-2 2.54-3.92 4.48-3.92z" fill="#EA4335"/>
  </svg>
);

export default function AuthPage({ onAuthSuccess }: AuthPageProps) {
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    const result = await signInWithGoogle();
    if (result.success) {
      onAuthSuccess(result.user, result.userData);
    } else {
      setError(result.error || 'Google sign in failed');
    }
    setLoading(false);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (mode === 'signup') {
      if (!name.trim()) { setError('Please enter your name'); setLoading(false); return; }
      if (password.length < 6) { setError('Password must be at least 6 characters'); setLoading(false); return; }
      const result = await signUpWithEmail(email, password, name);
      if (result.success) {
        setSuccess(result.message || 'Account created! Check your email to verify.');
        setMode('signin');
      } else {
        setError(result.error || 'Sign up failed');
      }
    } else {
      const result = await signInWithEmail(email, password);
      if (result.success) {
        onAuthSuccess(result.user, result.userData);
      } else {
        setError(result.error || 'Sign in failed');
      }
    }
    setLoading(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    if (!email) { setError('Please enter your email address'); setLoading(false); return; }
    const result = await sendPasswordReset(email);
    if (result.success) {
      setSuccess('Password reset link sent to your email. Please check your inbox.');
    } else {
      setError(result.error || 'Failed to send reset link');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen w-full bg-[#03050a] flex items-center justify-center font-sans p-5 relative overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&display=swap');
      `}</style>

      {/* Glow Effect */}
      <div className="absolute w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(232,84,42,0.07)_0%,transparent_70%)] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      <div className="bg-[#080d18] border border-white/10 rounded-2xl p-8 md:p-10 w-full max-w-[420px] relative z-10 shadow-[0_24px_80px_rgba(0,0,0,0.6)]">
        {/* LOGO */}
        <div className="text-center mb-8">
          <div className="font-display font-black text-3xl tracking-widest bg-gradient-to-br from-white to-vy-accent bg-clip-text text-transparent">VYREX</div>
          <div className="text-[9px] tracking-[0.25em] text-vy-accent mt-1 font-mono uppercase">INTELLIGENCE LAYER</div>
        </div>

        {/* FORGOT PASSWORD MODE */}
        {mode === 'forgot' ? (
          <>
            <div className="text-lg font-bold text-[#f0f6ff] mb-1.5 text-center">Reset Password</div>
            <div className="text-xs text-vy-muted text-center mb-7 font-mono tracking-tight">We'll send a direct reset link to your email</div>
            
            {error && <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-xs mb-4 leading-relaxed">⚠ {error}</div>}
            {success && <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3 text-emerald-400 text-xs mb-4 leading-relaxed">✓ {success}</div>}
            
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono tracking-widest text-vy-muted mb-1.5 uppercase">Email Address</label>
                <input 
                  className="w-full bg-[#03050a]/80 border border-white/10 rounded-lg px-4 py-3 text-[#f0f6ff] text-sm outline-none focus:border-vy-accent/60 focus:ring-2 focus:ring-vy-accent/10 transition-all"
                  type="email" 
                  placeholder="you@example.com"
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  required
                />
              </div>
              <button 
                type="submit" 
                className="w-full py-3.5 bg-gradient-to-r from-vy-accent to-vy-accent2 text-white border-none rounded-xl text-sm font-bold cursor-pointer transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_20px_rgba(232,84,42,0.3)] mt-2"
                disabled={loading}
              >
                {loading ? 'SENDING LINK...' : 'SEND RESET LINK →'}
              </button>
            </form>
            
            <div className="flex justify-center mt-6">
              <button 
                className="text-vy-accent cursor-pointer font-semibold bg-none border-none text-[12px] hover:underline" 
                onClick={() => { setMode('signin'); setError(''); setSuccess(''); }}
              >
                ← Back to Sign In
              </button>
            </div>
          </>
        ) : (
          <>
            {/* TABS */}
            <div className="flex gap-2 mb-6">
              <button 
                className={cn(
                  "flex-1 p-2 rounded-lg text-[10px] font-mono tracking-widest transition-all border",
                  mode === 'signin' ? "bg-vy-accent/15 border-vy-accent/40 text-vy-accent" : "bg-transparent border-white/5 text-vy-muted"
                )}
                onClick={() => { setMode('signin'); setError(''); setSuccess(''); }}
              >
                SIGN IN
              </button>
              <button 
                className={cn(
                  "flex-1 p-2 rounded-lg text-[10px] font-mono tracking-widest transition-all border",
                  mode === 'signup' ? "bg-vy-accent/15 border-vy-accent/40 text-vy-accent" : "bg-transparent border-white/5 text-vy-muted"
                )}
                onClick={() => { setMode('signup'); setError(''); setSuccess(''); }}
              >
                SIGN UP
              </button>
            </div>

            <div className="text-lg font-bold text-[#f0f6ff] mb-1.5 text-center">
              {mode === 'signin' ? 'Welcome back' : 'Create your account'}
            </div>
            <div className="text-[12px] text-vy-muted text-center mb-7 font-mono tracking-tight">
              {mode === 'signin' ? 'Sign in to your VYREX workspace' : 'Start with 50 free credits'}
            </div>

            {/* GOOGLE BUTTON */}
            <button 
              className="w-full py-3 px-5 bg-white text-[#111] border-none rounded-xl flex items-center justify-center cursor-pointer text-sm font-bold mb-5 transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50 shadow-[0_4px_16px_rgba(255,255,255,0.1)]"
              onClick={handleGoogleSignIn} 
              disabled={loading}
            >
              <GoogleIcon />
              {loading ? 'Connecting...' : `Continue with Google`}
            </button>

            {/* DIVIDER */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-[10px] text-vy-muted font-mono tracking-widest">OR</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* ERROR / SUCCESS */}
            {error && <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-xs mb-4">⚠ {error}</div>}
            {success && <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3 text-emerald-400 text-xs mb-4">✓ {success}</div>}

            {/* EMAIL FORM */}
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div>
                  <label className="block text-[10px] font-mono tracking-widest text-vy-muted mb-1.5 uppercase">Full Name</label>
                  <input 
                    className="w-full bg-[#03050a]/80 border border-white/10 rounded-lg px-4 py-3 text-[#f0f6ff] text-sm outline-none focus:border-vy-accent/60 focus:ring-2 focus:ring-vy-accent/10 transition-all font-sans"
                    type="text" 
                    placeholder="Your creator name"
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-[10px] font-mono tracking-widest text-vy-muted mb-1.5 uppercase">Email Address</label>
                <input 
                  className="w-full bg-[#03050a]/80 border border-white/10 rounded-lg px-4 py-3 text-[#f0f6ff] text-sm outline-none focus:border-vy-accent/60 focus:ring-2 focus:ring-vy-accent/10 transition-all font-sans"
                  type="email" 
                  placeholder="you@example.com"
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  required
                />
              </div>

              <div className="relative">
                <label className="block text-[10px] font-mono tracking-widest text-vy-muted mb-1.5 uppercase">Password</label>
                <input
                  className="w-full bg-[#03050a]/80 border border-white/10 rounded-lg pl-4 pr-12 py-3 text-[#f0f6ff] text-sm outline-none focus:border-vy-accent/60 focus:ring-2 focus:ring-vy-accent/10 transition-all font-sans"
                  type={showPassword ? 'text' : 'password'}
                  placeholder={mode === 'signup' ? 'Minimum 6 characters' : 'Your password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <button 
                  type="button" 
                  className="absolute right-3 top-[34px] p-1 text-vy-muted hover:text-vy-white transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '🙈' : '👁'}
                </button>
              </div>

              {mode === 'signin' && (
                <div className="text-right -mt-2">
                  <button 
                    type="button" 
                    className="text-[11px] text-vy-accent font-semibold opacity-80 hover:opacity-100 hover:underline"
                    onClick={() => { setMode('forgot'); setError(''); setSuccess(''); }}
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              <button 
                type="submit" 
                className="w-full py-3.5 bg-gradient-to-r from-vy-accent to-vy-accent2 text-white border-none rounded-xl text-sm font-bold cursor-pointer transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_20px_rgba(232,84,42,0.3)] mt-2"
                disabled={loading}
              >
                {loading
                  ? (mode === 'signin' ? 'SIGNING IN...' : 'CREATING ACCOUNT...')
                  : (mode === 'signin' ? 'SIGN IN TO VYREX →' : 'CREATE ACCOUNT →')
                }
              </button>
            </form>

            <div className="flex justify-center gap-1.5 mt-6 text-[12px] text-vy-muted flex-wrap">
              <span>{mode === 'signin' ? "Don't have an account?" : "Already have an account?"}</span>
              <button 
                className="text-vy-accent font-semibold hover:underline" 
                onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(''); setSuccess(''); }}
              >
                {mode === 'signin' ? 'Sign up free' : 'Sign in'}
              </button>
            </div>
          </>
        )}

        {/* FOOTER */}
        <div className="mt-8 pt-4 border-t border-white/5 text-center text-[10px] font-mono text-vy-muted/40 tracking-widest uppercase">
          NETWORK SECURE (SSL) · POWERED BY AI
        </div>
      </div>
    </div>
  );
}
