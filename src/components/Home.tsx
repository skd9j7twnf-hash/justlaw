import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { UserProfile } from '../types';
import { Search, Map as MapIcon, MessageCircle, Star, Heart, Eye, Shield as ShieldIcon, Settings as SettingsIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { auth, db } from '../lib/firebase';
import { getDoc, doc } from 'firebase/firestore';
import { cn } from '../lib/utils';

interface HomeProps {
  onSelectLawyer: (lawyer: UserProfile) => void;
  onOpenMap: () => void;
  onOpenChat: () => void;
  onOpenAdmin: () => void;
  onOpenSettings: () => void;
}

export default function Home({ onSelectLawyer, onOpenMap, onOpenChat, onOpenAdmin, onOpenSettings }: HomeProps) {
  const [lawyers, setLawyers] = useState<UserProfile[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [isLawyer, setIsLawyer] = useState(false);

  useEffect(() => {
    if (auth.currentUser) {
      const checkRole = async () => {
        const d = await getDoc(doc(db, 'users', auth.currentUser!.uid));
        setIsLawyer(d.data()?.role === 'lawyer');
      };
      checkRole();
    }
  }, []);

  useEffect(() => {
    const fetchLawyers = async () => {
      const q = query(collection(db, 'users'), where('role', '==', 'lawyer'), limit(10));
      const querySnapshot = await getDocs(q);
      const list = querySnapshot.docs.map(doc => doc.data() as UserProfile);
      
      if (list.length === 0) {
        const mockLawyers: UserProfile[] = [
          {
            uid: 'law1',
            name: 'Javier Méndez',
            email: 'javier@law.com',
            role: 'lawyer',
            photoURL: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400',
            verified: true,
            specialty: 'Civilista & Familia',
            location: 'BCN',
            pricePerConsultation: 150,
            description: 'Experto en defensa penal con más de 15 años de experiencia en tribunales nacionales.',
            rating: 5.0,
            reviewCount: 48
          },
          {
            uid: 'law2',
            name: 'Sofía Vallés',
            email: 'sofia@law.com',
            role: 'lawyer',
            photoURL: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
            verified: true,
            specialty: 'Penal & Procesal',
            location: 'BCN',
            pricePerConsultation: 95,
            description: 'Especialista en herencias, contratos y reclamaciones de cantidad. Trato cercano y eficiente.',
            rating: 4.8,
            reviewCount: 102
          }
        ];
        setLawyers(mockLawyers);
      } else {
        setLawyers(list);
      }
      setLoading(false);
    };
    fetchLawyers();
  }, []);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar Mock for Desktop */}
      <aside className="hidden w-72 border-r border-white/10 flex-col p-8 md:flex">
        <div className="flex items-center gap-2 mb-12">
          <div className="w-10 h-10 bg-[#1ba098] rounded-lg flex items-center justify-center font-bold text-xl italic text-[#051622]">J</div>
          <h1 className="text-2xl font-black tracking-tighter italic">JUSTLAW</h1>
        </div>
        <nav className="flex-1 space-y-6">
          <div className="space-y-3">
            <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold px-2">Marketplace</p>
            <button className="w-full sidebar-link sidebar-link-active">
              <Search className="w-5 h-5 text-[#1ba098]" />
              <span className="font-medium">Explorar</span>
            </button>
            <button onClick={onOpenChat} className="w-full sidebar-link">
              <MessageCircle className="w-5 h-5" />
              <span>Mensajes</span>
              <span className="ml-auto bg-red-500 text-[10px] px-1.5 py-0.5 rounded-full">4</span>
            </button>
            <button className="w-full sidebar-link" onClick={onOpenAdmin}>
              <ShieldIcon className="w-5 h-5" />
              <span>Admin</span>
            </button>
            <button className="w-full sidebar-link" onClick={onOpenSettings}>
              <SettingsIcon className="w-5 h-5" />
              <span>Verificación</span>
            </button>
            <button className="w-full sidebar-link">
              <Heart className="w-5 h-5" />
              <span>Favoritos</span>
            </button>
          </div>
        </nav>
        <div className="mt-auto p-4 bg-white/5 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-emerald-500 border-2 border-white/20"></div>
            <div className="text-left">
              <p className="text-sm font-bold">UserEjemplo</p>
              <p className="text-xs text-white/40 italic">Premium Member</p>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col">
        <header className="h-20 border-b border-white/10 flex items-center px-8 gap-4 glass">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/30" />
            <input
              type="text"
              placeholder="Especialidad: Abogado Penalista..."
              className="w-full bg-[#0a1f2e] border border-white/10 rounded-full py-3 px-12 text-sm focus:outline-none focus:border-[#1ba098] transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full border border-white/10 text-sm">
            <MapIcon className="w-4 h-4 text-[#1ba098]" />
            <span>Barcelona, ES</span>
          </div>
        </header>

        <section className="p-8">
          <div className="grid grid-cols-12 gap-8">
            {/* Map Area Widget */}
            <div className="col-span-12 lg:col-span-8">
              <div 
                onClick={onOpenMap}
                className="group relative h-[400px] w-full cursor-pointer overflow-hidden rounded-3xl border border-white/5 bg-[#0a1f2e] transition-all hover:border-[#1ba098]/30"
              >
                <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_center,_#1ba09822_0%,_transparent_70%)]" />
                <div className="absolute top-6 left-6 z-10 bg-black/60 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-2xl">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#1ba098] mb-1">Zona de búsqueda</p>
                  <h3 className="text-xl font-bold">Eixample, Barcelona</h3>
                  <p className="text-xs text-white/50 italic">12 Abogados disponibles cerca</p>
                </div>
                
                <div className="flex h-full items-center justify-center">
                  <div className="relative h-64 w-64 rounded-full border border-dashed border-[#1ba098]/20 bg-[#112a3d] p-8 animate-[pulse_4s_infinite]">
                    <div className="h-full w-full rounded-full border-2 border-white/5" />
                    <div className="absolute top-1/4 left-1/4 h-8 w-8 rounded-full border-4 border-white bg-[#1ba098] shadow-[0_0_20px_rgba(27,160,152,0.6)]" />
                    <div className="absolute bottom-1/3 right-1/4 h-6 w-6 rounded-full border-4 border-white bg-emerald-500" />
                  </div>
                </div>

                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#1ba098] px-6 py-2 text-xs font-black uppercase tracking-widest text-[#051622] shadow-[0_4px_20px_rgba(27,160,152,0.4)]">
                  Ampliar mapa interactivo
                </div>
              </div>
            </div>

            {/* Lawyer Cards Area */}
            <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
              <div className="flex items-end justify-between">
                <h2 className="text-2xl font-black italic tracking-tight">DESTACADOS</h2>
                <span className="text-xs font-bold uppercase tracking-widest text-[#1ba098]">Ver todos</span>
              </div>

              {lawyers.map((lawyer, i) => (
                <motion.div
                  key={lawyer.uid}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => onSelectLawyer(lawyer)}
                  className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 transition-all hover:bg-white/10 hover:ring-1 hover:ring-[#1ba098]/30"
                >
                  <div className="flex gap-4">
                    <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-slate-800">
                      <img src={lawyer.photoURL} alt="" className="h-full w-full object-cover transition-transform group-hover:scale-110" />
                      {lawyer.verified && (
                        <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#051622] bg-[#1ba098] text-[8px] font-bold">✓</div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <h3 className="font-bold text-lg group-hover:text-[#1ba098] transition-colors">{lawyer.name}</h3>
                        <span className="font-black text-[#1ba098]">{lawyer.pricePerConsultation}€/h</span>
                      </div>
                      <p className="mb-2 text-xs font-medium text-white/40 italic">{lawyer.specialty} • {lawyer.location}</p>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, j) => (
                          <Star key={j} className={cn("h-3 w-3", j < Math.floor(lawyer.rating || 0) ? "fill-[#fbbf24] text-[#fbbf24]" : "text-white/20")} />
                        ))}
                        <span className="ml-1 text-[10px] text-white/40">({lawyer.reviewCount})</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Promo Urgente Widget */}
              <div className="mt-4 rounded-3xl bg-gradient-to-br from-[#1ba098] to-emerald-600 p-8 shadow-[0_10px_30px_rgba(27,160,152,0.3)]">
                <h4 className="text-3xl font-black italic leading-none text-white">¿NECESITAS<br/>AYUDA URGENTE?</h4>
                <p className="mt-3 text-sm font-medium text-white/80 italic">Servicio de guardia 24/7 para procesos penales.</p>
                <button className="mt-6 w-full rounded-xl bg-white py-4 text-xs font-black uppercase tracking-widest text-[#051622] shadow-xl transition-all hover:scale-[1.02] active:scale-95">
                  Contactar Ahora
                </button>
              </div>
            </div>
          </div>
        </section>

        <footer className="mt-auto flex h-20 items-center border-t border-white/10 bg-white/5 px-8">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <p className="font-mono text-[10px] tracking-tighter text-white/40 uppercase">SYSTEM STATUS: READY • SERVERS: BCN-NORTH</p>
          </div>
          <div className="ml-auto hidden items-center gap-4 sm:flex">
             <div className="flex -space-x-3">
               <div className="h-8 w-8 rounded-full border-2 border-[#051622] bg-cyan-800" />
               <div className="h-8 w-8 rounded-full border-2 border-[#051622] bg-emerald-800" />
               <div className="h-8 w-8 rounded-full border-2 border-[#051622] bg-rose-800" />
             </div>
             <p className="text-[10px] font-bold text-white/60 italic">+1.2k Abogados conectados hoy</p>
          </div>
        </footer>
      </main>
    </div>
  );
}
