import React from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';

const Home: React.FC = () => {
  return (
    <Layout title="Postal - Digital Letter Service">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-16">
          <h1 className="text-5xl font-serif font-bold text-amber-800 mb-6">Postal</h1>
          <p className="text-xl text-amber-700 mb-8 font-serif">
            Digital letters delivered with the charm of real mail
          </p>
          
          {/* Hero image */}
          <div className="relative w-64 h-64 mx-auto mb-8">
            <div className="absolute inset-0 transform rotate-6 bg-amber-100 rounded-lg border-2 border-amber-300 shadow-lg"></div>
            <div className="absolute inset-0 transform -rotate-3 bg-amber-50 rounded-lg border-2 border-amber-200 shadow-lg"></div>
            <div className="absolute inset-0 transform rotate-1 bg-white rounded-lg border-2 border-amber-300 shadow-lg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-xl p-8 mb-12 border-2 border-amber-200">
            <h2 className="text-2xl font-serif font-semibold text-amber-800 mb-6">How It Works</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
              <div className="bg-amber-50 rounded-lg p-6 shadow-inner border border-amber-200 transform transition-transform hover:scale-105">
                <div className="w-16 h-16 rounded-full bg-amber-100 border-2 border-amber-300 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-serif font-bold text-amber-700">1</span>
                </div>
                <h3 className="text-lg font-serif font-medium mb-3 text-amber-800">Write Your Letter</h3>
                <p className="text-amber-700">Compose a heartfelt message with sender and recipient details.</p>
              </div>
              
              <div className="bg-amber-50 rounded-lg p-6 shadow-inner border border-amber-200 transform transition-transform hover:scale-105">
                <div className="w-16 h-16 rounded-full bg-amber-100 border-2 border-amber-300 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-serif font-bold text-amber-700">2</span>
                </div>
                <h3 className="text-lg font-serif font-medium mb-3 text-amber-800">Letter Travels</h3>
                <p className="text-amber-700">Your letter journeys between locations at real-world travel speeds.</p>
              </div>
              
              <div className="bg-amber-50 rounded-lg p-6 shadow-inner border border-amber-200 transform transition-transform hover:scale-105">
                <div className="w-16 h-16 rounded-full bg-amber-100 border-2 border-amber-300 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-serif font-bold text-amber-700">3</span>
                </div>
                <h3 className="text-lg font-serif font-medium mb-3 text-amber-800">Delivery</h3>
                <p className="text-amber-700">When the journey completes, your letter is delivered and can be read.</p>
              </div>
            </div>
            
            <p className="text-amber-700 mb-8 font-serif max-w-2xl mx-auto">
              In our digital age, we&apos;ve lost the anticipation and excitement of waiting
              for a letter to arrive. Postal brings back that special feeling by simulating real mail delivery
              based on actual distances between locations.
            </p>
            
            <div className="flex justify-center">
              <Link href="/create" className="inline-block px-8 py-4 bg-amber-600 text-white font-serif font-medium rounded-md hover:bg-amber-700 transition-colors shadow-md">
                Write a Letter
              </Link>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-amber-200 transform transition-transform hover:-rotate-1">
              <div className="mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-amber-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-serif font-semibold mb-3 text-amber-800">For Distant Connections</h3>
              <p className="text-amber-700 font-serif">
                Send thoughtful letters to loved ones far away, with delivery times that reflect the physical distance between you.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-amber-200 transform transition-transform hover:rotate-1">
              <div className="mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-amber-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-serif font-semibold mb-3 text-amber-800">For Special Moments</h3>
              <p className="text-amber-700 font-serif">
                Time your letters to arrive precisely for birthdays, anniversaries, or other meaningful occasions.
              </p>
            </div>
          </div>

          {/* Decorative element */}
          <div className="mt-12 opacity-20">
            <svg width="100" height="30" xmlns="http://www.w3.org/2000/svg" className="mx-auto">
              <path d="M0,15 C25,5 75,5 100,15 C75,25 25,25 0,15 Z" fill="#92400E" />
            </svg>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home; 