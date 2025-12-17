
import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Calculator, RotateCcw, Check } from 'lucide-react';
import { Button } from './Button';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

interface MathTablesProps {
  onExit: () => void;
}

type Mode = 'ADDITION' | 'SUBTRACTION';

// Generate data tables
const generateTables = (mode: Mode) => {
  const tables = [];
  if (mode === 'ADDITION') {
    for (let i = 1; i <= 9; i++) {
      const rows = [];
      for (let j = 1; j <= 10 - i; j++) {
        rows.push({ a: i, b: j, result: i + j });
      }
      if (rows.length > 0) tables.push({ number: i, rows });
    }
  } else {
    for (let i = 1; i <= 9; i++) {
      const rows = [];
      for (let j = i + 1; j <= 10; j++) {
        rows.push({ a: j, b: i, result: j - i });
      }
      if (rows.length > 0) tables.push({ number: i, rows });
    }
  }
  return tables;
};

const COLUMN_COLORS = [
  'bg-red-50 border-red-200 text-red-700',
  'bg-orange-50 border-orange-200 text-orange-700',
  'bg-yellow-50 border-yellow-200 text-yellow-800',
  'bg-lime-50 border-lime-200 text-lime-700',
  'bg-green-50 border-green-200 text-green-700',
  'bg-teal-50 border-teal-200 text-teal-700',
  'bg-cyan-50 border-cyan-200 text-cyan-700',
  'bg-blue-50 border-blue-200 text-blue-700',
  'bg-indigo-50 border-indigo-200 text-indigo-700',
  'bg-purple-50 border-purple-200 text-purple-700',
];

