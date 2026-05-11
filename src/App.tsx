import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, db } from './lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { AppView, UserProfile } from './types';
import Onboarding from './components/Onboarding';
import Home from './components/Home';
import LawyerProfile from './components/LawyerProfile';
import ChatModule from './components/Chat';
import Checkout from './components/Checkout';
import Success from './components/Success';
import MapView from './components/MapView';
import AdminPanel from './components/AdminPanel';
import LawyerSettings from './components/LawyerSettings';
import { LayoutGroup, motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [view, setView] = useState<AppView>('onboarding');
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [selectedLawyer, setSelectedLawyer] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(docSnap.data() as UserProfile);
          setView('home');
        } else {
          setView('onboarding');
        }
      } else {
        setView('onboarding');
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const navigate = (newView: AppView, data?: any) => {
    if (newView === 'lawyer-profile' && data) {
      setSelectedLawyer(data);
    }
    setView(newView);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#051622]">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-5xl font-black italic tracking-tighter text-[#1ba098] uppercase"
        >
          JUSTLAW
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#051622] text-white overflow-x-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="min-h-screen"
        >
          {view === 'onboarding' && <Onboarding onComplete={() => setView('home')} />}
          {view === 'home' && (
            <Home 
              onSelectLawyer={(law) => navigate('lawyer-profile', law)} 
              onOpenMap={() => setView('map-view')} 
              onOpenChat={() => setView('chat')} 
              onOpenAdmin={() => setView('admin-panel')}
              onOpenSettings={() => setView('lawyer-settings')}
            />
          )}
          {view === 'lawyer-profile' && selectedLawyer && (
            <LawyerProfile 
              lawyer={selectedLawyer} 
              onBack={() => setView('home')} 
              onHire={() => setView('checkout')}
              onMessage={() => setView('chat')}
            />
          )}
          {view === 'chat' && <ChatModule lawyer={selectedLawyer} onBack={() => setView('home')} />}
          {view === 'checkout' && selectedLawyer && (
            <Checkout 
              lawyer={selectedLawyer} 
              onBack={() => setView('lawyer-profile')} 
              onSuccess={() => setView('success')} 
            />
          )}
          {view === 'success' && <Success onBack={() => setView('home')} />}
          {view === 'map-view' && <MapView onBack={() => setView('home')} />}
          {view === 'admin-panel' && <AdminPanel onBack={() => setView('home')} />}
          {view === 'lawyer-settings' && <LawyerSettings onBack={() => setView('home')} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
