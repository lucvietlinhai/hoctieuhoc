import React, { useState } from 'react';
import { Button } from './Button';
import { Calculator, BookOpen, Layers, Sparkles, LayoutGrid, Award, BookOpenText, GraduationCap, ExternalLink, ArrowLeft, Star, FileQuestion, BookX } from 'lucide-react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { VietnameseTopic } from '../types';

interface DashboardProps {
  onStartVietnamese: (topic: VietnameseTopic) => void;
  onStartQuiz: () => void;
  missedWordsCount?: number;
}

type DashboardView = 'MAIN' | 'VIETNAMESE_MENU' | 'TOPIC_SELECTION' | 'SEMESTER_1_MENU';

export const Dashboard: React.FC<DashboardProps> = ({ onStartVietnamese, onStartQuiz, missedWordsCount = 0 }) => {
  const [currentView, setCurrentView] = useState<DashboardView>('MAIN');

  // Animation variants for transitions
  const containerVariants: Variants = {
    enter: { opacity: 0, scale: 0.9, x: 50 },
    center: { opacity: 1, scale: 1, x: 0, transition: { staggerChildren: 0.1, duration: 0.4 } },
    exit: { opacity: 0, scale: 0.9, x: -50, transition: { duration: 0.3 } }
  };

  const itemVariants: Variants = {
    enter: { y: 20, opacity: 0 },
    center: { y: 0, opacity: 1 },
    exit: { y: -20, opacity: 0 }
  };

  const renderContent = () => {
    switch (currentView) {
      case 'MAIN':
        return (
          <>
            {/* Missed Words Review Button (Only shows if there are missed words) */}
            {missedWordsCount > 0 && (
               <motion.div variants={itemVariants} className="w-full max-w-[300px] aspect-square">
                <Button 
                  size="lg" 
                  onClick={() => onStartVietnamese(VietnameseTopic.MISSED_WORDS)}
                  className="!bg-kid-pink !text-white !border-[6px] !border-white/50 shadow-[0_12px_24px_rgba(247,37,133,0.4)] hover:shadow-[0_16px_32px_rgba(247,37,133,0.6)] !rounded-[48px] w-full h-full flex flex-col items-center justify-center gap-4 relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 bg-red-500 text-white font-black text-lg px-4 py-1 rounded-bl-2xl z-10 animate-pulse">
                     {missedWordsCount} từ
                  </div>
                  <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center shadow-inner mb-2 backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                     <BookX className="w-20 h-20 text-white drop-shadow-md" />
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-3xl font-black tracking-tight text-center leading-none">Ôn Lại <br/> Từ Chưa Thuộc</span>
                    <span className="text-lg bg-white/20 px-4 py-1.5 rounded-full mt-3 font-bold backdrop-blur-sm whitespace-nowrap border-2 border-white/20">Cố lên nào!</span>
                  </div>
                </Button>
              </motion.div>
            )}

            {/* Tiếng Việt Button */}
            <motion.div variants={itemVariants} className="w-full max-w-[300px] aspect-square">
              <Button 
                size="lg" 
                onClick={() => setCurrentView('VIETNAMESE_MENU')}
                className="!bg-gradient-to-br !from-kid-blue !to-cyan-500 !text-white !border-[6px] !border-white/50 shadow-[0_12px_24px_rgba(76,201,240,0.4)] hover:shadow-[0_16px_32px_rgba(76,201,240,0.6)] !rounded-[48px] w-full h-full flex flex-col items-center justify-center gap-4 relative overflow-hidden group"
              >
                <div className="absolute top-0 left-0 w-full h-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center shadow-inner mb-2 backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                   <span className="text-8xl font-display font-black pt-4 drop-shadow-md">Aa</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-4xl font-black tracking-tight">Tiếng Việt</span>
                  <span className="text-xl bg-white/20 px-6 py-2 rounded-full mt-3 font-black backdrop-blur-sm whitespace-nowrap border-2 border-white/20">Bắt đầu học ngay</span>
                </div>
              </Button>
            </motion.div>

            {/* Ôn tập kỳ 1 Button */}
            <motion.div variants={itemVariants} className="w-full max-w-[300px] aspect-square">
              <Button 
                size="lg" 
                onClick={() => setCurrentView('SEMESTER_1_MENU')}
                className="!bg-gradient-to-br !from-kid-purple !to-fuchsia-600 !text-white !border-[6px] !border-white/50 shadow-[0_12px_24px_rgba(192,38,211,0.4)] hover:shadow-[0_16px_32px_rgba(192,38,211,0.6)] !rounded-[48px] w-full h-full flex flex-col items-center justify-center gap-4 relative overflow-hidden group"
              >
                <div className="absolute top-0 left-0 w-full h-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center shadow-inner mb-2 backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                   <Star className="w-20 h-20 text-white drop-shadow-md fill-white/20" />
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-black tracking-tight text-center leading-none">Ôn tập <br/> Học Kỳ 1</span>
                  <span className="text-lg bg-white/20 px-4 py-1.5 rounded-full mt-3 font-bold backdrop-blur-sm whitespace-nowrap border-2 border-white/20">Tổng hợp kiến thức</span>
                </div>
              </Button>
            </motion.div>

            {/* Toán Học Button (Disabled) */}
            <motion.div variants={itemVariants} className="w-full max-w-[300px] aspect-square">
              <Button 
                size="lg" 
                disabled
                className="!bg-white !text-gray-300 !border-[6px] !border-dashed !border-gray-300 shadow-none !rounded-[48px] w-full h-full flex flex-col items-center justify-center gap-4 cursor-not-allowed grayscale relative overflow-hidden opacity-80"
              >
                <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                   <Calculator className="w-20 h-20 text-gray-300" />
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-4xl font-black tracking-tight">Toán Học</span>
                  <span className="text-xl bg-gray-100 text-gray-400 px-6 py-2 rounded-full mt-3 font-black">Sắp ra mắt</span>
                </div>
              </Button>
            </motion.div>
          </>
        );

      case 'VIETNAMESE_MENU':
        return (
          <>
            <motion.div variants={itemVariants} className="w-full max-w-[300px] aspect-square">
              <Button 
                size="lg" 
                onClick={() => setCurrentView('TOPIC_SELECTION')}
                className="!bg-kid-green !text-white !border-[6px] !border-white/30 !rounded-[48px] w-full h-full flex flex-col items-center justify-center gap-4 shadow-[0_12px_0_#15803d] hover:brightness-110 active:translate-y-2 active:shadow-none transition-all group"
              >
                <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                   <GraduationCap className="w-20 h-20" />
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-black text-center leading-tight">Ôn tập <br/> học âm vần</span>
                  <span className="text-lg bg-black/10 px-4 py-1 rounded-full mt-2">Flashcard</span>
                </div>
              </Button>
            </motion.div>

            <motion.div variants={itemVariants} className="w-full max-w-[300px] aspect-square">
              <Button 
                size="lg" 
                onClick={() => window.open('https://www.hoc10.vn/doc-sach/tieng-viet-1-1/1/1/6/', '_blank')}
                className="!bg-kid-orange !bg-orange-500 !text-white !border-[6px] !border-white/30 !rounded-[48px] w-full h-full flex flex-col items-center justify-center gap-4 shadow-[0_12px_0_#c2410c] hover:brightness-110 active:translate-y-2 active:shadow-none transition-all group"
              >
                <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                   <BookOpenText className="w-20 h-20" />
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-black">SGK Online</span>
                  <span className="text-xl bg-black/10 px-4 py-1 rounded-full mt-2 flex items-center gap-2">
                    Mở sách <ExternalLink size={18}/>
                  </span>
                </div>
              </Button>
            </motion.div>
          </>
        );

      case 'SEMESTER_1_MENU':
        return (
          <>
            {/* Fill in the Blank Quiz Option - Centered as it is the only option now */}
            <motion.div variants={itemVariants} className="w-full max-w-[300px] aspect-square">
              <Button 
                size="lg" 
                onClick={onStartQuiz}
                className="!bg-kid-blue !text-white !border-[6px] !border-white/30 !rounded-[48px] w-full h-full flex flex-col items-center justify-center gap-4 shadow-[0_12px_0_#0284c7] hover:brightness-110 active:translate-y-2 active:shadow-none transition-all group"
              >
                <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                   <FileQuestion className="w-20 h-20" />
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-black text-center leading-tight">Bài tập <br/> điền từ</span>
                  <span className="text-lg bg-black/10 px-4 py-1 rounded-full mt-2">Trắc nghiệm vui</span>
                </div>
              </Button>
            </motion.div>
          </>
        );

      case 'TOPIC_SELECTION':
        return (
          <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-4">
             <motion.div variants={itemVariants} className="md:col-span-2">
                <Button 
                  onClick={() => onStartVietnamese(VietnameseTopic.PHAN_AM)}
                  className="!bg-kid-blue !rounded-3xl h-24 text-2xl !border-4 !border-white/20 shadow-[0_8px_0_#0284c7] hover:brightness-110 w-full"
                >
                   <Layers className="w-8 h-8 mr-3" /> Phần Âm (Cơ bản)
                </Button>
             </motion.div>

             <motion.div variants={itemVariants}>
                <Button 
                  onClick={() => onStartVietnamese(VietnameseTopic.VAN_KY_1)}
                  className="!bg-kid-yellow !text-white !rounded-3xl h-32 text-xl !border-4 !border-white/20 shadow-[0_8px_0_#b45309] flex-col hover:brightness-110 w-full"
                >
                   <BookOpen className="w-10 h-10 mb-2" /> Vần Kỳ 1
                </Button>
             </motion.div>

             <motion.div variants={itemVariants}>
                <Button 
                  onClick={() => onStartVietnamese(VietnameseTopic.VAN_KY_2)}
                  className="!bg-kid-pink !rounded-3xl h-32 text-xl !border-4 !border-white/20 shadow-[0_8px_0_#be185d] flex-col hover:brightness-110 w-full"
                >
                   <Sparkles className="w-10 h-10 mb-2" /> Vần Kỳ 2
                </Button>
             </motion.div>

             <motion.div variants={itemVariants} className="md:col-span-2 mt-2">
                <Button 
                  onClick={() => onStartVietnamese(VietnameseTopic.ALL)}
                  className="!bg-kid-purple !rounded-3xl h-20 text-xl !border-4 !border-white/20 shadow-[0_8px_0_#581c87] hover:brightness-110 w-full"
                >
                   <LayoutGrid className="w-6 h-6 mr-2" /> Ôn tập tất cả
                </Button>
             </motion.div>
          </div>
        );
    }
  };

  const getTitle = () => {
    switch(currentView) {
      case 'MAIN': return "Lớp học vui nhộn \n 1A16";
      case 'VIETNAMESE_MENU': return "Tiếng Việt";
      case 'TOPIC_SELECTION': return "Chọn Bài Học";
      case 'SEMESTER_1_MENU': return "Ôn Tập Kỳ 1";
    }
  };

  return (
    <div className="min-h-screen bg-sky-100 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Game Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none" 
           style={{ 
             backgroundImage: 'radial-gradient(#4CC9F0 2px, transparent 2px), radial-gradient(#4CC9F0 2px, transparent 2px)',
             backgroundSize: '40px 40px',
             backgroundPosition: '0 0, 20px 20px' 
           }}>
      </div>

      {/* Decorative Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[60vh] h-[60vh] bg-kid-yellow/20 rounded-full blur-3xl animate-wiggle"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[60vh] h-[60vh] bg-kid-pink/20 rounded-full blur-3xl animate-wiggle" style={{ animationDelay: '2s' }}></div>

      {/* Top Right Achievements Button */}
      <motion.button 
        whileHover={{ scale: 1.1, rotate: 10 }}
        whileTap={{ scale: 0.9 }}
        className="absolute top-6 right-6 z-20 w-16 h-16 bg-white border-4 border-kid-yellow rounded-full shadow-[0_4px_0_#eab308] flex items-center justify-center group active:translate-y-1 active:shadow-none transition-all"
      >
         <Award className="w-8 h-8 text-kid-yellow fill-kid-yellow group-hover:animate-wiggle" />
      </motion.button>

      {/* Back Button (Only for sub-menus) */}
      <AnimatePresence>
        {currentView !== 'MAIN' && (
          <motion.button
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
            onClick={() => setCurrentView(currentView === 'TOPIC_SELECTION' ? 'VIETNAMESE_MENU' : 'MAIN')}
            className="absolute top-6 left-6 z-20 w-14 h-14 bg-white border-4 border-kid-blue rounded-2xl shadow-[0_4px_0_#0284c7] flex items-center justify-center text-kid-blue hover:bg-gray-50 active:translate-y-1 active:shadow-none transition-all"
          >
            <ArrowLeft size={32} strokeWidth={3} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Dynamic Title */}
      <div className="text-center mb-10 relative z-10 min-h-[120px] flex items-end justify-center">
        <motion.div 
          key={currentView}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-5xl md:text-7xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-kid-purple via-kid-pink to-kid-blue drop-shadow-[0_4px_0_rgba(255,255,255,1)] p-2 tracking-tight whitespace-pre-line leading-tight">
            {getTitle()}
          </h1>
        </motion.div>
      </div>

      {/* Main Content Area - View Transition */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={currentView}
          variants={containerVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="flex flex-col md:flex-row gap-8 w-full max-w-6xl z-10 justify-center items-center flex-wrap"
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>

    </div>
  );
};