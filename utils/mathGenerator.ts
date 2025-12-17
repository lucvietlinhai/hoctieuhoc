

import { MathQuestion, MathQuestionType, MathTopic } from '../types';

// CONSTANTS
const MAX_VAL = 10; // Giới hạn số tối đa theo yêu cầu

// Helpers
const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const shuffleArray = (array: any[]) => array.sort(() => Math.random() - 0.5);

// Helper để tạo các đáp án sai (distractors) dựa trên đáp án đúng
const generateOptions = (correctVal: number | string, type: 'number' | 'sign' = 'number'): string[] => {
  if (type === 'sign') {
    return shuffleArray(['+', '-', '>', '=']);
  }

  const correctNum = parseInt(correctVal.toString());
  const options = new Set<number>();
  options.add(correctNum);

  // Cố gắng tạo các số lân cận đáp án đúng để làm nhiễu
  let attempts = 0;
  while (options.size < 4 && attempts < 20) {
    // Tạo số ngẫu nhiên trong khoảng 0-10
    const offset = getRandomInt(-3, 3); 
    const val = correctNum + offset;
    
    if (val >= 0 && val <= MAX_VAL && val !== correctNum) {
      options.add(val);
    }
    attempts++;
  }

  // Nếu vẫn chưa đủ 4 đáp án (do trùng lặp hoặc hết số lân cận), fill thêm số ngẫu nhiên 0-10
  while (options.size < 4) {
    options.add(getRandomInt(0, MAX_VAL));
  }

  return shuffleArray(Array.from(options).map(String));
};

// --- EXAM DATA GENERATION (Based on PDF) ---

