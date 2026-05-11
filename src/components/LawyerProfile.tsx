import React from 'react';
import { UserProfile } from '../types';
import { ArrowLeft, MapPin, Star, MessageSquare, ShieldCheck, Calendar } from 'lucide-react';
import { motion } from 'motion/react';

interface Props {
  lawyer: UserProfile;
  onBack: () => void;
  onHire: () => void;
  onMessage: () => void;
}

export default function LawyerProfile({ lawyer, onBack, onHire, onMessage }: Props) {
  return (
    <div className="min-h-screen bg-[#0a192f]">
      <header className="sticky top-0 z-10 flex h-20 items-center justify-between px-8 glass border-b border-white/10">
        <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-full transition-colors">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h2 className="text-xl font-black italic uppercase tracking-tighter">Perfil del Profesional</h2>
        <div className="w-10" />
      </header>

      <main className="px-8 py-12 max-w-4xl mx-auto">
        <div className="mb-12 flex flex-col md:flex-row items-center md:items-start gap-8 text-center md:text-left">
          <div className="h-40 w-40 overflow-hidden rounded-[2rem] ring-4 ring-[#1ba098]/20 shadow-2xl">
            <img src={lawyer.photoURL} alt={lawyer.name} className="h-full w-full object-cover" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <h1 className="text-4xl font-black italic tracking-tighter uppercase">{lawyer.name}</h1>
              {lawyer.verified && <ShieldCheck className="h-7 w-7 text-[#1ba098]" />}
            </div>
            <p className="text-[#1ba098] font-bold text-lg mt-1 italic uppercase tracking-widest">{lawyer.specialty}</p>
            <div className="mt-4 flex items-center justify-center md:justify-start gap-2">
              <div className="flex items-center gap-1 text-yellow-500">
                <Star className="h-5 w-5 fill-current" />
                <span className="font-black text-xl">{lawyer.rating}</span>
              </div>
              <span className="text-white/40 text-sm font-medium">({lawyer.reviewCount} valoraciones verificadas)</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur-sm">
            <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.2em] mb-2">Despacho Principal</p>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-[#1ba098]" />
              <span className="text-xl font-bold italic">{lawyer.location}</span>
            </div>
          </div>
          <div className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur-sm">
            <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.2em] mb-2">Tarifa Profesional</p>
            <p className="text-3xl font-black italic text-[#1ba098]">{lawyer.pricePerConsultation}€ <span className="text-sm font-normal text-white/40 not-italic">/ sesión</span></p>
          </div>
        </div>

        <section className="mb-12">
          <h3 className="text-2xl font-black italic uppercase italic mb-6 border-b border-white/10 pb-2">Sobre la práctica</h3>
          <p className="text-white/60 leading-relaxed text-lg italic">
            {lawyer.description}
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
        </section>

        <section className="mb-32">
          <h3 className="text-2xl font-black italic uppercase mb-6 border-b border-white/10 pb-2">Áreas de Especialización</h3>
          <div className="flex flex-wrap gap-3">
            {['Derecho de Familia', 'Sucesiones', 'Contratos', 'Litigación Estratégica', 'Derecho Digital'].map(tag => (
              <span key={tag} className="rounded-full bg-white/5 px-6 py-3 text-sm font-bold border border-white/10 hover:border-[#1ba098]/40 transition-colors">
                {tag}
              </span>
            ))}
          </div>
        </section>
      </main>

      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-2xl z-20">
        <div className="glass p-4 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col sm:flex-row gap-3">
          <button 
            onClick={onMessage}
            className="flex-1 flex items-center justify-center gap-2 rounded-2xl border-2 border-[#1ba098] py-4 font-black italic uppercase tracking-widest text-[#1ba098] hover:bg-[#1ba098]/10 transition-all"
          >
            <MessageSquare className="h-5 w-5" />
            ENVIAR MENSAJE
          </button>
          <button 
            onClick={onHire}
            className="flex-1 rounded-2xl bg-[#1ba098] py-4 font-black italic uppercase tracking-widest text-[#051622] shadow-[0_10px_30px_rgba(27,160,152,0.4)] hover:brightness-110 active:scale-95 transition-all"
          >
            CONTRATAR AHORA
          </button>
        </div>
      </div>
    </div>
  );
}
