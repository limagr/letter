import React, { useEffect, useState } from 'react';
import { Letter } from '../types';
import { getTimeRemainingMs } from '../lib/letterUtils';
import { motion } from 'framer-motion';

interface LetterAnimationProps {
  letter: Letter;
}

const LetterAnimation: React.FC<LetterAnimationProps> = ({ letter }) => {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const totalTime = letter.deliveryTime * 1000; // ms
    const remaining = getTimeRemainingMs(letter);
    const elapsed = totalTime - remaining;
    const initialProgress = Math.min(100, Math.max(0, (elapsed / totalTime) * 100));
    
    setProgress(initialProgress);
    
    // Only set up animation if letter is still in transit
    if (remaining > 0) {
      const interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + (0.1 * (100 / letter.deliveryTime)); // Smooth increment
          if (newProgress >= 100) {
            clearInterval(interval);
            return 100;
          }
          return newProgress;
        });
      }, 100); // Update every 100ms
      
      return () => clearInterval(interval);
    }
  }, [letter]);
  
  return (
    <div className="bg-amber-100 rounded-lg p-6 my-6 border border-amber-300 shadow-inner relative overflow-hidden">
      <h3 className="font-serif text-xl text-amber-800 mb-4 text-center">Journey Tracker</h3>
      
      {/* Horse delivery animation scene */}
      <div className="relative h-36 bg-gradient-to-b from-blue-100/50 to-amber-100/80 rounded-lg overflow-hidden border-2 border-amber-300">
        {/* Sky with clouds */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-b from-blue-200/50 to-transparent"></div>
          
          {/* Animated clouds */}
          <motion.div 
            className="absolute top-2 left-0"
            animate={{ x: ["0%", "100%"] }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          >
            <div className="flex space-x-16">
              <div className="bg-white/80 w-16 h-6 rounded-full blur-sm"></div>
              <div className="bg-white/80 w-24 h-8 rounded-full blur-sm"></div>
              <div className="bg-white/80 w-20 h-5 rounded-full blur-sm"></div>
            </div>
          </motion.div>
          
          <motion.div 
            className="absolute top-6 left-0"
            animate={{ x: ["0%", "100%"] }}
            transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          >
            <div className="flex space-x-32">
              <div className="bg-white/70 w-20 h-7 rounded-full blur-sm"></div>
              <div className="bg-white/70 w-16 h-5 rounded-full blur-sm"></div>
            </div>
          </motion.div>
        </div>
        
        {/* Ground with path */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-amber-200/70 to-amber-100/30">
          <div className="absolute inset-0">
            <svg width="100%" height="20" viewBox="0 0 100 20" preserveAspectRatio="none" className="absolute bottom-10">
              <path d="M0,10 Q25,15 50,10 T100,10" stroke="#92400E" strokeWidth="0.5" fill="none" strokeDasharray="3,2" opacity="0.5" />
            </svg>
          </div>
        </div>
        
        {/* Origin marker */}
        <div className="absolute left-4 bottom-10 transform -translate-y-1/2">
          <div className="w-8 h-8 rounded-full bg-amber-500 shadow-md flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        </div>
        
        {/* Destination marker */}
        <div className="absolute right-4 bottom-10 transform -translate-y-1/2">
          <div className="w-8 h-8 rounded-full bg-amber-600 shadow-md flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
        </div>
        
        {/* Moving horse with rider carrying mail */}
        <motion.div 
          className="absolute bottom-10 transform -translate-y-1/2 horse-gallop"
          style={{ 
            left: `calc(${progress}% - 20px)`,
            filter: 'drop-shadow(0 4px 3px rgba(0, 0, 0, 0.07)) drop-shadow(0 2px 2px rgba(0, 0, 0, 0.06))'
          }}
          animate={{ y: [-1, 1, -1] }}
          transition={{ repeat: Infinity, duration: 0.5 }}
        >
          <div className="relative">
            {/* Horse and rider */}
            <svg width="40" height="40" viewBox="0 0 24 24" className="text-amber-800">
              <g fill="currentColor">
                {/* Horse body */}
                <path d="M4,17c0,0,0.9-3.4,3.6-3.4s3.9,2.7,5.8,2.7s4.6-2.3,4.6-2.3V9.8c0,0-2.9-0.8-4.6,0.4S10.1,12,9.2,12S4.3,11.7,4,9.8  V17z"/>
                {/* Horse head */}
                <path d="M18,7c0,0-0.5-1.9-2.3-1.9c-1.8,0-2.4,1.5-2.4,1.9s0.4,1.7,2.4,1.8C17.5,8.9,18,7,18,7z"/>
                {/* Horse legs */}
                <path d="M4,17c0,0,0.3,0.6,1.2,0.6S6,17,6,17"/>
                <path d="M7.4,17c0,0,0.3,0.6,1.2,0.6S9.7,17,9.7,17"/>
                <path d="M13.4,17c0,0,0.3,0.6,1.2,0.6s0.8-0.6,0.8-0.6"/>
                <path d="M16.6,17c0,0,0.3,0.6,1.2,0.6s0.8-0.6,0.8-0.6"/>
                {/* Rider */}
                <path d="M13.5,7.6c0,0-0.5-1.3,0.4-1.3s2.1,0.3,2.1,0.9s-0.8,1.4-1.1,1.9c-0.3,0.5-0.5,1.3-0.7,1.3s-0.7-0.3-0.7-0.3  L13.5,7.6z"/>
                {/* Mail bag */}
                <path fill="#f59e0b" d="M16,8c0,0,1.1,0.3,1.1,1s-0.7,1.5-0.7,1.5l1.7,0.2c0,0,0.9-0.9,0.9-1.7s-0.7-1.6-1.5-1.6S16,8,16,8z"/>
              </g>
            </svg>
            
            {/* Letter/envelope hint */}
            <div className="absolute -top-4 -right-1 transform rotate-12">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white bg-amber-500 rounded" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </motion.div>
        
        {/* Progress dust particles */}
        {progress > 5 && (
          <motion.div 
            className="absolute bottom-10 left-0"
            style={{ width: `${progress}%` }}
          >
            {Array.from({ length: 5 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute bottom-0 bg-amber-300/30 w-1 h-1 rounded-full"
                style={{ 
                  left: `${80 + i * 4}%`,
                  opacity: 0.7 - (i * 0.1)
                }}
                animate={{ 
                  y: [-5, -10, -5],
                  opacity: [0.7, 0.3, 0]
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 1,
                  delay: i * 0.2
                }}
              />
            ))}
          </motion.div>
        )}
      </div>
      
      <div className="mt-4 flex justify-between text-sm font-serif">
        <div className="text-amber-800 font-semibold">
          <div className="text-xs uppercase tracking-wide mb-1">Origin</div>
          {letter.originAddress.split(',')[0]}
        </div>
        <div className="text-amber-800 font-semibold text-right">
          <div className="text-xs uppercase tracking-wide mb-1">Destination</div>
          {letter.destinationAddress.split(',')[0]}
        </div>
      </div>

      {/* Progress bar beneath the scene */}
      <div className="mt-4">
        <div className="flex justify-between text-xs text-amber-700 mb-1">
          <span>Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 w-full bg-amber-200/50 rounded-full overflow-hidden">
          <div 
            className="h-full bg-amber-600 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Decorative compass */}
      <div className="absolute -bottom-6 -right-6 w-16 h-16 opacity-20 rotate-12">
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="45" fill="none" stroke="#92400E" strokeWidth="2"/>
          <path d="M50 5 L50 95 M5 50 L95 50" stroke="#92400E" strokeWidth="2"/>
          <path d="M50 5 L55 15 L45 15 Z" fill="#92400E"/>
          <path d="M95 50 L85 55 L85 45 Z" fill="#92400E"/>
          <path d="M50 95 L45 85 L55 85 Z" fill="#92400E"/>
          <path d="M5 50 L15 45 L15 55 Z" fill="#92400E"/>
          <circle cx="50" cy="50" r="5" fill="#92400E"/>
        </svg>
      </div>
    </div>
  );
};

export default LetterAnimation; 