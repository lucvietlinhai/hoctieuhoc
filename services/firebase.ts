import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// --- QUAN TRỌNG: Thay thế thông tin bên dưới bằng cấu hình từ Firebase Console của bạn ---
// Vào Project Settings -> General -> Your apps -> Config
const firebaseConfig = {
  apiKey: "API_KEY_CUA_BAN",
  authDomain: "PROJECT_ID.firebaseapp.com",
  projectId: "PROJECT_ID",
  storageBucket: "PROJECT_ID.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

// Khởi tạo Firestore (Cơ sở dữ liệu)
export const db = getFirestore(app);