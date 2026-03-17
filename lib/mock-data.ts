export type QuestionType = 'MCQ' | 'MRQ' | 'INPUT'

export type Question = {
  id: string
  type: QuestionType
  prompt: string
  options?: { id: string; label: string }[]
  correctAnswer: string | string[]
  explanation: string
  marks: number
  negativeMarks?: number
  tags?: string[]
}

export type Test = {
  id: string
  title: string
  description: string
  duration: number // seconds
  totalMarks: number
  passingMarks: number
  tags: string[]
  difficulty: 'Easy' | 'Medium' | 'Hard'
  questions: Question[]
}

export type AttemptAnswer = {
  questionId: string
  answer: string | string[] | null
  timeTaken: number // seconds spent on this question
}

export type TestAttempt = {
  testId: string
  answers: AttemptAnswer[]
  startedAt: number // Date.now()
  submittedAt?: number
}

const t1: Test = {
  id: 'gk-sci-01',
  title: 'General Knowledge + Science Sprint',
  description:
    'A fast, mixed set of questions across civics, physics, biology, and everyday reasoning.',
  duration: 15 * 60,
  totalMarks: 22,
  passingMarks: 13,
  tags: ['General Knowledge', 'Science', 'Civics'],
  difficulty: 'Easy',
  questions: [
    {
      id: 't1-q1',
      type: 'MCQ',
      prompt: 'Which gas is most abundant in Earth’s atmosphere?',
      options: [
        { id: 'a', label: 'Oxygen' },
        { id: 'b', label: 'Nitrogen' },
        { id: 'c', label: 'Carbon dioxide' },
        { id: 'd', label: 'Argon' }
      ],
      correctAnswer: 'b',
      explanation:
        'Earth’s atmosphere is ~78% nitrogen, ~21% oxygen, and the remaining ~1% is mostly argon with trace gases such as CO₂.',
      marks: 2,
      negativeMarks: 0.5,
      tags: ['Science']
    },
    {
      id: 't1-q2',
      type: 'INPUT',
      prompt:
        'Water boils at what temperature (in °C) at standard atmospheric pressure (1 atm)?',
      correctAnswer: '100',
      explanation:
        'At 1 atm, pure water boils at 100°C. At higher altitudes (lower pressure) the boiling point decreases.',
      marks: 2,
      negativeMarks: 0.5,
      tags: ['Science']
    },
    {
      id: 't1-q3',
      type: 'MRQ',
      prompt:
        'Select all planets in our solar system that are classified as terrestrial planets.',
      options: [
        { id: 'a', label: 'Mercury' },
        { id: 'b', label: 'Venus' },
        { id: 'c', label: 'Jupiter' },
        { id: 'd', label: 'Mars' },
        { id: 'e', label: 'Neptune' }
      ],
      correctAnswer: ['a', 'b', 'd'],
      explanation:
        'Terrestrial planets are rocky planets with solid surfaces: Mercury, Venus, Earth, and Mars. Jupiter and Neptune are gas/ice giants.',
      marks: 3,
      negativeMarks: 1,
      tags: ['Science']
    },
    {
      id: 't1-q4',
      type: 'MCQ',
      prompt:
        'Which part of the cell is primarily responsible for energy production (ATP) in eukaryotes?',
      options: [
        { id: 'a', label: 'Nucleus' },
        { id: 'b', label: 'Ribosome' },
        { id: 'c', label: 'Mitochondrion' },
        { id: 'd', label: 'Golgi apparatus' }
      ],
      correctAnswer: 'c',
      explanation:
        'Mitochondria generate most ATP via cellular respiration (oxidative phosphorylation). Ribosomes make proteins; the Golgi packages them; the nucleus stores DNA.',
      marks: 2,
      negativeMarks: 0.5,
      tags: ['Science']
    },
    {
      id: 't1-q5',
      type: 'MCQ',
      prompt:
        'In a democratic system, the principle of “rule of law” most directly means:',
      options: [
        { id: 'a', label: 'Leaders can change laws whenever they want' },
        { id: 'b', label: 'Everyone, including the government, is subject to the law' },
        { id: 'c', label: 'Courts only apply criminal laws' },
        { id: 'd', label: 'Laws do not apply during elections' }
      ],
      correctAnswer: 'b',
      explanation:
        'Rule of law means laws apply equally and are enforced fairly; government authority is constrained by law rather than personal discretion.',
      marks: 2,
      negativeMarks: 0.5,
      tags: ['Civics']
    },
    {
      id: 't1-q6',
      type: 'INPUT',
      prompt: 'What is the chemical symbol for sodium?',
      correctAnswer: 'Na',
      explanation:
        'The symbol Na comes from the Latin name for sodium: “natrium”.',
      marks: 2,
      negativeMarks: 0.5,
      tags: ['Science']
    },
    {
      id: 't1-q7',
      type: 'MRQ',
      prompt:
        'Which of the following are forms of renewable energy? (Select all that apply.)',
      options: [
        { id: 'a', label: 'Solar power' },
        { id: 'b', label: 'Wind power' },
        { id: 'c', label: 'Coal' },
        { id: 'd', label: 'Hydroelectric power' },
        { id: 'e', label: 'Natural gas' }
      ],
      correctAnswer: ['a', 'b', 'd'],
      explanation:
        'Solar, wind, and hydro are replenished naturally and are considered renewable. Coal and natural gas are fossil fuels and are non-renewable on human timescales.',
      marks: 3,
      negativeMarks: 1,
      tags: ['Science']
    },
    {
      id: 't1-q8',
      type: 'MCQ',
      prompt: 'Which instrument is typically used to measure atmospheric pressure?',
      options: [
        { id: 'a', label: 'Thermometer' },
        { id: 'b', label: 'Barometer' },
        { id: 'c', label: 'Hygrometer' },
        { id: 'd', label: 'Anemometer' }
      ],
      correctAnswer: 'b',
      explanation:
        'A barometer measures atmospheric pressure. Thermometers measure temperature, hygrometers measure humidity, and anemometers measure wind speed.',
      marks: 2,
      negativeMarks: 0.5,
      tags: ['Science']
    },
    {
      id: 't1-q9',
      type: 'INPUT',
      prompt: 'How many continents are there on Earth (standard model)?',
      correctAnswer: '7',
      explanation:
        'The commonly taught model lists seven: Asia, Africa, North America, South America, Antarctica, Europe, and Australia.',
      marks: 2,
      negativeMarks: 0.5,
      tags: ['General Knowledge']
    },
    {
      id: 't1-q10',
      type: 'MCQ',
      prompt: 'A light-year is a unit of:',
      options: [
        { id: 'a', label: 'Time' },
        { id: 'b', label: 'Distance' },
        { id: 'c', label: 'Brightness' },
        { id: 'd', label: 'Speed' }
      ],
      correctAnswer: 'b',
      explanation:
        'A light-year is the distance light travels in vacuum in one year (~9.46 trillion km). It is not a unit of time.',
      marks: 2,
      negativeMarks: 0.5,
      tags: ['Science']
    }
  ]
}

