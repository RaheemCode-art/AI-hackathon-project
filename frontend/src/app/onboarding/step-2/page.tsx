"use client";

import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import api from '../../../utils/api';
import { useRouter } from 'next/navigation';

export default function OnboardingStep2() {
  const auth = useContext(AuthContext);
  const router = useRouter();
  const [goalData, setGoalData] = useState({ goal: 'Weight Loss', allergies: '', workoutPreference: 'Home' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!auth?.loading && !auth?.user) {
      router.push('/login');
    }
  }, [auth, router]);

 const handleGeneratePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/plans/generate', goalData);
      router.push('/onboarding/step-3'); 
    } catch (error) {
      alert("Plan generation failed. Check backend terminal for API key errors.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-white p-4 selection:bg-orange-500 selection:text-black relative overflow-hidden">
      
      <div className="absolute w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-xl bg-zinc-950 border border-zinc-800 p-8 rounded-2xl shadow-2xl relative z-10 space-y-6">
        <div className="text-center space-y-2">
          <span className="text-orange-400 font-extrabold text-xs uppercase tracking-wider bg-orange-500/10 border border-orange-500/20 px-3 py-1 rounded-full">Step 2 of 2</span>
          <h2 className="text-3xl font-black tracking-tight text-white mt-2">Select Your Fitness Goal</h2>
          <p className="text-zinc-400 text-xs leading-relaxed max-w-md mx-auto">
            Our Generative AI will craft a customized diet and workout plan for you[cite: 1].
          </p>
        </div>

        <form onSubmit={handleGeneratePlan} className="space-y-5">
          <div>
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-2">Primary Goal[cite: 1]</label>
            <select 
              className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded-xl focus:outline-none focus:border-orange-500 text-white font-bold text-sm transition-all"
              onChange={(e) => setGoalData({...goalData, goal: e.target.value})}
              value={goalData.goal}
            >
              <option value="Weight Loss">Weight Loss</option>
              <option value="Weight Gain">Weight Gain</option>
              <option value="Muscle">Muscle Building</option>
              <option value="Maintenance">Maintenance</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-2">Workout Preference</label>
            <select 
              className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded-xl focus:outline-none focus:border-orange-500 text-white font-bold text-sm transition-all"
              onChange={(e) => setGoalData({...goalData, workoutPreference: e.target.value})}
              value={goalData.workoutPreference}
            >
              <option value="Home">Home Workout</option>
              <option value="Gym">Gym Workout</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-2">Allergies / Dietary Restrictions</label>
            <input 
              type="text" 
              placeholder="e.g., Peanuts, Dairy, Gluten"
              className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded-xl focus:outline-none focus:border-orange-500 text-sm text-white transition-all"
              onChange={(e) => setGoalData({...goalData, allergies: e.target.value})}
              value={goalData.allergies}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-black font-extrabold rounded-xl transition-all shadow-lg shadow-orange-500/20 disabled:opacity-50 text-sm mt-2"
          >
            {loading ? 'AI is crafting your plan...' : 'Generate Plan & Enter Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
}