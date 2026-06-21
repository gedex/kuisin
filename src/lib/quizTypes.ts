import type { QuizQuestion } from "../types";

export const questionTypeLabels: Record<QuizQuestion["type"], string> = {
  "multiple-choice": "Pilihan ganda",
  "short-answer": "Isian singkat",
  "true-false": "Benar/Salah",
};
