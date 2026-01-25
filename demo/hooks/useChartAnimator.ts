import { useState, useEffect, useRef, useCallback } from 'react';
import { calculateChart, ChartData, GeoLocation, BodyId } from '@astrologer/astro-core';

export const DEFAULT_BODIES = [
    BodyId.Sun, BodyId.Moon, BodyId.Mercury, BodyId.Venus, BodyId.Mars,
    BodyId.Jupiter, BodyId.Saturn, BodyId.Uranus, BodyId.Neptune, BodyId.Pluto,
    BodyId.MeanNode, BodyId.TrueNode
];

export function useChartAnimator(
    location: GeoLocation, 
    initialDate: Date = new Date(), 
    bodies: BodyId[] = DEFAULT_BODIES
) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(5);
    const [date, setDate] = useState(initialDate);
    const [data, setData] = useState<ChartData | null>(null);
    
    const reqRef = useRef<number | undefined>(undefined);
    const lastTimeRef = useRef<number>(0);

    // Initial/Static Calculation when paused or init
    useEffect(() => {
        if (!isPlaying && !data) {
             try {
                const d = calculateChart({ date: initialDate, location, bodies });
                setData(d);
            } catch (e) {
                // Wasm might not be ready yet
            }
        }
    }, [isPlaying, location, initialDate, bodies]);

    // Animation Loop
    useEffect(() => {
        if (!isPlaying) {
            if (reqRef.current) cancelAnimationFrame(reqRef.current);
            return;
        }

        let currentDate = date;
        lastTimeRef.current = performance.now();

        const loop = (time: number) => {
            const delta = time - lastTimeRef.current;
            
            if (delta > 33) { 
                const daysToAdd = (delta / 1000) * speed;
                const newTime = currentDate.getTime() + (daysToAdd * 24 * 60 * 60 * 1000);
                currentDate = new Date(newTime);
                
                try {
                    const newChart = calculateChart({ date: currentDate, location, bodies });
                    setData(newChart);
                    setDate(currentDate);
                } catch (e) {
                    console.error(e);
                }
                
                lastTimeRef.current = time;
            }
            
            reqRef.current = requestAnimationFrame(loop);
        };
        
        reqRef.current = requestAnimationFrame(loop);

        return () => {
            if (reqRef.current) cancelAnimationFrame(reqRef.current);
        };
    }, [isPlaying, speed, location, bodies]); // added bodies

    const togglePlay = useCallback(() => setIsPlaying(p => !p), []);

    return {
        isPlaying,
        togglePlay,
        speed,
        setSpeed,
        date,
        data,
        reset: () => {
            setIsPlaying(false);
            setDate(initialDate);
            setData(null);
        }
    };
}