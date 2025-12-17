import { db } from './firebase';
import { 
  collection, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  doc, 
  updateDoc, 
  increment, 
  getDoc, 
  setDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { Student, StudentProgress } from '../types';

const STUDENTS_COLLECTION = 'students';

// Helpers
const AVATAR_COLORS = [
  'bg-kid-blue', 'bg-kid-pink', 'bg-kid-yellow', 'bg-kid-green', 'bg-kid-purple', 'bg-orange-400'
];
const AVATAR_ICONS = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐯', '🦁', '🐮', '🐷'];

// --- Student Management ---

export const getStudents = async (): Promise<Student[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, STUDENTS_COLLECTION));
    const students: Student[] = [];
    querySnapshot.forEach((doc) => {
      students.push({ id: doc.id, ...doc.data() } as Student);
    });
    return students;
  } catch (e) {
    console.error("Error fetching students from Firebase:", e);
    // Return empty array instead of defaults to avoid confusion when DB is actually empty
    return [];
  }
};

export const addStudent = async (name: string): Promise<Student> => {
  try {
    const newStudentData = {
      name: name,
      avatarColor: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
      icon: AVATAR_ICONS[Math.floor(Math.random() * AVATAR_ICONS.length)],
      createdAt: serverTimestamp(),
      // Initialize progress fields directly on the document for simpler querying
      totalWordsLearned: 0,
      quizzesTaken: 0,
      highScore: 0,
      lastStudyDate: 0
    };

    const docRef = await addDoc(collection(db, STUDENTS_COLLECTION), newStudentData);
    
    return {
      id: docRef.id,
      ...newStudentData,
      // Fallback for timestamp typing locally
      createdAt: Date.now() 
    } as unknown as Student;

  } catch (e) {
    console.error("Error adding student:", e);
    throw e;
  }
};

export const deleteStudent = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, STUDENTS_COLLECTION, id));
  } catch (e) {
    console.error("Error deleting student:", e);
    throw e;
  }
};

// --- Progress Management ---

// Fetch all students with their progress (Since we merged progress into the student doc)
// This effectively replaces getProgress() as we get everything in getStudents now.
// But for compatibility with the UI, we can provide a helper.

export const saveWordProgress = async (studentId: string, wordsLearnedCount: number) => {
  try {
    const studentRef = doc(db, STUDENTS_COLLECTION, studentId);
    await updateDoc(studentRef, {
      totalWordsLearned: increment(wordsLearnedCount),
      lastStudyDate: Date.now()
    });
  } catch (e) {
    console.error("Error saving word progress:", e);
  }
};

export const saveQuizResult = async (studentId: string, score: number) => {
  try {
    const studentRef = doc(db, STUDENTS_COLLECTION, studentId);
    
    // We need to check if it's a high score first
    const studentSnap = await getDoc(studentRef);
    if (studentSnap.exists()) {
      const data = studentSnap.data();
      const currentHighScore = data.highScore || 0;
      
      const updates: any = {
        quizzesTaken: increment(1),
        lastStudyDate: Date.now()
      };

      if (score > currentHighScore) {
        updates.highScore = score;
      }

      await updateDoc(studentRef, updates);
    }
  } catch (e) {
    console.error("Error saving quiz result:", e);
  }
};