import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { authenticateUser, authenticateAdmin, clearAuthError } from '../store/authSlice';

export default function AuthView() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const [mode, setMode] = useState('login'); // 'login' | 'signup' | 'admin'
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const switchMode = (newMode) => {
    setMode(newMode);
    dispatch(clearAuthError());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === 'admin') {
      dispatch(authenticateAdmin({ name: formData.name, password: formData.password }));
    } else {
      const payload =
        mode === 'signup'
          ? { name: formData.name, email: formData.email, password: formData.password }
          : { email: formData.email, password: formData.password };
      dispatch(authenticateUser({ mode, payload }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#090d16]">
      <div className="w-full max-w-md bg-[#111827] border border-[#1f2937] rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-[#10b981] tracking-wide">
            Daily Task Manager
          </h1>
          <p className="text-xs text-[#94a3b8] mt-1">
            Sign in to access your daily checklist
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="grid grid-cols-3 gap-1 bg-[#090d16] p-1 rounded-xl border border-[#1f2937] mb-6 text-xs font-semibold">
          <button
            type="button"
            onClick={() => switchMode('login')}
            className={`py-2 rounded-lg transition cursor-pointer ${
              mode === 'login' ? 'bg-[#10b981] text-black font-bold' : 'text-[#94a3b8] hover:text-white'
            }`}
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => switchMode('signup')}
            className={`py-2 rounded-lg transition cursor-pointer ${
              mode === 'signup' ? 'bg-[#10b981] text-black font-bold' : 'text-[#94a3b8] hover:text-white'
            }`}
          >
            Sign Up
          </button>
          <button
            type="button"
            onClick={() => switchMode('admin')}
            className={`py-2 rounded-lg transition cursor-pointer ${
              mode === 'admin' ? 'bg-[#f59e0b] text-black font-bold' : 'text-[#94a3b8] hover:text-white'
            }`}
          >
            Admin
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/40 text-red-400 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {(mode === 'signup' || mode === 'admin') && (
            <div>
              <label className="block text-xs text-[#94a3b8] mb-1">
                {mode === 'admin' ? 'Admin Name' : 'Your Name'}
              </label>
              <input
                type="text"
                required
                placeholder={mode === 'admin' ? 'User' : 'Enter your name'}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#090d16] border border-[#1f2937] text-sm text-white focus:outline-none focus:border-[#10b981]"
              />
            </div>
          )}

          {mode !== 'admin' && (
            <div>
              <label className="block text-xs text-[#94a3b8] mb-1">Email Address</label>
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#090d16] border border-[#1f2937] text-sm text-white focus:outline-none focus:border-[#10b981]"
              />
            </div>
          )}

          <div>
            <label className="block text-xs text-[#94a3b8] mb-1">Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[#090d16] border border-[#1f2937] text-sm text-white focus:outline-none focus:border-[#10b981]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-bold text-sm transition cursor-pointer ${
              mode === 'admin'
                ? 'bg-[#f59e0b] hover:bg-[#d97706] text-black'
                : 'bg-[#10b981] hover:bg-[#059669] text-black'
            }`}
          >
            {loading
              ? 'Please wait...'
              : mode === 'admin'
              ? 'Enter Admin Dashboard'
              : mode === 'signup'
              ? 'Create Account & Start'
              : 'Log In to Tasks'}
          </button>
        </form>
      </div>
    </div>
  );
}