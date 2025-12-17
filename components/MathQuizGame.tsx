
import React, { useState, useEffect, useRef } from 'react';
import { MathQuizState, MathQuestionType, MathTopic } from '../types';
import { generateMathQuiz } from '../utils/mathGenerator';
import { Button } from './Button';
import { NestedShape } from './NestedShape';
import { ArrowLeft, RefreshCcw, Home, Star, Play, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

interface MathQuizGameProps {
  topic?: MathTopic; // Optional, defaults to MIXED
  onExit: (score?: number) => void;
}

// Helper to render shapes via CSS
const ShapeRender = ({ type, className }: { type: string, className?: string }) => {
  const baseClass = `transition-all duration-300 ${className || ''}`;
  
  switch(type) {
    case 'circle': 
      return <div className={`w-16 h-16 rounded-full bg-kid-pink border-4 border-white shadow-md ${baseClass}`} />;
    case 'square': 
      return <div className={`w-16 h-16 bg-kid-blue border-4 border-white shadow-md rounded-lg ${baseClass}`} />;
    case 'triangle': 
      return (
        <div className={`w-0 h-0 border-l-[35px] border-l-transparent border-r-[35px] border-r-transparent border-b-[60px] border-b-kid-yellow drop-shadow-md ${baseClass}`} />
      );
    case 'rectangle': 
      return <div className={`w-24 h-14 bg-kid-green border-4 border-white shadow-md rounded-lg ${baseClass}`} />;
    default: 
      return <div className={`w-16 h-16 bg-gray-300 rounded-full ${baseClass}`} />;
  }
};

export const MathQuizGame: React.FC<MathQuizGameProps> = ({ topic = MathTopic.MIXED, onExit }) => {
  // Use lazy initialization to ensure questions are generated immediately on first render
  const [gameState, setGameState] = useState<MathQuizState>(() => ({
    questions: generateMathQuiz(topic, 20), // Increased to 20 questions
    currentIndex: 0,
    score: 0,
    isFinished: false
  }));

  const [sortingSequence, setSortingSequence] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

  // Timer State
  const [startTime, setStartTime] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const timerRef = useRef<number | null>(null);

  // Initialize Game & Timer
  useEffect(() => {
    startNewGame();
    return () => stopTimer();
  }, [topic]);

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
      questions: generateMathQuiz(topic, 20), // Increased to 20 questions
      currentIndex: 0,
      score: 0,
      isFinished: false
    });
    setSortingSequence([]);
    setFeedback(null);
    startTimer();
  };

  const handleAnswer = (answer: string) => {
    if (feedback) return;

    const currentQ = gameState.questions[gameState.currentIndex];
    if (!currentQ) return;
    
    // --- Special Logic for Sorting Type ---
    if (currentQ.type === MathQuestionType.SORTING) {
      if (sortingSequence.includes(answer)) return; // Prevent duplicate selection

      const newSequence = [...sortingSequence, answer];
      setSortingSequence(newSequence);
      
      // Check if sequence is complete
      if (newSequence.length === currentQ.options.length) {
        // Verify correctness
        const isCorrect = newSequence.join(',') === currentQ.correctAnswer;
        processResult(isCorrect);
      }
      return;
    }

    // --- Standard Logic for Single Choice / Compare ---
    const isCorrect = answer === currentQ.correctAnswer;
    processResult(isCorrect);
  };

  const handleRemoveFromSequence = (valueToRemove: string) => {
    if (feedback) return; // Cannot undo during feedback/checking
    setSortingSequence(prev => prev.filter(val => val !== valueToRemove));
  };

  const processResult = (isCorrect: boolean) => {
    if (isCorrect) {
      setFeedback('correct');
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.7 }, colors: ['#4CC9F0', '#F72585', '#F9C74F'] });
    } else {
      setFeedback('incorrect');
    }

    setTimeout(() => {
      if (gameState.currentIndex < gameState.questions.length - 1) {
        setGameState(prev => ({
          ...prev,
          score: isCorrect ? prev.score + 1 : prev.score,
          currentIndex: prev.currentIndex + 1
        }));
        setSortingSequence([]);
        setFeedback(null);
      } else {
        stopTimer();
        setGameState(prev => ({
          ...prev,
          score: isCorrect ? prev.score + 1 : prev.score,
          isFinished: true
        }));
      }
    }, 1500);
  };

  const currentQ = gameState.questions[gameState.currentIndex];

  // SAFETY CHECK: Prevent crash if question is undefined
  if (!currentQ && !gameState.isFinished) {
     return (
        <div className="flex flex-col min-h-screen bg-kid-bg items-center justify-center">
            <div className="animate-spin text-4xl mb-2">⏳</div>
            <p className="text-gray-500 font-bold">Đang tạo bài tập...</p>
        </div>
     );
  }

  // --- RENDERING HELPERS ---

  const renderQuestionContent = () => {
    if (!currentQ) return null;

    // 0. Interactive Nested Shapes
    if (currentQ.visualData?.type === 'NESTED_SHAPES' && currentQ.visualData.extraInfo) {
        return (
            <div className="mb-6 w-full flex justify-center">
                <NestedShape shapeId={currentQ.visualData.extraInfo} />
            </div>
        );
    }

    // 1. Shapes / Geometry
    if (currentQ.visualData?.type === 'SHAPES') {
      // If it's a counting game, scatter shapes
      if (currentQ.type === MathQuestionType.COUNTING) {
        return (
          <div className="relative h-60 w-full bg-white rounded-3xl border-4 border-dashed border-gray-200 overflow-hidden mb-6 shadow-inner">
             {currentQ.visualData.items.map((item, idx) => (
               <motion.div 
                 key={idx}
                 initial={{ scale: 0, rotate: -180 }}
                 animate={{ scale: 1, rotate: Math.random() * 30 - 15 }}
                 className="absolute"
                 style={{
                   top: `${Math.random() * 60 + 10}%`,
                   left: `${Math.random() * 70 + 10}%`
                 }}
               >
                 <ShapeRender type={item.type} />
               </motion.div>
             ))}
          </div>
        );
      }
    }

    // 2. Spatial / Position (Animals row)
    if (currentQ.visualData?.type === 'SPATIAL') {
      return (
        <div className="flex items-end justify-center gap-2 md:gap-8 h-48 bg-emerald-100 rounded-[40px] w-full mb-8 px-8 pb-6 border-b-8 border-emerald-200 shadow-sm">
           {currentQ.visualData.items.map((item, idx) => (
             <div key={idx} className="flex flex-col items-center group">
                <motion.span 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="text-7xl md:text-8xl drop-shadow-lg transform group-hover:-translate-y-2 transition-transform cursor-pointer"
                >
                  {item}
                </motion.span>
                <div className="w-20 h-4 bg-black/10 rounded-full mt-2 blur-sm"></div>
             </div>
           ))}
        </div>
      );
    }

    // 3. Calculation / Numbers (Objects)
    // Only render if there are items to show (Sorting type has empty items)
    if (currentQ.visualData?.type === 'OBJECTS' && currentQ.visualData.items.length > 0) {
       return (
         <div className="flex flex-wrap items-center justify-center gap-4 mb-10 bg-white/50 p-6 rounded-3xl">
           {currentQ.visualData.items.map((item, idx) => (
             <motion.div 
               key={idx}
               initial={{ scale: 0.5, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               transition={{ delay: idx * 0.1 }}
               className={`font-black flex items-center justify-center ${
                 item.val === '?' 
                   ? 'w-20 h-20 bg-kid-pink text-white rounded-xl shadow-lg animate-pulse text-5xl' 
                   : 'text-gray-700 text-6xl md:text-7xl'
               }`}
             >
               {item.val}
             </motion.div>
           ))}
         </div>
       );
    }

    return null;
  };

  const renderAnswerOptions = () => {
    if (!currentQ) return null;

    // Type 1: Sorting - Show Drop Zone & Source Buttons
    if (currentQ.type === MathQuestionType.SORTING) {
      return (
        <div className="w-full max-w-2xl">
           {/* Drop Zone (Result) */}
           <div className="flex justify-center gap-3 mb-8 min-h-[5rem]">
              {sortingSequence.map((val, idx) => (
                <motion.div 
                  layoutId={`sort-${val}`}
                  key={`res-${idx}`}
                  onClick={() => handleRemoveFromSequence(val)}
                  whileHover={{ scale: 1.1, backgroundColor: '#F72585' }}
                  className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-kid-blue text-white flex items-center justify-center text-3xl font-black border-4 border-white shadow-md cursor-pointer"
                  title="Bấm để bỏ chọn"
                >
                  {val}
                </motion.div>
              ))}
              {/* Empty placeholders */}
              {Array.from({length: Math.max(0, currentQ.options.length - sortingSequence.length)}).map((_, i) => (
                 <div key={`empty-${i}`} className="w-16 h-16 md:w-20 md:h-20 rounded-2xl border-4 border-dashed border-gray-300 bg-gray-50/50" />
              ))}
           </div>
           
           {/* Choices */}
           <div className="flex justify-center gap-4 flex-wrap">
             {currentQ.options.map((opt) => {
               const isSelected = sortingSequence.includes(opt);
               return (
                 <Button 
                    key={opt} 
                    onClick={() => handleAnswer(opt)}
                    className={`!w-20 !h-20 !rounded-2xl !text-3xl transition-all ${isSelected ? 'opacity-0 pointer-events-none scale-0' : 'opacity-100 scale-100'}`}
                 >
                   {opt}
                 </Button>
               );
             })}
           </div>
           <p className="text-center text-gray-400 mt-6 font-bold animate-pulse">Bấm vào số để sắp xếp nhé!</p>
        </div>
      );
    }

    // Type 2: Comparison (>, <, =)
    if (currentQ.type === MathQuestionType.COMPARE) {
      return (
        <div className="flex justify-center gap-4 md:gap-8 w-full max-w-xl">
          {['>', '=', '<'].map((opt) => (
            <Button 
              key={opt} 
              onClick={() => handleAnswer(opt)}
              className="!w-24 !h-24 !text-6xl !bg-white !text-kid-purple border-[6px] !border-kid-purple hover:!bg-kid-purple hover:!text-white shadow-[0_8px_0_#7209B7] active:shadow-none active:translate-y-[8px]"
            >
              {opt}
            </Button>
          ))}
        </div>
      );
    }

    // Type 3: Shape Identification (Render shapes in buttons)
    if (currentQ.visualData?.type === 'SHAPES' && currentQ.type === MathQuestionType.MULTIPLE_CHOICE) {
       return (
        <div className="grid grid-cols-2 gap-4 w-full max-w-md">
          {currentQ.options.map((opt, idx) => (
            <Button 
              key={idx} 
              onClick={() => handleAnswer(opt)}
              className="h-36 flex items-center justify-center bg-white border-4 border-gray-100 hover:border-kid-blue"
            >
               <ShapeRender type={opt} />
            </Button>
          ))}
        </div>
       );
    }

    // Type 4: Standard Multiple Choice (Text/Numbers)
    return (
      <div className="grid grid-cols-2 gap-4 md:gap-6 w-full max-w-2xl">
        {currentQ.options.map((opt, idx) => (
          <Button 
            key={idx} 
            onClick={() => handleAnswer(opt)}
            className="h-24 text-4xl md:text-5xl !rounded-[2rem]"
            disabled={!!feedback}
          >
            {opt}
          </Button>
        ))}
      </div>
    );
  };

  // --- FINISH SCREEN ---
  if (gameState.isFinished) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-kid-bg p-6 relative overflow-hidden">
        <div className="bg-white rounded-[40px] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.1)] text-center max-w-lg w-full relative z-10 border-8 border-white/50 backdrop-blur-xl">
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
             <Star className="w-24 h-24 text-yellow-400 fill-yellow-400 drop-shadow-lg animate-bounce-slow" />
          </div>
          
          <h2 className="text-4xl md:text-5xl font-black text-kid-blue mt-8 mb-2 font-display">Hoàn Thành!</h2>
          <p className="text-gray-500 mb-8 font-bold text-lg">Bé thật là giỏi!</p>

          <div className="bg-gray-50 rounded-3xl p-6 mb-8 border-2 border-gray-100 flex justify-around items-center">
            <div className="text-center">
                <p className="text-xl text-gray-400 font-bold uppercase tracking-wider mb-2">Điểm số</p>
                <p className="text-5xl font-black text-kid-pink">{gameState.score}<span className="text-4xl text-gray-300">/</span>{gameState.questions.length}</p>
            </div>
            <div className="w-[2px] h-16 bg-gray-200"></div>
            <div className="text-center">
                <p className="text-xl text-gray-400 font-bold uppercase tracking-wider mb-2">Thời gian</p>
                <div className="flex items-center justify-center gap-2">
                    <Clock size={24} className="text-kid-purple" />
                    <p className="text-4xl font-black text-kid-purple font-mono">{formatTime(currentTime)}</p>
                </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button onClick={startNewGame} className="!bg-kid-green !rounded-2xl h-16 text-xl">
              <RefreshCcw className="mr-2" /> Chơi lại
            </Button>
            <Button onClick={() => onExit(gameState.score)} variant="secondary" className="!rounded-2xl h-16 text-xl">
              <Home className="mr-2" /> Thoát
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // --- GAMEPLAY SCREEN ---
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-sky-100 to-indigo-50 relative overflow-hidden font-sans">
       
       {/* Top Bar */}
       <div className="p-4 md:p-6 flex items-center justify-between z-10 pt-safe-top">
         <button onClick={() => onExit()} className="bg-white p-3 rounded-2xl shadow-[0_4px_0_rgba(0,0,0,0.1)] border-2 border-gray-100 hover:scale-105 transition-transform">
           <ArrowLeft className="text-kid-blue w-6 h-6" strokeWidth={3} />
         </button>
         
         <div className="bg-white px-6 py-2 rounded-full border-2 border-kid-blue/20 shadow-sm flex items-center gap-2">
            <Play size={20} className="text-kid-blue fill-current" />
            <span className="text-kid-blue font-black text-xl">Câu {gameState.currentIndex + 1}/{gameState.questions.length}</span>
         </div>
       </div>

       {/* Question Area */}
       <div className="flex-1 flex flex-col items-center justify-center p-4 w-full max-w-4xl mx-auto pb-24">
          <AnimatePresence mode="wait">
            <motion.div
               key={currentQ.id}
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, x: -100 }}
               transition={{ type: "spring", duration: 0.5 }}
               className="w-full flex flex-col items-center"
            >
              <h2 className="text-2xl md:text-4xl font-black text-gray-800 text-center mb-8 drop-shadow-sm px-4 leading-normal">
                {currentQ.questionText}
              </h2>
              
              {renderQuestionContent()}
              
              <div className="w-full flex justify-center">
                 {renderAnswerOptions()}
              </div>
            </motion.div>
          </AnimatePresence>
       </div>

       {/* FIXED TIMER AT BOTTOM RIGHT */}
      <div className="fixed bottom-6 right-6 z-30 bg-white/90 backdrop-blur px-6 py-3 rounded-full shadow-xl border-4 border-white flex items-center gap-3 animate-bounce-slow">
         <Clock className="w-8 h-8 text-kid-purple" />
         <span className="font-black text-3xl text-kid-purple font-mono w-24 text-center">
           {formatTime(currentTime)}
         </span>
      </div>

       {/* Feedback Overlay */}
       <AnimatePresence>
         {feedback && (
           <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
              <motion.div 
                initial={{ scale: 0, rotate: -45 }} 
                animate={{ scale: 1, rotate: 0 }} 
                exit={{ scale: 1.5, opacity: 0 }}
                className={`w-48 h-48 rounded-[3rem] flex items-center justify-center shadow-2xl border-[10px] border-white ${feedback === 'correct' ? 'bg-kid-green' : 'bg-kid-pink'}`}
              >
                 <span className="text-8xl filter drop-shadow-lg">
                    {feedback === 'correct' ? '🤩' : '🤔'}
                 </span>
              </motion.div>
           </div>
         )}
       </AnimatePresence>
    </div>
  );
};
