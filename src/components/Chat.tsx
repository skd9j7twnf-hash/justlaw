import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, Message } from '../types';
import { ArrowLeft, Send, Paperclip } from 'lucide-react';
import { auth, db } from '../lib/firebase';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { motion } from 'motion/react';

interface Props {
  lawyer: UserProfile | null;
  onBack: () => void;
}

export default function ChatModule({ lawyer, onBack }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // In a real app, we would query a specific chatId
    // For this prototype, we'll use a global messages collection for the demo
    const q = query(collection(db, 'messages'), orderBy('timestamp', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message));
      setMessages(msgs);
      setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    });
    return unsubscribe;
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !auth.currentUser) return;

    try {
      await addDoc(collection(db, 'messages'), {
        senderId: auth.currentUser.uid,
        text: newMessage,
        timestamp: serverTimestamp(),
      });
      setNewMessage('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex h-screen flex-col bg-[#0a192f]">
      <header className="flex h-20 items-center gap-4 px-8 glass border-b border-white/10">
        <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-full transition-colors">
          <ArrowLeft className="h-6 w-6" />
        </button>
        {lawyer && (
          <div className="flex items-center gap-3">
            <img src={lawyer.photoURL} alt="" className="h-12 w-12 rounded-2xl object-cover ring-2 ring-[#1ba098]/20" />
            <div>
              <h3 className="font-bold text-lg italic uppercase tracking-tighter leading-none">{lawyer.name}</h3>
              <p className="text-[10px] text-[#1ba098] font-black uppercase mt-1 tracking-widest">Conectado • Guardia 24/7</p>
            </div>
          </div>
        )}
      </header>

      <div className="flex-1 overflow-y-auto p-8 space-y-6">
        {messages.map((msg) => {
          const isMe = msg.senderId === auth.currentUser?.uid;
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] rounded-3xl px-6 py-4 shadow-xl ${
                isMe ? 'bg-[#1ba098] text-[#051622] rounded-tr-none font-medium' : 'bg-white/5 border border-white/10 text-white rounded-tl-none italic'
              }`}>
                <p className="text-sm leading-relaxed">{msg.text}</p>
                <p className={`text-[9px] mt-2 font-bold uppercase tracking-tighter ${isMe ? 'text-[#051622]/50' : 'text-white/30'}`}>
                  {msg.timestamp?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || 'Transfiriendo...'}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={scrollRef} />
      </div>

      <div className="p-6 glass">
        <form onSubmit={handleSend} className="flex items-center gap-4 max-w-4xl mx-auto">
          <button type="button" className="p-3 text-white/30 hover:text-[#1ba098] transition-colors">
            <Paperclip className="h-6 w-6" />
          </button>
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Escribe un mensaje confidencial..."
              className="w-full rounded-2xl bg-white/5 py-4 px-6 outline-none ring-1 ring-white/10 focus:ring-[#1ba098]/50 transition-all placeholder:italic placeholder:text-white/20"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
          </div>
          <button 
            type="submit"
            className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1ba098] text-[#051622] shadow-[0_5px_15px_rgba(27,160,152,0.4)] hover:scale-105 active:scale-95 transition-all"
          >
            <Send className="h-6 w-6" />
          </button>
        </form>
      </div>
    </div>
  );
}
