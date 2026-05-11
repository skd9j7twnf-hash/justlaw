import React from 'react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { motion } from 'motion/react';
import { Shield, Mail, Facebook, Apple } from 'lucide-react';

export default function Onboarding({ onComplete }: { onComplete: () => void }) {
  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        await setDoc(docRef, {
          uid: user.uid,
          name: user.displayName || 'Usuario',
          email: user.email || '',
          role: 'client',
          photoURL: user.photoURL || '',
          verified: false,
        });
      }
      onComplete();
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-12 text-center"
      >
        <div className="mb-4 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-[#1ba098] shadow-[0_0_30px_rgba(27,160,152,0.4)]">
          <Shield className="h-10 w-10 text-[#051622]" />
        </div>
        <h1 className="mt-6 text-5xl font-black italic tracking-tighter text-white uppercase">JUSTLAW</h1>
        <p className="mt-2 text-slate-400 italic">Tu marketplace jurídico de alto nivel</p>
      </motion.div>

      <div className="w-full max-w-sm space-y-4">
        <button
          onClick={handleLogin}
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 py-4 transition-all hover:bg-white/10"
        >
          <Mail className="h-5 w-5 text-red-500" />
          <span>Continuar con Google</span>
        </button>

        <button className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 py-4 transition-all hover:bg-white/10 opacity-50 cursor-not-allowed">
          <Facebook className="h-5 w-5 text-blue-600" />
          <span>Continuar con Facebook</span>
        </button>

        <button className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 py-4 transition-all hover:bg-white/10 opacity-50 cursor-not-allowed">
          <Apple className="h-5 w-5 text-white" />
          <span>Continuar con Apple</span>
        </button>
      </div>

      <p className="mt-12 text-center text-xs text-slate-500">
        Al continuar, aceptas nuestros términos de servicio y política de privacidad.
      </p>
    </div>
  );
}
