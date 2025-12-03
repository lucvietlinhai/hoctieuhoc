export interface PhonicsCard {
  id: string;
  sound: string; // The letter or sound, e.g., "a", "b", "ang"
  color: string; // Tailwind color class for card background
}

export interface StudySessionState {
  correct: PhonicsCard[];
  incorrect: PhonicsCard[];
  remaining: PhonicsCard[];
  isFinished: boolean;
}

export enum AppScreen {
  DASHBOARD = 'DASHBOARD',
  STUDY_VIETNAMESE = 'STUDY_VIETNAMESE',
  QUIZ_GAME = 'QUIZ_GAME',
  RESULTS = 'RESULTS'
}

export enum VietnameseTopic {
  PHAN_AM = 'PHAN_AM',
  VAN_KY_1 = 'VAN_KY_1',
  VAN_KY_2 = 'VAN_KY_2',
  SEMESTER_1 = 'SEMESTER_1',
  ALL = 'ALL',
  MISSED_WORDS = 'MISSED_WORDS' // New topic for reviewing specific missed words
}

export interface QuizQuestion {
  id: string;
  word: string;       // The full word, e.g. "ca"
  display: string;    // The word with missing part, e.g. "c_"
  hint: string;       // Context hint, e.g. "Cái ... dùng để uống nước"
  correctAnswer: string; // The missing part, e.g. "a"
  options: string[];  // 4 options including correct answer
}

export interface QuizState {
  questions: QuizQuestion[];
  currentIndex: number;
  score: number;
  isFinished: boolean;
}

export interface UserProgress {
  missedWords: PhonicsCard[]; // List of unique cards the user got wrong
  lastStudyDate: string;
}