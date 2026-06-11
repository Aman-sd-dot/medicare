import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearError } from '../store/authSlice.js';
import { User, Mail, Lock, Phone, UserPlus } from 'lucide-react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');

    if (password !== confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters long');
      return;
    }

    dispatch(registerUser({ name, email, phone, password }));
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12 relative overflow-hidden bg-slate-50 dark:bg-slate-950/20">
      <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-emerald-300/10 dark:bg-emerald-800/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>

      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-premium relative z-10">
        
        <div className="text-center mb-8 space-y-2">
          <Link to="/" className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">✙</Link>
          <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">Create Account</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Join MediCare Pharma to order medicines online with convenience</p>
        </div>

        {/* Validation or API Errors */}
        {(validationError || error) && (
          <div className="mb-5 p-3.5 bg-red-50 dark:bg-red-950/20 text-red-650 dark:text-red-400 text-xs rounded-xl border border-red-200/50 dark:border-red-800/40 font-medium">
            ⚠️ {validationError || error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-455 block">Full Name</label>
            <div className="flex items-center bg-slate-50 dark:bg-slate-950/60 border border-slate-250 dark:border-slate-800 rounded-xl p-1 px-3">
              <User size={16} className="text-slate-400 mr-2 flex-shrink-0" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Rahul Sharma"
                className="w-full text-sm bg-transparent border-none outline-none focus:ring-0 text-slate-850 dark:text-slate-150 py-2.5"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-455 block">Email Address</label>
            <div className="flex items-center bg-slate-50 dark:bg-slate-950/60 border border-slate-250 dark:border-slate-800 rounded-xl p-1 px-3">
              <Mail size={16} className="text-slate-400 mr-2 flex-shrink-0" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rahul@example.com"
                className="w-full text-sm bg-transparent border-none outline-none focus:ring-0 text-slate-850 dark:text-slate-150 py-2.5"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-455 block">Phone Number</label>
            <div className="flex items-center bg-slate-50 dark:bg-slate-950/60 border border-slate-250 dark:border-slate-800 rounded-xl p-1 px-3">
              <Phone size={16} className="text-slate-400 mr-2 flex-shrink-0" />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="9988776655"
                className="w-full text-sm bg-transparent border-none outline-none focus:ring-0 text-slate-850 dark:text-slate-150 py-2.5"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-455 block">Password</label>
            <div className="flex items-center bg-slate-50 dark:bg-slate-950/60 border border-slate-250 dark:border-slate-800 rounded-xl p-1 px-3">
              <Lock size={16} className="text-slate-400 mr-2 flex-shrink-0" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full text-sm bg-transparent border-none outline-none focus:ring-0 text-slate-850 dark:text-slate-150 py-2.5"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-455 block">Confirm Password</label>
            <div className="flex items-center bg-slate-50 dark:bg-slate-950/60 border border-slate-250 dark:border-slate-800 rounded-xl p-1 px-3">
              <Lock size={16} className="text-slate-400 mr-2 flex-shrink-0" />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className="w-full text-sm bg-transparent border-none outline-none focus:ring-0 text-slate-850 dark:text-slate-150 py-2.5"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all text-sm flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Account...' : <><UserPlus size={16} className="mr-2" /> Create Account</>}
          </button>
        </form>

        <p className="text-center text-xs text-slate-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-emerald-600 hover:text-emerald-750 dark:text-emerald-400 font-semibold">
            Sign In
          </Link>
        </p>

      </div>
    </div>
  );
}
