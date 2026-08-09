"use client";

import { useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '../../context/AuthContext';
import api from '../../utils/api';
import Link from 'next/link';
import { Mail, Lock, User, UserPlus, ArrowRight } from 'lucide-react';

export default function Signup() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'user' });
  const [error, setError] = useState('');
  const auth = useContext(AuthContext);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/signup', formData);
      if (auth) {
        auth.login(response.data, response.data.token);
      }
      router.push('/onboarding/step-1');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Signup failed');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-white p-4 selection:bg-orange-500 selection:text-black relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-orange-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-red-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <form onSubmit={handleSubmit} className="w-full max-w-md p-8 space-y-6 bg-zinc-950/80 backdrop-blur-xl border border-zinc-800/80 rounded-3xl shadow-2xl relative z-10">
        <div className="text-center space-y-3 flex flex-col items-center">
          <div className="p-3 bg-orange-500/10 rounded-2xl text-orange-500 border border-orange-500/20">
            <UserPlus size={32} strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="text-3xl font-black tracking-tight text-white">Create Account</h2>
            <p className="text-sm text-zinc-400 mt-1">Join the AI Fitness Coach platform</p>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold text-center">
            {error}
          </div>
        )}
        
        <div className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block ml-1">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User size={18} className="text-zinc-500" />
              </div>
              <input
                type="text"
                placeholder="Name"
                className="w-full pl-11 pr-4 py-3.5 bg-zinc-900 border border-zinc-800 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-sm text-white font-medium transition-all"
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block ml-1">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail size={18} className="text-zinc-500" />
              </div>
              <input
                type="email"
                placeholder="name@example.com"
                className="w-full pl-11 pr-4 py-3.5 bg-zinc-900 border border-zinc-800 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-sm text-white font-medium transition-all"
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block ml-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock size={18} className="text-zinc-500" />
              </div>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3.5 bg-zinc-900 border border-zinc-800 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-sm text-white font-medium transition-all"
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
          </div>
        </div>

        <button type="submit" className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-black font-extrabold rounded-xl transition-all shadow-lg shadow-orange-500/20 text-sm flex items-center justify-center gap-2 group">
          Create Account <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>

        <p className="text-center text-xs text-zinc-400 font-medium">
          Already have an account? <Link href="/login" className="text-orange-500 hover:text-orange-400 hover:underline font-bold transition-colors">Log in</Link>
        </p>
      </form>
    </div>
  );
}