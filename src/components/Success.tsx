import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, ArrowRight, MapPin } from 'lucide-react';
import { APIProvider, Map, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';

const API_KEY = process.env.GOOGLE_MAPS_PLATFORM_KEY || '';

function RouteDisplay() {
  const map = useMap();
  const routesLib = useMapsLibrary('routes');

  React.useEffect(() => {
    if (!routesLib || !map || !API_KEY) return;

    // Sant Cugat Area coordinates for the "Mapa de Desplazamiento" requirement
    const origin = { lat: 41.4721, lng: 2.0867 }; // Sant Cugat
    const destination = { lat: 41.3851, lng: 2.1734 }; // Barcelona

    routesLib.Route.computeRoutes({
      origin,
      destination,
      travelMode: 'DRIVING',
      fields: ['path', 'viewport'],
    }).then(({ routes }) => {
      if (routes?.[0]) {
        const polylines = routes[0].createPolylines();
        polylines.forEach(p => p.setMap(map));
        if (routes[0].viewport) map.fitBounds(routes[0].viewport);
      }
    });
  }, [routesLib, map]);

  return null;
}

export default function Success({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex min-h-screen flex-col p-4 text-center">
      <div className="flex-1 flex flex-col items-center justify-center py-12">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 10, stiffness: 100 }}
          className="mb-8 rounded-full bg-[#00f5d4]/20 p-8"
        >
          <CheckCircle2 className="h-24 w-24 text-[#00f5d4]" />
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-extrabold tracking-tight"
        >
          ¡EL PAGO SE HA PERFECCIONADO CORRECTAMENTE!
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          delay={0.1}
          className="mt-4 text-slate-400"
        >
          Tu cita ha sido confirmada. El abogado se pondrá en contacto contigo a través del chat en breve.
        </motion.p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        delay={0.2}
        className="mb-8 overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10"
      >
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-[#00d2ff]" />
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Ruta al Despacho</span>
          </div>
          <span className="text-xs text-[#00f5d4]">22 min • 15.4 km</span>
        </div>
        
        <div className="h-64 w-full bg-slate-900 overflow-hidden relative">
          {API_KEY ? (
            <APIProvider apiKey={API_KEY}>
              <Map
                defaultCenter={{ lat: 41.4721, lng: 2.0867 }}
                defaultZoom={12}
                mapId="SUCCESS_MAP_ID"
                disableDefaultUI={true}
                gestureHandling={'none'}
                style={{ width: '100%', height: '100%' }}
              >
                <RouteDisplay />
              </Map>
            </APIProvider>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-500 text-xs text-center p-4">
              Añade GOOGLE_MAPS_PLATFORM_KEY para ver la ruta
            </div>
          )}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
             <div className="bg-[#00d2ff] text-[#0a192f] text-[10px] font-bold px-2 py-0.5 rounded shadow">1</div>
             <div className="bg-[#00f5d4] text-[#0a192f] text-[10px] font-bold px-2 py-0.5 rounded shadow mt-8">3</div>
          </div>
        </div>
      </motion.div>

      <div className="pb-8">
        <button
          onClick={onBack}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-white/10 px-8 py-5 font-bold transition-all hover:bg-white/20"
        >
          VOLVER AL INICIO
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
