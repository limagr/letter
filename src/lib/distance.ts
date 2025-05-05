import { DistanceResponse } from '../types';

// Mock function to calculate "distance" between two places based on string length
// This avoids calling the real Google Distance Matrix API
export async function getDistance(
  origin: string,
  destination: string
): Promise<DistanceResponse | null> {
  try {
    // Simulate API delay (between 500-1500ms)
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
    
    // Simple calculation based on string characters to simulate varying distances
    const combinedLength = origin.length + destination.length;
    const seemsInternational = origin.includes(',') && destination.includes(',') &&
      origin.split(',').pop()?.trim() !== destination.split(',').pop()?.trim();
    
    // Generate random distance value with some logic based on the addresses
    let distanceKm = Math.floor(combinedLength * 8 * (seemsInternational ? 100 : 5));
    // Add some randomness
    distanceKm = distanceKm * (0.8 + Math.random() * 0.4);
    // Ensure minimum reasonable distance
    distanceKm = Math.max(5, distanceKm);
    
    // Approximate travel time (roughly 60km/h on average, slower for international)
    const speedFactor = seemsInternational ? 500 : 60; // km/h
    const hours = distanceKm / speedFactor;
    const seconds = Math.floor(hours * 3600);
    
    // Format distance text
    let distanceText = '';
    if (distanceKm < 1) {
      distanceText = `${Math.round(distanceKm * 1000)} m`;
    } else if (distanceKm < 10) {
      distanceText = `${distanceKm.toFixed(1)} km`;
    } else {
      distanceText = `${Math.round(distanceKm)} km`;
    }
    
    // Format duration text
    let durationText = '';
    if (seconds < 60) {
      durationText = `${seconds} segundos`;
    } else if (seconds < 3600) {
      durationText = `${Math.floor(seconds / 60)} minutos`;
    } else if (seconds < 86400) {
      const h = Math.floor(seconds / 3600);
      const m = Math.floor((seconds % 3600) / 60);
      durationText = `${h} hora${h > 1 ? 's' : ''}${m > 0 ? ` ${m} min` : ''}`;
    } else {
      const d = Math.floor(seconds / 86400);
      const h = Math.floor((seconds % 86400) / 3600);
      durationText = `${d} dia${d > 1 ? 's' : ''}${h > 0 ? ` ${h} h` : ''}`;
    }
    
    console.log(`[MOCK] Distance from "${origin}" to "${destination}": ${distanceText} (${durationText})`);
    
    // Return mocked response that mimics the Google Distance Matrix API response
    return {
      distance: {
        text: distanceText,
        value: Math.floor(distanceKm * 1000), // convert to meters
      },
      duration: {
        text: durationText,
        value: seconds,
      },
      status: 'OK',
    };
  } catch (error) {
    console.error('Error in mock distance calculation:', error);
    return null;
  }
} 