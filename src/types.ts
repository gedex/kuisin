export type SortKey = "title-az" | "title-za";

export type QuizIndexItem = {
  type: "quiz";
  slug: string;
  title: string;
  description: string;
  subject: string;
  tags: string[];
  questionCount: number;
  flashcardCount?: number;
  dataFile: string;
};

export type QuizIndex = {
  version: number;
  updatedAt: string;
  items: QuizIndexItem[];
};

export type Choice = {
  id: string;
  text: string;
};

export type TriangleDiagram = {
  type: "triangle";
  title?: string;
  pointLabels?: {
    a?: string;
    b?: string;
    c?: string;
  };
  angleLabel?: string;
  leftLabel?: string;
  rightLabel?: string;
  baseLabel?: string;
  questionLabel?: string;
};

export type CubeDiagram = {
  type: "cube";
  title?: string;
  edgeLabel?: string;
  faceLabel?: string;
  questionLabel?: string;
};

export type QuestionDiagram = TriangleDiagram | CubeDiagram;

export type MultipleChoiceQuestion = {
  id: string;
  type: "multiple-choice";
  prompt: string;
  diagram?: QuestionDiagram;
  choices: Choice[];
  answer: string;
  explanation?: string;
};

export type TrueFalseQuestion = {
  id: string;
  type: "true-false";
  prompt: string;
  diagram?: QuestionDiagram;
  answer: boolean;
  explanation?: string;
};

export type ShortAnswerQuestion = {
  id: string;
  type: "short-answer";
  prompt: string;
  diagram?: QuestionDiagram;
  answers: string[];
  caseSensitive?: boolean;
  explanation?: string;
};

export type QuizQuestion = MultipleChoiceQuestion | TrueFalseQuestion | ShortAnswerQuestion;

export type QuizContent = {
  settings?: {
    questionMode?: "all" | "single";
    shuffleQuestions?: boolean;
    shuffleChoices?: boolean;
    passingScore?: number;
  };
  questions: QuizQuestion[];
};

export type Flashcard = {
  id: string;
  front: string;
  back: string;
  hint?: string;
};

export type QuizDetail = {
  version: number;
  slug: string;
  title: string;
  description: string;
  subject: string;
  tags: string[];
  quiz: QuizContent;
  flashcards: Flashcard[];
};

export type QuizAttempt = {
  answers: Record<string, string>;
  questionTimes?: Record<string, number>;
  currentQuestionIndex?: number;
  startedAt?: string;
  lastAnsweredAt?: string;
  activeQuestionId?: string;
  activeQuestionStartedAt?: string;
  completedAt?: string;
};

export type FlashcardProgress = {
  currentIndex: number;
  knownCardIds: string[];
  reviewedCardIds: string[];
};
