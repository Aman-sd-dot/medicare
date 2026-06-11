import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../store/authSlice.js';
import { Mail, Lock, LogIn, ShieldCheck, UserCheck } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { loading, error, isAuthenticated, user } = useSelector((state) => state.auth);

  // Clear previous errors when landing on this page
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Redirect if authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const from = location.state?.from?.pathname;
      if (from) {
        navigate(from);
      } else if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  }, [isAuthenticated, user, navigate, location]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim() && password) {
      dispatch(loginUser({ email, password }));
    }
  };

  // Quick Prefill helper
  const handlePrefill = (role) => {
    if (role === 'admin') {
      setEmail('admin@medicare.com');
      setPassword('admin123');
    } else {
      setEmail('customer@medicare.com');
      setPassword('customer123');
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12 relative overflow-hidden bg-slate-50 dark:bg-slate-950/20">
      {/* Background blurs */}
      <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-emerald-300/10 dark:bg-emerald-800/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-premium relative z-10">
        
        {/* Title logo */}
        <div className="text-center mb-8 space-y-2">
          <Link to="/" className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">✙</Link>
          <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">Welcome Back</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Sign in to order prescription medicines and view your orders</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-5 p-3.5 bg-red-50 dark:bg-red-950/20 text-red-650 dark:text-red-400 text-xs rounded-xl border border-red-200/50 dark:border-red-800/40 font-medium">
            ⚠️ {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-450 block">Email Address</label>
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

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-450 block">Password</label>
              <Link to="/forgot-password" className="text-xs text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-350 font-medium">
                Forgot Password?
              </Link>
            </div>
            <div className="flex items-center bg-slate-50 dark:bg-slate-950/60 border border-slate-250 dark:border-slate-800 rounded-xl p-1 px-3">
              <Lock size={16} className="text-slate-400 mr-2 flex-shrink-0" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-sm bg-transparent border-none outline-none focus:ring-0 text-slate-850 dark:text-slate-150 py-2.5"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all text-sm flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : <><LogIn size={16} className="mr-2" /> Sign In</>}
          </button>
        </form>

        {/* Demo Prefills */}
        <div className="mt-8 pt-6 border-t border-slate-150 dark:border-slate-800 space-y-3">
          <p className="text-[10px] text-slate-400 text-center font-semibold uppercase tracking-wider">Demo Quick Access</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handlePrefill('customer')}
              type="button"
              className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/20 dark:hover:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-xs rounded-xl font-bold border border-emerald-255/30 dark:border-emerald-800/30 flex items-center justify-center"
            >
              <UserCheck size={14} className="mr-1.5" /> Customer Account
            </button>
            <button
              onClick={() => handlePrefill('admin')}
              type="button"
              className="px-3 py-2 bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/20 dark:hover:bg-teal-950/40 text-teal-700 dark:text-teal-400 text-xs rounded-xl font-bold border border-teal-255/30 dark:border-teal-800/30 flex items-center justify-center"
            >
              <ShieldCheck size={14} className="mr-1.5" /> Admin Account
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-slate-500 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-emerald-600 hover:text-emerald-750 dark:text-emerald-400 font-semibold">
            Create Account
          </Link>
        </p>

      </div>
    </div>
  );
}
