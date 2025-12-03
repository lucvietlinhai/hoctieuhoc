import React, { useRef, useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { motion, useMotionValue, useTransform, PanInfo, useAnimation } from 'framer-motion';
import { PhonicsCard } from '../types';
import { Volume2, Sparkles } from 'lucide-react';
import { generateVietnameseSpeech } from '../services/geminiService';

interface FlashcardProps {
  card: PhonicsCard;
  onSwipe: (direction: 'left' | 'right') => void;
  active: boolean;
}

export interface FlashcardHandle {
  swipe: (direction: 'left' | 'right') => Promise<void>;
}

// Helper to convert written text to phonetic reading for 1st grade
const getPhoneticReading = (text: string): string => {
  const phonetics: { [key: string]: string } = {
    'b': 'bờ', 'c': 'cờ', 'd': 'dờ', 'đ': 'đờ',
    'g': 'gờ', 'gh': 'gờ', 'h': 'hờ', 'k': 'ca',
    'l': 'lờ', 'm': 'mờ', 'n': 'nờ', 'ng': 'ngờ',
    'ngh': 'ngờ', 'p': 'pờ', 'ph': 'phờ', 'q': 'cu',
    'r': 'rờ', 's': 'sờ', 't': 'tờ', 'th': 'thờ',
    'tr': 'trờ', 'v': 'vờ', 'x': 'xờ', 'ch': 'chờ',
    'nh': 'nhờ', 'kh': 'khờ', 'gi': 'di', 
    'q-qu': 'quờ', 'qu': 'quờ'
  };
  return phonetics[text.toLowerCase()] || text;
};

export const Flashcard = forwardRef<FlashcardHandle, FlashcardProps>(({ card, onSwipe, active }, ref) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);
  const controls = useAnimation();
  
  // Audio State
  const [isLoading, setIsLoading] = useState(false);
  
  // Cache buffers specifically for this card instance
  const readBufferRef = useRef<AudioBuffer | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Expose swipe method to parent via ref
  useImperativeHandle(ref, () => ({
    swipe: async (direction: 'left' | 'right') => {
      if (direction === 'right') {
        await controls.start({ 
          x: 500, 
          opacity: 0, 
          rotate: 20, 
          transition: { duration: 0.4, ease: "easeIn" } 
        });
        onSwipe('right');
      } else {
        await controls.start({ 
          x: -500, 
          opacity: 0, 
          rotate: -20, 
          transition: { duration: 0.4, ease: "easeIn" } 
        });
        onSwipe('left');
      }
    }
  }));

  // Initialize AudioContext
  useEffect(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }, []);

  // Pre-fetch reading audio silently when card becomes active
  useEffect(() => {
    let isMounted = true;
    const prefetch = async () => {
       if (active && audioContextRef.current && !readBufferRef.current) {
         const textToSpeak = getPhoneticReading(card.sound);
         const buffer = await generateVietnameseSpeech(textToSpeak, audioContextRef.current);
         if (isMounted) readBufferRef.current = buffer;
       }
    };
    prefetch();
    return () => { isMounted = false; };
  }, [card.id, active]);

  // Reset visual state when card changes
  useEffect(() => {
    x.set(0);
    readBufferRef.current = null;
    controls.start({ x: 0, opacity: 1, rotate: 0, transition: { duration: 0.5 } });
  }, [card.id, controls, x]);

  const playBuffer = async (buffer: AudioBuffer) => {
    if (!audioContextRef.current) return;
    if (audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume();
    }
    const source = audioContextRef.current.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContextRef.current.destination);
    source.start(0);
  };

  const handleRead = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLoading) return; // Prevent double click
    
    // Check cache
    if (readBufferRef.current) {
      playBuffer(readBufferRef.current);
      return;
    }

    // Fetch
    setIsLoading(true);
    if (audioContextRef.current) {
      const textToSpeak = getPhoneticReading(card.sound);
      const buffer = await generateVietnameseSpeech(textToSpeak, audioContextRef.current);
      if (buffer) {
        readBufferRef.current = buffer;
        playBuffer(buffer);
      }
    }
    setIsLoading(false);
  };

  const handleDragEnd = async (_: any, info: PanInfo) => {
    const threshold = 100;
    if (info.offset.x > threshold) {
      await controls.start({ x: 500, opacity: 0 });
      onSwipe('right');
    } else if (info.offset.x < -threshold) {
      await controls.start({ x: -500, opacity: 0 });
      onSwipe('left');
    } else {
      controls.start({ x: 0 });
    }
  };

  if (!active) return null;

  return (
    <motion.div
      style={{ x, rotate, opacity, zIndex: 10 }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      animate={controls}
      className="absolute top-0 left-0 w-full h-full cursor-grab active:cursor-grabbing"
    >
      <div className="relative w-full h-full">
        {/* Single Face Card Design */}
        <div 
          className={`absolute w-full h-full rounded-3xl shadow-[0_10px_0_rgba(0,0,0,0.15)] bg-white border-[6px] ${card.color.replace('bg-', 'border-')} flex flex-col items-center justify-center p-6 text-gray-800 overflow-hidden`}
        >
          {/* Decorative Elements */}
          <div className="absolute top-4 right-4 animate-bounce-slow">
            <Sparkles className="w-8 h-8 text-yellow-400" />
          </div>
          <div className="absolute top-4 left-4 opacity-50">
             <div className={`w-3 h-3 rounded-full ${card.color}`}></div>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center w-full">
            <h3 className={`text-[100px] font-black text-center mb-10 leading-none whitespace-nowrap ${card.color.replace('bg-', 'text-')}`}>
              {card.sound}
            </h3>
            
            <button 
              onClick={handleRead}
              disabled={isLoading}
              className={`w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center shadow-lg active:scale-95 transition-all hover:bg-gray-50 border-4 border-transparent ${isLoading ? 'opacity-70' : ''}`}
            >
              <Volume2 className={`w-10 h-10 ${isLoading ? 'text-gray-400' : 'text-gray-700'}`} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

Flashcard.displayName = 'Flashcard';