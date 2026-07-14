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

export type AngleDiagram = {
  type: "angle";
  title?: string;
  vertexLabel?: string;
  firstRayLabel?: string;
  secondRayLabel?: string;
  angleLabel?: string;
  questionLabel?: string;
};

export type ParallelLinesDiagram = {
  type: "parallel-lines";
  title?: string;
  topLineLabel?: string;
  bottomLineLabel?: string;
  transversalLabel?: string;
  upperAngleLabel?: string;
  lowerAngleLabel?: string;
  questionLabel?: string;
};

export type QuadrilateralDiagram = {
  type: "quadrilateral";
  title?: string;
  pointLabels?: {
    a?: string;
    b?: string;
    c?: string;
    d?: string;
  };
  topLabel?: string;
  rightLabel?: string;
  bottomLabel?: string;
  leftLabel?: string;
  diagonalLabel?: string;
  questionLabel?: string;
};

export type CircleDiagram = {
  type: "circle";
  title?: string;
  centerLabel?: string;
  radiusLabel?: string;
  chordLabel?: string;
  tangentLabel?: string;
  angleLabel?: string;
  questionLabel?: string;
};

export type CubeDiagram = {
  type: "cube";
  title?: string;
  edgeLabel?: string;
  faceLabel?: string;
  questionLabel?: string;
};

export type FlagDiagram = {
  type: "flag";
  title?: string;
  description?: string;
  emoji: string;
  caption?: string;
  questionLabel?: string;
};

export type CountryMapArea = {
  points: string;
  role?: "context" | "highlight" | "muted";
  label?: string;
};

export type CountryMapLabel = {
  text: string;
  x: number;
  y: number;
  role?: "land" | "water" | "region";
};

export type CountryMapDiagram = {
  type: "country-map";
  title?: string;
  description?: string;
  regionLabel?: string;
  questionLabel?: string;
  viewBox?: string;
  areas: CountryMapArea[];
  labels?: CountryMapLabel[];
};

export type WorldMapPinDiagram = {
  type: "world-map-pin";
  title?: string;
  description?: string;
  regionLabel?: string;
  questionLabel?: string;
  pin: {
    x: number;
    y: number;
  };
};

export type QuestionDiagram =
  | TriangleDiagram
  | AngleDiagram
  | ParallelLinesDiagram
  | QuadrilateralDiagram
  | CircleDiagram
  | CubeDiagram
  | FlagDiagram
  | CountryMapDiagram
  | WorldMapPinDiagram;

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
  inputType?: ShortAnswerInputType;
  caseSensitive?: boolean;
  explanation?: string;
};

export type ShortAnswerInputType =
  | "text"
  | "number"
  | "tel"
  | "email"
  | "url"
  | "search"
  | "password";

export type QuizQuestion = MultipleChoiceQuestion | TrueFalseQuestion | ShortAnswerQuestion;

export type QuizContent = {
  settings?: {
    questionMode?: "all" | "single";
    requireAnswerBeforeNext?: boolean;
    disableQuestionNavigation?: boolean;
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