export const getExamData = (examId: 1 | 2): MathQuestion[] => {
  if (examId === 1) {
    return [
      {
        id: 'ex1-q5',
        type: MathQuestionType.COUNTING,
        questionText: 'Bài 7: Hình vẽ bên có bao nhiêu hình tam giác?',
        // Bài 7 PDF: Hình vuông/CN có 2 đường chéo (4 nhỏ, 4 trung bình?? Không, 2 đường chéo chỉ tạo 4 tam giác nhỏ, 4 tam giác lớn ghép đôi).
        // Tuy nhiên theo ngữ cảnh lớp 1 thường đếm tam giác đơn + tam giác ghép đôi.
        // RECT_ENVELOPE (4 tam giác nhỏ)
        visualData: { 
            type: 'NESTED_SHAPES', 
            items: [], 
            extraInfo: 'RECT_ENVELOPE' 
        }, 
        correctAnswer: '4', 
        options: ['4', '5', '6', '8']
      },
      {
        id: 'ex1-q11',
        type: MathQuestionType.COUNTING,
        questionText: 'Bài 8: Hình bên có mấy hình tam giác?',
        // Hình vuông 1 đường chéo -> 2 tam giác
        visualData: { 
            type: 'NESTED_SHAPES', 
            items: [], 
            extraInfo: 'SQUARE_DIAGONAL' 
        },
        correctAnswer: '2',
        options: ['1', '2', '3', '4']
      },
       {
        id: 'ex1-q12',
        type: MathQuestionType.COUNTING,
        questionText: 'Bài 9: Hình vẽ bên có tất cả bao nhiêu hình vuông?',
        // TRIPLE_SQUARES: 3 hình vuông nhỏ, 0 hình vuông lớn (vì ghép 2, 3 cái thành HCN)
        visualData: { 
            type: 'NESTED_SHAPES', 
            items: [], 
            extraInfo: 'TRIPLE_SQUARES' 
        },
        correctAnswer: '3',
        options: ['3', '4', '5', '6']
      },
      {
        id: 'ex1-q1',
        type: MathQuestionType.MULTIPLE_CHOICE,
        questionText: 'Số bé nhất trong các số 6, 3, 0, 7, 10, 1 là số nào?',
        visualData: { type: 'OBJECTS', items: [{val: '6'}, {val: '3'}, {val: '0'}, {val: '7'}, {val: '10'}, {val: '1'}] },
        correctAnswer: '0',
        options: ['1', '7', '6', '0']
      },
      {
        id: 'ex1-q2',
        type: MathQuestionType.MULTIPLE_CHOICE,
        questionText: 'Kết quả của phép tính 1 + 9 = ... là:',
        visualData: { type: 'OBJECTS', items: [] },
        correctAnswer: '10',
        options: ['10', '9', '4', '8']
      },
      {
        id: 'ex1-q6',
        type: MathQuestionType.FILL_IN_BLANK,
        questionText: 'Điền số thích hợp: 10 - 0 = ...',
        visualData: { type: 'OBJECTS', items: [] },
        correctAnswer: '10',
        options: ['0', '10', '1', '9']
      },
      {
        id: 'ex1-q7',
        type: MathQuestionType.COMPARE,
        questionText: 'Điền dấu >, <, = : 4 + 5 ... 10 - 9',
        visualData: { type: 'OBJECTS', items: [{val:'4+5'}, {val:'?'}, {val:'10-9'}] },
        correctAnswer: '>',
        options: ['>', '<', '=']
      },
      {
        id: 'ex1-q8',
        type: MathQuestionType.MULTIPLE_CHOICE,
        questionText: 'Viết phép tính thích hợp cho hình con thỏ:',
        visualData: { type: 'OBJECTS', items: [{val:'🐰'},{val:'🐰'},{val:'🐰'},{val:'🐰'},{val:'|'},{val:'🐰'},{val:'🐰'}] }, // 4 left, 2 right example
        correctAnswer: '4 + 2 = 6',
        options: ['4 + 2 = 6', '4 - 2 = 2', '6 - 2 = 4', '2 + 4 = 8']
      },
      {
        id: 'ex1-q9',
        type: MathQuestionType.FILL_IN_BLANK,
        questionText: 'Điền số: ... - 4 + 2 = 2',
        visualData: { type: 'OBJECTS', items: [{val:'?'}, {val:'-'}, {val:'4'}, {val:'+'}, {val:'2'}, {val:'='}, {val:'2'}] },
        correctAnswer: '4', // 4 - 4 + 2 = 2
        options: ['4', '6', '8', '2']
      },
      {
        id: 'ex1-q10',
        type: MathQuestionType.SORTING,
        questionText: 'Sắp xếp các số sau từ BÉ đến LỚN:',
        visualData: { type: 'OBJECTS', items: [] },
        correctAnswer: '0,1,3,6,7,10',
        options: ['6', '3', '0', '7', '10', '1']
      }
    ];
  } else {
    // EXAM 2
    return [
      {
        id: 'ex2-q1',
        type: MathQuestionType.COUNTING,
        questionText: 'Bài 10: Trong hình dưới đây có mấy hình vuông?',
        // Hình vuông lớn trái + 2 hình chữ nhật phải? Không, đề bài vẽ 2 hình vuông nhỏ.
        // Tổng: 1 Lớn (Trái) + 0 Nhỏ (Phải là HCN) -> 1.
        // NHƯNG nếu nhìn hình Bài 10: 1 Hình vuông to, bên cạnh là 2 hình vuông nhỏ chồng lên nhau.
        // Vậy có 3 hình vuông.
        visualData: { 
            type: 'NESTED_SHAPES', 
            items: [], 
            extraInfo: 'RECT_SPLIT_4' 
        }, 
        correctAnswer: '3', // 1 lớn trái, 2 nhỏ phải (giả sử hình vẽ là vuông)
        options: ['3', '4', '5', '2']
      },
      {
        id: 'ex2-q11',
        type: MathQuestionType.COUNTING,
        questionText: 'Bài 11: Hình bên có mấy hình tam giác?',
        visualData: { 
            type: 'NESTED_SHAPES', 
            items: [], 
            extraInfo: 'HOUSE_SIMPLE' 
        }, 
        correctAnswer: '1', // Chỉ có mái là tam giác
        options: ['1', '2', '3', '4']
      },
      {
        id: 'ex2-q2',
        type: MathQuestionType.MULTIPLE_CHOICE,
        questionText: 'Kết quả của phép tính 6 + 4 - 3 + 3 = ...',
        visualData: { type: 'OBJECTS', items: [] },
        correctAnswer: '10',
        options: ['10', '2', '3', '0']
      },
      {
        id: 'ex2-q3',
        type: MathQuestionType.MULTIPLE_CHOICE,
        questionText: 'Các số lớn hơn 6 và bé hơn 9 là:',
        visualData: { type: 'OBJECTS', items: [] },
        correctAnswer: '7; 8',
        options: ['5; 7', '7; 8', '8; 9', '6; 9']
      },
      {
        id: 'ex2-q4',
        type: MathQuestionType.FILL_IN_BLANK,
        questionText: 'Tính: 10 - 9 - 1 = ...',
        visualData: { type: 'OBJECTS', items: [] },
        correctAnswer: '0',
        options: ['0', '1', '2', '10']
      },
      {
        id: 'ex2-q5',
        type: MathQuestionType.COMPARE,
        questionText: 'Điền dấu >, <, = : 3 + 5 ... 10 - 2',
        visualData: { type: 'OBJECTS', items: [{val:'8'}, {val:'?'}, {val:'8'}] },
        correctAnswer: '=',
        options: ['>', '<', '=']
      },
      {
        id: 'ex2-q6',
        type: MathQuestionType.SORTING,
        questionText: 'Sắp xếp các số sau từ BÉ đến LỚN:',
        visualData: { type: 'OBJECTS', items: [] },
        correctAnswer: '0,1,5,9,10',
        options: ['5', '1', '9', '0', '10']
      },
      {
        id: 'ex2-q7',
        type: MathQuestionType.SORTING,
        questionText: 'Sắp xếp các số sau từ LỚN đến BÉ:',
        visualData: { type: 'OBJECTS', items: [] },
        correctAnswer: '10,9,5,1,0',
        options: ['5', '1', '9', '0', '10']
      },
      {
        id: 'ex2-q8',
        type: MathQuestionType.FILL_IN_BLANK,
        questionText: 'Điền số: 3 + ... + 1 = 4',
        visualData: { type: 'OBJECTS', items: [{val:'3'}, {val:'+'}, {val:'?'}, {val:'+'}, {val:'1'}, {val:'='}, {val:'4'}] },
        correctAnswer: '0',
        options: ['0', '1', '4', '2']
      },
       {
        id: 'ex2-q9',
        type: MathQuestionType.COMPARE,
        questionText: 'Điền dấu: 8 - 6 ... 8 + 2 - 4',
        visualData: { type: 'OBJECTS', items: [{val:'2'}, {val:'?'}, {val:'6'}] },
        correctAnswer: '<',
        options: ['>', '<', '=']
      }
    ];
  }
};

