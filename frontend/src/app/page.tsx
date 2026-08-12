"use client";
import { Activity } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const backgroundImages = [
  '/arnold.jpg',
  '/ronnie.jpg',
  '/kevin.jpg',
  '/cbum.jpg'
];

export default function Home() {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % backgroundImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-orange-500 selection:text-black overflow-hidden relative">
      <div
        className="absolute inset-0 transition-opacity duration-1000 ease-in-out z-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: `url(${backgroundImages[currentImage]})` }}
      />

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-orange-600/15 rounded-full blur-[120px] pointer-events-none z-10"></div>

      <header className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center relative z-10 border-b border-zinc-900">
        <div className="flex items-center gap-2">
          <Activity size={32} strokeWidth={2.5} />
          <span className="font-black text-xl tracking-wider text-white">AI FITNESS <span className="text-orange-500">COACH</span></span>
        </div>
        <nav className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-semibold text-zinc-300 hover:text-white transition-all px-4 py-2">
            Log In
          </Link>
          <Link href="/signup" className="bg-orange-500 hover:bg-orange-600 text-black font-extrabold px-5 py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-orange-500/20">
            Get Started
          </Link>
        </nav>
      </header>

      <main className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center relative z-10">

        {/* <div className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-4 py-1.5 rounded-full text-xs font-bold text-orange-400 mb-8 shadow-inner">
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping"></span>
          Next-Level AI Powered Fitness Platform
        </div> */}

        <section className="space-y-6">
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-none text-white">
            Transform Your Body With <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-400">Generative AI</span>
          </h1>
          <p className="text-zinc-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Get personalized diet plans, custom workout splits, MediaPipe-powered body posture analysis, and a 24/7 intelligent fitness coach.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <Link href="/signup" className="bg-orange-500 hover:bg-orange-600 text-black font-black px-8 py-4 rounded-2xl text-base transition-all shadow-xl shadow-orange-500/25">
              Start Free Onboarding
            </Link>
            <Link href="/login" className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white font-bold px-8 py-4 rounded-2xl text-base transition-all">
              Sign In to Account
            </Link>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-24 text-left">

          <article className="bg-zinc-950 border border-zinc-900 p-6 rounded-2xl shadow-xl relative group hover:border-orange-500/50 transition-all">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 font-bold mb-4 text-lg">01</div>
            <h3 className="text-lg font-bold text-white mb-2">AI Body Analysis</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Upload multi-angle body images for instant posture detection and precise BMI estimation using advanced computer vision.
            </p>
          </article>

          <article className="bg-zinc-950 border border-zinc-900 p-6 rounded-2xl shadow-xl relative group hover:border-orange-500/50 transition-all">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 font-bold mb-4 text-lg">02</div>
            <h3 className="text-lg font-bold text-white mb-2">Custom Diet & Workout</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Allergy-aware macro tracking and customized home or gym workout routines engineered precisely for your fitness goals.
            </p>
          </article>

          <article className="bg-zinc-950 border border-zinc-900 p-6 rounded-2xl shadow-xl relative group hover:border-orange-500/50 transition-all">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 font-bold mb-4 text-lg">03</div>
            <h3 className="text-lg font-bold text-white mb-2">RAG AI Coach</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Chat in real-time with an intelligent assistant that securely reads your active plans and daily progress history for contextual advice.
            </p>
          </article>

        </section>
      </main>

      <footer className="max-w-7xl mx-auto px-6 py-8 mt-20 border-t border-zinc-900 flex flex-col sm:flex-row justify-between items-center text-xs text-zinc-500 relative z-10">
        <p>© 2026 AI Fitness Coach. All rights reserved.</p>
        <div className="flex gap-6 mt-4 sm:mt-0">
          <Link href="/login" className="hover:text-zinc-300 transition-colors">Privacy</Link>
          <Link href="/login" className="hover:text-zinc-300 transition-colors">Terms</Link>
          <Link href="/login" className="hover:text-zinc-300 transition-colors">Support</Link>
        </div>
      </footer>
    </div>
  );
}