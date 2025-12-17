
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
  duration?: number; // Time taken in milliseconds
}

export interface Student {
  id: string;
  name: string;
  avatarColor: string;
  icon: string;
}

export interface StudentProgress {
  studentId: string;
  lastStudyDate: number;
  totalWordsLearned: number;
  quizzesTaken: number;
  highScore: number;
}

export enum AppScreen {
  STUDENT_SELECT = 'STUDENT_SELECT',
  TEACHER_DASHBOARD = 'TEACHER_DASHBOARD',
  DASHBOARD = 'DASHBOARD',
  STUDY_VIETNAMESE = 'STUDY_VIETNAMESE',
  QUIZ_GAME = 'QUIZ_GAME', // Vietnamese Quiz
  MATH_QUIZ_GAME = 'MATH_QUIZ_GAME', // Math Quiz
  MATH_TABLES = 'MATH_TABLES', // Bảng cộng trừ
  MATH_REFLEX = 'MATH_REFLEX', // Phản xạ tốc độ
  MATH_EXAM = 'MATH_EXAM', // New: Thi thử học kỳ
  ENGLISH_GAME = 'ENGLISH_GAME', // New: English STEM
  RESULTS = 'RESULTS'
}

export enum VietnameseTopic {
  PHAN_AM = 'PHAN_AM',
  VAN_KY_1 = 'VAN_KY_1',
  VAN_KY_2 = 'VAN_KY_2',
  SEMESTER_1 = 'SEMESTER_1',
  ALL = 'ALL'
}

export enum MathTopic {
  GEOMETRY = 'GEOMETRY',       // Hinh hoc & Khong gian
  NUMBERS = 'NUMBERS',         // So hoc & So sanh
  CALCULATION = 'CALCULATION', // Phep tinh cong tru
  MIXED = 'MIXED'              // Tong hop
}

export enum EnglishTopic {
  UNIT_0 = 'UNIT_0', // Introduction & Blocks
  UNIT_1 = 'UNIT_1', // Colours
  UNIT_2 = 'UNIT_2', // Shapes
  UNIT_3 = 'UNIT_3', // Christmas
  REVIEW = 'REVIEW'  // General Questions
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

// --- MATH TYPES ---

export enum MathQuestionType {
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE', // Chon dap an dung (4 options)
  COMPARE = 'COMPARE',                 // Dien dau >, <, =
  SORTING = 'SORTING',                 // Sap xep day so
  COUNTING = 'COUNTING',               // Dem so luong hinh
  FILL_IN_BLANK = 'FILL_IN_BLANK',     // Dien so thich hop
}

export interface MathQuestion {
  id: string;
  type: MathQuestionType;
  questionText: string;
  
  // For Visualization
  visualData?: {
    type: 'SHAPES' | 'SPATIAL' | 'OBJECTS' | 'IMAGE_HINT' | 'NESTED_SHAPES';
    items: any[]; // Data required to render the scene
    extraInfo?: string; // e.g., Shape ID for NESTED_SHAPES
  };

  correctAnswer: string | string[]; // Can be a value "5" or a sequence ["1", "3", "5"]
  options: string[]; // Choices for MC or items to sort
}

export interface MathQuizState {
  questions: MathQuestion[];
  currentIndex: number;
  score: number;
  isFinished: boolean;
}

// --- ENGLISH TYPES ---
export interface EnglishQuestion {
  id: string;
  question: string;
  correctAnswer: string;
  options: string[];
  type: 'VOCAB' | 'TRANSLATION' | 'SENTENCE';
  imgHint?: string; // Emoji or simple visual
  audioText: string; // Text to speak
}

export interface EnglishQuizState {
  questions: EnglishQuestion[];
  currentIndex: number;
  score: number;
  isFinished: boolean;
}
