import React from 'react';
import { Letter } from '../types';
import { formatTimeRemaining, getTimeRemainingMs, isLetterDelivered } from '../lib/letterUtils';

// Define paper and font mappings
const paperClasses = {
  classic: 'bg-amber-50 classic-paper border-amber-100',
  parchment: 'bg-[#f5f0e5] parchment-paper border-amber-200',
  linen: 'bg-white linen-paper border-gray-200',
  recycled: 'bg-stone-50 recycled-paper border-stone-200',
  colored: 'bg-blue-50 blue-paper border-blue-100',
};

const fontClasses = {
  serif: 'font-serif',
  handwritten: 'font-handwritten',
  typewriter: 'font-typewriter',
  modern: 'font-sans',
  cursive: 'font-cursive',
};

interface LetterDisplayProps {
  letter: Letter;
  showContent?: boolean;
}

const LetterDisplay: React.FC<LetterDisplayProps> = ({ letter, showContent = false }) => {
  const delivered = isLetterDelivered(letter);
  const timeRemaining = getTimeRemainingMs(letter);
  
  // Get customization classes or use defaults
  const paperClass = letter.customization?.paper 
    ? paperClasses[letter.customization.paper as keyof typeof paperClasses] 
    : paperClasses.classic;
  
  const fontClass = letter.customization?.font 
    ? fontClasses[letter.customization.font as keyof typeof fontClasses] 
    : fontClasses.serif;
  
  return (
    <div className={`letter-card ${delivered ? 'delivered-stamp' : ''}`}>
      <div className="flex flex-col md:flex-row gap-6">
        {/* Envelope header information */}
        <div className="flex-grow">
          <div className="mb-8 relative">
            {/* Decorative header element */}
            <div className="absolute -top-6 -right-6 w-24 h-24 opacity-5">
              <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#92400E" strokeWidth="2"/>
                <path d="M50 5 L50 95 M5 50 L95 50" stroke="#92400E" strokeWidth="2"/>
              </svg>
            </div>
            
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-serif font-semibold mb-2 text-amber-900">From: {letter.sender}</h3>
                <h3 className="text-xl font-serif font-semibold mb-5 text-amber-900">To: {letter.recipient}</h3>
                
                <div className="text-sm text-amber-800 mb-1 font-medium">
                  Origin: <span className="text-amber-700">{letter.originAddress}</span>
                </div>
                <div className="text-sm text-amber-800 mb-4 font-medium">
                  Destination: <span className="text-amber-700">{letter.destinationAddress}</span>
                </div>
                
                <div className="text-sm text-amber-800 mb-5 inline-block bg-amber-50 px-3 py-1 rounded">
                  <span className="font-medium">Sent:</span> {new Date(letter.sentAt).toLocaleString()}
                </div>
              </div>
              
              {/* Delivery status and stamp */}
              <div className="flex flex-col items-end">
                <div className="letter-stamp mb-3 z-10">
                  <div className="z-10 text-xs font-bold text-amber-800 text-center">
                    <div>{delivered ? 'DELIVERED' : 'IN TRANSIT'}</div>
                    <div className="text-[8px] mt-1 opacity-80">{delivered ? 'POSTAL SERVICE' : `ETA: ${formatTimeRemaining(timeRemaining)}`}</div>
                  </div>
                </div>

                {!delivered && (
                  <div className="w-32">
                    <div className="text-xs font-medium text-amber-700 mb-1 text-center">Delivery Progress</div>
                    <div className="w-full h-1.5 bg-amber-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-amber-600 rounded-full transition-all duration-1000"
                        style={{ 
                          width: `${Math.max(5, 100 - (timeRemaining / (letter.deliveryTime * 10)))}%`
                        }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {!delivered && (
              <div className="bg-amber-50 rounded-md p-4 mt-6 border border-amber-100 relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(#92400E_1px,transparent_0)] [background-size:18px_18px] opacity-5"></div>
                <div className="relative">
                  <div className="text-sm text-amber-800 flex justify-between items-center">
                    <span>
                      <span className="font-medium">Estimated delivery:</span> {formatTimeRemaining(timeRemaining)}
                    </span>
                    <span className="text-xs bg-amber-100 px-2 py-1 rounded font-medium">
                      {Math.round(100 - (timeRemaining / (letter.deliveryTime * 10)))}% complete
                    </span>
                  </div>
                  <div className="w-full bg-white rounded-full h-2 mt-3 overflow-hidden shadow-inner">
                    <div 
                      className="bg-amber-600 h-full rounded-full transition-all ease-out"
                      style={{ 
                        width: `${Math.max(2, 100 - (timeRemaining / (letter.deliveryTime * 10)))}%`
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Letter content */}
      {(delivered || showContent) ? (
        <div className="mt-8">
          <div className="dashed-line mb-8"></div>
          <div className={`ornate-container ${paperClass}`}>
            <div className={`text-amber-900 text-lg leading-relaxed ${fontClass}`}>
              <div className="whitespace-pre-wrap relative">
                {letter.message}
                
                {/* Render stickers if available */}
                {letter.customization?.stickers && letter.customization.stickers.map((sticker, index) => (
                  <div 
                    key={index}
                    className="absolute text-3xl"
                    style={{ 
                      top: `${sticker.position.y}%`, 
                      left: `${sticker.position.x}%` 
                    }}
                  >
                    {sticker.emoji}
                  </div>
                ))}
              </div>
              <div className={`mt-10 text-right text-amber-800 italic ${fontClass}`}>
                - {letter.sender}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-8 p-6 bg-amber-50 rounded-lg text-center border border-amber-100">
          <div className="flex flex-col items-center">
            <div className="mb-3 text-amber-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <p className="text-amber-800 font-serif text-lg">This letter is sealed until delivery</p>
            <p className="text-amber-700 text-sm mt-2 max-w-md">The contents will be revealed once the letter completes its journey</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LetterDisplay; 