// --- GENERATORS BY TYPE ---

// 1. SHAPES & GEOMETRY
const generateShapeQuestion = (): MathQuestion => {
  const shapes = [
    { name: 'Hình tròn', type: 'circle' },
    { name: 'Hình vuông', type: 'square' },
    { name: 'Hình tam giác', type: 'triangle' },
    { name: 'Hình chữ nhật', type: 'rectangle' }
  ];
  
  const target = shapes[getRandomInt(0, shapes.length - 1)];
  const mode = Math.random() > 0.5 ? 'IDENTIFY' : 'COUNT';

  if (mode === 'IDENTIFY') {
    return {
      id: `geo-${Date.now()}`,
      type: MathQuestionType.MULTIPLE_CHOICE,
      questionText: `Bé hãy tìm: ${target.name}?`,
      visualData: { type: 'SHAPES', items: [] },
      correctAnswer: target.type,
      options: shuffleArray(shapes.map(s => s.type))
    };
  } else {
    // Đếm số lượng hình: Giới hạn số lượng nhỏ (1-5) để bé dễ đếm
    const count = getRandomInt(1, 5);
    const items = Array(count).fill({ type: target.type });
    
    // Thêm hình nhiễu
    const distractorCount = getRandomInt(1, 3);
    const otherShape = shapes.find(s => s.type !== target.type) || shapes[0];
    for(let i=0; i<distractorCount; i++) items.push({ type: otherShape.type });

    return {
      id: `geo-count-${Date.now()}`,
      type: MathQuestionType.COUNTING,
      questionText: `Có bao nhiêu ${target.name} trong hình?`,
      visualData: { 
        type: 'SHAPES', 
        items: shuffleArray(items)
      },
      correctAnswer: count.toString(),
      options: generateOptions(count)
    };
  }
};

