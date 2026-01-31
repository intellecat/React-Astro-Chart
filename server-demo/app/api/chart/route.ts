import { NextResponse } from 'next/server';
import { calculateChart, setSwissEphemeris, GeoLocation, BodyId } from '@astrologer/astro-core';
import * as swe from '@swisseph/node';

// Initialize the engine ONCE on the server
try {
  setSwissEphemeris(swe);
  console.log("Swiss Ephemeris Node Adapter Initialized");
} catch (e) {
  console.error("Failed to initialize Swiss Ephemeris", e);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const dateStr = searchParams.get('date');
  const lat = parseFloat(searchParams.get('lat') || '0');
  const lon = parseFloat(searchParams.get('lon') || '0');

  if (!dateStr) {
    return NextResponse.json({ error: 'Date is required' }, { status: 400 });
  }

  const date = new Date(dateStr);
  const location: GeoLocation = { latitude: lat, longitude: lon };
  
  // Default bodies
  const bodies = [
        BodyId.Sun, BodyId.Moon, BodyId.Mercury, BodyId.Venus, BodyId.Mars,
        BodyId.Jupiter, BodyId.Saturn, BodyId.Uranus, BodyId.Neptune, BodyId.Pluto,
        BodyId.TrueNode, BodyId.LilithMean, BodyId.Chiron
    ];

  try {
    const chartData = calculateChart({ date, location, bodies });
    return NextResponse.json(chartData);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
