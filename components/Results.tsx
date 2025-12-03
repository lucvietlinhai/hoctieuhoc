import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { StudySessionState } from '../types';
import { Button } from './Button';
import { RefreshCcw, Home, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

interface ResultsProps {
  state: StudySessionState;
  onRetry: () => void;
  onHome: () => void;
  onRetryMissed: () => void;
}

export const Results: React.FC<ResultsProps> = ({ state, onRetry, onHome, onRetryMissed }) => {

  useEffect(() => {
    // Celebration confetti
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
  }, []);

  const score = Math.round((state.correct.length / (state.correct.length + state.incorrect.length)) * 100);

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto p-4">
      <motion.div 
        initial={{ scale: 0 }} 
        animate={{ scale: 1 }} 
        className="bg-white rounded-3xl p-8 w-full shadow-xl border-b-8 border-gray-200 mb-6 text-center"
      >
        <h2 className="text-3xl font-display font-bold text-kid-purple mb-4">Hoàn thành rồi!</h2>
        
        <div className="relative w-40 h-40 mx-auto mb-6 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
            <circle cx="80" cy="80" r="70" stroke="#f3f4f6" strokeWidth="15" fill="transparent" />
            <circle 
              cx="80" 
              cy="80" 
              r="70" 
              stroke={score > 50 ? "#43AA8B" : "#F72585"} 
              strokeWidth="15" 
              fill="transparent" 
              strokeDasharray={440}
              strokeDashoffset={440 - (440 * score) / 100}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
             <span className="text-4xl font-bold text-gray-700">{state.correct.length}</span>
             <span className="text-sm text-gray-500 uppercase font-bold">Đã thuộc</span>
          </div>
        </div>

        <p className="text-lg text-gray-600 mb-6">
          {score === 100 ? "Tuyệt vời! Bé thuộc hết rồi!" : `Bé cần cố gắng thêm ${state.incorrect.length} chữ nữa nhé!`}
        </p>

        <div className="grid grid-cols-2 gap-4">
          <Button variant="secondary" onClick={onHome} className="text-sm">
            <Home className="w-4 h-4" /> Về trang chủ
          </Button>
          <Button onClick={onRetry} className="text-sm">
            <RefreshCcw className="w-4 h-4" /> Học lại từ đầu
          </Button>
        </div>
        
        {state.incorrect.length > 0 && (
           <Button variant="danger" className="mt-4 w-full" onClick={onRetryMissed}>
             <BookOpen className="w-5 h-5" /> Ôn tập chữ chưa thuộc
           </Button>
        )}
      </motion.div>

      {/* Missed Cards Section - Grid of 4 */}
      {state.incorrect.length > 0 && (
        <div className="w-full">
          <h3 className="text-xl font-display font-bold text-kid-blue mb-4 ml-2">Các chữ cần ôn lại:</h3>
          <div className="grid grid-cols-4 gap-3">
            {state.incorrect.map((card) => (
              <div key={card.id} className="bg-white p-2 rounded-2xl shadow-sm border-b-4 border-gray-100 flex flex-col items-center justify-center aspect-square gap-1">
                 <div className={`w-8 h-8 rounded-full ${card.color} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                    {card.sound.charAt(0)}
                  </div>
                  <p className="font-bold text-gray-700 text-lg truncate w-full text-center">{card.sound}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};