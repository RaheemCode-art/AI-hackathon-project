"use client";

import { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { Send, MessageSquare, X } from 'lucide-react';

export default function SupportChat({ adminTargetUserId }: { adminTargetUserId?: string }) {
  const auth = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState('');
  
  const isAdmin = auth?.user?.role === 'admin';
  const activeUserId = isAdmin ? adminTargetUserId : auth?.user?._id;

  useEffect(() => {
    let interval: any;
    if ((isAdmin && adminTargetUserId) || (!isAdmin && isOpen)) {
      fetchMessages();
      interval = setInterval(fetchMessages, 2000);
    }
    return () => clearInterval(interval);
  }, [isOpen, adminTargetUserId, isAdmin]);

  const fetchMessages = async () => {
    try {
      const url = isAdmin && activeUserId ? `/support?userId=${activeUserId}` : '/support';
      const res = await api.get(url);
      setMessages(res.data);
    } catch (error) {
      console.error("Failed to load messages");
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      await api.post('/support', { 
        message: text, 
        recipientUserId: isAdmin ? activeUserId : undefined 
      });
      setText('');
      fetchMessages();
    } catch (error) {
      alert("Failed to send message");
    }
  };

  if (isAdmin && !adminTargetUserId) return null;

  return (
    <div className={isAdmin ? "w-full h-full flex flex-col bg-zinc-950 rounded-2xl overflow-hidden" : "fixed bottom-6 right-6 z-50"}>
      {!isAdmin && !isOpen ? (
        <button onClick={() => setIsOpen(true)} className="bg-orange-500 hover:bg-orange-600 text-black p-4 rounded-full shadow-2xl font-bold flex items-center gap-2 transition-all">
          <MessageSquare size={24} /> Live Support
        </button>
      ) : (
        <div className={isAdmin ? "w-full h-full flex flex-col bg-zinc-950" : "bg-zinc-950 border border-zinc-800 w-80 md:w-96 h-[450px] rounded-2xl shadow-2xl flex flex-col overflow-hidden"}>
          {!isAdmin && (
            <div className="bg-zinc-900 p-4 border-b border-zinc-800 flex justify-between items-center flex-shrink-0">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span> Chat with Admin
              </h3>
              <button onClick={() => setIsOpen(false)} className="text-zinc-400 hover:text-white"><X size={18} /></button>
            </div>
          )}

          <div className="flex-1 p-4 overflow-y-auto space-y-3 custom-scrollbar bg-zinc-950/50">
            {messages.map((m, idx) => {
              const isMyMessage = isAdmin ? m.sender === 'admin' : m.sender === 'user';
              return (
                <div key={idx} className={`p-3 rounded-xl text-xs max-w-[85%] leading-relaxed ${isMyMessage ? 'bg-orange-500 text-black font-bold ml-auto shadow-md' : 'bg-zinc-800 text-white border border-zinc-700'}`}>
                  <p>{m.message}</p>
                </div>
              );
            })}
            {messages.length === 0 && <p className="text-center text-zinc-500 text-xs my-auto pt-24">No messages yet. Start conversation...</p>}
          </div>

          <form onSubmit={handleSend} className="p-3 bg-zinc-900 border-t border-zinc-800 flex gap-2 flex-shrink-0">
            <input type="text" placeholder="Type your message..." value={text} onChange={(e) => setText(e.target.value)} className="flex-1 bg-zinc-950 border border-zinc-800 px-3 py-2.5 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500" />
            <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-black px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center"><Send size={14} /></button>
          </form>
        </div>
      )}
    </div>
  );
}