// Yêu cầu: Vị trí (Trước – Sau, ở giữa; Trên- dưới; phải – trái)
const generateSpatialQuestion = (): MathQuestion => {
  const animals = ['🐶', '🐱', '🐭'];
  const setup = shuffleArray([...animals]); 
  
  const qType = getRandomInt(0, 2);
  
  if (qType === 0) {
    return {
      id: `spatial-${Date.now()}`,
      type: MathQuestionType.MULTIPLE_CHOICE,
      questionText: `Bạn nào đang đứng ở giữa?`,
      visualData: { type: 'SPATIAL', items: setup },
      correctAnswer: setup[1],
      options: shuffleArray([...setup, '🦁'])
    };
  } else if (qType === 1) {
    const isLeft = Math.random() > 0.5;
    const refIdx = 1; 
    const targetIdx = isLeft ? 0 : 2;
    const direction = isLeft ? 'bên trái' : 'bên phải';
    
    return {
      id: `spatial-${Date.now()}`,
      type: MathQuestionType.MULTIPLE_CHOICE,
      questionText: `Bạn nào đứng ${direction} bạn ${setup[refIdx]}?`,
      visualData: { type: 'SPATIAL', items: setup },
      correctAnswer: setup[targetIdx],
      options: shuffleArray([...setup, '🦁'])
    };
  } else {
     const isFirst = Math.random() > 0.5;
     const targetIdx = isFirst ? 0 : 2;
     const text = isFirst ? 'đứng đầu hàng' : 'đứng cuối hàng';
     return {
      id: `spatial-${Date.now()}`,
      type: MathQuestionType.MULTIPLE_CHOICE,
      questionText: `Bạn nào đang ${text}?`,
      visualData: { type: 'SPATIAL', items: setup },
      correctAnswer: setup[targetIdx],
      options: shuffleArray([...setup, '🦁'])
    };
  }
};

// 2. ARITHMETIC (Calculation)
// Yêu cầu: Cộng trừ phạm vi 10
const generateCalcQuestion = (): MathQuestion => {
  const isAddition = Math.random() > 0.5;
  
  let a, b, result, operator;

  if (isAddition) {
    // a + b = result (result <= 10)
    result = getRandomInt(0, MAX_VAL);
    a = getRandomInt(0, result);
    b = result - a;
    operator = '+';
  } else {
    // a - b = result (a <= 10)
    a = getRandomInt(0, MAX_VAL);
    b = getRandomInt(0, a);
    result = a - b;
    operator = '-';
  }

  // Random kiểu câu hỏi: Tính kết quả, Điền số thiếu, Điền dấu
  const mode = Math.random();
  
  if (mode < 0.4) {
    // Dạng 1: Tính kết quả (2 + 3 = ?)
    // Đáp án đúng là result
    return {
      id: `calc-${Date.now()}`,
      type: MathQuestionType.MULTIPLE_CHOICE,
      questionText: `Kết quả phép tính là bao nhiêu?`,
      visualData: { type: 'OBJECTS', items: [{val: a}, {val: operator}, {val: b}, {val: '='}, {val: '?'}] },
      correctAnswer: result.toString(),
      options: generateOptions(result) // Generate options based on RESULT
    };
  } else if (mode < 0.7) {
    // Dạng 2: Điền số thích hợp (2 + ? = 5 hoặc ? - 1 = 3)
    const missingB = Math.random() > 0.5;
    
    let items;
    let correctVal;

    if (missingB) {
      // a + ? = result
      items = [{val: a}, {val: operator}, {val: '?'}, {val: '='}, {val: result}];
      correctVal = b;
    } else {
      // ? + b = result
      items = [{val: '?'}, {val: operator}, {val: b}, {val: '='}, {val: result}];
      correctVal = a;
    }
    
    return {
      id: `fill-${Date.now()}`,
      type: MathQuestionType.FILL_IN_BLANK,
      questionText: `Điền số thích hợp vào ô trống:`,
      visualData: { type: 'OBJECTS', items: items },
      correctAnswer: correctVal.toString(),
      options: generateOptions(correctVal) // CRITICAL FIX: Generate options based on MISSING VALUE
    };
  } else {
    // Dạng 3: Điền dấu (5 ... 2 = 3)
    return {
      id: `sign-${Date.now()}`,
      type: MathQuestionType.MULTIPLE_CHOICE,
      questionText: `Dấu nào thích hợp?`,
      visualData: { type: 'OBJECTS', items: [{val: a}, {val: '?'}, {val: b}, {val: '='}, {val: result}] },
      correctAnswer: operator,
      options: shuffleArray(['+', '-', '>', '='])
    };
  }
};

