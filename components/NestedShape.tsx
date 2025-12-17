
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star } from 'lucide-react';

interface NestedShapeProps {
  shapeId: string;
}

interface ShapePart {
  id: number;
  d: string; // SVG Path data
}

interface ShapeCombination {
  parts: number[]; // Array of part IDs that make up this combo
  name: string;    // e.g. "Hình vuông lớn", "Hình chữ nhật"
  outline: string; // The SVG path for the outline of this combined shape
}

interface ShapeDef {
  viewBox: string;
  parts: ShapePart[];
  combinations: ShapeCombination[];
}

// LIBRARY OF SHAPES (SVG Paths)
const SHAPE_LIBRARY: Record<string, ShapeDef> = {
  // 1. Hình vuông có 2 đường chéo (Bài 8: 4 tam giác nhỏ -> 4 tam giác lớn -> 1 hình vuông)
  // Thực tế bài 8 trong ảnh chỉ có 1 đường chéo, nhưng ta làm tổng quát 2 đường chéo (8 tam giác) hoặc 1 (2 tam giác)
  // Dựa theo ảnh PDF Bài 8: Hình vuông có 1 đường chéo.
  'SQUARE_DIAGONAL': {
    viewBox: '0 0 100 100',
    parts: [
      { id: 0, d: 'M0,0 L100,100 L0,100 Z' }, // Tam giác dưới trái
      { id: 1, d: 'M0,0 L100,0 L100,100 Z' }, // Tam giác trên phải
    ],
    combinations: [
      { parts: [0, 1], name: "Hình vuông lớn", outline: "M0,0 L100,0 L100,100 L0,100 Z" }
    ]
  },

  // Bài 7: Hình chữ nhật có 2 đường chéo (Envelope style)
  // 4 tam giác nhỏ. Ghép đôi: Trái+Trên (ko phải tam giác), Trái+Dưới (ko phải).
  // Tuy nhiên nếu là hình vuông có 2 đường chéo thì ghép đôi cạnh nhau là tam giác vuông cân lớn.
  // Ở đây giả lập Bài 7 là Hình chữ nhật: 4 tam giác nhỏ.
  'RECT_ENVELOPE': {
    viewBox: '0 0 140 100',
    parts: [
      { id: 0, d: 'M0,0 L70,50 L0,100 Z' },    // Left
      { id: 1, d: 'M0,100 L70,50 L140,100 Z' }, // Bottom
      { id: 2, d: 'M140,100 L70,50 L140,0 Z' }, // Right
      { id: 3, d: 'M0,0 L140,0 L70,50 Z' },     // Top
    ],
    combinations: [
      { parts: [0, 1, 2, 3], name: "Hình chữ nhật lớn", outline: "M0,0 L140,0 L140,100 L0,100 Z" }
    ]
  },

  // Bài 9: 3 Hình vuông liền nhau, mỗi hình có 1 đường chéo
  'TRIPLE_SQUARES': {
    viewBox: '0 0 300 100',
    parts: [
      // Box 1 (Left)
      { id: 0, d: 'M0,0 L100,0 L100,100 Z' }, // Top Right Tri
      { id: 1, d: 'M0,0 L0,100 L100,100 Z' }, // Bot Left Tri
      // Box 2 (Mid)
      { id: 2, d: 'M100,0 L200,0 L100,100 Z' },
      { id: 3, d: 'M100,0 L100,100 L200,100 Z' },
      // Box 3 (Right)
      { id: 4, d: 'M200,0 L300,0 L200,100 Z' },
      { id: 5, d: 'M200,0 L200,100 L300,100 Z' },
    ],
    combinations: [
      // Squares
      { parts: [0, 1], name: "Hình vuông 1", outline: "M0,0 L100,0 L100,100 L0,100 Z" },
      { parts: [2, 3], name: "Hình vuông 2", outline: "M100,0 L200,0 L200,100 L100,100 Z" },
      { parts: [4, 5], name: "Hình vuông 3", outline: "M200,0 L300,0 L300,100 L200,100 Z" },
      // Rectangles (2 squares)
      { parts: [0, 1, 2, 3], name: "Hình chữ nhật (2 ô)", outline: "M0,0 L200,0 L200,100 L0,100 Z" },
      { parts: [2, 3, 4, 5], name: "Hình chữ nhật (2 ô)", outline: "M100,0 L300,0 L300,100 L100,100 Z" },
      // Big Rectangle (3 squares)
      { parts: [0, 1, 2, 3, 4, 5], name: "Hình chữ nhật lớn", outline: "M0,0 L300,0 L300,100 L0,100 Z" }
    ]
  },

  // Bài 10: 1 Hình vuông lớn bên trái, 2 hình vuông nhỏ bên phải chồng lên nhau
  // Tổng thể là một hình chữ nhật.
  'RECT_SPLIT_4': {
      viewBox: '0 0 200 100',
      parts: [
          { id: 0, d: 'M0,0 L100,0 L100,100 L0,100 Z' }, // Big Left Square (Size 100x100)
          { id: 1, d: 'M100,0 L200,0 L200,50 L100,50 Z' }, // Top Right Rect (Small Square 50x50 technically needs to be scaled visually to look like square, but logic holds)
          { id: 2, d: 'M100,50 L200,50 L200,100 L100,100 Z' }, // Bot Right Rect
      ],
      combinations: [
          // Rect Right
          { parts: [1, 2], name: "Hình chữ nhật phải", outline: "M100,0 L200,0 L200,100 L100,100 Z" },
          // Big Rect (All)
          { parts: [0, 1, 2], name: "Hình chữ nhật lớn", outline: "M0,0 L200,0 L200,100 L0,100 Z" }
      ]
  },
  
  // Hình ngôi nhà đơn giản
  'HOUSE_SIMPLE': {
    viewBox: '0 0 100 150',
    parts: [
        { id: 0, d: 'M50,0 L100,50 L0,50 Z' }, // Roof
        { id: 1, d: 'M0,50 L100,50 L100,150 L0,150 Z' }, // Body Square
    ],
    combinations: [
        { parts: [0, 1], name: "Hình ngôi nhà", outline: "M50,0 L100,50 L100,150 L0,150 L0,50 Z" }
    ]
  }
};