const t2: Test = {
  id: 'math-logic-01',
  title: 'Math + Logic Fundamentals',
  description:
    'A slightly tougher set focused on arithmetic, algebra, probability, and reasoning patterns.',
  duration: 20 * 60,
  totalMarks: 22,
  passingMarks: 13,
  tags: ['Math', 'Logic', 'Probability'],
  difficulty: 'Medium',
  questions: [
    {
      id: 't2-q1',
      type: 'MCQ',
      prompt: 'What is the value of 7 × 8?',
      options: [
        { id: 'a', label: '54' },
        { id: 'b', label: '56' },
        { id: 'c', label: '64' },
        { id: 'd', label: '48' }
      ],
      correctAnswer: 'b',
      explanation: '7 × 8 = 56 by basic multiplication facts.',
      marks: 2,
      negativeMarks: 0.5,
      tags: ['Math']
    },
    {
      id: 't2-q2',
      type: 'INPUT',
      prompt: 'Solve for x: 3x + 5 = 20',
      correctAnswer: '5',
      explanation:
        'Subtract 5 from both sides: 3x = 15. Divide by 3: x = 5.',
      marks: 2,
      negativeMarks: 0.5,
      tags: ['Math']
    },
    {
      id: 't2-q3',
      type: 'MCQ',
      prompt:
        'If a fair coin is flipped twice, what is the probability of getting exactly one head?',
      options: [
        { id: 'a', label: '1/4' },
        { id: 'b', label: '1/2' },
        { id: 'c', label: '3/4' },
        { id: 'd', label: '2/3' }
      ],
      correctAnswer: 'b',
      explanation:
        'The outcomes are HH, HT, TH, TT (4 equally likely). Exactly one head occurs in HT and TH (2 outcomes). Probability = 2/4 = 1/2.',
      marks: 2,
      negativeMarks: 0.5,
      tags: ['Probability']
    },
    {
      id: 't2-q4',
      type: 'MRQ',
      prompt: 'Which of the following numbers are prime? (Select all that apply.)',
      options: [
        { id: 'a', label: '21' },
        { id: 'b', label: '29' },
        { id: 'c', label: '31' },
        { id: 'd', label: '49' },
        { id: 'e', label: '51' }
      ],
      correctAnswer: ['b', 'c'],
      explanation:
        '29 and 31 have no positive divisors other than 1 and themselves. 21=3×7, 49=7×7, and 51=3×17, so those are composite.',
      marks: 3,
      negativeMarks: 1,
      tags: ['Math']
    },
    {
      id: 't2-q5',
      type: 'INPUT',
      prompt: 'What is 15% of 200?',
      correctAnswer: '30',
      explanation:
        '15% = 0.15, and 0.15 × 200 = 30. Another way: 10% of 200 is 20, 5% is 10, total 30.',
      marks: 2,
      negativeMarks: 0.5,
      tags: ['Math']
    },
    {
      id: 't2-q6',
      type: 'MCQ',
      prompt:
        'A sequence is defined by a₁ = 2 and aₙ = aₙ₋₁ + 3. What is a₄?',
      options: [
        { id: 'a', label: '8' },
        { id: 'b', label: '9' },
        { id: 'c', label: '11' },
        { id: 'd', label: '14' }
      ],
      correctAnswer: 'c',
      explanation:
        'This is an arithmetic sequence with common difference 3: a₁=2, a₂=5, a₃=8, a₄=11.',
      marks: 2,
      negativeMarks: 0.5,
      tags: ['Math']
    },
    {
      id: 't2-q7',
      type: 'MCQ',
      prompt: 'What is the next number in the pattern: 1, 4, 9, 16, ___ ?',
      options: [
        { id: 'a', label: '20' },
        { id: 'b', label: '24' },
        { id: 'c', label: '25' },
        { id: 'd', label: '32' }
      ],
      correctAnswer: 'c',
      explanation:
        'These are perfect squares: 1², 2², 3², 4². The next is 5² = 25.',
      marks: 2,
      negativeMarks: 0.5,
      tags: ['Logic']
    },
    {
      id: 't2-q8',
      type: 'MRQ',
      prompt:
        'Which statements about a standard six-sided die are true? (Select all that apply.)',
      options: [
        { id: 'a', label: 'The probability of rolling an even number is 1/2.' },
        { id: 'b', label: 'The expected value of a roll is 3.5.' },
        { id: 'c', label: 'The probability of rolling a 6 is 1/3.' },
        { id: 'd', label: 'Rolling a number greater than 4 has probability 1/3.' }
      ],
      correctAnswer: ['a', 'b', 'd'],
      explanation:
        'Even numbers are {2,4,6} so 3/6=1/2. Expected value is (1+2+3+4+5+6)/6=3.5. Rolling a 6 is 1/6 (not 1/3). Numbers >4 are {5,6} so 2/6=1/3.',
      marks: 3,
      negativeMarks: 1,
      tags: ['Probability']
    },
    {
      id: 't2-q9',
      type: 'INPUT',
      prompt: 'Compute the mean (average) of 4, 7, 9, 10.',
      correctAnswer: '7.5',
      explanation:
        'Add the values: 4+7+9+10=30. Divide by 4 numbers: 30/4=7.5.',
      marks: 2,
      negativeMarks: 0.5,
      tags: ['Math']
    },
    {
      id: 't2-q10',
      type: 'MCQ',
      prompt:
        'A bag contains 3 red balls and 2 blue balls. If you draw one ball at random, what is the probability it is red?',
      options: [
        { id: 'a', label: '2/5' },
        { id: 'b', label: '3/5' },
        { id: 'c', label: '1/2' },
        { id: 'd', label: '3/2' }
      ],
      correctAnswer: 'b',
      explanation: 'There are 5 balls total; 3 are red. Probability = 3/5.',
      marks: 2,
      negativeMarks: 0.5,
      tags: ['Probability']
    }
  ]
}

