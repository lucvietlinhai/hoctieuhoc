import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Point {
  x: number;
  y: number;
  id: number;
  color: string;
}

const COLORS = ['#4CC9F0', '#F72585', '#F9C74F', '#43AA8B', '#7209B7'];

export const CursorEffect: React.FC = () => {
  const [points, setPoints] = useState<Point[]>([]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const newPoint: Point = {
        x: e.clientX,
        y: e.clientY,
        id: Date.now(),
        color: COLORS[Math.floor(Math.random() * COLORS.length)]
      };

      setPoints(prev => [...prev.slice(-15), newPoint]);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Cleanup old points
  useEffect(() => {
    const interval = setInterval(() => {
      setPoints(prev => prev.filter(p => Date.now() - p.id < 500));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      <AnimatePresence>
        {points.map((point) => (
          <motion.div
            key={point.id}
            initial={{ scale: 1, opacity: 1 }}
            animate={{ scale: 0, opacity: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute rounded-full"
            style={{
              left: point.x,
              top: point.y,
              width: '12px',
              height: '12px',
              backgroundColor: point.color,
              transform: 'translate(-50%, -50%)',
            }}
          >
            {/* Inner sparkle */}
            <div className="w-full h-full bg-white opacity-50 rounded-full animate-ping" />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};