const COLORS = [
    '#4CC9F0', '#F72585', '#F9C74F', '#43AA8B', '#7209B7', '#E056FD', '#686DE0'
];

export const NestedShape: React.FC<NestedShapeProps> = ({ shapeId }) => {
  const definition = SHAPE_LIBRARY[shapeId];
  const [activeParts, setActiveParts] = useState<number[]>([]);
  const [detectedCombo, setDetectedCombo] = useState<ShapeCombination | null>(null);

  if (!definition) {
    return <div className="text-gray-400 p-4 border-2 border-dashed rounded-lg">Hình chưa được hỗ trợ: {shapeId}</div>;
  }

  const togglePart = (index: number) => {
    let newParts = [];
    if (activeParts.includes(index)) {
        newParts = activeParts.filter(i => i !== index);
    } else {
        newParts = [...activeParts, index];
    }
    setActiveParts(newParts);
    checkCombinations(newParts);
  };

  const checkCombinations = (parts: number[]) => {
      // Find the largest combination that matches the selected parts EXACTLY
      // Sorting combinations by number of parts (descending) to find largest first
      const sortedCombos = [...definition.combinations].sort((a, b) => b.parts.length - a.parts.length);
      
      const match = sortedCombos.find(combo => {
          // Check if all parts in combo are active
          const hasAllParts = combo.parts.every(p => parts.includes(p));
          // Check if active parts are exactly equal to combo parts (optional, or allow partial selection?)
          // Usually strict match is better for "Identification"
          const isExactMatch = hasAllParts && parts.length === combo.parts.length;
          return isExactMatch;
      });

      setDetectedCombo(match || null);
  };

  return (
    <div className="flex flex-col items-center w-full">
        <div className="relative w-full max-w-md aspect-video bg-white rounded-3xl shadow-[0_8px_16px_rgba(0,0,0,0.1)] border-4 border-white p-6 flex items-center justify-center overflow-hidden">
            
            <svg 
                viewBox={definition.viewBox} 
                className="w-full h-full drop-shadow-lg overflow-visible touch-none select-none"
                style={{ maxHeight: '250px' }}
            >
                <defs>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                       <feGaussianBlur stdDeviation="3" result="blur" />
                       <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>

                {/* Render Individual Parts */}
                {definition.parts.map((part) => {
                    const isActive = activeParts.includes(part.id);
                    const color = COLORS[part.id % COLORS.length];
                    
                    return (
                        <motion.path
                            key={part.id}
                            d={part.d}
                            initial={{ fill: '#f1f5f9', stroke: '#cbd5e1', strokeWidth: 2 }}
                            animate={{ 
                                fill: isActive ? color : '#f1f5f9',
                                stroke: isActive ? '#fff' : '#94a3b8',
                                strokeWidth: isActive ? 3 : 2,
                                opacity: isActive ? 0.9 : 1
                            }}
                            whileHover={{ 
                                fill: isActive ? color : '#e2e8f0',
                                cursor: 'pointer',
                                scale: 1.02,
                            }}
                            onClick={() => togglePart(part.id)}
                            transition={{ duration: 0.2 }}
                            strokeLinejoin="round"
                            style={{ transformOrigin: 'center' }}
                        />
                    );
                })}

                {/* Render Detected Combination Outline */}
                <AnimatePresence>
                    {detectedCombo && (
                        <motion.path
                            d={detectedCombo.outline}
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            exit={{ opacity: 0 }}
                            fill="none"
                            stroke="#FFD700" // Gold
                            strokeWidth="5"
                            strokeDasharray="10 5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            filter="url(#glow)"
                            className="pointer-events-none z-20"
                        />
                    )}
                </AnimatePresence>
            </svg>
            
            {/* Helper Hint */}
            <div className="absolute top-3 right-3 pointer-events-none">
                 <div className="bg-white/90 backdrop-blur text-xs font-bold text-gray-400 px-3 py-1 rounded-full border border-gray-100 shadow-sm">
                    Bé chọn hình để ghép nhé
                 </div>
            </div>

            {/* Success Animation */}
            <AnimatePresence>
                {detectedCombo && (
                     <motion.div 
                       initial={{ scale: 0, opacity: 0 }}
                       animate={{ scale: 1, opacity: 1 }}
                       exit={{ scale: 0, opacity: 0 }}
                       className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                     >
                        <Star className="w-24 h-24 text-yellow-400 fill-yellow-400 drop-shadow-[0_4px_4px_rgba(0,0,0,0.3)] animate-spin-slow" />
                     </motion.div>
                )}
            </AnimatePresence>
        </div>
        
        {/* Status Bar */}
        <div className="mt-4 flex flex-col items-center h-16">
            <AnimatePresence mode="wait">
                {detectedCombo ? (
                    <motion.div
                        key="combo"
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -10, opacity: 0 }}
                        className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-6 py-2 rounded-2xl shadow-md font-black text-xl flex items-center gap-2"
                    >
                        <Star size={20} fill="currentColor" />
                        {detectedCombo.name}
                    </motion.div>
                ) : (
                    <motion.div
                        key="count"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-gray-500 font-bold bg-white px-4 py-2 rounded-xl border border-gray-200"
                    >
                        Đã chọn: {activeParts.length} phần
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    </div>
  );
};
