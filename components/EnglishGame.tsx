
import React, { useState, useEffect, useRef } from 'react';
import { EnglishTopic, EnglishQuizState } from '../types';
import { generateEnglishQuiz } from '../utils/englishGenerator';
import { Button } from './Button';
import { ArrowLeft, RefreshCcw, Home, Volume2, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

interface EnglishGameProps {
  topic: EnglishTopic;
  onExit: (score?: number) => void;
}

export const EnglishGame: React.FC<EnglishGameProps> = ({ topic, onExit }) => {
  const [gameState, setGameState] = useState<EnglishQuizState>({
    questions: [],
    currentIndex: 0,
    score: 0,
    isFinished: false
  });

  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  
  // Audio handling
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    startNewGame();
  }, [topic]);

  const startNewGame = () => {
    setGameState({
      questions: generateEnglishQuiz(topic),
      currentIndex: 0,
      score: 0,
      isFinished: false
    });
    setFeedback(null);
  };

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US'; // Set to English
      utterance.rate = 0.8; // Slower for kids
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Trình duyệt không hỗ trợ phát âm.");
    }
  };

  // Auto-speak when question changes (if it has English text)
  useEffect(() => {
    if (gameState.questions.length > 0 && !gameState.isFinished) {
      const currentQ = gameState.questions[gameState.currentIndex];
      if (currentQ.audioText) {
        // Short delay to allow animation
        setTimeout(() => handleSpeak(currentQ.audioText), 500);
      }
    }
  }, [gameState.currentIndex, gameState.isFinished, gameState.questions]);

  const handleAnswer = (answer: string) => {
    if (feedback) return;

    const currentQ = gameState.questions[gameState.currentIndex];
    const isCorrect = answer === currentQ.correctAnswer;

    if (isCorrect) {
      setFeedback('correct');
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    } else {
      setFeedback('incorrect');
    }

    setTimeout(() => {
      setFeedback(null);
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

  // FINISHED SCREEN
  if (gameState.isFinished) {
    return (
      <div className="min-h-screen bg-indigo-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white rounded-[3rem] p-10 shadow-xl border-8 border-white max-w-lg w-full">
           <div className="mb-6 relative inline-block">
             <Star className="w-32 h-32 text-yellow-400 fill-yellow-400 animate-spin-slow" />
             <div className="absolute inset-0 flex items-center justify-center text-5xl">🇬🇧</div>
           </div>
           
           <h2 className="text-4xl font-black text-indigo-600 mb-2">Good Job!</h2>
           <p className="text-gray-500 font-bold mb-6">Bé đã hoàn thành bài Tiếng Anh</p>
           
           <div className="text-6xl font-black text-kid-pink mb-8">
             {gameState.score}/{gameState.questions.length}
           </div>

           <div className="grid grid-cols-2 gap-4">
              <Button onClick={startNewGame} className="!bg-kid-green !rounded-2xl">
                <RefreshCcw className="mr-2" /> Play Again
              </Button>
              <Button onClick={() => onExit(gameState.score)} variant="secondary" className="!rounded-2xl">
                <Home className="mr-2" /> Exit
              </Button>
           </div>
        </div>
      </div>
    );
  }

  if (!currentQ) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-indigo-100 flex flex-col relative overflow-hidden font-sans">
      {/* Header */}
      <div className="p-4 flex items-center justify-between z-10 pt-safe-top">
         <button onClick={() => onExit()} className="bg-white p-3 rounded-2xl shadow-sm border-2 border-white text-indigo-500">
           <ArrowLeft size={24} />
         </button>
         <div className="bg-white px-4 py-2 rounded-full border-2 border-indigo-200 font-bold text-indigo-600">
            Question {gameState.currentIndex + 1}/{gameState.questions.length}
         </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 max-w-3xl mx-auto w-full pb-10">
         
         <AnimatePresence mode="wait">
            <motion.div 
               key={currentQ.id}
               initial={{ scale: 0.9, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               exit={{ scale: 1.1, opacity: 0 }}
               className="bg-white rounded-[3rem] p-8 shadow-lg border-4 border-white w-full mb-8 relative text-center"
            >
               {/* Image Hint */}
               {currentQ.imgHint && (
                 <div className="text-8xl mb-4 animate-bounce-slow">{currentQ.imgHint}</div>
               )}

               {/* Question Text */}
               <h2 className="text-2xl md:text-4xl font-black text-gray-800 mb-4 leading-normal">
                  {currentQ.question}
               </h2>

               {/* Speak Button */}
               {currentQ.audioText && (
                  <button 
                    onClick={() => handleSpeak(currentQ.audioText)}
                    disabled={isSpeaking}
                    className={`
                      mx-auto flex items-center gap-2 px-6 py-3 rounded-full font-bold text-lg transition-all
                      ${isSpeaking ? 'bg-indigo-100 text-indigo-400' : 'bg-indigo-600 text-white shadow-lg hover:scale-105 active:scale-95'}
                    `}
                  >
                     <Volume2 size={24} className={isSpeaking ? 'animate-pulse' : ''} />
                     {isSpeaking ? 'Listening...' : 'Listen'}
                  </button>
               )}
            </motion.div>
         </AnimatePresence>

         {/* Options */}
         <div className="grid grid-cols-2 gap-4 w-full">
            {currentQ.options.map((opt, idx) => (
              <Button 
                key={idx}
                onClick={() => handleAnswer(opt)}
                disabled={!!feedback}
                className="!bg-white !text-indigo-700 !border-4 !border-indigo-100 hover:!border-indigo-500 !shadow-sm text-xl md:text-2xl py-6 !rounded-2xl h-auto min-h-[5rem]"
              >
                {opt}
              </Button>
            ))}
         </div>

      </div>

      {/* Feedback Overlay */}
      <AnimatePresence>
         {feedback && (
           <motion.div 
              initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }}
              className={`fixed bottom-0 left-0 right-0 p-6 flex items-center justify-center gap-4 text-white font-bold text-2xl z-50 ${feedback === 'correct' ? 'bg-green-500' : 'bg-red-500'}`}
           >
              <span>{feedback === 'correct' ? 'Correct! 🎉' : 'Oops! Try again 😅'}</span>
           </motion.div>
         )}
      </AnimatePresence>

    </div>
  );
};
