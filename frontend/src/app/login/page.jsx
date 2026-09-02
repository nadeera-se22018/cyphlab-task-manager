'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { Sparkles, Lock, Mail, User, Shield, ArrowRight } from 'lucide-react';
import api from '../../lib/axios';
import Footer from '../../components/Footer';

export default function LoginPage() {
  const router = useRouter();
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('MEMBER');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (isRegistering) {
        await api.post('/auth/register', { name, email, password, role });
        setSuccess('Registration successful. Please log in.');
        setIsRegistering(false);
        setName('');
        setPassword('');
      } else {
        const response = await api.post('/auth/login', { email, password });
        Cookies.set('token', response.data.token, { expires: 1 });
        router.push('/');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication failed. Please check credentials or database connectivity.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-between bg-[#080A0F] px-4 py-8 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="fixed top-1/4 left-1/3 w-[32rem] h-[32rem] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/3 w-[30rem] h-[30rem] bg-slate-400/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full" />

      <div className="w-full max-w-md relative z-10 my-auto">
        {/* Brand Emblem */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-700 flex items-center justify-center shadow-xl shadow-amber-500/25 ring-1 ring-amber-300/40 mb-4">
            <Sparkles className="h-7 w-7 text-slate-950 fill-slate-950" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-wider gold-gradient-text">
            CYPHLAB
          </h1>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mt-1">
            Enterprise Task Management
          </p>
        </div>

        {/* Card Container */}
        <div className="glass-card rounded-2xl p-8 border border-amber-500/20 shadow-2xl shadow-black/80">
          <div className="mb-6 text-center">
            <h2 className="text-xl font-bold text-white">
              {isRegistering ? 'Create New Account' : 'Sign in to Workspace'}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {isRegistering
                ? 'Enter your credentials to register as a team member'
                : 'Access your tasks, projects, and dashboard'}
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-xl bg-red-950/40 border border-red-500/30 p-4 text-xs font-medium text-red-300 leading-relaxed">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 rounded-xl bg-emerald-950/40 border border-emerald-500/30 p-4 text-xs font-medium text-emerald-300 leading-relaxed">
              {success}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {isRegistering && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="h-4 w-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    name="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-slate-700/80 bg-slate-900/90 pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400/50 transition-all"
                    placeholder="Kasun Weerasekara"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="h-4 w-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-700/80 bg-slate-900/90 pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400/50 transition-all"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="h-4 w-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-700/80 bg-slate-900/90 pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400/50 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {isRegistering && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Select Role
                </label>
                <div className="relative">
                  <Shield className="h-4 w-4 text-slate-500 absolute left-3.5 top-3" />
                  <select
                    name="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full rounded-xl border border-slate-700/80 bg-slate-900/90 pl-10 pr-4 py-2.5 text-sm text-slate-100 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400/50 transition-all"
                  >
                    <option value="MEMBER">MEMBER (Standard Access)</option>
                    <option value="MANAGER">MANAGER (Project Manager)</option>
                    <option value="ADMIN">ADMIN (System Administrator)</option>
                  </select>
                </div>
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="gold-btn w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold tracking-wide disabled:opacity-50"
              >
                {loading ? (
                  <Sparkles className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <span>{isRegistering ? 'Create Cyphlab Account' : 'Sign In'}</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsRegistering(!isRegistering);
                  setError('');
                  setSuccess('');
                }}
                className="text-xs font-medium text-slate-400 hover:text-amber-300 transition-colors"
              >
                {isRegistering
                  ? 'Already have an account? Sign in'
                  : "Don't have an account? Create one"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="w-full max-w-md relative z-10 pt-6">
        <Footer />
      </div>
    </div>
  );
}
