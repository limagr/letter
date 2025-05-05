import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { getDistance } from '../lib/distance';
import { saveLetter } from '../lib/letterUtils';
import { v4 as uuidv4 } from 'uuid';
import { motion, AnimatePresence } from 'framer-motion';

const paperOptions = [
  { id: 'classic', name: 'Classic Cream', bg: 'bg-amber-50', texture: 'classic-paper', border: 'border-amber-100' },
  { id: 'parchment', name: 'Vintage Parchment', bg: 'bg-[#f5f0e5]', texture: 'parchment-paper', border: 'border-amber-200' },
  { id: 'linen', name: 'Linen White', bg: 'bg-white', texture: 'linen-paper', border: 'border-gray-200' },
  { id: 'recycled', name: 'Recycled Natural', bg: 'bg-stone-50', texture: 'recycled-paper', border: 'border-stone-200' },
  { id: 'colored', name: 'Soft Blue', bg: 'bg-blue-50', texture: 'blue-paper', border: 'border-blue-100' },
];

const fontOptions = [
  { id: 'serif', name: 'Elegant Serif', fontClass: 'font-serif' },
  { id: 'handwritten', name: 'Handwritten', fontClass: 'font-handwritten' },
  { id: 'typewriter', name: 'Typewriter', fontClass: 'font-typewriter' },
  { id: 'modern', name: 'Modern Sans', fontClass: 'font-sans' },
  { id: 'cursive', name: 'Flowing Cursive', fontClass: 'font-cursive' },
];

const stickerCategories = [
  {
    name: 'Nature',
    stickers: [
      { id: 'flower', emoji: '🌸', name: 'Flower' },
      { id: 'tree', emoji: '🌳', name: 'Tree' },
      { id: 'leaf', emoji: '🍂', name: 'Leaf' },
      { id: 'mountain', emoji: '⛰️', name: 'Mountain' },
      { id: 'sun', emoji: '☀️', name: 'Sun' },
    ]
  },
  {
    name: 'Feelings',
    stickers: [
      { id: 'heart', emoji: '❤️', name: 'Heart' },
      { id: 'smile', emoji: '😊', name: 'Smile' },
      { id: 'star', emoji: '⭐', name: 'Star' },
      { id: 'sparkle', emoji: '✨', name: 'Sparkle' },
      { id: 'hug', emoji: '🤗', name: 'Hug' },
    ]
  },
  {
    name: 'Travel',
    stickers: [
      { id: 'plane', emoji: '✈️', name: 'Plane' },
      { id: 'luggage', emoji: '🧳', name: 'Luggage' },
      { id: 'map', emoji: '🗺️', name: 'Map' },
      { id: 'compass', emoji: '🧭', name: 'Compass' },
      { id: 'globe', emoji: '🌎', name: 'Globe' },
    ]
  }
];

