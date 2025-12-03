import React, { useState, useEffect, useRef } from 'react';
import { QuizQuestion, QuizState } from '../types';
import { Button } from './Button';
import { generateQuiz } from '../constants';
import { ArrowLeft, RefreshCcw, Trophy, Home, Sparkles, Star, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

interface QuizGameProps {
  onExit: () => void;
}

const BG_THEMES = [
  "from-cyan-100 to-blue-200",      // Blue
  "from-purple-100 to-fuchsia-200", // Purple
  "from-green-100 to-emerald-200",  // Green
  "from-orange-100 to-amber-200",   // Orange
  "from-rose-100 to-pink-200",      // Pink
  "from-teal-100 to-cyan-200",      // Teal
];

export const QuizGame: React.FC<QuizGameProps> = ({ onExit }) => {
  const [gameState, setGameState] = useState<QuizState>({
    questions: [],
    currentIndex: 0,
    score: 0,
    isFinished: false
  });
  
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  
  // Timer State
  const [startTime, setStartTime] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const timerRef = useRef<number | null>(null);

  // Initialize Game
  useEffect(() => {
    startNewGame();
    return () => stopTimer();
  }, []);

  const startTimer = () => {
    stopTimer();
    const start = Date.now();
    setStartTime(start);
    setCurrentTime(0);
    timerRef.current = window.setInterval(() => {
      setCurrentTime(Date.now() - start);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const startNewGame = () => {
    setGameState({
      questions: generateQuiz(10), // Generate 10 questions
      currentIndex: 0,
      score: 0,
      isFinished: false
    });
    setFeedback(null);
    setSelectedOption(null);
    setIsChecking(false);
    startTimer();
  };

  const handleOptionSelect = (option: string) => {
    if (isChecking) return;
    
    setSelectedOption(option);
    setIsChecking(true);

    const currentQ = gameState.questions[gameState.currentIndex];
    const isCorrect = option === currentQ.correctAnswer;

    if (isCorrect) {
      setFeedback('correct');
      // Confetti for correct answer
      confetti({
        particleCount: 80,
        spread: 100,
        origin: { y: 0.7 },
        colors: ['#43AA8B', '#F9C74F', '#F72585']
      });
    } else {
      setFeedback('incorrect');
    }

    // Wait and move to next question
    setTimeout(() => {
      if (gameState.currentIndex < gameState.questions.length - 1) {
        setGameState(prev => ({
          ...prev,
          score: isCorrect ? prev.score + 1 : prev.score,
          currentIndex: prev.currentIndex + 1
        }));
        setSelectedOption(null);
        setFeedback(null);
        setIsChecking(false);
      } else {
        stopTimer();
        setGameState(prev => ({
          ...prev,
          score: isCorrect ? prev.score + 1 : prev.score,
          isFinished: true
        }));
        // Final celebration confetti if score is high
        if ((isCorrect ? gameState.score + 1 : gameState.score) > 7) {
            triggerFinalConfetti();
        }
      }
    }, 1500); 
  };

  const triggerFinalConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;
    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#4CC9F0', '#F72585', '#F9C74F']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#43AA8B', '#7209B7']
      });
      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  const currentQ = gameState.questions[gameState.currentIndex];

  // Get current background theme based on question index
  const currentBgTheme = BG_THEMES[gameState.currentIndex % BG_THEMES.length];

  if (gameState.isFinished) {
    const isHighScore = gameState.score >= 8;
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-300 via-purple-300 to-pink-300 p-6 relative overflow-hidden">
        
        {/* Animated Background Rays */}
        <div className="absolute inset-0 z-0 flex items-center justify-center opacity-30">
           <motion.div 
             animate={{ rotate: 360 }}
             transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
             className="w-[150vmax] h-[150vmax] bg-[conic-gradient(from_0deg_at_50%_50%,rgba(255,255,255,0.8)_0deg,transparent_20deg,rgba(255,255,255,0.8)_40deg,transparent_60deg,rgba(255,255,255,0.8)_80deg,transparent_100deg,rgba(255,255,255,0.8)_120deg,transparent_140deg,rgba(255,255,255,0.8)_160deg,transparent_180deg,rgba(255,255,255,0.8)_200deg,transparent_220deg,rgba(255,255,255,0.8)_240deg,transparent_260deg,rgba(255,255,255,0.8)_280deg,transparent_300deg,rgba(255,255,255,0.8)_320deg,transparent_340deg,rgba(255,255,255,0.8)_360deg)]"
           />
        </div>

        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", bounce: 0.5 }}
          className="bg-white/90 backdrop-blur-md rounded-[50px] p-8 md:p-10 max-w-3xl w-full text-center shadow-[0_20px_50px_rgba(0,0,0,0.3)] border-8 border-white relative z-10"
        >
          <div className="relative inline-block mb-6">
             <Trophy className="w-40 h-40 md:w-48 md:h-48 mx-auto text-yellow-400 drop-shadow-[0_10px_10px_rgba(250,204,21,0.5)] fill-yellow-200 animate-bounce-slow" strokeWidth={1.5} />
             {isHighScore && (
                <motion.div 
                   animate={{ rotate: [0, 15, -15, 0] }}
                   transition={{ repeat: Infinity, duration: 2 }}
                   className="absolute -top-4 -right-4"
                >
                   <Star className="w-16 h-16 md:w-20 md:h-20 text-kid-pink fill-kid-pink drop-shadow-lg" />
                </motion.div>
             )}
          </div>
          
          <h2 className="text-5xl md:text-6xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 mb-6 drop-shadow-sm leading-tight">
            {isHighScore ? "Tuyệt Vời!" : "Làm Tốt Lắm!"}
          </h2>
          
          <div className="bg-gray-100 rounded-3xl p-6 mb-8 flex justify-around items-center">
            <div className="text-center">
               <p className="text-2xl text-gray-500 font-bold mb-1">Điểm số</p>
               <p className="text-5xl md:text-6xl font-black text-kid-blue">
                 {gameState.score}<span className="text-4xl text-gray-400">/</span>{gameState.questions.length}
               </p>
            </div>
            <div className="w-[2px] h-20 bg-gray-300"></div>
            <div className="text-center">
               <p className="text-2xl text-gray-500 font-bold mb-1">Thời gian</p>
               <p className="text-4xl md:text-5xl font-black text-kid-purple flex items-center justify-center gap-2">
                 <Clock size={32} />
                 {formatTime(currentTime)}
               </p>
            </div>
          </div>

          {/* Buttons on same row */}
          <div className="grid grid-cols-2 gap-4 md:gap-6 w-full">
            <Button onClick={startNewGame} className="!bg-kid-green !rounded-3xl text-2xl md:text-3xl font-black h-20 md:h-24 shadow-[0_8px_0_#15803d] hover:scale-105 transition-transform">
               <RefreshCcw className="w-8 h-8 md:w-10 md:h-10 mr-2" /> Chơi lại
            </Button>
            <Button onClick={onExit} className="!bg-kid-blue !rounded-3xl text-2xl md:text-3xl font-black h-20 md:h-24 shadow-[0_8px_0_#0284c7] hover:scale-105 transition-transform">
               <Home className="w-8 h-8 md:w-10 md:h-10 mr-2" /> Trang chủ
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!currentQ) return null;

  return (
    <motion.div 
      className={`flex flex-col min-h-screen bg-gradient-to-br ${currentBgTheme} relative overflow-hidden transition-colors duration-1000 ease-in-out`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      
      {/* Animated Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
         {[...Array(8)].map((_, i) => (
            <motion.div
               key={i}
               animate={{ 
                 y: [0, -100, 0], 
                 x: [0, Math.random() * 50 - 25, 0],
                 opacity: [0.3, 0.8, 0.3]
               }}
               transition={{ duration: 5 + Math.random() * 5, repeat: Infinity, ease: "easeInOut" }}
               className="absolute rounded-full bg-white blur-xl"
               style={{
                 left: `${Math.random() * 100}%`,
                 top: `${Math.random() * 100}%`,
                 width: `${50 + Math.random() * 100}px`,
                 height: `${50 + Math.random() * 100}px`,
               }}
            />
         ))}
      </div>

      {/* Header */}
      <div className="p-4 flex items-center justify-between z-20 pt-safe-top">
        <button onClick={onExit} className="w-16 h-16 bg-white border-4 border-white/50 rounded-2xl shadow-lg flex items-center justify-center hover:scale-110 transition-transform active:scale-95">
          <ArrowLeft className="w-8 h-8 text-kid-blue" strokeWidth={4} />
        </button>
        
        {/* Removed Timer from Header */}

        <div className="bg-white/80 backdrop-blur px-8 py-4 rounded-full shadow-lg border-4 border-white">
           <span className="font-black text-3xl text-kid-purple tracking-widest">CÂU {gameState.currentIndex + 1} / {gameState.questions.length}</span>
        </div>
      </div>

      {/* Question Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 z-10 max-w-5xl mx-auto w-full pb-24">
        
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentQ.id}
            initial={{ scale: 0.9, opacity: 0, rotateX: 90 }}
            animate={{ scale: 1, opacity: 1, rotateX: 0 }}
            exit={{ scale: 0.9, opacity: 0, rotateX: -90 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-white rounded-[50px] p-8 md:p-12 w-full shadow-[0_20px_0_rgba(0,0,0,0.1)] border-8 border-white mb-10 text-center relative max-w-4xl"
          >
             {/* Decorative Stars */}
             <div className="absolute -top-6 -left-6 text-kid-yellow animate-spin-slow">
                <Sparkles size={70} fill="currentColor" />
             </div>
             
             {/* CONTEXT / HINT */}
             <div className="mb-4">
                <span className="text-2xl md:text-3xl font-display font-bold text-gray-500 bg-gray-100 px-6 py-2 rounded-full inline-block">
                  Câu gợi ý:
                </span>
                <p className="text-3xl md:text-5xl font-display font-bold text-kid-purple mt-4 leading-normal">
                  "{currentQ.hint}"
                </p>
             </div>

             <div className="my-6 border-t-4 border-dashed border-gray-200 w-2/3 mx-auto"></div>

             <h3 className="text-2xl text-gray-400 font-bold mb-2 uppercase tracking-widest">Điền từ còn thiếu</h3>
             <div className="text-[100px] md:text-[140px] font-black text-kid-blue leading-none tracking-wider drop-shadow-sm">
                {currentQ.display}
             </div>
          </motion.div>
        </AnimatePresence>

        {/* Options Grid */}
        <div className="grid grid-cols-2 gap-6 w-full max-w-3xl">
           {currentQ.options.map((option, idx) => {
             let btnStyle = "!bg-white/90 !text-kid-blue border-[6px] !border-white"; // Default
             
             if (isChecking) {
                if (option === currentQ.correctAnswer) {
                   // CORRECT ANSWER STYLE
                   btnStyle = "!bg-kid-green !text-white !border-kid-green shadow-[0_12px_0_#15803d] scale-105 z-20";
                } else if (option === selectedOption) {
                   // WRONG ANSWER STYLE
                   btnStyle = "!bg-kid-pink !text-white !border-kid-pink shadow-[0_12px_0_#be185d] opacity-50";
                } else {
                   // INACTIVE STYLE
                   btnStyle = "!bg-gray-100 !text-gray-300 !border-transparent shadow-none scale-90 opacity-40";
                }
             } else {
                btnStyle += " shadow-[0_12px_0_rgba(0,0,0,0.1)] hover:!border-kid-blue hover:!bg-kid-blue hover:!text-white hover:scale-105";
             }

             return (
               <Button 
                 key={idx}
                 onClick={() => handleOptionSelect(option)}
                 disabled={isChecking}
                 className={`!rounded-[30px] h-32 md:h-44 text-7xl md:text-8xl ${btnStyle} transition-all duration-300`}
               >
                 {option}
               </Button>
             );
           })}
        </div>
      </div>

      {/* FIXED TIMER AT BOTTOM RIGHT */}
      <div className="fixed bottom-6 right-6 z-30 bg-white/90 backdrop-blur px-6 py-3 rounded-full shadow-xl border-4 border-white flex items-center gap-3 animate-bounce-slow">
         <Clock className="w-8 h-8 text-kid-purple" />
         <span className="font-black text-3xl text-kid-purple font-mono w-24 text-center">
           {formatTime(currentTime)}
         </span>
      </div>

    </motion.div>
  );
};