import { PhonicsCard, VietnameseTopic, QuizQuestion, Student } from './types';

const CARD_COLORS = [
  'bg-red-400', 'bg-orange-400', 'bg-amber-400', 'bg-yellow-400', 
  'bg-lime-400', 'bg-green-400', 'bg-emerald-400', 'bg-teal-400', 
  'bg-cyan-400', 'bg-sky-400', 'bg-blue-400', 'bg-indigo-400', 
  'bg-violet-400', 'bg-purple-400', 'bg-fuchsia-400', 'bg-pink-400', 'bg-rose-400',
];

export const getRandomColor = () => CARD_COLORS[Math.floor(Math.random() * CARD_COLORS.length)];

// --- Student Data (Sample) ---
const AVATAR_COLORS = [
  'bg-kid-blue', 'bg-kid-pink', 'bg-kid-yellow', 'bg-kid-green', 'bg-kid-purple', 'bg-orange-400'
];

const AVATAR_ICONS = ['🐶', '🐱', '🐭', '🐹', '🐰', 'fox', 'bear', 'panda', '🐯', '🦁', '🐮', '🐷'];

// Bạn có thể thay thế danh sách này bằng danh sách lớp thực tế
const SAMPLE_STUDENT_NAMES = [
  "Minh An", "Bảo Ngọc", "Gia Huy", "Tuấn Kiệt", 
  "Khánh Vy", "Thảo Nhi", "Đức Minh", "Hoàng Bách",
  "Yến Nhi", "Quang Hải", "Bảo Châu", "Hải Đăng"
];

export const CLASS_LIST: Student[] = SAMPLE_STUDENT_NAMES.map((name, index) => ({
  id: `std-${index}`,
  name: name,
  avatarColor: AVATAR_COLORS[index % AVATAR_COLORS.length],
  icon: AVATAR_ICONS[index % AVATAR_ICONS.length] || '🎓'
}));


// --- Data Sections provided by user ---

const PHAN_AM_RAW = [
  "a", "ă", "â", "b", "c", "o", "ô", "ơ", "v", "e", "ê", "d", "đ", "i",
  "k", "l", "h", "ch", "kh", "n", "m", "u", "ư", "g", "gh", "ng", "ngh", "t",
  "th", "nh", "r", "tr", "ia", "ua", "ưa", "p", "ph", "s", "x", "q-qu", "y", "gi"
];

const VAN_KY_1_RAW = [
  "ia", "ua", "ưa", "ao", "eo", "au", "êu", "âu", "iu", "ưu", "ai", "oi", "ôi", "ơi",
  "ui", "ưi", "ay", "ây", "ac", "âc", "ăc", "oc", "ôc", "uc", "ưc", "at", "ăt", "ât",
  "et", "êt", "it", "ot", "ôt", "ơt", "ut", "ưt", "an", "ăn", "ân", "en", "ên", "in",
  "on", "ôn", "ơn", "un", "ang", "ăng", "âng", "ong", "ông", "ung", "ưng", "ach", "êch", "ich",
  "am", "ăm", "âm", "em", "êm", "om", "ôm", "ơm", "im", "um", "ap", "ăp", "âp", "ep",
  "êp", "op", "ôp", "ơp", "ip", "up", "anh", "ênh", "inh",
  "ươu", "iêu", "yêu", "uôi", "ươi", "iêc", "uôc", "ước", "iêt", "yêt", "uôt", "ướt", "iên", "yên",
  "uôn", "ươn", "iêng", "yêng", "uông", "ương", "iêm", "yêm", "uôm", "ươm", "iêp", "ươp"
];

const VAN_KY_2_RAW = [
  "oa", "oe", "uê", "uy", "oai", "oay", "oac", "oat", "oan", "oang", "uân", "uyên", "uyt", "oăt",
  "uât", "uyêt", "oanh", "uynh", "uych", "oăng", "oam", "oap", "oăn", "oen", "oong", "ooc", "uyn", "uya"
];

// Helper to clean and unique the list
const processList = (list: string[]) => Array.from(new Set(list.filter(item => item && item.trim() !== "")));

const DATA_MAP = {
  [VietnameseTopic.PHAN_AM]: processList(PHAN_AM_RAW),
  [VietnameseTopic.VAN_KY_1]: processList(VAN_KY_1_RAW),
  [VietnameseTopic.VAN_KY_2]: processList(VAN_KY_2_RAW),
  [VietnameseTopic.SEMESTER_1]: processList([...PHAN_AM_RAW, ...VAN_KY_1_RAW]),
  [VietnameseTopic.ALL]: processList([...PHAN_AM_RAW, ...VAN_KY_1_RAW, ...VAN_KY_2_RAW])
};

