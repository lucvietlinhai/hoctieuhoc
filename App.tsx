
import React, { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { StudySession } from './components/StudySession';
import { Results } from './components/Results';
import { QuizGame } from './components/QuizGame';
import { MathQuizGame } from './components/MathQuizGame';
import { MathTables } from './components/MathTables';
import { MathReflexGame } from './components/MathReflexGame';
import { MathExam } from './components/MathExam';
import { EnglishGame } from './components/EnglishGame';
import { CursorEffect } from './components/CursorEffect';
import { StudentSelect } from './components/StudentSelect';
import { TeacherDashboard } from './components/TeacherDashboard';
import { AppScreen, StudySessionState, PhonicsCard, VietnameseTopic, Student, MathTopic, EnglishTopic } from './types';
import { createVietnameseDeck } from './constants';
// import { saveWordProgress, saveQuizResult } from './services/dataService'; // Disabled for dev
import { motion, AnimatePresence } from 'framer-motion';

// --- MOCK USER FOR DEVELOPMENT ---
const DEV_STUDENT: Student = {
  id: 'dev-student-01',
  name: 'Bé Chăm Chỉ',
  avatarColor: 'bg-kid-blue',
  icon: '🐼'
};

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>(AppScreen.DASHBOARD);
  const [currentUser, setCurrentUser] = useState<Student | null>(DEV_STUDENT);
  
  const [studyState, setStudyState] = useState<StudySessionState | null>(null);
  const [activeCards, setActiveCards] = useState<PhonicsCard[]>([]);
  const [currentTopic, setCurrentTopic] = useState<VietnameseTopic>(VietnameseTopic.ALL);
  const [currentMathTopic, setCurrentMathTopic] = useState<MathTopic>(MathTopic.MIXED);
  const [selectedExamId, setSelectedExamId] = useState<1 | 2>(1);
  const [currentEnglishTopic, setCurrentEnglishTopic] = useState<EnglishTopic>(EnglishTopic.UNIT_0);

  const handleSelectStudent = (student: Student) => {
    setCurrentUser(student);
    sessionStorage.setItem('kid_app_active_session_user', JSON.stringify(student));
    setCurrentScreen(AppScreen.DASHBOARD);
  };

  const handleTeacherAccess = () => {
    setCurrentScreen(AppScreen.TEACHER_DASHBOARD);
  };

  const handleChangeUser = () => {
    // DEVELOPMENT MODE: Disable user switching
    console.log("User switching disabled during development");
  };

  const handleStartVietnamese = (topic: VietnameseTopic) => {
    setCurrentTopic(topic);
    const deck = createVietnameseDeck(topic);
    setActiveCards(deck);
    setCurrentScreen(AppScreen.STUDY_VIETNAMESE);
  };
  
  const handleStartQuiz = () => {
    setCurrentScreen(AppScreen.QUIZ_GAME);
  };

  const handleStartMath = (topic: MathTopic) => {
    setCurrentMathTopic(topic);
    setCurrentScreen(AppScreen.MATH_QUIZ_GAME);
  };

  const handleStartExam = (examId: 1 | 2) => {
    setSelectedExamId(examId);
    setCurrentScreen(AppScreen.MATH_EXAM);
  };

  const handleStartEnglish = (topic: EnglishTopic) => {
    setCurrentEnglishTopic(topic);
    setCurrentScreen(AppScreen.ENGLISH_GAME);
  };

  const handleFinishSession = async (result: StudySessionState) => {
    setStudyState(result);
    // SAVE PROGRESS TO FIREBASE (Optional in Dev Mode)
    if (currentUser) {
      console.log("Saving word progress for", currentUser.name, result.correct.length);
    }
    setCurrentScreen(AppScreen.RESULTS);
  };

  const handleFinishQuiz = async (score: number) => {
     if (currentUser) {
       console.log("Saving quiz result for", currentUser.name, score);
     }
     handleHome();
  };

  const handleRetry = () => {
    const deck = createVietnameseDeck(currentTopic);
    if (deck.length === 0) {
       handleHome();
       return;
    }
    setActiveCards(deck);
    setCurrentScreen(AppScreen.STUDY_VIETNAMESE);
  };
  
  const handleRetryMissed = () => {
    if (studyState && studyState.incorrect.length > 0) {
       setActiveCards(studyState.incorrect);
       setCurrentScreen(AppScreen.STUDY_VIETNAMESE);
    }
  };

  const handleHome = () => {
    setCurrentScreen(AppScreen.DASHBOARD);
    setStudyState(null);
  };

  return (
    <div className="font-sans text-gray-800 bg-[#E0F7FA] min-h-screen cursor-default">
      <CursorEffect />
      <AnimatePresence mode="wait">
        
        {currentScreen === AppScreen.STUDENT_SELECT && (
          <motion.div
            key="student-select"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="w-full"
          >
            <StudentSelect 
              onSelect={handleSelectStudent} 
              onTeacherAccess={handleTeacherAccess}
            />
          </motion.div>
        )}

        {currentScreen === AppScreen.TEACHER_DASHBOARD && (
          <motion.div
            key="teacher-dashboard"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="w-full"
          >
            <TeacherDashboard onExit={() => setCurrentScreen(AppScreen.STUDENT_SELECT)} />
          </motion.div>
        )}

        {currentScreen === AppScreen.DASHBOARD && currentUser && (
          <motion.div 
            key="dashboard"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="w-full"
          >
            <Dashboard 
              student={currentUser}
              onStartVietnamese={handleStartVietnamese} 
              onStartQuiz={handleStartQuiz}
              onStartMath={handleStartMath}
              onOpenMathTables={() => setCurrentScreen(AppScreen.MATH_TABLES)}
              onOpenMathReflex={() => setCurrentScreen(AppScreen.MATH_REFLEX)}
              onStartExam={handleStartExam}
              onStartEnglish={handleStartEnglish}
              onChangeUser={handleChangeUser}
            />
          </motion.div>
        )}

        {currentScreen === AppScreen.STUDY_VIETNAMESE && (
          <motion.div 
            key="study"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="w-full h-full"
          >
            <StudySession 
              cards={activeCards} 
              onFinish={handleFinishSession} 
              onExit={handleHome}
            />
          </motion.div>
        )}

        {currentScreen === AppScreen.QUIZ_GAME && (
          <motion.div 
            key="quiz"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="w-full"
          >
             <QuizGame onExit={(score) => handleFinishQuiz(score ?? 0)} />
          </motion.div>
        )}

        {currentScreen === AppScreen.MATH_QUIZ_GAME && (
          <motion.div 
            key="math-quiz"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="w-full"
          >
             <MathQuizGame 
                topic={currentMathTopic} 
                onExit={(score) => handleFinishQuiz(score ?? 0)} 
             />
          </motion.div>
        )}

        {currentScreen === AppScreen.MATH_TABLES && (
          <motion.div 
            key="math-tables"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full"
          >
             <MathTables onExit={handleHome} />
          </motion.div>
        )}

        {currentScreen === AppScreen.MATH_REFLEX && (
          <motion.div 
            key="math-reflex"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full"
          >
             <MathReflexGame onExit={handleHome} />
          </motion.div>
        )}

        {currentScreen === AppScreen.MATH_EXAM && (
          <motion.div 
            key="math-exam"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="w-full"
          >
             <MathExam examId={selectedExamId} onExit={handleHome} />
          </motion.div>
        )}

        {currentScreen === AppScreen.ENGLISH_GAME && (
          <motion.div 
            key="english-game"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="w-full"
          >
             <EnglishGame topic={currentEnglishTopic} onExit={(score) => handleFinishQuiz(score ?? 0)} />
          </motion.div>
        )}

        {currentScreen === AppScreen.RESULTS && studyState && (
          <motion.div 
            key="results"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="w-full"
          >
            <Results 
              state={studyState} 
              onRetry={handleRetry} 
              onHome={handleHome}
              onRetryMissed={handleRetryMissed}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
