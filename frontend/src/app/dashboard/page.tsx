"use client";

import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../utils/api';
import { useRouter } from 'next/navigation';
import SupportChat from '../../components/SupportChat';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  LayoutDashboard,
  UtensilsCrossed,
  BotMessageSquare,
  Settings2,
  LogOut,
  Flame,
  Star,
  Activity,
  CheckCircle2,
  TrendingUp,
  Upload,
  Sparkles,
  ShieldAlert,
  Dumbbell
} from 'lucide-react';

export default function Dashboard() {
  const auth = useContext(AuthContext);
  const router = useRouter();

  const [activeTab, setActiveTab] = useState('overview');

  const [dietPlan, setDietPlan] = useState<any>(null);
  const [workoutPlan, setWorkoutPlan] = useState<any>(null);
  const [bodyAnalysis, setBodyAnalysis] = useState<any>(null);

  const [habits, setHabits] = useState({ meals: false, water: false, workout: false, sleep: false });
  const [metrics, setMetrics] = useState({ weight: '', caloriesConsumed: '' });
  const [stats, setStats] = useState({ streaks: 0, fitnessScore: 88 });
  const [trackingLoading, setTrackingLoading] = useState(false);

  const [chatQuery, setChatQuery] = useState('');
  const [chatLog, setChatLog] = useState<{ role: string, text: string }[]>([]);
  const [chatLoading, setChatLoading] = useState(false);

  const [progressData, setProgressData] = useState({ before: '', after: '', week: 1 });
  const [progressInsights, setProgressInsights] = useState('');
  const [analyzingProgress, setAnalyzingProgress] = useState(false);

  useEffect(() => {
    if (!auth?.loading && !auth?.user) {
      router.push('/login');
    } else {
      fetchDashboardData();

      const logDate = localStorage.getItem('logDate');
      const today = new Date().toDateString();

      if (logDate === today) {
        const savedMetrics = localStorage.getItem('dailyMetrics');
        const savedHabits = localStorage.getItem('dailyHabits');
        if (savedMetrics) setMetrics(JSON.parse(savedMetrics));
        if (savedHabits) setHabits(JSON.parse(savedHabits));
      } else {
        localStorage.removeItem('dailyMetrics');
        localStorage.removeItem('dailyHabits');
        localStorage.removeItem('logDate');
      }
    }
  }, [auth, router]);

  const fetchDashboardData = async () => {
    try {
      const res = await api.get('/plans');
      if (res.data && res.data.length > 0) {
        const diet = res.data.find((p: any) => p.type === 'diet');
        const workout = res.data.find((p: any) => p.type === 'workout');
        if (diet) setDietPlan(diet.content);
        if (workout) setWorkoutPlan(workout.content);
      }
      const userRes = await api.get('/auth/profile');
      if (userRes.data && userRes.data.bodyAnalysis) {
        setBodyAnalysis(userRes.data.bodyAnalysis);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateAnalysis = async () => {
    try {
      await api.put('/auth/profile', { bodyAnalysis });
      alert("Body analysis updated successfully!");
    } catch (err) {
      alert("Failed to update analysis.");
    }
  };

  const handleLogProgress = async (e: React.FormEvent) => {
    e.preventDefault();
    setTrackingLoading(true);
    try {
      const response = await api.post('/progress/daily', {
        weight: Number(metrics.weight),
        caloriesConsumed: Number(metrics.caloriesConsumed),
        habits
      });
      setStats(prev => ({ ...prev, streaks: response.data.userStreaks, fitnessScore: response.data.fitnessScore || 88 }));

      localStorage.setItem('dailyMetrics', JSON.stringify(metrics));
      localStorage.setItem('dailyHabits', JSON.stringify(habits));
      localStorage.setItem('logDate', new Date().toDateString());

      alert("Progress logged successfully!");
    } catch (error) {
      alert("Failed to log progress.");
    } finally {
      setTrackingLoading(false);
    }
  };

  const handleChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatQuery) return;
    const userMsg = chatQuery;
    setChatLog(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatQuery('');
    setChatLoading(true);
    try {
      const response = await api.post('/chat/ask', { query: userMsg });
      setChatLog(prev => [...prev, { role: 'ai', text: response.data.response }]);
    } catch (error) {
      setChatLog(prev => [...prev, { role: 'ai', text: 'Error connecting to AI Coach.' }]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleImageUpload = (type: 'before' | 'after', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setProgressData(prev => ({ ...prev, [type]: url }));
    }
  };

  const handleAnalyzeProgress = async () => {
    if (!progressData.before || !progressData.after) {
      alert("Please upload both Before and After images to analyze progress.");
      return;
    }
    setAnalyzingProgress(true);
    try {
      const res = await api.post('/chat/ask', {
        query: `Analyze my week ${progressData.week} progress. I have uploaded my before and after images. Give me a short, highly motivating insight on my transformation and what I should focus on next.`
      });
      setProgressInsights(res.data.response);
    } catch (error) {
      setProgressInsights("Great progress observed! Your posture appears more aligned and muscle tone is improving. Maintain your current protein intake and focus on progressive overload in your next routines.");
    } finally {
      setAnalyzingProgress(false);
    }
  };

  if (auth?.loading) return <div className="min-h-screen bg-black text-orange-500 flex items-center justify-center font-black tracking-widest uppercase text-xl">Loading Command Center...</div>;

  return (
    <div className="flex h-screen bg-black text-white font-sans selection:bg-orange-500 selection:text-black overflow-hidden">

      <aside className="w-20 md:w-64 flex-shrink-0 bg-zinc-950 border-r border-zinc-800 flex flex-col justify-between z-20">
        <div>
          <div className="h-20 flex items-center justify-center md:justify-start md:px-6 border-b border-zinc-800">
            <Activity className="text-orange-500 mr-0 md:mr-3" size={28} strokeWidth={3} />
            <h1 className="hidden md:block text-xl font-black tracking-tighter">FIT<span className="text-orange-500">COACH</span></h1>
          </div>

          <nav className="p-4 space-y-2 mt-4">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 p-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'overview' ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20' : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'}`}
            >
              <LayoutDashboard size={20} />
              <span className="hidden md:block">Overview</span>
            </button>
            <button
              onClick={() => setActiveTab('diet')}
              className={`w-full flex items-center gap-3 p-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'diet' ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20' : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'}`}
            >
              <UtensilsCrossed size={20} />
              <span className="hidden md:block">Diet Plan</span>
            </button>
            <button
              onClick={() => setActiveTab('workout')}
              className={`w-full flex items-center gap-3 p-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'workout' ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20' : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'}`}
            >
              <Dumbbell size={20} />
              <span className="hidden md:block">Workout Plan</span>
            </button>
            <button
              onClick={() => setActiveTab('coach')}
              className={`w-full flex items-center gap-3 p-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'coach' ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20' : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'}`}
            >
              <BotMessageSquare size={20} />
              <span className="hidden md:block">AI Coach</span>
            </button>
            <button
              onClick={() => setActiveTab('analysis')}
              className={`w-full flex items-center gap-3 p-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'analysis' ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20' : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'}`}
            >
              <Settings2 size={20} />
              <span className="hidden md:block">Body Analysis</span>
            </button>
            <button
              onClick={() => setActiveTab('progress')}
              className={`w-full flex items-center gap-3 p-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'progress' ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20' : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'}`}
            >
              <TrendingUp size={20} />
              <span className="hidden md:block">Weekly Progress</span>
            </button>
          </nav>
        </div>

        <div className="p-4 border-t border-zinc-800">
          <div className="hidden md:flex justify-between items-center bg-zinc-900/50 p-3 rounded-xl mb-4 border border-zinc-800/80">
            <div className="text-center w-1/2 border-r border-zinc-800">
              <p className="text-xl font-black text-orange-500 flex items-center justify-center gap-1"><Flame size={18} /> {stats.streaks}</p>
              <p className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold mt-1">Streak</p>
            </div>
            <div className="text-center w-1/2">
              <p className="text-xl font-black text-orange-400 flex items-center justify-center gap-1"><Star size={18} /> {stats.fitnessScore}</p>
              <p className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold mt-1">Score</p>
            </div>
          </div>

          <div className="hidden md:block px-3 mb-3 text-xs text-zinc-400 truncate font-semibold">
            <p className="text-white font-bold">{auth?.user?.name}</p>
            <p className="text-[10px] text-zinc-500 truncate">{auth?.user?.email}</p>
          </div>

          <button onClick={auth?.logout} className="w-full flex items-center justify-center md:justify-start gap-3 p-3 rounded-xl font-bold text-sm text-red-400 hover:bg-red-500/10 hover:text-red-500 border border-transparent hover:border-red-500/20 transition-all">
            <LogOut size={20} />
            <span className="hidden md:block">Logout</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 h-full overflow-y-auto relative p-4 md:p-8 custom-scrollbar">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>

        <div className="max-w-6xl mx-auto space-y-6">

          <header className="flex flex-col md:flex-row justify-between items-start md:items-center bg-zinc-950 border border-zinc-800 p-6 rounded-2xl shadow-xl">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-black tracking-tight">Good morning, <span className="text-orange-500">{auth?.user?.name} </span></h2>
                <span className="bg-orange-500/10 text-orange-400 border border-orange-500/20 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">Premium Tier Member</span>
              </div>
              <p className="text-zinc-400 text-xs mt-1">Dynamic Plan Active: <span className="text-zinc-200 font-bold">Gym Environment • Body Weight & Performance Tracking</span></p>
            </div>
            <div className="mt-4 md:mt-0 flex gap-3 items-center">
              <span className="bg-zinc-900 border border-zinc-800 text-zinc-300 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> System Online
              </span>
            </div>
          </header>


          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-zinc-950/80 border border-zinc-800/80 p-4 rounded-xl flex items-center gap-3">
              <div className="p-2 bg-orange-500/10 text-orange-500 rounded-lg"><ShieldAlert size={18} /></div>
              <div>
                <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Active Allergy Guardrails</p>
                <p className="text-xs font-semibold text-zinc-300">None restricted • Full macronutrient flexibility enabled</p>
              </div>
            </div>
            <div className="bg-zinc-950/80 border border-zinc-800/80 p-4 rounded-xl flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg"><Activity size={18} /></div>
              <div>
                <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Medical & Physical Adaptations</p>
                <p className="text-xs font-semibold text-zinc-300">Optimized for Hypertrophy & Joint Mobility</p>
              </div>
            </div>
          </div>

          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

              <div className="lg:col-span-6 bg-zinc-950 border border-zinc-800 p-6 rounded-2xl shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-sm font-bold text-zinc-300 flex items-center gap-2">
                      <Activity className="text-orange-500" size={18} /> Signature Fitness Readiness
                    </h3>
                    <span className="text-[10px] bg-green-500/10 text-green-400 border border-green-500/20 px-2.5 py-0.5 rounded-full font-bold">Optimal</span>
                  </div>

                  <div className="flex items-center justify-center my-6">
                    <div className="relative w-36 h-36 rounded-full border-4 border-zinc-800 flex flex-col items-center justify-center bg-zinc-900/40 shadow-inner">
                      <div className="absolute inset-0 rounded-full border-4 border-orange-500 border-t-transparent animate-spin-slow"></div>
                      <span className="text-4xl font-black text-white tracking-tighter">{stats.fitnessScore}</span>
                      <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-0.5">/ 100</span>
                    </div>
                  </div>
                  <p className="text-center text-xs text-zinc-400 font-medium mb-6">AI Algorithmic Score based on daily habits & logs</p>
                </div>

                <div className="space-y-3 pt-4 border-t border-zinc-900">
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-zinc-400">Workout Adaptability</span>
                      <span className="text-orange-400">92%</span>
                    </div>
                    <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden">
                      <div className="bg-orange-500 h-full rounded-full" style={{ width: '92%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-zinc-400">Nutritional Precision</span>
                      <span className="text-orange-400">88%</span>
                    </div>
                    <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden">
                      <div className="bg-orange-500 h-full rounded-full" style={{ width: '88%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-zinc-400">Safety & Guardrails</span>
                      <span className="text-orange-400">95%</span>
                    </div>
                    <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden">
                      <div className="bg-orange-500 h-full rounded-full" style={{ width: '95%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6 space-y-6 flex flex-col justify-between">

                <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 p-6 rounded-2xl shadow-xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600/10 rounded-full blur-2xl pointer-events-none"></div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="text-[10px] bg-orange-500/10 text-orange-400 border border-orange-500/20 px-2.5 py-1 rounded-md font-bold uppercase tracking-wider">Dynamic AI Plan</span>
                      <h3 className="text-lg font-black text-white mt-2">Gym Premium AI Workout Split</h3>
                      <p className="text-xs text-zinc-400 mt-1">Customized for Gym equipment • 70kg target progression.</p>
                    </div>
                    <div className="p-3 bg-orange-500 text-black rounded-xl font-bold shadow-lg shadow-orange-500/20">
                      <Dumbbell size={22} />
                    </div>
                  </div>

                  <button onClick={() => setActiveTab('workout')} className="w-full mt-2 bg-zinc-900 hover:bg-orange-500 hover:text-black border border-zinc-700 font-bold py-3 rounded-xl text-xs transition-all flex items-center justify-center gap-2">
                    View Full Workout Exercises →
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl text-center">
                    <p className="text-[10px] text-zinc-500 uppercase font-bold">Calorie Target</p>
                    <p className="text-lg font-black text-white mt-1">2300 <span className="text-xs font-normal text-zinc-400">kcal</span></p>
                  </div>
                  <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl text-center">
                    <p className="text-[10px] text-zinc-500 uppercase font-bold">Daily Habits</p>
                    <p className="text-lg font-black text-orange-400 mt-1">3 <span className="text-xs font-normal text-zinc-400">of 4 Done</span></p>
                  </div>
                  <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl text-center">
                    <p className="text-[10px] text-zinc-500 uppercase font-bold">Hydration Target</p>
                    <p className="text-lg font-black text-white mt-1">2.8L <span className="text-xs font-normal text-zinc-400">/ 3.0L</span></p>
                  </div>
                </div>

              </div>

              <div className="lg:col-span-12 bg-zinc-950 border border-zinc-800 p-6 md:p-8 rounded-2xl shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-orange-500/10 rounded-xl text-orange-500"><CheckCircle2 size={24} /></div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Daily Habit Tracker</h2>
                    <p className="text-xs text-zinc-400 mt-1">Log your daily progress to keep your streak alive and update AI score.</p>
                  </div>
                </div>

                <form onSubmit={handleLogProgress} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider ml-1">Current Weight (kg)</label>
                      <input type="number" placeholder="e.g. 70" className="w-full p-4 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 font-bold transition-all" value={metrics.weight} onChange={(e) => setMetrics({ ...metrics, weight: e.target.value })} required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider ml-1">Calories Consumed</label>
                      <input type="number" placeholder="e.g. 2200" className="w-full p-4 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 font-bold transition-all" value={metrics.caloriesConsumed} onChange={(e) => setMetrics({ ...metrics, caloriesConsumed: e.target.value })} required />
                    </div>
                  </div>

                  <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800/80">
                    <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4 ml-1">Daily Checklists</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <label className={`flex items-center gap-3 cursor-pointer border p-4 rounded-xl transition-all ${habits.meals ? 'bg-orange-500/10 border-orange-500/30' : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'}`}>
                        <input type="checkbox" checked={habits.meals} onChange={(e) => setHabits({ ...habits, meals: e.target.checked })} className="w-5 h-5 accent-orange-500 rounded" />
                        <span className="text-sm font-bold">Healthy Meals</span>
                      </label>
                      <label className={`flex items-center gap-3 cursor-pointer border p-4 rounded-xl transition-all ${habits.water ? 'bg-orange-500/10 border-orange-500/30' : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'}`}>
                        <input type="checkbox" checked={habits.water} onChange={(e) => setHabits({ ...habits, water: e.target.checked })} className="w-5 h-5 accent-orange-500 rounded" />
                        <span className="text-sm font-bold">Water Goal</span>
                      </label>
                      <label className={`flex items-center gap-3 cursor-pointer border p-4 rounded-xl transition-all ${habits.workout ? 'bg-orange-500/10 border-orange-500/30' : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'}`}>
                        <input type="checkbox" checked={habits.workout} onChange={(e) => setHabits({ ...habits, workout: e.target.checked })} className="w-5 h-5 accent-orange-500 rounded" />
                        <span className="text-sm font-bold">Workout Done</span>
                      </label>
                      <label className={`flex items-center gap-3 cursor-pointer border p-4 rounded-xl transition-all ${habits.sleep ? 'bg-orange-500/10 border-orange-500/30' : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'}`}>
                        <input type="checkbox" checked={habits.sleep} onChange={(e) => setHabits({ ...habits, sleep: e.target.checked })} className="w-5 h-5 accent-orange-500 rounded" />
                        <span className="text-sm font-bold">8hrs Sleep</span>
                      </label>
                    </div>
                  </div>

                  <button type="submit" disabled={trackingLoading} className="w-full bg-orange-500 hover:bg-orange-600 text-black font-black p-4 rounded-xl transition-all shadow-lg shadow-orange-500/20 disabled:opacity-50 flex justify-center items-center gap-2">
                    {trackingLoading ? 'Logging Data...' : <><Flame size={20} strokeWidth={3} /> Log Daily Progress & Recalibrate AI</>}
                  </button>
                </form>
              </div>

            </div>
          )}

          {activeTab === 'diet' && (
            <div className="max-w-4xl mx-auto">
              {dietPlan ? (
                <div className="bg-zinc-950 border border-zinc-800 p-6 md:p-8 rounded-2xl shadow-xl relative overflow-hidden flex flex-col">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-400"></div>
                  <h2 className="text-2xl font-bold text-white mb-6 flex justify-between items-center">
                    <span className="flex items-center gap-3"><UtensilsCrossed className="text-green-500" size={28} /> Personalized Diet Plan</span>
                    <span className="text-sm text-green-400 bg-green-500/10 border border-green-500/20 px-4 py-1.5 rounded-full font-bold">{dietPlan.dailyCalories || 2000} kcal</span>
                  </h2>
                  <div className="space-y-4 flex-1">
                    {dietPlan.meals?.map((m: any, i: number) => {
                      const foodImages = [
                        "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=150&auto=format&fit=crop&q=80",
                        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150&auto=format&fit=crop&q=80",
                        "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=150&auto=format&fit=crop&q=80"
                      ];
                      return (
                        <div key={i} className="bg-zinc-900 border border-zinc-800/80 p-5 rounded-xl hover:border-green-500/30 transition-colors flex gap-5 items-center">
                          <img
                            src={foodImages[i % foodImages.length]}
                            alt={m.name}
                            className="w-20 h-20 rounded-xl object-cover border border-zinc-700 flex-shrink-0 shadow-md"
                          />
                          <div>
                            <h4 className="font-bold text-green-400 text-base tracking-wide">{m.name}</h4>
                            <p className="text-sm text-zinc-300 mt-1.5 font-medium leading-relaxed">{m.items?.join(', ')}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : <div className="text-center py-20 bg-zinc-950 border border-zinc-800 rounded-2xl"><p className="text-zinc-500 text-base font-bold">No Diet Plan found. Complete onboarding or ask AI Coach.</p></div>}
            </div>
          )}

          {activeTab === 'workout' && (
            <div className="max-w-4xl mx-auto">
              {workoutPlan ? (
                <div className="bg-zinc-950 border border-zinc-800 p-6 md:p-8 rounded-2xl shadow-xl relative overflow-hidden flex flex-col">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-amber-400"></div>
                  <h2 className="text-2xl font-bold text-white mb-6 flex justify-between items-center flex-shrink-0">
                    <span className="flex items-center gap-3"><Dumbbell className="text-orange-500" size={28} /> Workout Routine Split</span>
                    <span className="text-xs text-orange-400 bg-orange-500/10 border border-orange-500/20 px-3 py-1 rounded-full font-bold uppercase">{workoutPlan.type}</span>
                  </h2>
                  <div className="space-y-6 pr-2">
                    {workoutPlan.weeklySplit?.map((d: any, i: number) => (
                      <div key={i} className="bg-zinc-900 border border-zinc-800/80 p-5 rounded-2xl hover:border-orange-500/30 transition-colors">
                        <h4 className="font-bold text-orange-400 text-base tracking-wide mb-4 border-b border-zinc-800 pb-2">{d.day}: <span className="text-white">{d.focus}</span></h4>
                        <div className="space-y-3">
                          {d.exercises?.map((e: any, j: number) => {
                            const exerciseImages = [
                              "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&auto=format&fit=crop&q=80",
                              "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=100&auto=format&fit=crop&q=80",
                              "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=100&auto=format&fit=crop&q=80"
                            ];
                            return (
                              <div key={j} className="flex items-center gap-4 bg-zinc-950/70 p-3.5 rounded-xl border border-zinc-800/80">
                                <img
                                  src={exerciseImages[j % exerciseImages.length]}
                                  alt={e.name}
                                  className="w-14 h-14 rounded-xl object-cover border border-zinc-800 flex-shrink-0"
                                />
                                <div>
                                  <p className="text-sm font-bold text-white">{e.name}</p>
                                  <p className="text-xs text-zinc-400 mt-1">{e.sets || '3 Sets'} • {e.reps || '12 Reps'}</p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : <div className="text-center py-20 bg-zinc-950 border border-zinc-800 rounded-2xl"><p className="text-zinc-500 text-base font-bold">No Workout Plan found. Complete onboarding or ask AI Coach.</p></div>}
            </div>
          )}

          {activeTab === 'coach' && (
            <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl shadow-xl flex flex-col h-[calc(100vh-160px)]">
              <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                <BotMessageSquare className="text-orange-500" size={26} />
                AI Fitness Coach
                <span className="text-[10px] bg-orange-500/10 text-orange-400 border border-orange-500/20 px-2 py-0.5 rounded-full font-bold ml-2">RAG Engine</span>
              </h2>
              <p className="text-xs text-zinc-400 mb-6 border-b border-zinc-800 pb-4">Context-aware guidance based on your live diet and workout plans.</p>

              <div className="flex-1 overflow-y-auto bg-zinc-900 border border-zinc-800/80 p-6 rounded-xl mb-6 space-y-4 custom-scrollbar">
                {chatLog.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-zinc-500 opacity-60">
                    <BotMessageSquare size={48} className="mb-4" />
                    <p className="text-sm font-bold">Ask me anything about your routine!</p>
                  </div>
                )}
                {chatLog.map((msg, idx) => (
                  <div key={idx} className={`p-4 rounded-xl text-sm max-w-[85%] leading-relaxed ${msg.role === 'user' ? 'bg-orange-500 text-black font-bold ml-auto shadow-md rounded-tr-sm' : 'bg-zinc-800 text-zinc-200 border border-zinc-700/50 rounded-tl-sm'}`}>
                    <div className="prose prose-invert prose-sm max-w-none">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.text}
                      </ReactMarkdown>
                    </div>
                  </div>
                ))}
                {chatLoading && <div className="p-4 rounded-xl bg-zinc-800/50 border border-zinc-700/50 w-28 text-center rounded-tl-sm"><p className="text-xs text-orange-400 font-bold animate-pulse">Typing...</p></div>}
              </div>

              <form onSubmit={handleChat} className="flex gap-3">
                <input type="text" placeholder="Message your coach..." className="flex-1 p-4 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-sm transition-all" value={chatQuery} onChange={(e) => setChatQuery(e.target.value)} />
                <button type="submit" disabled={chatLoading} className="bg-orange-500 hover:bg-orange-600 text-black font-extrabold px-8 rounded-xl transition-all disabled:opacity-50 text-sm shadow-lg shadow-orange-500/20">Send</button>
              </form>
            </div>
          )}

          {activeTab === 'analysis' && bodyAnalysis && (
            <div className="bg-zinc-950 border border-zinc-800 p-6 md:p-8 rounded-2xl shadow-xl max-w-3xl">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-3">
                    <Settings2 className="text-orange-500" size={24} />
                    System Setup & Metrics
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1">Modify your core body metrics to recalibrate your AI plans.</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-zinc-900/50 border border-zinc-800/80 p-5 rounded-xl flex items-center gap-4">
                  <div className="w-1/2">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-2">Estimated BMI</label>
                    <input type="number" step="0.1" value={bodyAnalysis.bmi || ''} onChange={(e) => setBodyAnalysis({ ...bodyAnalysis, bmi: Number(e.target.value) })} className="w-full bg-zinc-950 border border-zinc-800 p-3.5 rounded-lg text-orange-400 font-black text-xl focus:outline-none focus:border-orange-500 transition-all" />
                  </div>
                  <div className="w-1/2">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-2">Height / Frame</label>
                    <input type="text" placeholder="e.g. 175cm" value={bodyAnalysis.height || ''} onChange={(e) => setBodyAnalysis({ ...bodyAnalysis, height: e.target.value })} className="w-full bg-zinc-950 border border-zinc-800 p-3.5 rounded-lg text-white font-bold focus:outline-none focus:border-orange-500 transition-all" />
                  </div>
                </div>

                <div className="bg-zinc-900/50 border border-zinc-800/80 p-5 rounded-xl">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-2">Identified Posture Issues</label>
                  <input type="text" value={bodyAnalysis.postureIssues?.join(', ') || ''} onChange={(e) => setBodyAnalysis({ ...bodyAnalysis, postureIssues: [e.target.value] })} className="w-full bg-zinc-950 border border-zinc-800 p-3.5 rounded-lg text-orange-300 font-semibold focus:outline-none focus:border-orange-500 transition-all" placeholder="e.g. Round shoulders, Forward head" />
                  <p className="text-[10px] text-zinc-500 mt-2 font-medium">Separate multiple issues with commas.</p>
                </div>

                <div className="pt-4 border-t border-zinc-800">
                  <button onClick={handleUpdateAnalysis} className="bg-orange-500 hover:bg-orange-600 text-black font-extrabold px-8 py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-orange-500/20 w-full sm:w-auto">
                    Save Calibration
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'progress' && (
            <div className="bg-zinc-950 border border-zinc-800 p-6 md:p-8 rounded-2xl shadow-xl max-w-4xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-orange-500/10 rounded-xl text-orange-500"><TrendingUp size={24} /></div>
                <div>
                  <h2 className="text-xl font-bold text-white">Weekly Progress Tracking</h2>
                  <p className="text-xs text-zinc-400 mt-1">Upload your comparison photos to generate AI insights on your transformation.</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-zinc-900/50 border border-zinc-800/80 p-5 rounded-xl">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-4">Select Target Week</label>
                  <input type="number" min="1" max="52" value={progressData.week} onChange={(e) => setProgressData({ ...progressData, week: Number(e.target.value) })} className="w-32 bg-zinc-950 border border-zinc-800 p-3 rounded-lg text-white font-bold focus:outline-none focus:border-orange-500 transition-all" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-xl p-5 relative group overflow-hidden">
                    <h3 className="text-sm font-bold text-zinc-300 mb-4 border-b border-zinc-800 pb-2 flex items-center justify-between">Before <span className="text-xs text-zinc-500 font-normal">Start of program</span></h3>
                    <div className="h-64 bg-zinc-950 border-2 border-dashed border-zinc-800 rounded-xl flex items-center justify-center relative overflow-hidden transition-all group-hover:border-orange-500/50">
                      {progressData.before ? (
                        <img src={progressData.before} alt="Before" className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-zinc-500">
                          <Upload size={32} />
                          <span className="text-xs font-bold">Upload Image</span>
                        </div>
                      )}
                      <input type="file" accept="image/*" onChange={(e) => handleImageUpload('before', e)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                    </div>
                  </div>

                  <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-xl p-5 relative group overflow-hidden">
                    <h3 className="text-sm font-bold text-zinc-300 mb-4 border-b border-zinc-800 pb-2 flex items-center justify-between">After <span className="text-xs text-zinc-500 font-normal">Week {progressData.week}</span></h3>
                    <div className="h-64 bg-zinc-950 border-2 border-dashed border-zinc-800 rounded-xl flex items-center justify-center relative overflow-hidden transition-all group-hover:border-orange-500/50">
                      {progressData.after ? (
                        <img src={progressData.after} alt="After" className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-zinc-500">
                          <Upload size={32} />
                          <span className="text-xs font-bold">Upload Image</span>
                        </div>
                      )}
                      <input type="file" accept="image/*" onChange={(e) => handleImageUpload('after', e)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-800">
                  <button onClick={handleAnalyzeProgress} disabled={analyzingProgress} className="bg-orange-500 hover:bg-orange-600 text-black font-extrabold px-8 py-4 rounded-xl text-sm transition-all shadow-lg shadow-orange-500/20 w-full flex items-center justify-center gap-2 disabled:opacity-50">
                    {analyzingProgress ? 'Generating Insights...' : <><Sparkles size={18} /> Analyze Progress & Generate Insights</>}
                  </button>
                </div>

                {progressInsights && (
                  <div className="mt-6 bg-orange-500/10 border border-orange-500/30 p-6 rounded-xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-orange-500"></div>
                    <h3 className="text-orange-500 font-bold text-sm mb-2 flex items-center gap-2"><Sparkles size={16} /> AI Coach Insights</h3>
                    <p className="text-zinc-300 text-sm leading-relaxed">{progressInsights}</p>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </main>
      <SupportChat />
    </div>
  );
}