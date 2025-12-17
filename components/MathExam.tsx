
import React, { useState, useEffect } from 'react';
import { MathQuizState, MathQuestionType } from '../types';
import { getExamData } from '../utils/mathGenerator';
import { Button } from './Button';
import { NestedShape } from './NestedShape';
import { ArrowLeft, Flag, CheckCircle, XCircle, Trophy, Home } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

interface MathExamProps {
  examId: 1 | 2;
  onExit: () => void;
}

// Reuse ShapeRender from MathQuizGame logic (simplified here)
const ShapeRender = ({ type }: { type: string }) => {
  switch(type) {
    case 'circle': return <div className="w-12 h-12 rounded-full bg-kid-pink border-2 border-white shadow-sm" />;
    case 'square': return <div className="w-12 h-12 bg-kid-blue border-2 border-white shadow-sm rounded-md" />;
    case 'triangle': return <div className="w-0 h-0 border-l-[25px] border-l-transparent border-r-[25px] border-r-transparent border-b-[45px] border-b-kid-yellow drop-shadow-sm" />;
    case 'rectangle': return <div className="w-16 h-10 bg-kid-green border-2 border-white shadow-sm rounded-md" />;
    default: return null;
  }
};

export const MathExam: React.FC<MathExamProps> = ({ examId, onExit }) => {
  const [gameState, setGameState] = useState<MathQuizState>({
    questions: [],
    currentIndex: 0,
    score: 0,
    isFinished: false
  });

  const [sortingSequence, setSortingSequence] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

  useEffect(() => {
    const questions = getExamData(examId);
    setGameState({
      questions,
      currentIndex: 0,
      score: 0,
      isFinished: false
    });
  }, [examId]);

  const handleAnswer = (answer: string) => {
    if (feedback) return;
    const currentQ = gameState.questions[gameState.currentIndex];
    
    // Logic for Sorting
    if (currentQ.type === MathQuestionType.SORTING) {
      if (sortingSequence.includes(answer)) return;
      const newSequence = [...sortingSequence, answer];
      setSortingSequence(newSequence);
      
      // Auto check if full
      if (newSequence.length === currentQ.options.length) {
        // Normalize strings for comparison (remove spaces)
        const userStr = newSequence.join(',').replace(/\s/g, '');
        const correctStr = (currentQ.correctAnswer as string).replace(/\s/g, '');
        processResult(userStr === correctStr);
      }
      return;
    }

    // Standard Logic
    // Normalize logic for array answers (like "7; 8")
    const isCorrect = answer === currentQ.correctAnswer;
    processResult(isCorrect);
  };

  const handleUndoSort = (val: string) => {
    if (feedback) return;
    setSortingSequence(prev => prev.filter(item => item !== val));
  };

  const processResult = (isCorrect: boolean) => {
    if (isCorrect) {
      setFeedback('correct');
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    } else {
      setFeedback('incorrect');
    }

    setTimeout(() => {
      setFeedback(null);
      setSortingSequence([]);
      
      if (gameState.currentIndex < gameState.questions.length - 1) {
        setGameState(prev => ({
          ...prev,
          score: isCorrect ? prev.score + 1 : prev.score,
          currentIndex: prev.currentIndex + 1
        }));
      } else {
        setGameState(prev => ({
          ...prev,
          score: isCorrect ? prev.score + 1 : prev.score,
          isFinished: true
        }));
      }
    }, 1500);
  };

  const currentQ = gameState.questions[gameState.currentIndex];

  if (!currentQ && !gameState.isFinished) return <div>Loading...</div>;

  // --- RENDERING VISUALS ---
  const renderVisuals = () => {
    if (!currentQ.visualData) return null;

    // 1. Interactive Nested Shapes (New Feature)
    if (currentQ.visualData.type === 'NESTED_SHAPES' && currentQ.visualData.extraInfo) {
        return (
            <div className="mb-6 w-full flex justify-center">
                <NestedShape shapeId={currentQ.visualData.extraInfo} />
            </div>
        );
    }

    // 2. Simple Scattered Shapes
    if (currentQ.visualData.type === 'SHAPES') {
      return (
         <div className="flex flex-wrap gap-4 justify-center bg-white border-2 border-gray-100 p-6 rounded-2xl mb-6 shadow-inner">
            {currentQ.visualData.items.map((item, i) => (
               <div key={i} className="animate-bounce-slow" style={{ animationDelay: `${i*0.1}s` }}>
                 <ShapeRender type={item.type} />
               </div>
            ))}
         </div>
      );
    }

    // 3. Objects / Numbers
    if (currentQ.visualData.type === 'OBJECTS' && currentQ.visualData.items.length > 0) {
      return (
         <div className="flex flex-wrap gap-2 justify-center items-center mb-8">
            {currentQ.visualData.items.map((item, i) => (
              <div key={i} className={`text-5xl font-bold ${item.val === '?' ? 'text-kid-pink animate-pulse' : 'text-gray-700'}`}>
                {item.val}
              </div>
            ))}
         </div>
      );
    }

    return null;
  };

  if (gameState.isFinished) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
        <Trophy className="w-32 h-32 text-yellow-400 fill-yellow-200 mb-6 animate-bounce" />
        <h2 className="text-3xl font-black text-gray-800 mb-2">Hoàn Thành Đề Thi!</h2>
        <div className="text-5xl font-black text-kid-blue mb-8">
           {gameState.score}/{gameState.questions.length} <span className="text-xl text-gray-400 font-normal">câu đúng</span>
        </div>
        <Button onClick={onExit} size="lg" className="!rounded-full">
           <Home className="mr-2" /> Quay lại
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
       {/* Header */}
       <div className="bg-white p-4 border-b border-gray-200 flex justify-between items-center sticky top-0 z-10">
          <button onClick={onExit} className="text-gray-500 hover:text-kid-blue">
             <ArrowLeft />
          </button>
          <div className="font-bold text-gray-700 flex items-center gap-2">
             <Flag className="text-kid-purple" size={18} />
             ĐỀ THI SỐ {examId}
          </div>
          <div className="text-sm font-bold bg-gray-100 px-3 py-1 rounded-full">
             Câu {gameState.currentIndex + 1}/{gameState.questions.length}
          </div>
       </div>

       {/* Progress Bar */}
       <div className="w-full h-2 bg-gray-200">
          <div 
            className="h-full bg-kid-blue transition-all duration-300" 
            style={{ width: `${((gameState.currentIndex) / gameState.questions.length) * 100}%` }}
          />
       </div>

       {/* Question Area */}
       <div className="flex-1 flex flex-col items-center p-6 max-w-3xl mx-auto w-full">
          
          <div className="bg-white p-6 md:p-10 rounded-[2rem] shadow-sm border border-gray-100 w-full mb-6">
              <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 leading-relaxed">
                 {currentQ.questionText}
              </h3>
              
              {renderVisuals()}

              {/* Sorting Area if needed */}
              {currentQ.type === MathQuestionType.SORTING && (
                 <div className="flex gap-2 justify-center min-h-[4rem] mb-6 flex-wrap">
                    {sortingSequence.map((val, idx) => (
                       <button 
                         key={idx} 
                         onClick={() => handleUndoSort(val)}
                         className="bg-kid-blue text-white px-4 py-2 rounded-xl font-bold text-xl shadow-md hover:bg-red-400"
                       >
                         {val}
                       </button>
                    ))}
                    {sortingSequence.length === 0 && (
                       <span className="text-gray-400 italic">Chọn các số bên dưới...</span>
                    )}
                 </div>
              )}
          </div>

          {/* Options */}
          <div className={`grid ${currentQ.options.length > 2 ? 'grid-cols-2' : 'grid-cols-2'} gap-4 w-full`}>
             {currentQ.options.map((opt, idx) => {
               const isSelected = sortingSequence.includes(opt);
               return (
                 <Button 
                    key={idx}
                    onClick={() => handleAnswer(opt)}
                    disabled={!!feedback || (currentQ.type === MathQuestionType.SORTING && isSelected)}
                    className={`
                      !bg-white !text-gray-700 !border-2 !border-gray-200 hover:!border-kid-blue hover:!text-kid-blue !shadow-sm text-lg md:text-2xl py-6 !rounded-2xl
                      ${isSelected ? 'opacity-30' : ''}
                    `}
                 >
                    {opt}
                 </Button>
               )
             })}
          </div>
       </div>

       {/* Feedback Popup */}
       <AnimatePresence>
          {feedback && (
             <motion.div 
               initial={{ y: 100 }}
               animate={{ y: 0 }}
               exit={{ y: 100 }}
               className={`fixed bottom-0 left-0 right-0 p-6 flex items-center justify-center gap-4 text-white font-bold text-2xl z-50 ${feedback === 'correct' ? 'bg-green-500' : 'bg-red-500'}`}
             >
                {feedback === 'correct' ? <CheckCircle size={32} /> : <XCircle size={32} />}
                {feedback === 'correct' ? 'Chính xác!' : 'Sai rồi!'}
             </motion.div>
          )}
       </AnimatePresence>
    </div>
  );
};
