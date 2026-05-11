import React, { useState, useEffect } from 'react';
import { collection, addDoc, query, where, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { VerificationRequest } from '../types';
import { ShieldCheck, ArrowLeft, Loader2, SendCircle } from 'lucide-react';

export default function LawyerSettings({ onBack }: { onBack: () => void }) {
  const [license, setLicense] = useState('');
  const [college, setCollege] = useState('');
  const [request, setRequest] = useState<VerificationRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!auth.currentUser) return;
    const q = query(collection(db, 'verificationRequests'), where('lawyerId', '==', auth.currentUser.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        setRequest({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as VerificationRequest);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser || !license || !college) return;

    setSubmitting(true);
    try {
      await addDoc(collection(db, 'verificationRequests'), {
        lawyerId: auth.currentUser.uid,
        licenseNumber: license,
        collegeName: college,
        status: 'pending',
        timestamp: serverTimestamp()
      });
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-[#1ba098]" /></div>;

  return (
    <div className="min-h-screen bg-[#051622] p-8">
      <header className="mb-12 flex items-center gap-4">
        <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-full">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-2xl font-black italic uppercase tracking-tighter">Gestión de Credenciales</h1>
      </header>

      <div className="max-w-xl mx-auto">
        {request ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
            <div className={`mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl ${
              request.status === 'pending' ? 'bg-amber-500/10 text-amber-500' : 
              request.status === 'approved' ? 'bg-[#1ba098]/10 text-[#1ba098]' : 'bg-rose-500/10 text-rose-500'
            }`}>
              <ShieldCheck className="h-10 w-10" />
            </div>
            <h2 className="text-xl font-bold uppercase italic italic tracking-tighter">
              {request.status === 'pending' ? 'VERIFICACIÓN EN CURSO' : 
               request.status === 'approved' ? 'PERFIL VERIFICADO' : 'SOLICITUD RECHAZADA'}
            </h2>
            <p className="mt-4 text-white/40 text-sm">
              {request.status === 'pending' ? 'Nuestros auditores están revisando tu licencia colegial.' : 
               request.status === 'approved' ? 'Tu credibilidad ha sido certificada oficialmente.' : 'Hay un problema con tus credenciales. Contacta con soporte.'}
            </p>
            <div className="mt-8 rounded-2xl bg-black/20 p-4 font-mono text-xs text-white/30">
              ID: {request.licenseNumber} • {request.collegeName}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
              <h3 className="text-lg font-bold italic mb-6">Solicitar Verificación</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#1ba098] ml-2">Nº Colegiado</label>
                  <input 
                    required
                    type="text" 
                    value={license}
                    onChange={e => setLicense(e.target.value)}
                    className="mt-2 w-full rounded-2xl bg-white/5 border border-white/10 p-4 focus:border-[#1ba098] outline-none transition-all"
                    placeholder="Ej: 12345/M"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#1ba098] ml-2">Ilustre Colegio de Abogados</label>
                  <input 
                    required
                    type="text" 
                    value={college}
                    onChange={e => setCollege(e.target.value)}
                    className="mt-2 w-full rounded-2xl bg-white/5 border border-white/10 p-4 focus:border-[#1ba098] outline-none transition-all"
                    placeholder="Ej: ICAM Madrid"
                  />
                </div>
              </div>
            </div>

            <button 
              disabled={submitting}
              className="w-full rounded-3xl bg-[#1ba098] py-5 font-black italic uppercase tracking-widest text-[#051622] shadow-2xl transition-all hover:brightness-110 active:scale-95 disabled:opacity-50"
            >
              {submitting ? 'ENVIANDO...' : 'ENVIAR PARA REVISIÓN'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
