import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Student } from '../types';
import { getStudents } from '../services/dataService';
import { Settings, Loader2 } from 'lucide-react';

interface StudentSelectProps {
  onSelect: (student: Student) => void;
  onTeacherAccess: () => void;
}

export const StudentSelect: React.FC<StudentSelectProps> = ({ onSelect, onTeacherAccess }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await getStudents();
      setStudents(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-kid-bg flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none opacity-20" 
           style={{ 
             backgroundImage: 'radial-gradient(#4CC9F0 2px, transparent 2px)',
             backgroundSize: '30px 30px' 
           }}>
      </div>
      
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-kid-yellow rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-kid-pink rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

      {/* Teacher Access Button */}
      <div className="absolute top-6 right-6 z-20">
        <button 
          onClick={onTeacherAccess}
          className="bg-white/50 hover:bg-white p-2 rounded-full text-gray-400 hover:text-kid-blue transition-colors flex items-center gap-2 px-4 border border-transparent hover:border-kid-blue/20"
        >
          <span className="text-sm font-bold hidden sm:inline">Góc Giáo Viên</span>
          <Settings size={20} />
        </button>
      </div>

      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="z-10 text-center mb-8"
      >
        <span className="text-xl md:text-2xl font-bold text-kid-blue uppercase tracking-widest mb-2 block">Chào mừng bé đến lớp</span>
        <h1 className="text-4xl md:text-6xl font-display font-black text-gray-800 drop-shadow-sm">
          Con tên là gì?
        </h1>
      </motion.div>

      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="w-full max-w-5xl z-10"
      >
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-kid-blue" />
          </div>
        ) : students.length === 0 ? (
          <div className="text-center bg-white p-8 rounded-3xl shadow-lg max-w-md mx-auto">
            <p className="text-xl text-gray-500 mb-4">Chưa có học sinh nào trong lớp.</p>
            <p className="text-kid-blue font-bold">Thầy/Cô vui lòng vào "Góc Giáo Viên" để thêm danh sách lớp nhé!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {students.map((student, index) => (
              <motion.button
                key={student.id}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onSelect(student)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-3xl p-4 shadow-[0_8px_0_rgba(0,0,0,0.1)] hover:shadow-[0_12px_0_rgba(0,0,0,0.15)] active:shadow-none active:translate-y-[8px] border-4 border-transparent transition-all flex flex-col items-center gap-3 group relative overflow-hidden"
              >
                <div className={`w-20 h-20 md:w-24 md:h-24 rounded-full ${student.avatarColor} flex items-center justify-center text-4xl shadow-inner mb-1 group-hover:scale-110 transition-transform duration-300`}>
                  <span className="filter drop-shadow-md">{student.icon}</span>
                </div>
                
                <div className="text-center w-full">
                  <h3 className="text-xl md:text-2xl font-display font-bold text-gray-700 truncate w-full px-2">
                    {student.name}
                  </h3>
                </div>

                {/* Hover Effect Ring */}
                <div className={`absolute inset-0 border-4 ${student.avatarColor.replace('bg-', 'border-')} rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`}></div>
              </motion.button>
            ))}
          </div>
        )}
      </motion.div>

      <div className="mt-12 text-gray-400 text-sm font-bold text-center z-10">
        Phụ huynh vui lòng chọn đúng tên của bé để lưu kết quả học tập nhé!
      </div>
    </div>
  );
};