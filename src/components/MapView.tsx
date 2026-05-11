import React from 'react';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import { ArrowLeft } from 'lucide-react';

const API_KEY = process.env.GOOGLE_MAPS_PLATFORM_KEY || '';
const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

export default function MapView({ onBack }: { onBack: () => void }) {
  if (!hasValidKey) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#051622] p-8 text-center text-white">
        <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-4">Google Maps Key Required</h2>
        <p className="text-white/40 mb-8 max-w-sm italic">
          Por favor, añade <strong>GOOGLE_MAPS_PLATFORM_KEY</strong> en los Secretos para activar la red de inteligencia geográfica.
        </p>
        <button onClick={onBack} className="rounded-2xl bg-white/5 border border-white/10 px-8 py-4 font-black uppercase tracking-widest hover:bg-white/10 transition-all italic">
          VOLVER AL INICIO
        </button>
      </div>
    );
  }

  // Mock lawyers locations in Spain
  const locations = [
    { id: '1', lat: 40.4168, lng: -3.7038, title: 'Madrid Centro' },
    { id: '2', lat: 41.3851, lng: 2.1734, title: 'Barcelona Diagonal' },
    { id: '3', lat: 43.2630, lng: -2.9350, title: 'Bilbao Abando' },
    { id: '4', lat: 37.3891, lng: -5.9845, title: 'Sevilla Casco Antiguo' }
  ];

  return (
    <div className="relative h-screen w-full bg-[#051622]">
      <div className="absolute left-6 top-6 z-10">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 rounded-2xl glass px-6 py-3 font-black italic uppercase tracking-widest shadow-2xl hover:bg-[#1ba098]/10 transition-all border border-white/10"
        >
          <ArrowLeft className="h-5 w-5" />
          VOLVER
        </button>
      </div>

      <div className="absolute left-1/2 top-6 z-10 -translate-x-1/2">
        <div className="rounded-2xl glass px-8 py-3 shadow-2xl border border-white/10">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#1ba098]">ZONA DE BÚSQUEDA ACTIVADA</p>
        </div>
      </div>

      <APIProvider apiKey={API_KEY} version="weekly">
        <Map
          defaultCenter={{ lat: 40.4168, lng: -3.7038 }}
          defaultZoom={6}
          mapId="JUSTLAW_MAP_ID"
          internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
          style={{ width: '100%', height: '100%' }}
          gestureHandling={'greedy'}
          disableDefaultUI={true}
        >
          {locations.map(loc => (
            <AdvancedMarker key={loc.id} position={{ lat: loc.lat, lng: loc.lng }} title={loc.title}>
              <Pin background="#1ba098" glyphColor="#051622" borderColor="#051622" />
            </AdvancedMarker>
          ))}
        </Map>
      </APIProvider>
    </div>
  );
}