const t3: Test = {
  id: 'math-12-01',
  title: 'Class 12 Mathematics — Calculus & Algebra Set',
  description:
    'Board-exam style questions from Class 12 mathematics: limits, derivatives, integrals, matrices, vectors, probability, and differential equations.',
  duration: 30 * 60,
  totalMarks: 23,
  passingMarks: 14,
  tags: ['Mathematics', 'Class 12', 'Calculus', 'Algebra'],
  difficulty: 'Hard',
  questions: [
    {
      id: 't3-q1',
      type: 'MCQ',
      prompt: 'Evaluate the limit: limₓ→0 (sin x) / x',
      options: [
        { id: 'a', label: '0' },
        { id: 'b', label: '1' },
        { id: 'c', label: '∞' },
        { id: 'd', label: 'Does not exist' }
      ],
      correctAnswer: 'b',
      explanation:
        'A standard limit in calculus: limₓ→0 (sin x)/x = 1 (when x is in radians). It follows from the squeeze theorem or the small-angle approximation sin x ~ x.',
      marks: 2,
      negativeMarks: 0.5,
      tags: ['Calculus', 'Limits']
    },
    {
      id: 't3-q2',
      type: 'INPUT',
      prompt: 'If f(x) = x³ − 3x, find f′(2).',
      correctAnswer: '9',
      explanation:
        'Differentiate: f′(x) = 3x² − 3. Then f′(2) = 3·(2²) − 3 = 12 − 3 = 9.',
      marks: 2,
      negativeMarks: 0.5,
      tags: ['Calculus', 'Derivatives']
    },
    {
      id: 't3-q3',
      type: 'INPUT',
      prompt: 'Evaluate the definite integral: ∫₀^π sin x dx',
      correctAnswer: '2',
      explanation:
        '∫ sin x dx = −cos x + C. So ∫₀^π sin x dx = [−cos x]₀^π = (−cos π) − (−cos 0) = 1 − (−1) = 2.',
      marks: 3,
      negativeMarks: 1,
      tags: ['Calculus', 'Integrals']
    },
    {
      id: 't3-q4',
      type: 'MCQ',
      prompt: 'Find det(A) for A = [[1, 2], [3, 4]].',
      options: [
        { id: 'a', label: '−2' },
        { id: 'b', label: '2' },
        { id: 'c', label: '−10' },
        { id: 'd', label: '10' }
      ],
      correctAnswer: 'a',
      explanation:
        'For a 2×2 matrix [[a,b],[c,d]], det = ad − bc. Here det = 1·4 − 2·3 = 4 − 6 = −2.',
      marks: 2,
      negativeMarks: 0.5,
      tags: ['Algebra', 'Matrices']
    },
    {
      id: 't3-q5',
      type: 'MCQ',
      prompt: 'For the complex number z = 3 − 4i, what is |z|?',
      options: [
        { id: 'a', label: '1' },
        { id: 'b', label: '5' },
        { id: 'c', label: '7' },
        { id: 'd', label: '√7' }
      ],
      correctAnswer: 'b',
      explanation:
        '|a+bi| = √(a² + b²). So |3−4i| = √(3² + (−4)²) = √(9 + 16) = √25 = 5.',
      marks: 2,
      negativeMarks: 0.5,
      tags: ['Algebra', 'Complex Numbers']
    },
    {
      id: 't3-q6',
      type: 'INPUT',
      prompt:
        'Let a = (1, 0, 0) and b = (1, 1, 0). Find cos(θ), where θ is the angle between a and b. (Enter a decimal.)',
      correctAnswer: '0.7071',
      explanation:
        'cos θ = (a·b)/(|a||b|). Here a·b = 1·1 + 0·1 + 0·0 = 1. |a| = 1. |b| = √(1²+1²+0²)=√2. So cos θ = 1/√2 ≈ 0.7071.',
      marks: 2,
      negativeMarks: 0.5,
      tags: ['Vectors']
    },
    {
      id: 't3-q7',
      type: 'MCQ',
      prompt:
        'A fair coin is tossed 4 times. What is the probability of getting exactly 2 heads?',
      options: [
        { id: 'a', label: '1/4' },
        { id: 'b', label: '3/8' },
        { id: 'c', label: '1/2' },
        { id: 'd', label: '5/8' }
      ],
      correctAnswer: 'b',
      explanation:
        'Use the binomial probability: P(X=2) = C(4,2)(1/2)^2(1/2)^2 = 6/16 = 3/8.',
      marks: 2,
      negativeMarks: 0.5,
      tags: ['Probability', 'Binomial Theorem']
    },
    {
      id: 't3-q8',
      type: 'MRQ',
      prompt: 'Select all pairs of vectors that are perpendicular (dot product = 0).',
      options: [
        { id: 'a', label: '(1, 2, 3) and (4, −2, 0)' },
        { id: 'b', label: '(2, 0, 1) and (1, 2, 3)' },
        { id: 'c', label: '(1, −1, 0) and (2, 2, 0)' },
        { id: 'd', label: '(0, 1, 1) and (1, 1, 1)' },
        { id: 'e', label: '(3, 1, 0) and (1, 3, 0)' }
      ],
      correctAnswer: ['a', 'c'],
      explanation:
        'Compute dot products:\n(a) 1·4 + 2·(−2) + 3·0 = 4 − 4 + 0 = 0 ✓\n(b) 2·1 + 0·2 + 1·3 = 5 ✗\n(c) 1·2 + (−1)·2 + 0·0 = 0 ✓\n(d) 0·1 + 1·1 + 1·1 = 2 ✗\n(e) 3·1 + 1·3 + 0 = 6 ✗',
      marks: 3,
      negativeMarks: 1,
      tags: ['Vectors']
    },
    {
      id: 't3-q9',
      type: 'MRQ',
      prompt: 'Which properties of definite integrals are always true? (Select all that apply.)',
      options: [
        { id: 'a', label: '∫ₐ^ₐ f(x) dx = 0' },
        { id: 'b', label: '∫ₐ^ᵇ f(x) dx = −∫ᵇ^ₐ f(x) dx' },
        { id: 'c', label: '∫ₐ^ᵇ (f(x)+g(x)) dx = ∫ₐ^ᵇ f(x) dx + ∫ₐ^ᵇ g(x) dx' },
        { id: 'd', label: '∫ₐ^ᵇ c·f(x) dx = c + ∫ₐ^ᵇ f(x) dx' }
      ],
      correctAnswer: ['a', 'b', 'c'],
      explanation:
        '(a) True by definition: no interval length, area is 0.\n(b) Reversing bounds changes sign.\n(c) Linearity holds for integrals.\n(d) Incorrect: constants factor out multiplicatively: ∫ c f = c ∫ f (not c + ∫ f).',
      marks: 3,
      negativeMarks: 1,
      tags: ['Calculus', 'Integrals']
    },
    {
      id: 't3-q10',
      type: 'MCQ',
      prompt: 'Solve the differential equation: dy/dx = 3x².',
      options: [
        { id: 'a', label: 'y = 3x + C' },
        { id: 'b', label: 'y = x³ + C' },
        { id: 'c', label: 'y = x² + C' },
        { id: 'd', label: 'y = 3x² + C' }
      ],
      correctAnswer: 'b',
      explanation:
        'Integrate both sides: dy = 3x² dx ⇒ y = ∫ 3x² dx = x³ + C.',
      marks: 2,
      negativeMarks: 0.5,
      tags: ['Calculus', 'Differential Equations']
    }
  ]
}


export const mockTests: Test[] = [t1, t2, t3]

export function getMockTestById(id: string): Test | undefined {
  return mockTests.find((t) => t.id === id)
}