export const MathTables: React.FC<MathTablesProps> = ({ onExit }) => {
  const [mode, setMode] = useState<Mode>('ADDITION');
  
  // State to track user answers: { "ADDITION-1-1": "2" }
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  
  // State to track currently selected cell ID
  const [activeId, setActiveId] = useState<string | null>(null);

  const tables = generateTables(mode);

  // Auto-select first available cell on load or mode switch
  useEffect(() => {
    // Find the first unfinished item
    for (const table of tables) {
      for (const row of table.rows) {
        const id = `${mode}-${row.a}-${row.b}`;
        if (!userAnswers[id] || userAnswers[id] !== row.result.toString()) {
          setActiveId(id);
          return;
        }
      }
    }
    setActiveId(null);
  }, [mode]); // Run when mode changes

  // Add Keyboard Event Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!activeId) return;

      // Handle Numbers (0-9)
      if (e.key >= '0' && e.key <= '9') {
        handleKeypadPress(parseInt(e.key));
      }

      // Handle Backspace
      if (e.key === 'Backspace') {
        handleBackspace();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    // Cleanup listener on unmount or when dependencies change
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeId, userAnswers]); // Dependencies are crucial for access to latest state

  const handleKeypadPress = (num: number) => {
    if (!activeId) return;

    const currentVal = userAnswers[activeId] || '';
    // Limit length to avoid spamming
    if (currentVal.length >= 2) return; 

    const newVal = currentVal + num.toString();
    updateAnswer(activeId, newVal);
  };

  const handleBackspace = () => {
    if (!activeId) return;
    const currentVal = userAnswers[activeId] || '';
    updateAnswer(activeId, currentVal.slice(0, -1));
  };

  const updateAnswer = (id: string, val: string) => {
    // Extract expected result from ID
    // ID format: MODE-a-b (Note: result is not in ID, we need to find it or parse it)
    // Actually, checking result is easier if we look up the data, but for speed, let's recalculate
    const parts = id.split('-'); // [MODE, a, b]
    const a = parseInt(parts[1]);
    const b = parseInt(parts[2]);
    const expected = mode === 'ADDITION' ? a + b : a - b;

    setUserAnswers(prev => ({ ...prev, [id]: val }));

    // Instant Check
    if (val === expected.toString()) {
       // Correct!
       confetti({
         particleCount: 30,
         spread: 50,
         origin: { y: 0.8 },
         colors: ['#43AA8B', '#F9C74F']
       });
       
       // Auto advance to next empty field
       // This logic is simple: Find current index in flattened list and go to next
       findNextField(id);
    }
  };

  const findNextField = (currentId: string) => {
    let foundCurrent = false;
    for (const table of tables) {
        for (const row of table.rows) {
            const id = `${mode}-${row.a}-${row.b}`;
            if (foundCurrent) {
                // If this next field is not answered correctly yet
                if (userAnswers[id] !== row.result.toString()) {
                    setActiveId(id);
                    return;
                }
            }
            if (id === currentId) foundCurrent = true;
        }
    }
    // If we finished the last one
    setActiveId(null);
  };

  const handleReset = () => {
    if (window.confirm("Bé có muốn xóa hết kết quả để làm lại không?")) {
      setUserAnswers({});
      setActiveId(null);
      // Re-trigger effect to select first
      const firstId = `${mode}-${tables[0].rows[0].a}-${tables[0].rows[0].b}`;
      setActiveId(firstId);
    }
  };

  // Helper to get result status
  const getStatus = (id: string, result: number) => {
    const val = userAnswers[id];
    if (!val) return 'EMPTY';
    if (val === result.toString()) return 'CORRECT';
    return 'WRONG'; // Incomplete or wrong
  };

  return (
    <div className="min-h-screen bg-kid-bg flex flex-col font-sans h-screen overflow-hidden">
      {/* Header */}
      <div className="bg-white p-3 shadow-sm z-20 flex items-center justify-between pt-safe-top shrink-0">
        <div className="flex items-center gap-3">
          <Button onClick={onExit} size="sm" className="!bg-gray-100 !text-gray-600 !border-transparent hover:!bg-white">
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-lg md:text-xl font-black text-kid-blue flex items-center gap-2">
            <Calculator size={20} />
            Bảng Tính Tương Tác
          </h1>
        </div>
        
        <div className="flex gap-2">
             <button
              onClick={() => setMode(mode === 'ADDITION' ? 'SUBTRACTION' : 'ADDITION')}
              className={`px-4 py-2 rounded-xl font-bold text-sm border-2 transition-all ${
                mode === 'ADDITION' 
                  ? 'bg-kid-pink text-white border-kid-pink' 
                  : 'bg-kid-blue text-white border-kid-blue'
              }`}
            >
              {mode === 'ADDITION' ? 'Đổi sang Trừ (-)' : 'Đổi sang Cộng (+)'}
            </button>
            <Button onClick={handleReset} size="sm" variant="secondary" className="!px-3">
                <RotateCcw size={16} />
            </Button>
        </div>
      </div>

      {/* Tables Grid - Scrollable Area */}
      <div className="flex-1 overflow-y-auto p-4 pb-4"> 
        <div className="flex flex-col gap-6">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {tables.map((table, tIdx) => (
                    <div
                        key={`${mode}-${table.number}`}
                        className={`rounded-3xl border-4 ${COLUMN_COLORS[tIdx % COLUMN_COLORS.length]} overflow-hidden flex flex-col`}
                    >
                        <div className="bg-white/50 p-2 text-center font-black border-b-2 border-inherit">
                            {mode === 'ADDITION' ? `Cộng ${table.number}` : `Trừ ${table.number}`}
                        </div>
                        <div className="p-2 grid grid-cols-1 gap-2">
                             {table.rows.map((row) => {
                                 const id = `${mode}-${row.a}-${row.b}`;
                                 const status = getStatus(id, row.result);
                                 const isActive = activeId === id;
                                 
                                 return (
                                     <motion.div 
                                        key={id}
                                        onClick={() => setActiveId(id)}
                                        animate={isActive ? { scale: 1.02 } : { scale: 1 }}
                                        className={`
                                            relative flex items-center justify-between p-3 rounded-2xl border-2 cursor-pointer transition-all
                                            ${isActive 
                                                ? 'bg-white border-kid-blue shadow-[0_0_0_4px_rgba(76,201,240,0.2)] z-10' 
                                                : status === 'CORRECT' 
                                                    ? 'bg-green-100 border-green-300' 
                                                    : 'bg-white/60 border-transparent hover:bg-white'
                                            }
                                        `}
                                     >
                                         <span className={`font-black text-xl w-24 ${status === 'CORRECT' ? 'text-green-700' : 'text-gray-700'}`}>
                                             {row.a} {mode === 'ADDITION' ? '+' : '-'} {row.b} = 
                                         </span>

                                         <div className={`
                                             w-12 h-10 rounded-lg flex items-center justify-center font-black text-2xl
                                             ${status === 'CORRECT' ? 'text-green-600' : status === 'WRONG' ? 'text-red-500' : 'text-kid-blue'}
                                         `}>
                                             {status === 'CORRECT' ? (
                                                 <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                                     {row.result}
                                                 </motion.div>
                                             ) : (
                                                 userAnswers[id] || (isActive ? <span className="animate-pulse text-gray-300">|</span> : '')
                                             )}
                                         </div>

                                         {status === 'CORRECT' && (
                                             <div className="absolute right-2 top-1/2 -translate-y-1/2 text-green-500">
                                                 <Check size={20} strokeWidth={4} />
                                             </div>
                                         )}
                                     </motion.div>
                                 )
                             })}
                        </div>
                    </div>
                ))}
             </div>
        </div>
      </div>
    </div>
  );
};
