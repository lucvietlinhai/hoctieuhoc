import React, { useState, useEffect, useRef } from 'react';
import { Button } from './Button';
import { ArrowLeft, Timer, Zap, RotateCcw, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

interface MathReflexGameProps {
  onExit: () => void;
}

type GameState = 'INTRO' | 'PLAYING' | 'FINISHED';

interface Equation {
  a: number;
  b: number;
  operator: '+' | '-';
  result: number;
}

export const MathReflexGame: React.FC<MathReflexGameProps> = ({ onExit }) => {
  const [gameState, setGameState] = useState<GameState>('INTRO');
  const [equation, setEquation] = useState<Equation>({ a: 0, b: 0, operator: '+', result: 0 });
  const [userInput, setUserInput] = useState<string>('');
  
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState<'CORRECT' | 'WRONG' | null>(null);

  const timerRef = useRef<number | null>(null);

  // Generate new equation (0-10 range)
  const generateEquation = () => {
    const isAddition = Math.random() > 0.5;
    let a, b, result;

    if (isAddition) {
      // Result <= 10
      result = Math.floor(Math.random() * 11); // 0-10
      a = Math.floor(Math.random() * (result + 1));
      b = result - a;
      setEquation({ a, b, operator: '+', result });
    } else {
      // a <= 10
      a = Math.floor(Math.random() * 11);
      b = Math.floor(Math.random() * (a + 1));
      result = a - b;
      setEquation({ a, b, operator: '-', result });
    }
    setUserInput('');
  };

  const startGame = () => {
    setScore(0);
    setStreak(0);
    setTimeLeft(60);
    setGameState('PLAYING');
    generateEquation();
    
    // Start Timer
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const endGame = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setGameState('FINISHED');
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  // Check Input Logic
  const checkAnswer = (input: string) => {
    const num = parseInt(input);
    const expected = equation.result;

    if (isNaN(num)) return;

    // Logic: 
    // If input matches exactly -> Correct
    // If input is '1' and expected is '10' -> Wait for '0'? 
    // Actually simpler: 
    // If expected is < 10, single digit match is instant.
    // If expected is 10, wait for 2 digits.
    
    const isMatch = num === expected;
    
    // Auto-submit logic
    if (isMatch) {
       handleCorrect();
    } else {
       // Check for potential errors
       // If expected is single digit, but user typed wrong single digit -> Wrong
       if (expected < 10 && input.length === 1) {
         handleWrong();
       }
       // If expected is 10, but user typed something that isn't '1' -> Wrong
       else if (expected === 10 && input.length === 1 && input !== '1') {
         handleWrong();
       }
       // If expected is 10, user typed '1', wait... 
       // If user types '12' -> Wrong
       else if (input.length >= 2 && num !== expected) {
         handleWrong();
       }
    }
  };

  const handleCorrect = () => {
    setScore(s => s + 1);
    setStreak(s => s + 1);
    setFeedback('CORRECT');
    
    // Bonus time for streak
    if (streak > 0 && streak % 5 === 0) {
      setTimeLeft(t => Math.min(t + 5, 60)); // Add 5s, max 60s
    }

    setTimeout(() => {
      setFeedback(null);
      generateEquation();
    }, 200);
  };

  const handleWrong = () => {
    setStreak(0);
    setFeedback('WRONG');
    setUserInput(''); // Reset input to try again
    
    // Penalty? No penalty, just clear streak.
    setTimeout(() => {
        setFeedback(null);
    }, 300);
  };

  const handleInput = (val: string) => {
    if (gameState !== 'PLAYING') return;
    const nextInput = userInput + val;
    setUserInput(nextInput);
    checkAnswer(nextInput);
  };

  // Keyboard Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'PLAYING') return;
      if (e.key >= '0' && e.key <= '9') {
        handleInput(e.key);
      }
      if (e.key === 'Backspace') {
        setUserInput(prev => prev.slice(0, -1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, userInput, equation]);

  // Clean up timer
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // --- RENDER ---

  if (gameState === 'INTRO') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex flex-col items-center justify-center p-6 text-white relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-20">
            <div className="absolute top-10 left-10 text-9xl font-black animate-bounce-slow">?</div>
            <div className="absolute bottom-20 right-20 text-9xl font-black animate-bounce-slow" style={{ animationDelay: '1s' }}>+</div>
        </div>

        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white/10 backdrop-blur-lg p-10 rounded-[3rem] border-4 border-white/30 text-center max-w-lg w-full shadow-2xl"
        >
          <Zap className="w-24 h-24 mx-auto mb-6 text-yellow-300 fill-yellow-300 animate-pulse" />
          <h1 className="text-4xl md:text-5xl font-black mb-4">Thử Thách Tốc Độ</h1>
          <p className="text-xl md:text-2xl mb-8 font-medium text-white/90">
            Bé có 60 giây.<br/>Trả lời thật nhanh các phép tính!
          </p>
          
          <div className="grid gap-4">
             <Button onClick={startGame} className="!bg-yellow-400 !text-purple-900 !text-2xl !h-20 !rounded-2xl shadow-[0_8px_0_#b45309] hover:scale-105 transition-transform">
               Bắt đầu ngay!
             </Button>
             <Button onClick={onExit} variant="secondary" className="!bg-white/20 !text-white !border-transparent hover:!bg-white/30">
               Quay lại
             </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (gameState === 'FINISHED') {
    return (
      <div className="min-h-screen bg-kid-bg flex flex-col items-center justify-center p-6">
        <div className="bg-white rounded-[40px] p-8 md:p-12 text-center shadow-xl border-8 border-white max-w-lg w-full">
           <Trophy className="w-32 h-32 mx-auto text-yellow-400 fill-yellow-400 mb-6 drop-shadow-lg" />
           <h2 className="text-4xl font-black text-kid-blue mb-2">Hết Giờ!</h2>
           <p className="text-gray-500 font-bold text-xl mb-8">Kết quả của bé</p>

           <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-blue-50 p-4 rounded-2xl">
                 <p className="text-gray-500 text-sm font-bold uppercase">Số câu đúng</p>
                 <p className="text-5xl font-black text-kid-blue">{score}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-2xl">
                 <p className="text-gray-500 text-sm font-bold uppercase">Tốc độ TB</p>
                 <p className="text-3xl font-black text-kid-purple mt-2">
                   {score > 0 ? (60 / score).toFixed(1) : '-'}s
                   <span className="text-sm font-normal text-gray-400">/câu</span>
                 </p>
              </div>
           </div>

           <div className="grid grid-cols-2 gap-4">
              <Button onClick={startGame} className="!bg-kid-green !rounded-2xl">Chơi lại</Button>
              <Button onClick={onExit} variant="secondary" className="!rounded-2xl">Thoát</Button>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-between font-sans relative overflow-hidden">
      
      {/* Timer Bar */}
      <div className="w-full h-4 bg-gray-800">
         <motion.div 
           className="h-full bg-gradient-to-r from-green-500 to-yellow-500"
           initial={{ width: '100%' }}
           animate={{ width: `${(timeLeft / 60) * 100}%` }}
           transition={{ ease: "linear", duration: 1 }}
         />
      </div>

      {/* Header Info */}
      <div className="w-full max-w-3xl px-6 py-4 flex justify-between items-center text-white relative z-10">
         <Button onClick={onExit} size="sm" className="!bg-white/10 !text-white !border-transparent hover:!bg-white/20">
           <ArrowLeft />
         </Button>
         
         <div className="flex items-center gap-6">
            <div className="flex flex-col items-center">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Liên tiếp</span>
              <span className={`text-2xl font-black ${streak > 2 ? 'text-yellow-400 animate-pulse' : 'text-white'}`}>
                {streak} 🔥
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Điểm</span>
              <span className="text-3xl font-black text-kid-blue">{score}</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-xl border border-gray-700">
               <Timer className="text-gray-400" size={20} />
               <span className={`text-2xl font-mono font-bold ${timeLeft < 10 ? 'text-red-500' : 'text-white'}`}>
                 {timeLeft}
               </span>
            </div>
         </div>
      </div>

      {/* Main Game Area */}
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md relative z-10">
         
         <AnimatePresence mode="wait">
           <motion.div 
             key={`${equation.a}-${equation.operator}-${equation.b}`} // Re-render on new equation
             initial={{ scale: 0.8, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             className="flex items-center justify-center gap-4 mb-10"
           >
              <div className="text-8xl md:text-9xl font-black text-white">{equation.a}</div>
              <div className="text-6xl font-bold text-gray-500">{equation.operator}</div>
              <div className="text-8xl md:text-9xl font-black text-white">{equation.b}</div>
              <div className="text-6xl font-bold text-gray-500">=</div>
              
              <div className={`
                 min-w-[120px] h-[120px] rounded-3xl border-4 flex items-center justify-center text-7xl font-black
                 ${feedback === 'CORRECT' ? 'bg-green-500 border-green-400 text-white' : 
                   feedback === 'WRONG' ? 'bg-red-500 border-red-400 text-white animate-shake' : 
                   'bg-gray-800 border-gray-600 text-yellow-400'}
              `}>
                 {userInput || '?'}
              </div>
           </motion.div>
         </AnimatePresence>

         {/* Numpad for Touchscreen */}
         <div className="grid grid-cols-3 gap-3 w-full px-6 mb-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
               <button 
                 key={num}
                 onClick={() => handleInput(num.toString())}
                 className="bg-gray-800 hover:bg-gray-700 active:bg-gray-600 text-white text-4xl font-black rounded-2xl py-6 shadow-[0_4px_0_rgba(0,0,0,0.5)] active:shadow-none active:translate-y-1 transition-all"
               >
                 {num}
               </button>
            ))}
            <button onClick={() => setUserInput('')} className="bg-red-900/50 hover:bg-red-900/70 text-red-200 font-bold rounded-2xl flex items-center justify-center shadow-[0_4px_0_rgba(0,0,0,0.5)] active:shadow-none active:translate-y-1">
               XÓA
            </button>
            <button 
               onClick={() => handleInput('0')}
               className="bg-gray-800 hover:bg-gray-700 active:bg-gray-600 text-white text-4xl font-black rounded-2xl py-6 shadow-[0_4px_0_rgba(0,0,0,0.5)] active:shadow-none active:translate-y-1"
            >
               0
            </button>
            <div className="flex items-center justify-center text-gray-500 text-sm font-bold text-center leading-tight">
               Dùng phím số<br/>trên bàn phím
            </div>
         </div>
      </div>
    </div>
  );
};