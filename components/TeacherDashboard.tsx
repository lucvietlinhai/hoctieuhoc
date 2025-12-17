import React, { useState, useEffect } from 'react';
import { Student } from '../types';
import { getStudents, addStudent, deleteStudent } from '../services/dataService';
import { Button } from './Button';
import { ArrowLeft, Trash2, UserPlus, BarChart3, Users, Save, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TeacherDashboardProps {
  onExit: () => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ onExit }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [activeTab, setActiveTab] = useState<'students' | 'reports'>('students');
  const [newStudentName, setNewStudentName] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Initial Load
  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const loadData = async () => {
    setIsLoading(true);
    const data = await getStudents();
    setStudents(data);
    setIsLoading(false);
  };

  const handleLogin = () => {
    if (pin === '1234') {
      setIsAuthenticated(true);
    } else {
      alert('Mật khẩu không đúng! (Gợi ý: 1234)');
      setPin('');
    }
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newStudentName.trim()) {
      setIsProcessing(true);
      await addStudent(newStudentName.trim());
      await loadData(); // Reload list
      setNewStudentName('');
      setIsProcessing(false);
    }
  };

  const handleDeleteStudent = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa học sinh này không? Dữ liệu học tập cũng sẽ mất.')) {
      setIsProcessing(true);
      await deleteStudent(id);
      await loadData();
      setIsProcessing(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-8 rounded-3xl shadow-xl max-w-sm w-full text-center border-4 border-gray-200"
        >
          <div className="w-16 h-16 bg-kid-blue rounded-full flex items-center justify-center mx-auto mb-4 text-white">
            <Users size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Góc Giáo Viên</h2>
          <p className="text-gray-500 mb-6">Vui lòng nhập mã PIN để quản lý lớp học.</p>
          
          <input 
            type="password" 
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="w-full text-center text-3xl font-bold tracking-widest p-4 rounded-xl border-2 border-gray-300 focus:border-kid-blue focus:outline-none mb-6"
            placeholder="••••"
            maxLength={4}
          />
          
          <div className="flex gap-2">
            <Button variant="secondary" onClick={onExit} className="flex-1">Quay lại</Button>
            <Button onClick={handleLogin} className="flex-1">Đăng nhập</Button>
          </div>
          <p className="mt-4 text-xs text-gray-400">(Mật khẩu mặc định: 1234)</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onExit} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft size={24} className="text-gray-600" />
            </button>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <Users className="text-kid-blue" />
              Quản Lý Lớp Học
            </h1>
          </div>
          
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button 
              onClick={() => setActiveTab('students')}
              className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'students' ? 'bg-white shadow-sm text-kid-blue' : 'text-gray-500'}`}
            >
              Danh sách lớp
            </button>
            <button 
              onClick={() => setActiveTab('reports')}
              className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'reports' ? 'bg-white shadow-sm text-kid-purple' : 'text-gray-500'}`}
            >
              Báo cáo kết quả
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {isLoading ? (
          <div className="flex justify-center py-20">
             <Loader2 className="animate-spin w-10 h-10 text-gray-400" />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {activeTab === 'students' ? (
              <motion.div 
                key="students"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* Add Student Form */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <UserPlus size={20} className="text-kid-green" /> Thêm học sinh mới
                  </h3>
                  <form onSubmit={handleAddStudent} className="flex gap-3">
                    <input 
                      type="text" 
                      value={newStudentName}
                      onChange={(e) => setNewStudentName(e.target.value)}
                      placeholder="Nhập tên học sinh (VD: Nguyễn Văn A)"
                      className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-kid-green focus:outline-none"
                      disabled={isProcessing}
                      autoFocus
                    />
                    <Button variant="success" type="submit" disabled={!newStudentName.trim() || isProcessing}>
                      {isProcessing ? <Loader2 className="animate-spin" /> : <Save size={18} className="mr-2" />} 
                      Lưu
                    </Button>
                  </form>
                </div>

                {/* Student List */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                    <h3 className="font-bold text-gray-700">Danh sách ({students.length} em)</h3>
                  </div>
                  {students.length === 0 ? (
                    <div className="p-8 text-center text-gray-400">Chưa có học sinh nào.</div>
                  ) : (
                    <ul className="divide-y divide-gray-100">
                      {students.map((student) => (
                        <li key={student.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full ${student.avatarColor} flex items-center justify-center text-lg`}>
                              {student.icon}
                            </div>
                            <span className="font-bold text-gray-700 text-lg">{student.name}</span>
                          </div>
                          <button 
                            onClick={() => handleDeleteStudent(student.id)}
                            disabled={isProcessing}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all disabled:opacity-50"
                            title="Xóa"
                          >
                            <Trash2 size={20} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="reports"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                    <h3 className="font-bold text-gray-700 flex items-center gap-2">
                      <BarChart3 size={20} className="text-kid-purple" /> Kết quả học tập
                    </h3>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-gray-50 text-gray-500 text-sm uppercase tracking-wider">
                          <th className="px-6 py-3 font-bold">Học sinh</th>
                          <th className="px-6 py-3 font-bold text-center">Số từ đã học</th>
                          <th className="px-6 py-3 font-bold text-center">Bài kiểm tra</th>
                          <th className="px-6 py-3 font-bold text-center">Điểm cao nhất</th>
                          <th className="px-6 py-3 font-bold text-right">Học gần nhất</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {students.map((student: any) => {
                          return (
                            <tr key={student.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className={`w-8 h-8 rounded-full ${student.avatarColor} flex items-center justify-center text-sm`}>
                                    {student.icon}
                                  </div>
                                  <span className="font-bold text-gray-700">{student.name}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-center">
                                <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full font-bold text-sm">
                                  {student.totalWordsLearned || 0} từ
                                </span>
                              </td>
                              <td className="px-6 py-4 text-center">
                                {student.quizzesTaken || 0}
                              </td>
                              <td className="px-6 py-4 text-center font-bold text-kid-pink">
                                {student.highScore || 0}/10
                              </td>
                              <td className="px-6 py-4 text-right text-gray-500 text-sm">
                                {student.lastStudyDate ? new Date(student.lastStudyDate).toLocaleDateString('vi-VN') : 'Chưa học'}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};