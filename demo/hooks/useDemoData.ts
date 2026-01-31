import { useEffect, useState } from 'react';
import { 
  ChartData, 
  calculateChart, 
  setSwissEphemeris,
  GeoLocation,
  BodyId
} from '@astrologer/astro-core';
import { SwissEphemeris } from '@swisseph/browser';
// @ts-ignore
import wasmUrl from '@swisseph/browser/dist/swisseph.wasm?url';

export function useDemoData(date: Date, location: GeoLocation) {
  const [isReady, setIsReady] = useState(false);
  const [data, setData] = useState<{
      natal: ChartData | null;
      transit: ChartData | null;
      partner: ChartData | null;
  }>({ natal: null, transit: null, partner: null });
  
  useEffect(() => {
    const init = async () => {
        try {
            const swe = new SwissEphemeris();
            await swe.init(wasmUrl);
            setSwissEphemeris(swe);
            setIsReady(true);
        } catch (e) {
            console.error("Ephemeris Init Failed:", e);
        }
    };
    init();
  }, []);

  useEffect(() => {
    if (!isReady) return;
    
    const bodies = [
        BodyId.Sun, BodyId.Moon, BodyId.Mercury, BodyId.Venus, BodyId.Mars,
        BodyId.Jupiter, BodyId.Saturn, BodyId.Uranus, BodyId.Neptune, BodyId.Pluto,
        BodyId.TrueNode
    ];

    try {
        const natal = calculateChart({ date, location, bodies });
        const transit = calculateChart({ date, location, bodies });
        const partner = calculateChart({ 
            date: new Date(date.getTime() + 31557600000 * 2), // 2 years later
            location, 
            bodies 
        });
        
        setData({ natal, transit, partner });
    } catch (e) {
        console.error("Calculation Failed:", e);
    }
  }, [isReady, date, location]);

  return { isReady, ...data };
}
