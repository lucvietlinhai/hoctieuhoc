import { PhonicsCard, UserProgress } from '../types';

const STORAGE_KEY = 'be_vui_hoc_progress_v1';

export const storageService = {
  // Load current progress
  getProgress: (): UserProgress => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (error) {
      console.error("Error loading progress", error);
    }
    return { missedWords: [], lastStudyDate: new Date().toISOString() };
  },

  // Save session results
  saveSession: (correct: PhonicsCard[], incorrect: PhonicsCard[]) => {
    const currentProgress = storageService.getProgress();
    let newMissedWords = [...currentProgress.missedWords];

    // 1. Remove words that are now CORRECT (Mastered)
    // We filter out any word in 'newMissedWords' that matches the ID or Sound of words in 'correct' list
    if (correct.length > 0) {
      const correctIds = new Set(correct.map(c => c.sound)); // Use sound as unique key to be safe across topics
      newMissedWords = newMissedWords.filter(w => !correctIds.has(w.sound));
    }

    // 2. Add new INCORRECT words (if not already in list)
    if (incorrect.length > 0) {
      const existingSounds = new Set(newMissedWords.map(w => w.sound));
      incorrect.forEach(card => {
        if (!existingSounds.has(card.sound)) {
          newMissedWords.push(card);
          existingSounds.add(card.sound);
        }
      });
    }

    const newData: UserProgress = {
      missedWords: newMissedWords,
      lastStudyDate: new Date().toISOString()
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    return newData;
  },

  // Get count of missed words
  getMissedCount: (): number => {
    const progress = storageService.getProgress();
    return progress.missedWords.length;
  },
  
  // Clear all data (Reset app)
  resetProgress: () => {
    localStorage.removeItem(STORAGE_KEY);
  }
};