
import { EnglishQuestion, EnglishTopic } from '../types';

// Helpers
const shuffleArray = (array: any[]) => array.sort(() => Math.random() - 0.5);

// DATA SOURCE FROM PDF
const UNIT_0_BLOCKS = [
  { term: "block", mean: "khối hình", icon: "🧱" },
  { term: "smart block", mean: "khối thông minh", icon: "🧠" },
  { term: "Master block", mean: "khối đổi màu", icon: "🎛️" },
  { term: "LED block", mean: "khối hiển thị đèn", icon: "💡" },
  { term: "DC motor block", mean: "khối động cơ", icon: "⚙️" },
  { term: "Sound block", mean: "khối âm thanh", icon: "🔊" },
  { term: "Proximity sensor block", mean: "khối cảm biến vật thể", icon: "📡" },
  { term: "Light & touch sensor block", mean: "khối cảm biến chạm & ánh sáng", icon: "☀️" },
  { term: "one", mean: "số một", icon: "1️⃣" },
  { term: "two", mean: "số hai", icon: "2️⃣" },
  { term: "three", mean: "số ba", icon: "3️⃣" },
  { term: "one block", mean: "một khối", icon: "🧱" },
];

const UNIT_1_COLORS = [
  { term: "red", mean: "màu đỏ", icon: "🔴" },
  { term: "green", mean: "màu xanh lá", icon: "🟢" },
  { term: "yellow", mean: "màu vàng", icon: "🟡" },
  { term: "white", mean: "màu trắng", icon: "⚪" },
  { term: "black", mean: "màu đen", icon: "⚫" },
  { term: "blue", mean: "màu xanh dương", icon: "🔵" },
];

const UNIT_2_SHAPES = [
  { term: "triangle", mean: "hình tam giác", icon: "🔺" },
  { term: "circle", mean: "hình tròn", icon: "🔴" },
  { term: "square", mean: "hình vuông", icon: "⬛" },
  { term: "rectangle", mean: "hình chữ nhật", icon: "▭" },
];

const UNIT_3_CHRISTMAS = [
  { term: "Santa Claus", mean: "ông già Noel", icon: "🎅" },
  { term: "Christmas tree", mean: "cây thông Giáng Sinh", icon: "🎄" },
  { term: "reindeer", mean: "tuần lộc", icon: "🦌" },
];

const GENERAL_QUESTIONS = [
  { q: "What's your name?", a: "My name is...", opts: ["My name is...", "I'm fine", "It's red"] },
  { q: "How are you?", a: "I'm fine / good", opts: ["I'm fine / good", "My name is...", "It's a square"] },
  { q: "What is this?", a: "It's a...", opts: ["It's a...", "I'm five", "Yes, it is"] },
  { q: "What colour is it?", a: "It's green/red...", opts: ["It's green/red...", "It's a circle", "I'm fine"] },
  { q: "How many blocks?", a: "Two blocks", opts: ["Two blocks", "Red blocks", "Square"] },
  { q: "Is it yellow?", a: "Yes, it is", opts: ["Yes, it is", "It's a triangle", "My name is..."] },
];

// GENERATOR FUNCTIONS

const generateVocabQuestions = (dataset: any[], count: number): EnglishQuestion[] => {
  const shuffled = shuffleArray([...dataset]);
  const selected = shuffled.slice(0, count);

  return selected.map((item, idx) => {
    // 50% chance: English -> Vietnamese OR Vietnamese -> English
    const isEngToViet = Math.random() > 0.5;
    
    // Create distractors
    const otherItems = dataset.filter(i => i.term !== item.term);
    const distractors = shuffleArray(otherItems).slice(0, 3).map((i: any) => isEngToViet ? i.mean : i.term);
    
    const correctAnswer = isEngToViet ? item.mean : item.term;
    const options = shuffleArray([...distractors, correctAnswer]);

    return {
      id: `vocab-${Date.now()}-${idx}`,
      type: 'VOCAB',
      question: isEngToViet ? `"${item.term}" nghĩa là gì?` : `"${item.mean}" tiếng Anh là gì?`,
      audioText: isEngToViet ? item.term : '', // Only speak English
      imgHint: item.icon,
      correctAnswer: correctAnswer,
      options: options
    };
  });
};

export const generateEnglishQuiz = (topic: EnglishTopic): EnglishQuestion[] => {
  let questions: EnglishQuestion[] = [];

  switch (topic) {
    case EnglishTopic.UNIT_0:
      questions = generateVocabQuestions(UNIT_0_BLOCKS, 10);
      // Add specific structure question
      questions.push({
        id: 'u0-str-1', type: 'SENTENCE',
        question: "What is this? (Đây là khối gì?)",
        imgHint: "🎛️",
        audioText: "What is this?",
        correctAnswer: "It's a Master block",
        options: shuffleArray(["It's a Master block", "It's red", "I'm fine", "Two blocks"])
      });
      break;

    case EnglishTopic.UNIT_1:
      questions = generateVocabQuestions(UNIT_1_COLORS, 8);
      questions.push({
        id: 'u1-str-1', type: 'SENTENCE',
        question: "What colour is it? (Đây là màu gì?)",
        imgHint: "🔴",
        audioText: "What colour is it?",
        correctAnswer: "Red",
        options: shuffleArray(["Red", "Triangle", "One", "Block"])
      });
      break;

    case EnglishTopic.UNIT_2:
      questions = generateVocabQuestions(UNIT_2_SHAPES, 6);
      questions.push({
        id: 'u2-str-1', type: 'SENTENCE',
        question: "What shape is it? (Đây là hình gì?)",
        imgHint: "🔺",
        audioText: "What shape is it?",
        correctAnswer: "Triangle",
        options: shuffleArray(["Triangle", "Red", "Santa Claus", "Two"])
      });
      break;

    case EnglishTopic.UNIT_3:
      questions = generateVocabQuestions(UNIT_3_CHRISTMAS, 6);
       questions.push({
        id: 'u3-str-1', type: 'SENTENCE',
        question: "Who is this?",
        imgHint: "🎅",
        audioText: "Who is this?",
        correctAnswer: "Santa Claus",
        options: shuffleArray(["Santa Claus", "Reindeer", "Christmas tree", "Block"])
      });
      break;

    case EnglishTopic.REVIEW:
      // Mix of all
      const q1 = generateVocabQuestions(UNIT_0_BLOCKS, 4);
      const q2 = generateVocabQuestions(UNIT_1_COLORS, 4);
      const q3 = generateVocabQuestions(UNIT_2_SHAPES, 4);
      const q4 = generateVocabQuestions(UNIT_3_CHRISTMAS, 3);
      
      // Add general conversational questions
      const conversational: EnglishQuestion[] = GENERAL_QUESTIONS.map((g, i) => ({
        id: `gen-${i}`,
        type: 'SENTENCE',
        question: g.q,
        audioText: g.q,
        correctAnswer: g.a,
        options: shuffleArray(g.opts)
      }));

      questions = [...q1, ...q2, ...q3, ...q4, ...conversational];
      questions = shuffleArray(questions).slice(0, 20); // Limit to 20
      break;
  }

  return questions;
};
