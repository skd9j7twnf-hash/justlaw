import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { VerificationRequest, UserProfile } from '../types';
import { ShieldCheck, XCircle, CheckCircle2, ArrowLeft, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

export default function AdminPanel({ onBack }: { onBack: () => void }) {
  const [requests, setRequests] = useState<VerificationRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'verificationRequests'), where('status', '==', 'pending'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const reqs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as VerificationRequest));
      setRequests(reqs);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleAction = async (request: VerificationRequest, approve: boolean) => {
    try {
      // Update request status
      await updateDoc(doc(db, 'verificationRequests', request.id), {
        status: approve ? 'approved' : 'rejected'
      });

      // If approved, update user verified status
      if (approve) {
        await updateDoc(doc(db, 'users', request.lawyerId), {
          verified: true
        });
      }
    } catch (error) {
      console.error("Action failed", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#051622] p-8">
      <header className="mb-12 flex items-center gap-4">
        <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-full">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-3xl font-black italic tracking-tighter uppercase">Panel de Verificación</h1>
      </header>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#1ba098]" />
        </div>
      ) : requests.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-white/10 p-12 text-center text-white/30 italic">
          No hay solicitudes pendientes de revisión.
        </div>
      ) : (
        <div className="grid gap-6">
          {requests.map(req => (
            <div key={req.id} className="rounded-3xl border border-white/10 bg-white/5 p-8 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-[#1ba098] mb-1">Solicitud # {req.id.slice(0, 8)}</p>
                <h3 className="text-xl font-bold italic tracking-tight">Licencia: {req.licenseNumber}</h3>
                <p className="text-white/40 text-sm mt-1">{req.collegeName}</p>
                <p className="text-xs text-white/20 mt-2">Lawyer ID: {req.lawyerId}</p>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={() => handleAction(req, false)}
                  className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-rose-500 hover:bg-rose-500/20 transition-all"
                >
                  <XCircle className="h-6 w-6" />
                </button>
                <button 
                  onClick={() => handleAction(req, true)}
                  className="rounded-xl border border-[#1ba098]/30 bg-[#1ba098]/10 p-4 text-[#1ba098] hover:bg-[#1ba098]/20 transition-all"
                >
                  <CheckCircle2 className="h-6 w-6" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
