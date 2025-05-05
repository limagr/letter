import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { getLetters, isLetterDelivered } from '../../lib/letterUtils';
import { Letter } from '../../types';
import { motion } from 'framer-motion';

const TrackLetters: React.FC = () => {
  const [letters, setLetters] = useState<Letter[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Load letters from localStorage
    const loadedLetters = getLetters();
    setLetters(loadedLetters);
    setLoaded(true);
  }, []);

  if (!loaded) {
    return (
      <Layout title="Track Letters - Digital Letter Service">
        <div className="max-w-4xl mx-auto text-center p-12">
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
          <p className="mt-4 text-amber-800 font-medium">Loading your letters...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Your Letters - Digital Letter Service">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-amber-900">Your Letters</h1>
          <Link href="/create" className="px-5 py-2.5 bg-amber-600 text-white font-medium rounded-md hover:bg-amber-700 transition-colors shadow-md flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Write New Letter
          </Link>
        </div>
        
        {letters.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow-md p-12 text-center border border-amber-100"
          >
            <img 
              src="/empty-mailbox.svg" 
              alt="Empty mailbox" 
              className="w-48 h-48 mx-auto mb-6 opacity-80"
              onError={(e) => {
                // Fallback if image doesn't exist
                const target = e.target as HTMLImageElement;
                target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2NhOGEwNCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxyZWN0IHg9IjIiIHk9IjQiIHdpZHRoPSIyMCIgaGVpZ2h0PSIxNiIgcng9IjIiPjwvcmVjdD48cGF0aCBkPSJNMjIgNyBMMTIgMTQgTDIgNyI+PC9wYXRoPjwvc3ZnPg==';
              }}
            />
            <h2 className="text-2xl font-serif font-semibold text-amber-900 mb-4">No Letters Found</h2>
            <p className="text-amber-700 mb-8 max-w-md mx-auto">
              Your mailbox is empty. Start your journey by writing a beautiful letter to someone special.
            </p>
            <Link href="/create" className="inline-block px-6 py-3 bg-amber-600 text-white font-medium rounded-md hover:bg-amber-700 transition-colors shadow-md">
              Write Your First Letter
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {letters.map((letter, index) => {
              const delivered = isLetterDelivered(letter);
              
              return (
                <motion.div 
                  key={letter.id} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`bg-white rounded-lg shadow-md border-l-4 ${
                    delivered ? 'border-green-500' : 'border-amber-500'
                  } hover:shadow-lg transition-all duration-200`}
                >
                  <Link 
                    href={`/track/${letter.id}`}
                    className="block p-6"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-serif font-semibold mb-2 text-amber-900 group-hover:text-amber-700">
                          From {letter.sender} to {letter.recipient}
                        </h3>
                        <p className="text-sm text-amber-700 mb-1">
                          {letter.originAddress} → {letter.destinationAddress}
                        </p>
                        <p className="text-sm text-amber-600">
                          Sent: {new Date(letter.sentAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          delivered 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {delivered ? 'Delivered' : 'In Transit'}
                        </span>
                        
                        {delivered ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-500 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-4 flex justify-between items-center">
                      <div className="text-sm">
                        {delivered ? (
                          <span className="text-green-600">
                            Delivered on {new Date(letter.sentAt + letter.deliveryTime * 1000).toLocaleString()}
                          </span>
                        ) : (
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-amber-600">Estimated delivery in progress</span>
                          </div>
                        )}
                      </div>
                      
                      <span className="text-amber-600 hover:text-amber-800 text-sm font-medium inline-flex items-center">
                        View Details
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default TrackLetters; 