import React, { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { StudySession } from './components/StudySession';
import { Results } from './components/Results';
import { QuizGame } from './components/QuizGame';
import { CursorEffect } from './components/CursorEffect';
import { AppScreen, StudySessionState, PhonicsCard, VietnameseTopic } from './types';
import { createVietnameseDeck } from './constants';
import { storageService } from './services/storageService'; // Import storage
import { motion, AnimatePresence } from 'framer-motion';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>(AppScreen.DASHBOARD);
  const [studyState, setStudyState] = useState<StudySessionState | null>(null);
  const [activeCards, setActiveCards] = useState<PhonicsCard[]>([]);
  const [currentTopic, setCurrentTopic] = useState<VietnameseTopic>(VietnameseTopic.ALL);
  
  // State to track missed words count for Dashboard badge
  const [missedCount, setMissedCount] = useState(0);

  useEffect(() => {
    // Load initial count
    setMissedCount(storageService.getMissedCount());
  }, [currentScreen]); // Refresh whenever screen changes

  const handleStartVietnamese = (topic: VietnameseTopic) => {
    setCurrentTopic(topic);
    
    let deck: PhonicsCard[] = [];
    
    if (topic === VietnameseTopic.MISSED_WORDS) {
      // Load from storage
      const progress = storageService.getProgress();
      deck = progress.missedWords;
      // If empty (shouldn't happen due to UI check, but safe guard)
      if (deck.length === 0) {
        alert("Bé đã thuộc hết các từ rồi! Hãy chọn bài học mới nhé.");
        return;
      }
    } else {
      deck = createVietnameseDeck(topic);
    }

    setActiveCards(deck);
    setCurrentScreen(AppScreen.STUDY_VIETNAMESE);
  };
  
  const handleStartQuiz = () => {
    setCurrentScreen(AppScreen.QUIZ_GAME);
  };

  const handleFinishSession = (result: StudySessionState) => {
    // SAVE PROGRESS TO DB (LocalStorage)
    storageService.saveSession(result.correct, result.incorrect);
    
    setStudyState(result);
    setCurrentScreen(AppScreen.RESULTS);
  };

  const handleRetry = () => {
    let deck: PhonicsCard[] = [];
    if (currentTopic === VietnameseTopic.MISSED_WORDS) {
       // Reload current missed words from storage (in case some were mastered in previous run)
       deck = storageService.getProgress().missedWords;
    } else {
       deck = createVietnameseDeck(currentTopic);
    }
    
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
        {currentScreen === AppScreen.DASHBOARD && (
          <motion.div 
            key="dashboard"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="w-full"
          >
            <Dashboard 
              onStartVietnamese={handleStartVietnamese} 
              onStartQuiz={handleStartQuiz}
              missedWordsCount={missedCount} // Pass count to dashboard
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
             <QuizGame onExit={handleHome} />
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