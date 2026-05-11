import React, { useState } from 'react';
import { UserProfile } from '../types';
import { ArrowLeft, CreditCard, Apple, Wallet, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

interface Props {
  lawyer: UserProfile;
  onBack: () => void;
  onSuccess: () => void;
}

export default function Checkout({ lawyer, onBack, onSuccess }: Props) {
  const [method, setMethod] = useState<'visa' | 'apple' | 'bizum' | null>(null);

  return (
    <div className="min-h-screen bg-[#0a192f] p-4">
      <header className="mb-12 flex items-center gap-4">
        <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-full transition-colors">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h2 className="text-3xl font-black italic uppercase tracking-tighter">MÉTODOS DE PAGO</h2>
      </header>

      <div className="space-y-4 max-w-2xl mx-auto">
        <button
          onClick={() => setMethod('visa')}
          className={`flex w-full items-center justify-between rounded-3xl p-6 transition-all ${
            method === 'visa' ? 'bg-[#1ba098] text-[#051622] scale-[1.02] shadow-2xl' : 'bg-white/5 text-white ring-1 ring-white/10'
          }`}
        >
          <div className="flex items-center gap-4">
            <div className={`rounded-xl p-3 ${method === 'visa' ? 'bg-white/20' : 'bg-[#1ba098]/20'}`}>
              <CreditCard className={`h-8 w-8 ${method === 'visa' ? 'text-[#051622]' : 'text-[#1ba098]'}`} />
            </div>
            <div className="text-left font-bold uppercase tracking-tight italic">
              <p className="text-lg">Tarjetas guardadas</p>
              <p className={`text-xs ${method === 'visa' ? 'text-[#051622]/60' : 'text-white/40'}`}>VISA • **** 4582</p>
            </div>
          </div>
          {method === 'visa' && <CheckCircle2 className="h-8 w-8" />}
        </button>

        <button
          onClick={() => setMethod('apple')}
          className={`flex w-full items-center justify-between rounded-3xl p-6 transition-all ${
            method === 'apple' ? 'bg-[#1ba098] text-[#051622] scale-[1.02] shadow-2xl' : 'bg-white/5 text-white ring-1 ring-white/10'
          }`}
        >
          <div className="flex items-center gap-4">
            <div className={`rounded-xl p-3 ${method === 'apple' ? 'bg-white/20' : 'bg-white/10'}`}>
              <Apple className={`h-8 w-8 ${method === 'apple' ? 'text-[#051622]' : 'text-white'}`} />
            </div>
            <p className="text-lg font-bold uppercase tracking-tight italic">Apple Pay</p>
          </div>
          {method === 'apple' && <CheckCircle2 className="h-8 w-8" />}
        </button>

        <button
          onClick={() => setMethod('bizum')}
          className={`flex w-full items-center justify-between rounded-3xl p-6 transition-all ${
            method === 'bizum' ? 'bg-[#1ba098] text-[#051622] scale-[1.02] shadow-2xl' : 'bg-white/5 text-white ring-1 ring-white/10'
          }`}
        >
          <div className="flex items-center gap-4">
            <div className={`rounded-xl bg-emerald-500/20 p-3`}>
              <Wallet className={`h-8 w-8 text-emerald-400`} />
            </div>
            <p className="text-lg font-bold uppercase tracking-tight italic">Bizum Directo</p>
          </div>
          {method === 'bizum' && <CheckCircle2 className="h-8 w-8" />}
        </button>

        <button className="w-full rounded-3xl border-2 border-dashed border-white/10 py-6 text-sm font-black uppercase tracking-widest text-white/20 hover:border-[#1ba098] hover:text-white transition-all italic">
          + Añadir nuevo método
        </button>
      </div>

      <div className="mt-12 rounded-[2.5rem] bg-white/5 p-8 ring-1 ring-white/10 backdrop-blur-xl max-w-2xl mx-auto shadow-2xl">
        <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
          <span className="text-white/40 font-bold uppercase text-xs tracking-widest italic">Expediente Jurídico</span>
          <span className="font-black italic tracking-tighter uppercase">{lawyer.name}</span>
        </div>
        <div className="flex items-center justify-between text-4xl font-black italic tracking-tighter uppercase">
          <span>Total</span>
          <span className="text-[#1ba098]">{lawyer.pricePerConsultation}€</span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto mt-12">
        <button
          onClick={onSuccess}
          disabled={!method}
          className="w-full rounded-3xl bg-[#1ba098] py-6 font-black italic uppercase tracking-widest text-[#051622] disabled:opacity-30 shadow-[0_15px_40px_rgba(27,160,152,0.5)] transition-all hover:scale-[1.01] active:scale-95"
        >
          PERFECCIONAR PAGO
        </button>
      </div>
    </div>
  );
}
