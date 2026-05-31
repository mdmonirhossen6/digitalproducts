import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Zap, Mail, Lock, ArrowRight, UserPlus, LogIn } from 'lucide-react';
import { toast } from 'react-toastify';

export default function Login() {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email || !password) return setError('Please enter both email and password.');
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        const { error: err } = await signUp(email, password);
        if (err) throw err;
        toast.success('Registration successful! Please check your email for confirmation.', {
          position: 'top-center',
          autoClose: 5000,
        });
      } else {
        const { error: err } = await signIn(email, password);
        if (err) throw err;
        toast.success('Logged in successfully!', {
          position: 'bottom-right',
          autoClose: 2000,
        });
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please try again.');
      toast.error(err.message || 'Authentication failed.', {
        position: 'top-center',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-800 relative px-4 py-20 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-grid-pattern bg-grid-size opacity-50 pointer-events-none" />
      <div className="absolute w-[600px] h-[600px] rounded-full bg-brand-500/5 blur-3xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none animate-pulse-slow" />

      {/* Card */}
      <div className="w-full max-w-md bg-surface-700/60 backdrop-blur-xl border border-white/6 rounded-2xl p-8 shadow-2xl relative z-10 animate-fade-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-brand-500 flex items-center justify-center shadow-lg shadow-brand-500/30 mx-auto mb-3">
            <Zap size={22} className="text-white" fill="white" />
          </div>
          <h2 className="font-display font-700 text-2xl text-white">
            {isSignUp ? 'Create your account' : 'Welcome back'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {isSignUp ? 'Get instant access to premium tools' : 'Access your professional digital arsenal'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Email Address</label>
            <div className="relative">
              <Mail size={16} className="text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                className="w-full bg-surface-600/40 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all duration-200"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Password</label>
            <div className="relative">
              <Lock size={16} className="text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                className="w-full bg-surface-600/40 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all duration-200"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-display font-600 text-sm bg-brand-500 hover:bg-brand-600 text-white transition-all duration-300 shadow-lg shadow-brand-500/20 hover:shadow-brand-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="loading loading-spinner loading-xs text-white" />
            ) : isSignUp ? (
              <>
                <UserPlus size={16} />
                <span>Sign Up</span>
              </>
            ) : (
              <>
                <LogIn size={16} />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        {/* Toggle */}
        <div className="mt-6 text-center text-xs text-slate-500">
          <span>{isSignUp ? 'Already have an account? ' : "Don't have an account? "}</span>
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
            }}
            className="text-brand-400 hover:text-brand-300 font-semibold underline transition-colors"
          >
            {isSignUp ? 'Sign In' : 'Sign Up Now'}
          </button>
        </div>
      </div>
    </div>
  );
}
