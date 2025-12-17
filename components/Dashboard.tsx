
import React, { useState } from 'react';
import { Button } from './Button';
import { BookOpenText, GraduationCap, ArrowLeft, Star, Shapes, Calculator, ArrowUpDown, LayoutGrid, Table2, Timer, ClipboardList, Languages, Bot, Palette, Triangle } from 'lucide-react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { VietnameseTopic, Student, MathTopic, EnglishTopic } from '../types';

interface DashboardProps {
  student: Student;
  onStartVietnamese: (topic: VietnameseTopic) => void;
  onStartQuiz: () => void;
  onChangeUser: () => void;
  onStartMath: (topic: MathTopic) => void;
  onOpenMathTables: () => void;
  onOpenMathReflex: () => void;
  onStartExam: (examId: 1 | 2) => void;
  onStartEnglish: (topic: EnglishTopic) => void;
}

type DashboardView = 'MAIN' | 'VIETNAMESE_MENU' | 'MATH_MENU' | 'ENGLISH_MENU';

export const Dashboard: React.FC<DashboardProps> = ({ 
  student, 
  onStartVietnamese, 
  onStartQuiz, 
  onChangeUser, 
  onStartMath, 
  onOpenMathTables, 
  onOpenMathReflex, 
  onStartExam,
  onStartEnglish 
}) => {
  const [currentView, setCurrentView] = useState<DashboardView>('MAIN');

  // Animation variants
  const containerVariants: Variants = {
    enter: { opacity: 0, x: 50 },
    center: { opacity: 1, x: 0, transition: { staggerChildren: 0.1 } },
    exit: { opacity: 0, x: -50 }
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
            {/* Tiếng Việt Card */}
            <motion.div variants={itemVariants} className="w-full max-w-[300px] aspect-[4/5]">
              <Button 
                onClick={() => setCurrentView('VIETNAMESE_MENU')}
                className="!bg-gradient-to-b !from-kid-blue !to-blue-500 !text-white !border-[6px] !border-white/40 shadow-[0_12px_24px_rgba(59,130,246,0.3)] hover:scale-105 !rounded-[40px] w-full h-full flex flex-col items-center justify-center gap-6 relative overflow-hidden group p-0"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.2),transparent)]"></div>
                <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md shadow-inner border-2 border-white/30 group-hover:scale-110 transition-transform duration-500">
                   <span className="text-8xl font-display font-black pt-4 drop-shadow-lg">Aa</span>
                </div>
                <div className="text-center z-10 px-4">
                  <h2 className="text-3xl font-black mb-1 tracking-tight">Tiếng Việt</h2>
                  <p className="text-blue-100 font-medium text-sm bg-blue-600/30 px-3 py-1 rounded-full">Học vần</p>
                </div>
              </Button>
            </motion.div>

            {/* Toán Học Card */}
            <motion.div variants={itemVariants} className="w-full max-w-[300px] aspect-[4/5]">
              <Button 
                onClick={() => setCurrentView('MATH_MENU')}
                className="!bg-gradient-to-b !from-orange-400 !to-red-500 !text-white !border-[6px] !border-white/40 shadow-[0_12px_24px_rgba(249,115,22,0.3)] hover:scale-105 !rounded-[40px] w-full h-full flex flex-col items-center justify-center gap-6 relative overflow-hidden group p-0"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.2),transparent)]"></div>
                <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md shadow-inner border-2 border-white/30 group-hover:scale-110 transition-transform duration-500">
                   <div className="relative">
                      <span className="text-7xl font-black absolute -top-10 -left-8 text-yellow-200">1</span>
                      <span className="text-8xl font-black relative z-10 text-white drop-shadow-lg">2</span>
                      <span className="text-7xl font-black absolute -bottom-8 -right-8 text-yellow-200">3</span>
                   </div>
                </div>
                <div className="text-center z-10 px-4">
                  <h2 className="text-3xl font-black mb-1 tracking-tight">Toán Học</h2>
                  <p className="text-orange-100 font-medium text-sm bg-orange-600/30 px-3 py-1 rounded-full">Đếm & Hình</p>
                </div>
              </Button>
            </motion.div>

             {/* English Card (New) */}
            <motion.div variants={itemVariants} className="w-full max-w-[300px] aspect-[4/5]">
              <Button 
                onClick={() => setCurrentView('ENGLISH_MENU')}
                className="!bg-gradient-to-b !from-indigo-400 !to-purple-600 !text-white !border-[6px] !border-white/40 shadow-[0_12px_24px_rgba(124,58,237,0.3)] hover:scale-105 !rounded-[40px] w-full h-full flex flex-col items-center justify-center gap-6 relative overflow-hidden group p-0"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent)]"></div>
                <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md shadow-inner border-2 border-white/30 group-hover:scale-110 transition-transform duration-500">
                   <Languages size={64} className="text-white drop-shadow-lg" />
                </div>
                <div className="text-center z-10 px-4">
                  <h2 className="text-3xl font-black mb-1 tracking-tight">English</h2>
                  <p className="text-indigo-100 font-medium text-sm bg-indigo-600/30 px-3 py-1 rounded-full">STEM Robotics</p>
                </div>
              </Button>
            </motion.div>
          </>
        );

      case 'VIETNAMESE_MENU':
        return (
          <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div variants={itemVariants} className="md:col-span-2 mb-2">
               <Button onClick={() => setCurrentView('MAIN')} className="!bg-white/50 !text-gray-600 hover:!bg-white mb-4 !px-4 !py-2 !h-auto !text-sm">
                  <ArrowLeft size={16} className="mr-2"/> Quay lại
               </Button>
               <h2 className="text-3xl font-black text-kid-blue mb-2 text-center md:text-left pl-2">Chọn Bài Học Tiếng Việt</h2>
            </motion.div>
            {/* Vietnamese buttons... (kept same) */}
            <motion.div variants={itemVariants}>
              <Button size="lg" onClick={() => onStartVietnamese(VietnameseTopic.PHAN_AM)} className="!bg-kid-green w-full h-32 text-2xl justify-between px-8 !rounded-3xl shadow-[0_8px_0_#15803d]">
                <span>Phần Âm</span>
                <BookOpenText size={40} className="opacity-80" />
              </Button>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Button size="lg" onClick={() => onStartVietnamese(VietnameseTopic.VAN_KY_1)} className="!bg-kid-purple w-full h-32 text-2xl justify-between px-8 !rounded-3xl shadow-[0_8px_0_#7e22ce]">
                <span>Vần Kì 1</span>
                <GraduationCap size={40} className="opacity-80" />
              </Button>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Button size="lg" onClick={() => onStartVietnamese(VietnameseTopic.VAN_KY_2)} className="!bg-kid-pink w-full h-32 text-2xl justify-between px-8 !rounded-3xl shadow-[0_8px_0_#be185d]">
                <span>Vần Kì 2</span>
                <Star size={40} className="opacity-80" />
              </Button>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Button size="lg" onClick={onStartQuiz} className="!bg-kid-yellow !text-orange-900 w-full h-32 text-2xl justify-between px-8 !rounded-3xl shadow-[0_8px_0_#d97706]">
                <span>Trò Chơi Ôn Tập</span>
                <span className="text-5xl">🎮</span>
              </Button>
            </motion.div>
          </div>
        );

      case 'MATH_MENU':
        return (
          <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-4 pb-20">
            <motion.div variants={itemVariants} className="md:col-span-2 mb-2">
               <Button onClick={() => setCurrentView('MAIN')} className="!bg-white/50 !text-gray-600 hover:!bg-white mb-4 !px-4 !py-2 !h-auto !text-sm">
                  <ArrowLeft size={16} className="mr-2"/> Quay lại
               </Button>
               <h2 className="text-3xl font-black text-orange-500 mb-2 text-center md:text-left pl-2">Chọn Bài Học Toán</h2>
            </motion.div>
            {/* Math buttons... (kept same) */}
            <motion.div variants={itemVariants} className="md:col-span-2">
              <div className="bg-white/60 p-4 rounded-[2rem] border-2 border-white mb-4">
                 <h3 className="font-bold text-gray-500 uppercase tracking-widest text-sm mb-3 ml-2 flex items-center gap-2">
                    <ClipboardList size={16} /> Luyện Đề Thi Cuối Kỳ
                 </h3>
                 <div className="grid grid-cols-2 gap-4">
                    <Button onClick={() => onStartExam(1)} className="!bg-white !text-kid-blue !border-2 !border-kid-blue/20 hover:!border-kid-blue shadow-sm !rounded-2xl h-20 text-xl">📝 Đề Số 1</Button>
                    <Button onClick={() => onStartExam(2)} className="!bg-white !text-kid-purple !border-2 !border-kid-purple/20 hover:!border-kid-purple shadow-sm !rounded-2xl h-20 text-xl">📝 Đề Số 2</Button>
                 </div>
              </div>
            </motion.div>
            <motion.div variants={itemVariants}>
               <Button size="lg" onClick={onOpenMathTables} className="!bg-gradient-to-r !from-pink-500 !to-rose-400 w-full h-32 text-2xl justify-between px-8 !rounded-3xl shadow-[0_8px_0_#be123c] !text-white border-2 border-white/20">
                <div className="text-left"><span className="block font-black text-2xl">Bảng Cộng Trừ</span><span className="text-sm opacity-90 font-normal">Học thuộc nhanh</span></div>
                <Table2 size={40} className="opacity-80" />
              </Button>
            </motion.div>
            <motion.div variants={itemVariants}>
               <Button size="lg" onClick={onOpenMathReflex} className="!bg-gradient-to-r !from-indigo-500 !to-violet-500 w-full h-32 text-2xl justify-between px-8 !rounded-3xl shadow-[0_8px_0_#4338ca] !text-white border-2 border-white/20">
                <div className="text-left"><span className="block font-black text-2xl">Thử Thách Tốc Độ</span><span className="text-sm opacity-90 font-normal">Luyện phản xạ 60s</span></div>
                <Timer size={40} className="opacity-80 animate-pulse" />
              </Button>
            </motion.div>
            <motion.div variants={itemVariants}><Button size="lg" onClick={() => onStartMath(MathTopic.GEOMETRY)} className="!bg-emerald-400 w-full h-32 text-xl md:text-2xl justify-between px-8 !rounded-3xl shadow-[0_8px_0_#059669]"><div className="text-left"><span className="block font-black">Hình & Vị Trí</span><span className="text-sm opacity-90 font-normal">Vuông, Tròn, Trái, Phải</span></div><Shapes size={40} className="opacity-80" /></Button></motion.div>
            <motion.div variants={itemVariants}><Button size="lg" onClick={() => onStartMath(MathTopic.NUMBERS)} className="!bg-sky-400 w-full h-32 text-xl md:text-2xl justify-between px-8 !rounded-3xl shadow-[0_8px_0_#0284c7]"><div className="text-left"><span className="block font-black">Số & So Sánh</span><span className="text-sm opacity-90 font-normal">Lớn, Bé, Sắp xếp</span></div><ArrowUpDown size={40} className="opacity-80" /></Button></motion.div>
            <motion.div variants={itemVariants}><Button size="lg" onClick={() => onStartMath(MathTopic.CALCULATION)} className="!bg-rose-400 w-full h-32 text-xl md:text-2xl justify-between px-8 !rounded-3xl shadow-[0_8px_0_#e11d48]"><div className="text-left"><span className="block font-black">Phép Tính</span><span className="text-sm opacity-90 font-normal">Cộng, Trừ 10</span></div><Calculator size={40} className="opacity-80" /></Button></motion.div>
            <motion.div variants={itemVariants}><Button size="lg" onClick={() => onStartMath(MathTopic.MIXED)} className="!bg-gray-400 w-full h-32 text-xl md:text-2xl justify-between px-8 !rounded-3xl shadow-[0_8px_0_#4b5563]"><div className="text-left"><span className="block font-black">Tổng Hợp</span><span className="text-sm opacity-90 font-normal">Tất cả các dạng</span></div><LayoutGrid size={40} className="opacity-80" /></Button></motion.div>
          </div>
        );

      case 'ENGLISH_MENU':
        return (
          <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-4 pb-20">
            <motion.div variants={itemVariants} className="md:col-span-2 mb-2">
               <Button onClick={() => setCurrentView('MAIN')} className="!bg-white/50 !text-gray-600 hover:!bg-white mb-4 !px-4 !py-2 !h-auto !text-sm">
                  <ArrowLeft size={16} className="mr-2"/> Quay lại
               </Button>
               <h2 className="text-3xl font-black text-indigo-600 mb-2 text-center md:text-left pl-2">English STEM Robotics</h2>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Button size="lg" onClick={() => onStartEnglish(EnglishTopic.UNIT_0)} className="!bg-gray-600 w-full h-32 text-xl justify-between px-8 !rounded-3xl shadow-[0_8px_0_#374151] !text-white">
                <div className="text-left">
                  <span className="block font-black">Unit 0: Intro</span>
                  <span className="text-sm opacity-90 font-normal">Robot Blocks, Numbers</span>
                </div>
                <Bot size={40} className="opacity-80" />
              </Button>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Button size="lg" onClick={() => onStartEnglish(EnglishTopic.UNIT_1)} className="!bg-teal-500 w-full h-32 text-xl justify-between px-8 !rounded-3xl shadow-[0_8px_0_#14b8a6] !text-white">
                <div className="text-left">
                  <span className="block font-black">Unit 1: Colours</span>
                  <span className="text-sm opacity-90 font-normal">Red, Green, Blue...</span>
                </div>
                <Palette size={40} className="opacity-80" />
              </Button>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Button size="lg" onClick={() => onStartEnglish(EnglishTopic.UNIT_2)} className="!bg-orange-500 w-full h-32 text-xl justify-between px-8 !rounded-3xl shadow-[0_8px_0_#f97316] !text-white">
                <div className="text-left">
                  <span className="block font-black">Unit 2: Shapes</span>
                  <span className="text-sm opacity-90 font-normal">Triangle, Circle, Square</span>
                </div>
                <Triangle size={40} className="opacity-80" />
              </Button>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Button size="lg" onClick={() => onStartEnglish(EnglishTopic.UNIT_3)} className="!bg-red-600 w-full h-32 text-xl justify-between px-8 !rounded-3xl shadow-[0_8px_0_#dc2626] !text-white">
                <div className="text-left">
                  <span className="block font-black">Unit 3: Christmas</span>
                  <span className="text-sm opacity-90 font-normal">Santa, Tree, Reindeer</span>
                </div>
                <span className="text-4xl">🎄</span>
              </Button>
            </motion.div>

            <motion.div variants={itemVariants} className="md:col-span-2">
              <Button size="lg" onClick={() => onStartEnglish(EnglishTopic.REVIEW)} className="!bg-indigo-600 w-full h-24 text-xl justify-between px-8 !rounded-3xl shadow-[0_8px_0_#4f46e5] !text-white">
                <div className="text-left">
                  <span className="block font-black">General Review (Ôn Tập Chung)</span>
                  <span className="text-sm opacity-90 font-normal">Practice Q&A: What's your name?...</span>
                </div>
                <ClipboardList size={40} className="opacity-80" />
              </Button>
            </motion.div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-kid-bg flex flex-col relative overflow-x-hidden">
      {/* Header */}
      <header className="px-6 py-4 flex justify-between items-center bg-white/60 backdrop-blur-md sticky top-0 z-20 border-b border-white">
        <div className="flex items-center gap-3">
           <div className={`w-12 h-12 rounded-full ${student.avatarColor} flex items-center justify-center text-2xl shadow-sm border-2 border-white`}>
             {student.icon}
           </div>
           <div>
             <p className="text-xs text-gray-500 font-bold uppercase">Học sinh</p>
             <h2 className="text-xl font-black text-gray-800 leading-none">{student.name}</h2>
           </div>
        </div>
        <div className="opacity-0 pointer-events-none">
           <Button variant="secondary" size="sm" onClick={onChangeUser}>Đổi bé</Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 relative">
         <motion.div
           key={currentView}
           variants={containerVariants}
           initial="enter"
           animate="center"
           exit="exit"
           className={`flex flex-wrap items-center justify-center gap-8 w-full ${currentView === 'MAIN' ? 'flex-row' : ''}`}
         >
            {renderContent()}
         </motion.div>
      </main>
    </div>
  );
};