const CreateLetter: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    sender: '',
    recipient: '',
    originAddress: '',
    destinationAddress: '',
    message: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'details' | 'message' | 'customize'>('details');
  
  // New customization states
  const [selectedPaper, setSelectedPaper] = useState(paperOptions[0]);
  const [selectedFont, setSelectedFont] = useState(fontOptions[0]);
  const [selectedStickers, setSelectedStickers] = useState<{id: string, emoji: string, x: number, y: number}[]>([]);
  const [activeStickerCategory, setActiveStickerCategory] = useState(stickerCategories[0]);
  const [showEnvelopeAnimation, setShowEnvelopeAnimation] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStickerAdd = (sticker: {id: string, emoji: string}) => {
    // Add sticker with random position within the letter area
    const x = 20 + Math.random() * 60; // 20-80% of width
    const y = 20 + Math.random() * 60; // 20-80% of height
    setSelectedStickers([...selectedStickers, {...sticker, x, y}]);
  };

  const handleStickerMove = (index: number, newX: number, newY: number) => {
    const newStickers = [...selectedStickers];
    newStickers[index] = {...newStickers[index], x: newX, y: newY};
    setSelectedStickers(newStickers);
  };

  const handleStickerRemove = (index: number) => {
    setSelectedStickers(selectedStickers.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    // Mostrar animação do envelope
    setShowEnvelopeAnimation(true);
    
    // Esperar a animação terminar antes de continuar
    setTimeout(async () => {
      try {
        // Validar formulário
        if (!formData.sender || !formData.recipient || !formData.originAddress || 
            !formData.destinationAddress || !formData.message) {
          throw new Error('Por favor, preencha todos os campos');
        }

        // Obter dados de distância da API Google
        const distanceData = await getDistance(formData.originAddress, formData.destinationAddress);
        
        if (!distanceData) {
          throw new Error('Não foi possível calcular a distância. Por favor, verifique os endereços e tente novamente.');
        }

        // Criar objeto da carta com opções de personalização
        const letter = {
          id: uuidv4(),
          ...formData,
          sentAt: Date.now(),
          deliveryTime: distanceData.duration.value, // segundos
          status: 'transit' as const,
          customization: {
            paper: selectedPaper.id,
            font: selectedFont.id,
            stickers: selectedStickers.map(s => ({
              id: s.id,
              emoji: s.emoji,
              position: { x: s.x, y: s.y }
            }))
          }
        };

        // Salvar carta
        saveLetter(letter);

        // Redirecionamento para página de rastreamento
        setTimeout(() => {
          router.push(`/track/${letter.id}`);
        }, 1000);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('Ocorreu um erro inesperado');
        }
        setIsLoading(false);
        setShowEnvelopeAnimation(false);
      }
    }, 3000); // 3 segundos para animação
  };

  const handleNextStep = () => {
    if (step === 'details') {
      if (!formData.sender || !formData.recipient || !formData.originAddress || !formData.destinationAddress) {
        setError('Please fill in all address fields');
        return;
      }
      setError(null);
      setStep('message');
    } else if (step === 'message') {
      if (!formData.message) {
        setError('Please write your message');
        return;
      }
      setError(null);
      setStep('customize');
    }
  };
  
  const handlePrevStep = () => {
    if (step === 'message') {
      setStep('details');
    } else if (step === 'customize') {
      setStep('message');
    }
  };

  // Componente de animação do envelope
  const EnvelopeAnimation = () => (
    <motion.div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      exit={{ opacity: 0 }}
    >
      <div className="relative w-[400px] h-[300px]">
        {/* Papel com carta */}
        <motion.div 
          className={`absolute inset-0 ${selectedPaper.bg} rounded-lg shadow-lg p-6 ${selectedPaper.texture} overflow-hidden z-20 origin-bottom`}
          initial={{ y: 0 }}
          animate={{ 
            y: -200,
            transition: { delay: 0.5, duration: 1, ease: "easeInOut" }
          }}
        >
          <div className={`text-sm ${selectedFont.fontClass} text-amber-900 opacity-80 overflow-hidden h-full`}>
            {formData.message}
          </div>
          
          {/* Adesivos na carta */}
          {selectedStickers.map((sticker, index) => (
            <div 
              key={index}
              className="absolute text-2xl"
              style={{ top: `${sticker.y}%`, left: `${sticker.x}%` }}
            >
              {sticker.emoji}
            </div>
          ))}
        </motion.div>
        
        {/* Envelope */}
        <motion.div className="absolute inset-0 bg-white rounded-lg shadow-lg z-10">
          {/* Aba inferior */}
          <motion.div 
            className="absolute bottom-0 left-0 right-0 h-[150px] bg-white border-t border-amber-100 rounded-b-lg shadow-sm z-30 origin-bottom"
            initial={{ rotateX: -90 }}
            animate={{ 
              rotateX: 0,
              transition: { delay: 1.4, duration: 0.5, ease: "easeOut" }
            }}
          />
          
          {/* Aba esquerda */}
          <motion.div 
            className="absolute top-0 left-0 bottom-0 w-[200px] bg-white border-r border-amber-100 rounded-l-lg shadow-sm z-40 origin-left"
            initial={{ rotateY: -90 }}
            animate={{ 
              rotateY: 0,
              transition: { delay: 1.9, duration: 0.4, ease: "easeOut" }
            }}
          />
          
          {/* Aba direita */}
          <motion.div 
            className="absolute top-0 right-0 bottom-0 w-[200px] bg-white border-l border-amber-100 rounded-r-lg shadow-sm z-40 origin-right"
            initial={{ rotateY: 90 }}
            animate={{ 
              rotateY: 0,
              transition: { delay: 2.3, duration: 0.4, ease: "easeOut" }
            }}
          />
          
          {/* Aba superior */}
          <motion.div 
            className="absolute top-0 left-0 right-0 h-[150px] bg-white border-b border-amber-100 rounded-t-lg shadow-md z-50 origin-top"
            initial={{ rotateX: 90 }}
            animate={{ 
              rotateX: 0,
              transition: { delay: 2.7, duration: 0.5, ease: "easeOut" }
            }}
          >
            <div className="absolute bottom-2 left-0 right-0 text-center text-amber-900 opacity-60 text-sm">
              {formData.recipient}
            </div>
          </motion.div>
          
          {/* Selo ou marca do envelope */}
          <motion.div
            className="absolute right-5 top-5 w-12 h-12 bg-amber-100 rounded-sm z-60 flex items-center justify-center border border-amber-200"
            initial={{ scale: 0, rotate: -15 }}
            animate={{ 
              scale: 1, 
              rotate: 0,
              transition: { delay: 3.2, duration: 0.4, type: "spring" }
            }}
          >
            <div className="text-amber-800 text-[10px] font-bold text-center">
              <div>POSTAL</div>
              <div className="text-[8px] opacity-60">MAIL</div>
            </div>
          </motion.div>
        </motion.div>
        
        {/* Mensagem de envio */}
        <motion.div
          className="absolute -bottom-16 text-white text-center w-full"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: 1,
            transition: { delay: 3.5, duration: 0.3 }
          }}
        >
          Enviando sua carta...
        </motion.div>
      </div>
    </motion.div>
  );

  return (
    <Layout title="Write a Letter - Digital Letter Service">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-serif font-bold text-center text-amber-900 mb-2">Write a Letter</h1>
        <p className="text-center text-amber-700 mb-8 font-medium">Create your letter which will travel in real time to its destination</p>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6 border border-red-100">
            <div className="font-medium">{error}</div>
          </div>
        )}
        
        <div className={`ornate-container shadow-xl ${selectedPaper.bg} border ${selectedPaper.border} transition-all ${selectedPaper.texture}`}>
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(#92400E_0.5px,transparent_0)] [background-size:15px_15px] opacity-10"></div>
          
          {step === 'details' && (
            <form className="relative">
              <div className="mb-8 border-b border-amber-200 pb-6">
                <div className="flex justify-between items-center mb-6">
                  <div className="letter-stamp text-xs">
                    <div className="font-bold text-amber-800">POSTAL</div>
                    <div className="text-[8px] mt-1 opacity-80">DIGITAL MAIL</div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-serif text-amber-800 opacity-80 text-sm">
                      {new Date().toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric', 
                        year: 'numeric'
                      })}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-amber-800 font-medium mb-2" htmlFor="sender">
                      Your Name (Sender)
                    </label>
                    <input
                      type="text"
                      id="sender"
                      name="sender"
                      value={formData.sender}
                      onChange={handleChange}
                      className="input-styled"
                      placeholder="John Doe"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-amber-800 font-medium mb-2" htmlFor="recipient">
                      Recipient Name
                    </label>
                    <input
                      type="text"
                      id="recipient"
                      name="recipient"
                      value={formData.recipient}
                      onChange={handleChange}
                      className="input-styled"
                      placeholder="Jane Smith"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <div className="mb-6">
                  <label className="block text-amber-800 font-medium mb-2" htmlFor="originAddress">
                    Your Location (Origin)
                  </label>
                  <input
                    type="text"
                    id="originAddress"
                    name="originAddress"
                    value={formData.originAddress}
                    onChange={handleChange}
                    className="input-styled"
                    placeholder="New York, NY, USA"
                  />
                  <p className="text-sm text-amber-700 mt-1">
                    Enter a full address or city name. Example: &ldquo;London, UK&rdquo; or &ldquo;123 Main St, Seattle, WA&rdquo;
                  </p>
                </div>
                
                <div className="mb-6">
                  <label className="block text-amber-800 font-medium mb-2" htmlFor="destinationAddress">
                    Recipient Location (Destination)
                  </label>
                  <input
                    type="text"
                    id="destinationAddress"
                    name="destinationAddress"
                    value={formData.destinationAddress}
                    onChange={handleChange}
                    className="input-styled"
                    placeholder="Los Angeles, CA, USA"
                  />
                  <p className="text-sm text-amber-700 mt-1">
                    Enter a full address or city name. Example: &ldquo;Paris, France&rdquo; or &ldquo;456 Oak St, Miami, FL&rdquo;
                  </p>
                </div>
              </div>
              
              <div className="mt-8 p-4 bg-white/80 rounded-md border border-amber-100">
                <h3 className="text-sm font-semibold text-amber-800 mb-2">How It Works:</h3>
                <p className="text-sm text-amber-700">
                  After you send this letter, we&apos;ll calculate the real-world travel time between the origin and destination.
                  Your letter will be &ldquo;in transit&rdquo; until that time has passed, just like real mail!
                </p>
              </div>
              
              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="btn-primary"
                >
                  Write Your Letter →
                </button>
              </div>
            </form>
          )}
          
          {step === 'message' && (
            <form className="relative">
              <div className="letter-writing-area">
                <div className="mb-4 flex justify-between items-center">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="text-amber-700 hover:text-amber-900 transition-colors"
                  >
                    ← Back to Details
                  </button>
                  
                  <div className="text-right">
                    <div className="font-serif text-amber-800 opacity-80 text-sm">
                      {new Date().toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric', 
                        year: 'numeric'
                      })}
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 mb-4">
                  <p className={`${selectedFont.fontClass} text-amber-900 text-right mb-8`}>
                    <span className="italic">From {formData.originAddress}</span>
                  </p>
                  
                  <p className={`${selectedFont.fontClass} text-amber-900 mb-8`}>
                    Dear {formData.recipient},
                  </p>
                </div>
                
                <div className="mb-6 relative">
                  <textarea
                    id="message"
                    name="message"
                    rows={10}
                    value={formData.message}
                    onChange={handleChange}
                    className={`textarea-styled ${selectedFont.fontClass}`}
                    placeholder="Write your letter here..."
                  />
                  
                  {/* Display stickers positioned on the letter */}
                  {selectedStickers.map((sticker, index) => (
                    <div 
                      key={index}
                      className="absolute text-3xl cursor-move z-10"
                      style={{ top: `${sticker.y}%`, left: `${sticker.x}%` }}
                      // In a real implementation, we'd use drag handlers here
                    >
                      {sticker.emoji}
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-between mt-10">
                  <p className={`${selectedFont.fontClass} text-amber-900 text-right italic`}>
                    Yours truly,<br/>
                    {formData.sender}
                  </p>
                </div>
                
                <div className="flex justify-end mt-6">
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="btn-primary"
                  >
                    Customize Letter →
                  </button>
                </div>
              </div>
            </form>
          )}
          
          {step === 'customize' && (
            <div className="relative">
              <div className="mb-4 flex justify-between items-center">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="text-amber-700 hover:text-amber-900 transition-colors"
                >
                  ← Back to Message
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Letter preview */}
                <div className={`lg:col-span-2 p-6 rounded-lg ${selectedPaper.bg} ${selectedPaper.texture} border ${selectedPaper.border} shadow-md min-h-[400px] relative overflow-hidden`}>
                  <div className="mb-4">
                    <p className={`${selectedFont.fontClass} text-amber-900 text-right mb-8`}>
                      <span className="italic">From {formData.originAddress}</span>
                    </p>
                    
                    <p className={`${selectedFont.fontClass} text-amber-900 mb-8`}>
                      Dear {formData.recipient},
                    </p>
                  </div>
                  
                  <div className={`${selectedFont.fontClass} text-amber-900 whitespace-pre-line`}>
                    {formData.message}
                  </div>
                  
                  <div className="mt-10">
                    <p className={`${selectedFont.fontClass} text-amber-900 text-right italic`}>
                      Yours truly,<br/>
                      {formData.sender}
                    </p>
                  </div>
                  
                  {/* Display stickers positioned on the letter */}
                  {selectedStickers.map((sticker, index) => (
                    <motion.div 
                      key={index}
                      className="absolute text-3xl cursor-move"
                      style={{ top: `${sticker.y}%`, left: `${sticker.x}%` }}
                      drag
                      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                      dragElastic={0.1}
                      dragMomentum={false}
                      onDragEnd={(event) => {
                        try {
                          const element = event.target as HTMLElement;
                          if (!element) return;
                          
                          const rect = element.getBoundingClientRect();
                          const parentRect = element.offsetParent?.getBoundingClientRect();
                          
                          if (parentRect) {
                            const newX = ((rect.left - parentRect.left) / parentRect.width) * 100;
                            const newY = ((rect.top - parentRect.top) / parentRect.height) * 100;
                            handleStickerMove(index, newX, newY);
                          }
                        } catch (err) {
                          console.error("Error in drag handler:", err);
                        }
                      }}
                      whileTap={{ scale: 1.2 }}
                      onDoubleClick={() => handleStickerRemove(index)}
                    >
                      {sticker.emoji}
                    </motion.div>
                  ))}
                </div>
                
                {/* Customization options */}
                <div className="customization-panel bg-white rounded-lg shadow-md p-4 border border-gray-100">
                  <div className="mb-6">
                    <h3 className="text-amber-900 font-semibold mb-3">Paper Style</h3>
                    <div className="grid grid-cols-3 gap-2">
                      {paperOptions.map(paper => (
                        <button
                          key={paper.id}
                          onClick={() => setSelectedPaper(paper)}
                          className={`p-2 rounded ${paper.id === selectedPaper.id ? 'ring-2 ring-amber-500' : 'hover:bg-amber-50'}`}
                        >
                          <div className={`w-full h-8 rounded ${paper.bg} ${paper.texture} border ${paper.border}`}></div>
                          <div className="text-xs mt-1 text-amber-900">{paper.name}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-amber-900 font-semibold mb-3">Font Style</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {fontOptions.map(font => (
                        <button
                          key={font.id}
                          onClick={() => setSelectedFont(font)}
                          className={`p-2 rounded text-center ${font.id === selectedFont.id ? 'ring-2 ring-amber-500 bg-amber-50' : 'hover:bg-amber-50'}`}
                        >
                          <div className={`${font.fontClass} text-amber-900`}>Aa</div>
                          <div className="text-xs mt-1 text-amber-900">{font.name}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-amber-900 font-semibold mb-3">Add Stickers</h3>
                    
                    <div className="mb-3 border-b border-amber-100">
                      {stickerCategories.map(category => (
                        <button
                          key={category.name}
                          onClick={() => setActiveStickerCategory(category)}
                          className={`px-3 py-1 text-sm rounded-t mr-1 ${activeStickerCategory.name === category.name ? 'bg-amber-100 text-amber-900' : 'text-amber-700 hover:bg-amber-50'}`}
                        >
                          {category.name}
                        </button>
                      ))}
                    </div>
                    
                    <div className="grid grid-cols-5 gap-1">
                      {activeStickerCategory.stickers.map(sticker => (
                        <button
                          key={sticker.id}
                          onClick={() => handleStickerAdd(sticker)}
                          className="p-2 text-center hover:bg-amber-50 rounded"
                          title={sticker.name}
                        >
                          <div className="text-2xl">{sticker.emoji}</div>
                        </button>
                      ))}
                    </div>
                    
                    <p className="text-xs text-amber-700 mt-2">
                      Click to add. Drag to reposition. Double-click to remove.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end mt-8">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="btn-primary"
                  disabled={isLoading}
                >
                  {isLoading ? 'Sending...' : 'Send Letter'}
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Envelope Animation */}
        <AnimatePresence>
          {showEnvelopeAnimation && <EnvelopeAnimation />}
        </AnimatePresence>
      </div>
    </Layout>
  );
};

export default CreateLetter; 