export const createVietnameseDeck = (topic: VietnameseTopic = VietnameseTopic.ALL): PhonicsCard[] => {
  const data = DATA_MAP[topic];
  return data.map((sound, index) => ({
    id: `${topic}-${index}-${sound}`,
    sound: sound.trim(),
    color: getRandomColor(),
  }));
};

// --- QUIZ DATA GENERATION ---

// Curated vocabulary list with EXPLICIT distractors to avoid ambiguous answers.
// UPDATED: Now includes tone marks in the targets/options where appropriate for better meaning.
const QUIZ_VOCAB_CURATED = [
  // --- Dạng 1: Điền âm đầu (Dấu thanh nằm ở vần) ---
  { target: "b", word: "bà", mask: "_à", hint: "Mẹ của mẹ gọi là ... ngoại", distractors: ["l", "n", "m"] },
  { target: "c", word: "cá", mask: "_á", hint: "Con ... bơi dưới nước", distractors: ["ph", "nh", "th"] },
  { target: "d", word: "da", mask: "_a", hint: "Làn ... em bé mịn màng", distractors: ["x", "s", "r"] },
  { target: "đ", word: "đá", mask: "_á", hint: "Cục ... lạnh buốt", distractors: ["h", "k", "v"] },
  { target: "ch", word: "chó", mask: "_ó", hint: "Con ... sủa gâu gâu", distractors: ["nh", "kh", "th"] },
  { target: "nh", word: "nhà", mask: "_à", hint: "Ngôi ... của em", distractors: ["ch", "tr", "s"] },
  { target: "th", word: "thỏ", mask: "_ỏ", hint: "Con ... có đôi tai dài", distractors: ["ch", "nh", "ph"] },
  { target: "tr", word: "tre", mask: "_e", hint: "Cây ... xanh Việt Nam", distractors: ["ch", "nh", "ng"] },
  { target: "ph", word: "phố", mask: "_ố", hint: "Thành ... xe cộ đông đúc", distractors: ["th", "kh", "nh"] },
  { target: "ng", word: "ngà", mask: "_à", hint: "Con voi có đôi ... trắng", distractors: ["ch", "nh", "tr"] },
  { target: "kh", word: "khế", mask: "_ế", hint: "Quả ... chua nấu canh", distractors: ["tr", "ph", "qu"] },

  // --- Dạng 2: Điền vần có kèm dấu thanh (Để tạo từ có nghĩa) ---
  { target: "a", word: "ca", mask: "c_", hint: "Cái ... dùng để uống nước", distractors: ["á", "à", "ạ"] },
  { target: "e", word: "xe", mask: "x_", hint: "Bé tập đi ... đạp", distractors: ["é", "è", "ẻ"] },
  { target: "ê", word: "lê", mask: "l_", hint: "Quả ... ăn rất ngọt", distractors: ["ề", "ế", "ể"] },
  { target: "i", word: "bi", mask: "b_", hint: "Bé chơi bắn ...", distractors: ["í", "ì", "ị"] },
  { target: "ía", word: "mía", mask: "m_", hint: "Cây ... làm ra đường", distractors: ["ia", "úa", "óa"] },
  { target: "ua", word: "cua", mask: "c_", hint: "Con ... bò ngang", distractors: ["úa", "ùa", "uạ"] },
  { target: "ừa", word: "dừa", mask: "d_", hint: "Quả ... uống nước rất mát", distractors: ["ưa", "ứa", "ựa"] },
  { target: "oi", word: "voi", mask: "v_", hint: "Con ... có cái vòi dài", distractors: ["ói", "òi", "ọi"] },
  { target: "ái", word: "gà mái", mask: "gà m_", hint: "Con ... đẻ trứng cục tác", distractors: ["ai", "ài", "ại"] },
  { target: "ôi", word: "đôi", mask: "đ_", hint: "... bạn cùng tiến", distractors: ["ối", "ồi", "ội"] },
  { target: "ơi", word: "bơi", mask: "b_", hint: "Bé đi ... ở hồ nước", distractors: ["ới", "ời", "ợi"] },
  { target: "áy", word: "máy", mask: "m_", hint: "Cái ... bay trên trời", distractors: ["ay", "ày", "ạy"] },
  { target: "ây", word: "cây", mask: "c_", hint: "... xanh tỏa bóng mát", distractors: ["ấy", "ầy", "ậy"] },
  { target: "èo", word: "mèo", mask: "m_", hint: "Con ... kêu meo meo", distractors: ["eo", "éo", "ẹo"] },
  { target: "ao", word: "sao", mask: "s_", hint: "Ngôi ... sáng trên trời", distractors: ["áo", "ào", "ạo"] },
  { target: "au", word: "rau", mask: "r_", hint: "Bé ăn nhiều ... xanh", distractors: ["áu", "àu", "ạu"] },
  { target: "ấu", word: "gấu", mask: "g_", hint: "Con ... trúc ăn tre", distractors: ["âu", "ầu", "ậu"] },
  { target: "ìu", word: "rìu", mask: "r_", hint: "Cái ... của bác tiều phu", distractors: ["iu", "íu", "ịu"] },
  { target: "ừu", word: "cừu", mask: "c_", hint: "Con ... có bộ lông dày", distractors: ["ưu", "ứu", "ựu"] },
  { target: "àn", word: "bàn", mask: "b_", hint: "Cái ... học của bé", distractors: ["an", "án", "ạn"] },
  { target: "ăn", word: "khăn", mask: "kh_", hint: "Cái ... quàng đỏ", distractors: ["ắn", "ằn", "ặn"] },
  { target: "ân", word: "cân", mask: "c_", hint: "Cái ... dùng để biết nặng nhẹ", distractors: ["ấn", "ần", "ận"] },
  { target: "on", word: "con", mask: "c_", hint: "... mèo trèo cây cau", distractors: ["ón", "òn", "ọn"] },
  { target: "ốn", word: "bốn", mask: "b_", hint: "Một, hai, ba, ...", distractors: ["ôn", "ồn", "ộn"] },
  { target: "ơn", word: "sơn", mask: "s_", hint: "Chú thợ ... tường", distractors: ["ớn", "ờn", "ợn"] },
  { target: "en", word: "xe ben", mask: "xe b_", hint: "Chiếc ... chở cát", distractors: ["én", "èn", "ẹn"] },
  { target: "ến", word: "nến", mask: "n_", hint: "Thắp ... sinh nhật", distractors: ["ên", "ền", "ện"] },
  { target: "in", word: "đèn pin", mask: "đèn p_", hint: "Bật ... soi sáng", distractors: ["ín", "ìn", "ịn"] },
  { target: "ún", word: "bún", mask: "b_", hint: "Món ... chả rất ngon", distractors: ["un", "ùn", "ụn"] },
  { target: "ôm", word: "tôm", mask: "t_", hint: "Con ... bơi giật lùi", distractors: ["om", "ốm", "ồm"] },
  { target: "am", word: "cam", mask: "c_", hint: "Quả ... nhiều vitamin C", distractors: ["ám", "àm", "ạm"] },
  { target: "ăm", word: "tăm", mask: "t_", hint: "Bé lấy ... cho bà", distractors: ["ắm", "ằm", "ặm"] },
  { target: "ấm", word: "nấm", mask: "n_", hint: "Cây ... mọc sau mưa", distractors: ["âm", "ầm", "ậm"] },
  { target: "ót", word: "hót", mask: "h_", hint: "Con chim ... líu lo", distractors: ["ot", "ọt", "út"] },
  { target: "át", word: "hát", mask: "h_", hint: "Bé ... bài ca đi học", distractors: ["at", "ạt", "ít"] },
  { target: "ắt", word: "cắt", mask: "c_", hint: "Dùng kéo để ... giấy", distractors: ["ăt", "ặt", "ât"] },
  { target: "ất", word: "đất", mask: "đ_", hint: "Trái ... hình tròn", distractors: ["ât", "ật", "ăt"] },
];

export const generateQuiz = (questionCount: number = 10): QuizQuestion[] => {
  // Shuffle vocabulary
  const shuffledVocab = [...QUIZ_VOCAB_CURATED].sort(() => Math.random() - 0.5);
  const selected = shuffledVocab.slice(0, questionCount);

  return selected.map((item, index) => {
    // Combine correct answer with pre-defined safe distractors
    const options = [...item.distractors, item.target].sort(() => Math.random() - 0.5);

    return {
      id: `q-${index}`,
      word: item.word,
      display: item.mask,
      hint: item.hint,
      correctAnswer: item.target,
      options: options
    };
  });
};