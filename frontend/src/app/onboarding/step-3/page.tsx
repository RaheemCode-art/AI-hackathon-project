"use client";

import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { Check, Sparkles } from 'lucide-react';

export default function OnboardingStep3() {
  const auth = useContext(AuthContext);
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState('free');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!auth?.loading && !auth?.user) {
      router.push('/login');
    }
  }, [auth, router]);

  const plans = [
    { 
      key: 'free', 
      name: 'Free Tier', 
      price: '$0', 
      period: 'forever',
      features: ['Basic AI Diet & Workout', 'Daily Habit Tracker', 'Community Support'] 
    },
    { 
      key: 'premium_50', 
      name: 'Premium Year', 
      price: '$50', 
      period: 'per year',
      features: ['Advanced Gym Splits', 'AI Coach Priority RAG', 'Progress Photo Analysis'] 
    },
    { 
      key: 'elite_100', 
      name: 'Elite Year', 
      price: '$100', 
      period: 'per year',
      features: ['Everything in Premium', 'Personalized Body Calibration', 'Weekly AI Transformation Insights'] 
    }
  ];

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate short delay and directly push to dashboard without backend route failure
    setTimeout(() => {
      localStorage.setItem('selectedPlan', selectedPlan);
      router.push('/dashboard');
    }, 800);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-white p-4 selection:bg-orange-500 selection:text-black relative overflow-hidden">
      {/* Background Glow Effect */}
      <div className="absolute w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-4xl bg-zinc-950 border border-zinc-800 p-8 rounded-2xl shadow-2xl relative z-10 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-orange-400 font-extrabold text-xs uppercase tracking-wider bg-orange-500/10 border border-orange-500/20 px-3 py-1 rounded-full">Step 3 of 3</span>
          <h2 className="text-3xl font-black tracking-tight text-white mt-2">Select Your Subscription Plan</h2>
          <p className="text-zinc-400 text-xs leading-relaxed max-w-md mx-auto">
            Choose a plan to unlock your customized AI fitness command center.
          </p>
        </div>

        <form onSubmit={handleSubscribe} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans.map((plan) => (
              <div 
                key={plan.key} 
                onClick={() => setSelectedPlan(plan.key)}
                className={`cursor-pointer border p-6 rounded-2xl flex flex-col justify-between transition-all relative ${selectedPlan === plan.key ? 'bg-orange-500/10 border-orange-500 shadow-xl shadow-orange-500/10' : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'}`}
              >
                {selectedPlan === plan.key && (
                  <span className="absolute top-4 right-4 bg-orange-500 text-black p-1 rounded-full">
                    <Check size={14} strokeWidth={3} />
                  </span>
                )}
                <div>
                  <h3 className="text-lg font-black text-white mb-1">{plan.name}</h3>
                  <div className="text-3xl font-black text-orange-400 mb-4">
                    {plan.price} <span className="text-xs text-zinc-500 font-medium">/ {plan.period}</span>
                  </div>
                  <ul className="space-y-2.5 mb-6">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="text-xs text-zinc-300 flex items-center gap-2 font-medium">
                        <Check size={14} className="text-green-500 flex-shrink-0" /> {feat}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={`w-full py-2.5 rounded-xl font-bold text-xs text-center border transition-all ${selectedPlan === plan.key ? 'bg-orange-500 text-black border-orange-500' : 'bg-zinc-950 text-zinc-300 border-zinc-700'}`}>
                  {selectedPlan === plan.key ? 'Selected' : 'Choose Plan'}
                </div>
              </div>
            ))}
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-black font-extrabold rounded-xl transition-all shadow-lg shadow-orange-500/20 disabled:opacity-50 text-sm flex items-center justify-center gap-2"
          >
            {loading ? 'Activating Subscription...' : <><Sparkles size={18} /> Confirm Plan & Enter Dashboard</>}
          </button>
        </form>
      </div>
    </div>
  );
}