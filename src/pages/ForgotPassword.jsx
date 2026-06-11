import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send, CheckCircle } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Forgot password failed');
      }

      setSuccess(true);
      setCode(data.resetCode || 'RESET123');
    } catch (err) {
      setError(err.message || 'Server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12 relative overflow-hidden bg-slate-50 dark:bg-slate-950/20">
      <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-emerald-300/10 dark:bg-emerald-800/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>

      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-premium relative z-10">
        
        {success ? (
          <div className="space-y-6 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-450 flex items-center justify-center">
              <CheckCircle size={28} />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-850 dark:text-slate-100">Recovery Link Sent</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                We have sent password recovery instructions to <strong>{email}</strong> (Simulated).
              </p>
            </div>

            {/* Print out mock details so it is easy to test */}
            <div className="bg-slate-50 dark:bg-slate-950/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-left space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Simulation Information</span>
              <p className="text-xs text-slate-700 dark:text-slate-350">
                <strong>Reset Code:</strong> <span className="bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400 px-2 py-0.5 rounded font-mono font-bold">{code}</span>
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-450 leading-normal">
                To reset password: Navigate to `http://localhost:5173/reset-password?email=${email}&code=${code}` or click the button below.
              </p>
            </div>

            <button
              onClick={() => setSuccess(false)}
              className="w-full py-2.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-xs font-semibold"
            >
              Request Another Link
            </button>

            <Link
              to="/login"
              className="inline-flex items-center text-xs text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 font-semibold"
            >
              <ArrowLeft size={14} className="mr-1.5" /> Back to Sign In
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <Link to="/" className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">✙</Link>
              <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">Reset Password</h2>
              <p className="text-xs text-slate-500 dark:text-slate-450">Enter your email and we'll send you a password reset code</p>
            </div>

            {error && (
              <div className="p-3.5 bg-red-50 dark:bg-red-950/20 text-red-650 dark:text-red-400 text-xs rounded-xl border border-red-200/50 dark:border-red-800/40 font-medium">
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-455 block">Email Address</label>
                <div className="flex items-center bg-slate-50 dark:bg-slate-950/60 border border-slate-250 dark:border-slate-800 rounded-xl p-1 px-3">
                  <Mail size={16} className="text-slate-400 mr-2 flex-shrink-0" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full text-sm bg-transparent border-none outline-none focus:ring-0 text-slate-850 dark:text-slate-150 py-2.5"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all text-sm flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending Code...' : <><Send size={16} className="mr-2" /> Send Reset Link</>}
              </button>
            </form>

            <div className="text-center pt-2">
              <Link
                to="/login"
                className="inline-flex items-center text-xs text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-450 font-semibold"
              >
                <ArrowLeft size={14} className="mr-1.5" /> Back to Login
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
