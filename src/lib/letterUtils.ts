import { Letter } from '../types';

// Save letter to local storage
export function saveLetter(letter: Letter): void {
  const letters = getLetters();
  letters.push(letter);
  localStorage.setItem('letters', JSON.stringify(letters));
}

// Get all letters from local storage
export function getLetters(): Letter[] {
  if (typeof window === 'undefined') return [];
  
  const lettersJson = localStorage.getItem('letters');
  if (!lettersJson) return [];
  
  try {
    return JSON.parse(lettersJson);
  } catch (error) {
    console.error('Error parsing letters from localStorage:', error);
    return [];
  }
}

// Get a specific letter by ID
export function getLetterById(id: string): Letter | null {
  const letters = getLetters();
  const letter = letters.find(l => l.id === id);
  return letter || null;
}

// Check if a letter is delivered based on time elapsed
export function isLetterDelivered(letter: Letter): boolean {
  const now = Date.now();
  const deliveryTimeMs = letter.sentAt + (letter.deliveryTime * 1000);
  return now >= deliveryTimeMs;
}

// Update letter status to delivered
export function updateLetterStatus(id: string, status: 'transit' | 'delivered'): void {
  const letters = getLetters();
  const updatedLetters = letters.map(letter => 
    letter.id === id ? { ...letter, status } : letter
  );
  localStorage.setItem('letters', JSON.stringify(updatedLetters));
}

// Calculate time remaining for delivery in milliseconds
export function getTimeRemainingMs(letter: Letter): number {
  const now = Date.now();
  const deliveryTimeMs = letter.sentAt + (letter.deliveryTime * 1000);
  const remaining = deliveryTimeMs - now;
  return remaining > 0 ? remaining : 0;
}

// Format time remaining as a string (e.g. "2d 5h 30m 15s")
export function formatTimeRemaining(ms: number): string {
  if (ms <= 0) return 'Delivered';
  
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  
  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (seconds > 0) parts.push(`${seconds}s`);
  
  return parts.join(' ');
} 