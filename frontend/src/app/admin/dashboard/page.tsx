"use client";

import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import api from '../../../utils/api';
import { useRouter } from 'next/navigation';
import SupportChat from '../../../components/SupportChat';
import { Users, UserCheck, Activity, LogOut, ShieldAlert, Ban, CheckCircle, Edit3, X, Save, MessageSquare, TrendingUp, BarChart3 } from 'lucide-react';

export default function AdminDashboard() {
  const auth = useContext(AuthContext);
  const router = useRouter();
  
  const [analytics, setAnalytics] = useState({ totalUsers: 0, activeUsers: 0, avgFitnessScore: 0 });
  const [users, setUsers] = useState<any[]>([]);
  const [chatLogs, setChatLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [activeTab, setActiveTab] = useState('users');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [userPlans, setUserPlans] = useState<any[]>([]);
  const [editingPlan, setEditingPlan] = useState<any>(null);
  const [planContentString, setPlanContentString] = useState('');

  const [supportUser, setSupportUser] = useState<any>(null);

  useEffect(() => {
    if (!auth?.loading) {
      if (!auth?.user || auth.user.role !== 'admin') {
        router.push('/login');
      } else {
        fetchAdminData();
      }
    }
  }, [auth, router]);

  const fetchAdminData = async () => {
    try {
      const [analyticsRes, usersRes, chatsRes] = await Promise.all([
        api.get('/admin/analytics'),
        api.get('/admin/users'),
        api.get('/admin/chatlogs')
      ]);
      setAnalytics(analyticsRes.data);
      setUsers(usersRes.data);
      setChatLogs(chatsRes.data);
    } catch (error) {
      alert("Failed to fetch admin data.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'banned' : 'active';
    try {
      await api.put('/admin/users/status', { userId, status: newStatus });
      fetchAdminData(); 
    } catch (error) {
      alert("Failed to update user status.");
    }
  };

  const fetchUserPlans = async (user: any) => {
    setSelectedUser(user);
    try {
      const res = await api.get(`/admin/users/${user._id}/plans`);
      setUserPlans(res.data);
    } catch (error) {
      alert("Failed to fetch user plans.");
    }
  };

  const handleEditPlan = (plan: any) => {
    setEditingPlan(plan);
    setPlanContentString(JSON.stringify(plan.content, null, 2));
  };

  const handleSavePlanOverride = async () => {
    try {
      const parsedContent = JSON.parse(planContentString);
      await api.put(`/admin/plans/${editingPlan._id}`, { content: parsedContent });
      alert("Plan overridden successfully.");
      setEditingPlan(null);
      fetchUserPlans(selectedUser);
    } catch (error) {
      alert("Invalid JSON format or server error.");
    }
  };

  if (auth?.loading || loading) return <div className="min-h-screen bg-black text-orange-500 flex items-center justify-center font-black tracking-widest uppercase">Loading Command Center...</div>;

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8 selection:bg-orange-500 selection:text-black relative overflow-hidden">
      
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-red-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-orange-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        
        <div className="flex flex-col md:flex-row justify-between items-center bg-zinc-950 p-6 rounded-2xl shadow-2xl border border-zinc-800 border-b-4 border-b-red-600 gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-500/10 rounded-xl text-red-500">
              <ShieldAlert size={36} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-white">Admin Command Center</h1>
              <p className="text-sm text-zinc-400 font-medium mt-1">System Analytics, Graphs & Override Controls</p>
            </div>
          </div>
          <button 
            onClick={auth?.logout} 
            className="flex items-center gap-2 bg-zinc-900 border border-zinc-700 hover:border-red-500 hover:text-red-500 px-6 py-3 rounded-xl font-bold transition-all text-sm group"
          >
            <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
            Logout
          </button>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-zinc-950 p-6 rounded-2xl shadow-xl border border-zinc-800 border-l-4 border-l-orange-500 relative overflow-hidden group">
            <div className="absolute right-[-5%] top-[-10%] opacity-5 group-hover:opacity-10 transition-opacity"><Users size={120} /></div>
            <div className="flex justify-between items-center mb-4 relative z-10">
              <h3 className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Total Users</h3>
              <Users className="text-orange-500" size={24} />
            </div>
            <p className="text-5xl font-black relative z-10 text-white">{analytics.totalUsers}</p>
          </div>
          <div className="bg-zinc-950 p-6 rounded-2xl shadow-xl border border-zinc-800 border-l-4 border-l-green-500 relative overflow-hidden group">
            <div className="absolute right-[-5%] top-[-10%] opacity-5 group-hover:opacity-10 transition-opacity"><UserCheck size={120} /></div>
            <div className="flex justify-between items-center mb-4 relative z-10">
              <h3 className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Active Users</h3>
              <UserCheck className="text-green-500" size={24} />
            </div>
            <p className="text-5xl font-black relative z-10 text-white">{analytics.activeUsers}</p>
          </div>
          <div className="bg-zinc-950 p-6 rounded-2xl shadow-xl border border-zinc-800 border-l-4 border-l-red-500 relative overflow-hidden group">
            <div className="absolute right-[-5%] top-[-10%] opacity-5 group-hover:opacity-10 transition-opacity"><Activity size={120} /></div>
            <div className="flex justify-between items-center mb-4 relative z-10">
              <h3 className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Avg Fitness Score</h3>
              <Activity className="text-red-500" size={24} />
            </div>
            <p className="text-5xl font-black relative z-10 text-white">{analytics.avgFitnessScore}</p>
          </div>
        </div>

        {/* Visual Analytics Graphs Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-bold text-white flex items-center gap-2"><TrendingUp size={18} className="text-orange-500"/> User Growth & Activity Trend</h3>
              <span className="text-[10px] bg-orange-500/10 text-orange-400 px-2.5 py-1 rounded-md font-bold uppercase">Weekly</span>
            </div>
            {/* Custom Bar Graph */}
            <div className="h-48 flex items-end justify-between gap-4 pt-6 px-2 border-b border-zinc-800">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => {
                const heights = ['40%', '65%', '50%', '80%', '70%', '95%', '85%'];
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <div className="w-full bg-gradient-to-t from-orange-600 to-orange-400 rounded-t-lg transition-all group-hover:brightness-125 relative" style={{ height: heights[idx] }}>
                      <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-orange-400 opacity-0 group-hover:opacity-100 transition-opacity">{heights[idx]}</span>
                    </div>
                    <span className="text-[10px] font-bold text-zinc-500 uppercase">{day}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl shadow-xl flex flex-col justify-between">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2"><BarChart3 size={18} className="text-green-500"/> System Engagement Distribution</h3>
              <span className="text-[10px] bg-green-500/10 text-green-400 px-2.5 py-1 rounded-md font-bold uppercase">Realtime</span>
            </div>
            <div className="space-y-4 my-auto">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className="text-zinc-300">Active Workouts & Plans Generated</span>
                  <span className="text-orange-400">85%</span>
                </div>
                <div className="w-full bg-zinc-900 h-3 rounded-full overflow-hidden p-0.5 border border-zinc-800">
                  <div className="bg-gradient-to-r from-orange-600 to-amber-500 h-full rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className="text-zinc-300">Daily Habit Trackers Logged</span>
                  <span className="text-green-400">72%</span>
                </div>
                <div className="w-full bg-zinc-900 h-3 rounded-full overflow-hidden p-0.5 border border-zinc-800">
                  <div className="bg-gradient-to-r from-green-600 to-emerald-400 h-full rounded-full" style={{ width: '72%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className="text-zinc-300">Live Support Chat Resolution</span>
                  <span className="text-blue-400">94%</span>
                </div>
                <div className="w-full bg-zinc-900 h-3 rounded-full overflow-hidden p-0.5 border border-zinc-800">
                  <div className="bg-gradient-to-r from-blue-600 to-cyan-400 h-full rounded-full" style={{ width: '94%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-4 border-b border-zinc-800 pb-2">
          <button onClick={() => setActiveTab('users')} className={`px-6 py-3 font-bold text-sm rounded-t-xl transition-all ${activeTab === 'users' ? 'bg-zinc-900 text-white border-b-2 border-orange-500' : 'text-zinc-500 hover:text-white'}`}>User & Plan Management</button>
          <button onClick={() => setActiveTab('chats')} className={`px-6 py-3 font-bold text-sm rounded-t-xl transition-all ${activeTab === 'chats' ? 'bg-zinc-900 text-white border-b-2 border-orange-500' : 'text-zinc-500 hover:text-white'}`}>AI Chat Moderation Logs</button>
          <button onClick={() => setActiveTab('support')} className={`px-6 py-3 font-bold text-sm rounded-t-xl transition-all ${activeTab === 'support' ? 'bg-zinc-900 text-white border-b-2 border-orange-500' : 'text-zinc-500 hover:text-white'}`}>Live Support Chats</button>
        </div>

        {activeTab === 'users' && (
          <div className="bg-zinc-950 rounded-2xl shadow-2xl border border-zinc-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="bg-zinc-900 text-zinc-400 text-[10px] uppercase tracking-widest font-bold">
                    <th className="p-5 border-b border-zinc-800">Name</th>
                    <th className="p-5 border-b border-zinc-800">Email</th>
                    <th className="p-5 border-b border-zinc-800">Score</th>
                    <th className="p-5 border-b border-zinc-800">Status</th>
                    <th className="p-5 border-b border-zinc-800 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {users.map((user) => (
                    <tr key={user._id} className="border-b border-zinc-800/50 hover:bg-zinc-900/50 transition-colors">
                      <td className="p-5 font-bold text-white">{user.name}</td>
                      <td className="p-5 text-zinc-400 font-medium">{user.email}</td>
                      <td className="p-5 font-black text-orange-400 text-lg">{user.fitnessScore}</td>
                      <td className="p-5">
                        <span className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${user.status === 'active' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="p-5 text-right flex justify-end gap-2">
                        {user.role !== 'admin' && (
                          <>
                            <button onClick={() => setSupportUser(user)} className="flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-xs transition-all shadow-sm bg-orange-500/10 text-orange-400 hover:bg-orange-500 hover:text-black border border-orange-500/20">
                              <MessageSquare size={14} strokeWidth={3} /> Support Chat
                            </button>
                            <button onClick={() => fetchUserPlans(user)} className="flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-xs transition-all shadow-sm bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white border border-blue-500/20">
                              <Edit3 size={14} strokeWidth={3} /> Override Plans
                            </button>
                            <button onClick={() => handleStatusChange(user._id, user.status)} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-xs transition-all shadow-sm ${user.status === 'active' ? 'bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20' : 'bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white border border-green-500/20'}`}>
                              {user.status === 'active' ? <><Ban size={14} strokeWidth={3} /> Ban User</> : <><CheckCircle size={14} strokeWidth={3} /> Activate</>}
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'chats' && (
          <div className="bg-zinc-950 rounded-2xl shadow-2xl border border-zinc-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="bg-zinc-900 text-zinc-400 text-[10px] uppercase tracking-widest font-bold">
                    <th className="p-5 border-b border-zinc-800">User</th>
                    <th className="p-5 border-b border-zinc-800">Query</th>
                    <th className="p-5 border-b border-zinc-800">AI Response</th>
                    <th className="p-5 border-b border-zinc-800">Date</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {chatLogs.map((log) => (
                    <tr key={log._id} className="border-b border-zinc-800/50 hover:bg-zinc-900/50 transition-colors">
                      <td className="p-5 font-bold text-orange-400">{log.userId?.name || 'Unknown'}</td>
                      <td className="p-5 text-white max-w-xs truncate">{log.query}</td>
                      <td className="p-5 text-zinc-400 max-w-md truncate">{log.response}</td>
                      <td className="p-5 text-zinc-500 text-xs">{new Date(log.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                  {chatLogs.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-12 text-center text-zinc-500 font-bold">No chat logs found in the system.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'support' && (
          <div className="bg-zinc-950 rounded-2xl shadow-2xl border border-zinc-800 p-6">
            <h2 className="text-xl font-bold mb-4">Select User to Start Live Support</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {users.filter(u => u.role !== 'admin').map(user => (
                <div key={user._id} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-white">{user.name}</h3>
                    <p className="text-xs text-zinc-400">{user.email}</p>
                  </div>
                  <button onClick={() => setSupportUser(user)} className="bg-orange-500 hover:bg-orange-600 text-black px-4 py-2 rounded-lg text-xs font-bold transition-all">
                    Open Chat
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {selectedUser && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-zinc-800">
              <h2 className="text-xl font-bold">Manage Plans: <span className="text-orange-500">{selectedUser.name}</span></h2>
              <button onClick={() => { setSelectedUser(null); setEditingPlan(null); }} className="text-zinc-500 hover:text-white bg-zinc-900 p-2 rounded-lg"><X size={20} /></button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              {!editingPlan ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userPlans.map(plan => (
                    <div key={plan._id} className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl">
                      <h3 className="text-lg font-bold capitalize text-white mb-2">{plan.type} Plan</h3>
                      <p className="text-xs text-zinc-400 mb-4">Source: {plan.source}</p>
                      <button onClick={() => handleEditPlan(plan)} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg text-sm flex items-center justify-center gap-2 transition-all">
                        <Edit3 size={16} /> Edit JSON Content
                      </button>
                    </div>
                  ))}
                  {userPlans.length === 0 && <p className="text-zinc-500 text-sm">No plans generated by this user yet.</p>}
                </div>
              ) : (
                <div className="flex flex-col h-full h-[500px]">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-zinc-300">Editing Mode (Raw JSON)</h3>
                    <button onClick={() => setEditingPlan(null)} className="text-xs text-zinc-400 hover:text-white">Cancel Edit</button>
                  </div>
                  <textarea 
                    value={planContentString}
                    onChange={(e) => setPlanContentString(e.target.value)}
                    className="flex-1 w-full bg-zinc-900 border border-zinc-700 rounded-xl p-4 text-green-400 font-mono text-xs focus:outline-none focus:border-orange-500 custom-scrollbar resize-none"
                  />
                  <button onClick={handleSavePlanOverride} className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-green-500/20">
                    <Save size={18} /> Save & Override Plan
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {supportUser && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl w-full max-w-xl h-[600px] flex flex-col overflow-hidden relative">
            <div className="flex justify-between items-center px-6 py-4 border-b border-zinc-800 bg-zinc-900 flex-shrink-0">
              <div>
                <h2 className="text-base font-bold text-white">Live Support Chat: <span className="text-orange-500">{supportUser.name}</span></h2>
                <p className="text-xs text-zinc-400">{supportUser.email}</p>
              </div>
              <button onClick={() => setSupportUser(null)} className="text-zinc-400 hover:text-white bg-zinc-800 p-2 rounded-xl transition-colors"><X size={18} /></button>
            </div>
            <div className="flex-1 overflow-hidden flex flex-col relative">
              <SupportChat adminTargetUserId={supportUser._id} />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}