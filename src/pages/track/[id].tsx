import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import LetterDisplay from '../../components/LetterDisplay';
import LetterAnimation from '../../components/LetterAnimation';
import { 
  getLetterById, 
  isLetterDelivered, 
  updateLetterStatus,
  formatTimeRemaining,
  getTimeRemainingMs
} from '../../lib/letterUtils';
import { Letter } from '../../types';
import { motion } from 'framer-motion';

const LetterTrackingPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  
  const [letter, setLetter] = useState<Letter | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [loaded, setLoaded] = useState(false);

  // Load the letter data
  useEffect(() => {
    if (!id) return;
    
    const letterData = getLetterById(id as string);
    setLetter(letterData);
    setLoaded(true);
    
    if (letterData && !isLetterDelivered(letterData)) {
      setTimeRemaining(getTimeRemainingMs(letterData));
    }
  }, [id]);

  // Update time remaining
  useEffect(() => {
    if (!letter || isLetterDelivered(letter)) return;
    
    const timer = setInterval(() => {
      const remaining = getTimeRemainingMs(letter);
      setTimeRemaining(remaining);
      
      // Check if letter is now delivered
      if (remaining <= 0) {
        updateLetterStatus(letter.id, 'delivered');
        setLetter(prev => prev ? { ...prev, status: 'delivered' } : null);
        clearInterval(timer);
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, [letter]);

  if (!loaded) {
    return (
      <Layout title="Tracking Letter - Digital Letter Service">
        <div className="max-w-3xl mx-auto text-center p-12">
          <motion.div 
            className="inline-block"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          >
            <svg className="w-12 h-12 text-amber-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </motion.div>
          <p className="mt-4 text-amber-800 font-medium">Loading your letter...</p>
        </div>
      </Layout>
    );
  }

  if (!letter) {
    return (
      <Layout title="Letter Not Found - Digital Letter Service">
        <div className="max-w-3xl mx-auto text-center p-12">
          <div className="bg-white rounded-lg shadow-lg p-8 border border-amber-100">
            <svg className="w-24 h-24 text-amber-300 mx-auto mb-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h1 className="text-3xl font-bold text-amber-900 mb-6">Letter Not Found</h1>
            <p className="text-amber-700 mb-8 max-w-md mx-auto">
              The letter you're looking for does not exist or has been removed. Perhaps it was delivered to the wrong address?
            </p>
            <button
              onClick={() => router.push('/track')}
              className="px-6 py-3 bg-amber-600 text-white font-medium rounded-md hover:bg-amber-700 transition-colors shadow-md"
            >
              Back to Your Letters
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const delivered = isLetterDelivered(letter);

  return (
    <Layout title={`${delivered ? 'Delivered' : 'Tracking'} Letter - Digital Letter Service`}>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-amber-900">
            {delivered ? 'Delivered Letter' : 'Letter in Transit'}
          </h1>
          <button
            onClick={() => router.push('/track')}
            className="px-4 py-2 bg-amber-100 text-amber-800 rounded-md hover:bg-amber-200 transition-colors shadow-sm flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            All Letters
          </button>
        </div>
        
        {!delivered && (
          <div className="mb-8">
            <div className="bg-white rounded-lg shadow-md p-6 mb-4 border border-amber-100">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-serif font-semibold text-amber-800">Delivery Status</h2>
                <div className="text-sm bg-amber-100 text-amber-800 px-3 py-1 rounded-full font-medium">
                  In Transit
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-amber-50/50 p-4 rounded-lg text-center">
                  <h3 className="text-amber-700 text-sm font-medium mb-1">Origin</h3>
                  <div className="text-amber-900 font-medium">{letter.originAddress}</div>
                </div>
                
                <div className="bg-amber-50/50 p-4 rounded-lg text-center">
                  <h3 className="text-amber-700 text-sm font-medium mb-1">Estimated Delivery</h3>
                  <div className="text-amber-900 text-xl font-bold">
                    {formatTimeRemaining(timeRemaining)}
                  </div>
                </div>
                
                <div className="bg-amber-50/50 p-4 rounded-lg text-center">
                  <h3 className="text-amber-700 text-sm font-medium mb-1">Destination</h3>
                  <div className="text-amber-900 font-medium">{letter.destinationAddress}</div>
                </div>
              </div>
              
              <div className="mt-6">
                <div className="text-amber-700 text-sm font-medium mb-2">Delivery Progress</div>
                <div className="w-full bg-amber-100 rounded-full h-2.5 overflow-hidden shadow-inner">
                  <div 
                    className="bg-amber-600 h-full rounded-full transition-all duration-500"
                    style={{ 
                      width: `${Math.max(5, 100 - (timeRemaining / (letter.deliveryTime * 10)))}%`
                    }}
                  ></div>
                </div>
              </div>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <LetterAnimation letter={letter} />
            </motion.div>
            
            <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 text-amber-700 text-sm mt-4">
              <div className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-amber-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p>
                  Your letter is traveling in real-time! The messenger is on horseback, carrying your letter across the distance that separates the sender and recipient. The delivery time is based on the actual geographic distance.
                </p>
              </div>
            </div>
          </div>
        )}
        
        <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-amber-100">
          {delivered && (
            <div className="bg-green-50 px-6 py-4 border-b border-green-100">
              <div className="flex items-center">
                <svg className="h-6 w-6 text-green-500 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <h2 className="text-green-800 font-medium">Letter Delivered</h2>
                  <p className="text-green-700 text-sm">
                    Delivered on {new Date(letter.sentAt + letter.deliveryTime * 1000).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <div className="p-6">
            <LetterDisplay letter={letter} showContent={delivered} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LetterTrackingPage; 