// 3. COMPARISON & ORDERING & LOGIC
// Yêu cầu: Sắp xếp 5 số, So sánh phạm vi 10
const generateNumberSenseQuestion = (): MathQuestion => {
  const type = Math.random();

  if (type < 0.3) {
    // So sánh >, <, = (0-10)
    const a = getRandomInt(0, MAX_VAL);
    const b = getRandomInt(0, MAX_VAL);
    let answer = '=';
    if (a > b) answer = '>';
    if (a < b) answer = '<';

    return {
      id: `comp-${Date.now()}`,
      type: MathQuestionType.COMPARE,
      questionText: `Điền dấu thích hợp:`,
      visualData: { type: 'OBJECTS', items: [{val: a}, {val: '?'}, {val: b}] },
      correctAnswer: answer,
      options: ['>', '<', '=']
    };
  } else if (type < 0.5) {
    // Tìm số lớn nhất / bé nhất (0-10)
    const nums = new Set<number>();
    while(nums.size < 4) nums.add(getRandomInt(0, MAX_VAL));
    const numList = Array.from(nums);
    
    const isMax = Math.random() > 0.5;
    const answer = isMax ? Math.max(...numList) : Math.min(...numList);
    
    return {
      id: `minmax-${Date.now()}`,
      type: MathQuestionType.MULTIPLE_CHOICE,
      questionText: `Số nào ${isMax ? 'LỚN NHẤT' : 'BÉ NHẤT'}?`,
      visualData: { type: 'OBJECTS', items: [] }, // Chỉ hiện options
      correctAnswer: answer.toString(),
      options: shuffleArray(numList.map(String))
    };
  } else {
    // Sắp xếp: Tăng lên 5 số theo yêu cầu
    const nums = new Set<number>();
    // Cố gắng tạo 5 số khác nhau trong khoảng 0-10
    // Vì khoảng 0-10 chỉ có 11 số, nên việc lấy 5 số là dễ dàng
    while(nums.size < 5) {
        nums.add(getRandomInt(0, MAX_VAL));
    }
    const uniqueNums = Array.from(nums);
    
    const isAscending = Math.random() > 0.5;
    const sorted = [...uniqueNums].sort((a, b) => isAscending ? a - b : b - a);
    
    return {
      id: `sort-${Date.now()}`,
      type: MathQuestionType.SORTING,
      questionText: `Sắp xếp 5 số từ ${isAscending ? 'BÉ đến LỚN' : 'LỚN đến BÉ'}:`,
      visualData: { type: 'OBJECTS', items: [] },
      correctAnswer: sorted.join(','),
      options: shuffleArray(uniqueNums.map(String))
    };
  }
};

// --- MAIN FACTORY ---

export const generateMathQuiz = (topic: MathTopic, count: number = 10): MathQuestion[] => {
  const questions: MathQuestion[] = [];

  for (let i = 0; i < count; i++) {
    let q: MathQuestion | undefined;
    
    switch (topic) {
      case MathTopic.GEOMETRY:
        q = Math.random() > 0.4 ? generateShapeQuestion() : generateSpatialQuestion();
        break;
      case MathTopic.CALCULATION:
        q = generateCalcQuestion();
        break;
      case MathTopic.NUMBERS:
        q = generateNumberSenseQuestion();
        break;
      case MathTopic.MIXED:
      default:
        const rand = Math.random();
        if (rand < 0.25) q = generateShapeQuestion(); // Giảm tỉ lệ hình học chút để tập trung tính toán
        else if (rand < 0.65) q = generateCalcQuestion();
        else q = generateNumberSenseQuestion();
        break;
    }
    
    if (q) {
        q.id = `${q.id}-${i}`;
        questions.push(q);
    }
  }

  return questions;
};
