import React, { useState, useEffect, useRef } from 'react';
import { StudySessionState, PhonicsCard } from '../types';
import { Flashcard, FlashcardHandle } from './Flashcard';
import { Button } from './Button';
import { ArrowLeft, Check, X, Trophy, Star, ThumbsUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

interface StudySessionProps {
  cards: PhonicsCard[];
  onFinish: (resultState: StudySessionState) => void;
  onExit: () => void;
}

export const StudySession: React.FC<StudySessionProps> = ({ cards, onFinish, onExit }) => {
  const [queue, setQueue] = useState<PhonicsCard[]>(cards);
  const [correct, setCorrect] = useState<PhonicsCard[]>([]);
  const [incorrect, setIncorrect] = useState<PhonicsCard[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  
  const flashcardRef = useRef<FlashcardHandle>(null);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (queue.length === 0) return;
      
      if (e.key === 'ArrowLeft') {
        flashcardRef.current?.swipe('left');
      } else if (e.key === 'ArrowRight') {
        flashcardRef.current?.swipe('right');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [queue.length]);

  const handleSwipe = (direction: 'left' | 'right') => {
    const currentCard = queue[0];
    if (!currentCard) return;

    // Trigger Visual Feedback
    if (direction === 'right') {
      setFeedback('correct');
      // Confetti burst for correct answer
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4CC9F0', '#F72585', '#F9C74F', '#43AA8B']
      });
      setCorrect([...correct, currentCard]);
    } else {
      setFeedback('incorrect');
      setIncorrect([...incorrect, currentCard]);
    }

    // Reset feedback after a moment
    setTimeout(() => setFeedback(null), 1200);

    const newQueue = queue.slice(1);
    setQueue(newQueue);

    if (newQueue.length === 0) {
      // Delay slightly to let the last card animate out
      setTimeout(() => {
        onFinish({
          correct: direction === 'right' ? [...correct, currentCard] : correct,
          incorrect: direction === 'left' ? [...incorrect, currentCard] : incorrect,
          remaining: [],
          isFinished: true
        });
      }, 500);
    }
  };

  const completedCount = cards.length - queue.length;
  const progressPercent = (completedCount / cards.length) * 100;

  return (
    <div className="flex flex-col h-screen w-full relative overflow-hidden bg-sky-200">
      
      {/* Game Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-30 pointer-events-none" 
           style={{ 
             backgroundImage: 'radial-gradient(#fff 2px, transparent 2px), radial-gradient(#fff 2px, transparent 2px)',
             backgroundSize: '30px 30px',
             backgroundPosition: '0 0, 15px 15px' 
           }}>
      </div>
      
      {/* Floating Clouds (CSS Only) */}
      <div className="absolute top-10 left-[-50px] w-32 h-12 bg-white rounded-full opacity-60 blur-xl animate-wiggle"></div>
      <div className="absolute top-40 right-[-20px] w-40 h-16 bg-white rounded-full opacity-40 blur-xl animate-wiggle" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-20 left-20 w-48 h-20 bg-white rounded-full opacity-30 blur-2xl animate-wiggle" style={{ animationDelay: '2s' }}></div>

      {/* Header UI */}
      <div className="p-4 flex items-center justify-between z-20 relative pt-safe-top">
        <button onClick={onExit} className="w-12 h-12 bg-white border-2 border-gray-100 rounded-2xl shadow-[0_4px_0_rgba(0,0,0,0.1)] active:shadow-none active:translate-y-1 flex items-center justify-center transition-all">
          <ArrowLeft className="w-6 h-6 text-kid-blue font-bold" />
        </button>
        
        {/* Progress Bar */}
        <div className="mx-4 w-48 sm:w-64">
           <div className="flex justify-between text-xs font-black text-kid-blue mb-1 uppercase tracking-wider">
             <span>Tiến độ</span>
             <span className="text-base">{completedCount}/{cards.length}</span>
           </div>
           <div className="h-5 bg-white rounded-full overflow-hidden border-2 border-white/50 shadow-inner p-1">
              <motion.div 
                className="h-full bg-gradient-to-r from-kid-green to-teal-400 rounded-full shadow-[0_2px_0_rgba(0,0,0,0.1)inset]"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ type: 'spring', stiffness: 50 }}
              />
           </div>
        </div>

        <div className="w-12 h-12 bg-white border-2 border-gray-100 rounded-2xl shadow-[0_4px_0_rgba(0,0,0,0.1)] flex items-center justify-center text-kid-yellow">
           <Trophy className="w-6 h-6 fill-current" />
        </div>
      </div>

      {/* Visual Feedback Overlay */}
      <AnimatePresence>
        {feedback && (
          <motion.div 
            initial={{ scale: 0, opacity: 0, rotate: -20 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 1.5, opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none"
          >
             {feedback === 'correct' ? (
                <div className="flex flex-col items-center">
                   <div className="relative">
                     <Star className="w-40 h-40 text-kid-yellow fill-kid-yellow drop-shadow-2xl" />
                     <motion.div 
                       animate={{ scale: [1, 1.2, 1] }} 
                       transition={{ repeat: Infinity, duration: 0.5 }}
                       className="absolute inset-0 flex items-center justify-center"
                     >
                        <span className="text-5xl">🤩</span>
                     </motion.div>
                   </div>
                   <h2 className="text-5xl font-display font-black text-yellow-300 mt-4 drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)] stroke-white">Tuyệt vời!</h2>
                </div>
             ) : (
                <div className="flex flex-col items-center">
                   <div className="w-40 h-40 bg-white rounded-full flex items-center justify-center shadow-xl border-8 border-kid-pink">
                     <ThumbsUp className="w-20 h-20 text-kid-pink transform rotate-180" />
                   </div>
                   <h2 className="text-5xl font-display font-black text-white mt-4 drop-shadow-[0_4px_4px_rgba(0,0,0,0.4)]">Cố lên nhé!</h2>
                </div>
             )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Card Deck Area */}
      <div className="flex-1 relative flex items-center justify-center p-4 z-10">
        <div className="relative w-full max-w-sm aspect-[3/4] max-h-[60vh]">
          <AnimatePresence>
            {queue.map((card, index) => (
              index <= 1 && ( 
                <Flashcard 
                  key={card.id} 
                  ref={index === 0 ? flashcardRef : null}
                  card={card} 
                  active={index === 0}
                  onSwipe={handleSwipe}
                />
              )
            ))}
          </AnimatePresence>
          
          {queue.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-white">
              <span className="animate-spin text-6xl mb-4">🎉</span>
              <p className="font-display text-2xl font-bold">Hoan hô!</p>
            </div>
          )}
        </div>
      </div>

      {/* Game Controls */}
      <div className="p-6 pb-8 grid grid-cols-2 gap-6 z-20 max-w-lg mx-auto w-full relative">
        
        {/* Statistics Counters */}
        <div className="absolute -top-6 left-6 flex items-center justify-center pointer-events-none w-[calc(50%-1.5rem)]">
          <div className="bg-white border-4 border-kid-pink text-kid-pink font-black px-4 py-1 rounded-full shadow-sm text-lg flex items-center gap-2 animate-bounce-slow">
             <X size={20} strokeWidth={4} /> 
             <span>{incorrect.length}</span>
          </div>
        </div>

        <div className="absolute -top-6 right-6 flex items-center justify-center pointer-events-none w-[calc(50%-1.5rem)]">
          <div className="bg-white border-4 border-kid-green text-kid-green font-black px-4 py-1 rounded-full shadow-sm text-lg flex items-center gap-2 animate-bounce-slow" style={{ animationDelay: '0.5s' }}>
             <Check size={20} strokeWidth={4} />
             <span>{correct.length}</span>
          </div>
        </div>

        <Button 
          variant="danger" 
          onClick={() => flashcardRef.current?.swipe('left')}
          disabled={queue.length === 0}
          className="flex-col py-4 h-24 !rounded-3xl !shadow-[0_8px_0_#9d174d] active:!shadow-none active:!translate-y-[8px] relative overflow-hidden"
        >
          <X className="w-8 h-8 mb-1" strokeWidth={4} />
          <span className="text-lg font-black uppercase">Chưa thuộc</span>
        </Button>
        <Button 
          variant="success" 
          onClick={() => flashcardRef.current?.swipe('right')}
          disabled={queue.length === 0}
          className="flex-col py-4 h-24 !rounded-3xl !shadow-[0_8px_0_#15803d] active:!shadow-none active:!translate-y-[8px] relative overflow-hidden"
        >
          <Check className="w-8 h-8 mb-1" strokeWidth={4} />
          <span className="text-lg font-black uppercase">Đã thuộc</span>
        </Button>
      </div>
    </div>
  );
};