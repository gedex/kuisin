import { questionTypeLabels } from "../../lib/quizTypes";
import type { QuizAttempt, QuizContent, QuizQuestion, ShortAnswerQuestion } from "../../types";

export type QuestionResult = {
  answer?: string;
  answerText: string;
  correct: boolean;
  correctAnswerText: string;
  durationMs: number;
  explanation?: string;
  index: number;
  question: QuizQuestion;
  typeLabel: string;
};

export function firstUnansweredIndex(quiz: QuizContent, attempt: QuizAttempt) {
  const unansweredIndex = quiz.questions.findIndex(
    (question) => !attempt.answers[question.id],
  );

  return unansweredIndex === -1 ? 0 : unansweredIndex;
}

export function getQuestionTypeSummary(questions: QuizQuestion[]) {
  const types = Array.from(new Set(questions.map((question) => question.type)));

  if (types.length === 1) {
    return questionTypeLabels[types[0]];
  }

  return "Kuis campuran";
}

export function isCorrectAnswer(question: QuizQuestion, answer?: string) {
  if (!answer) return false;

  switch (question.type) {
    case "multiple-choice":
      return answer === question.answer;
    case "true-false":
      return answer === String(question.answer);
    case "short-answer":
      return question.answers.some(
        (acceptedAnswer) =>
          normalizeShortAnswer(answer, question) ===
          normalizeShortAnswer(acceptedAnswer, question),
      );
  }
}

export function getQuestionResult(
  question: QuizQuestion,
  index: number,
  attempt: QuizAttempt,
): QuestionResult {
  const answer = attempt.answers[question.id];

  return {
    answer,
    answerText: getAnswerText(question, answer),
    correct: isCorrectAnswer(question, answer),
    correctAnswerText: getCorrectAnswerText(question),
    durationMs: attempt.questionTimes?.[question.id] ?? 0,
    explanation: getExplanation(question),
    index,
    question,
    typeLabel: questionTypeLabels[question.type],
  };
}

export function getAnswerText(question: QuizQuestion, answer?: string) {
  if (!answer) return "Belum dijawab";

  switch (question.type) {
    case "multiple-choice":
      return question.choices.find((choice) => choice.id === answer)?.text ?? answer;
    case "true-false":
      return answer === "true" ? "Benar" : "Salah";
    case "short-answer":
      return answer;
  }
}

export function getCorrectAnswerText(question: QuizQuestion) {
  switch (question.type) {
    case "multiple-choice":
      return question.choices.find((choice) => choice.id === question.answer)?.text ?? question.answer;
    case "true-false":
      return question.answer ? "Benar" : "Salah";
    case "short-answer":
      return question.answers.join(" / ");
  }
}

export function getExplanation(question: QuizQuestion) {
  return "explanation" in question ? question.explanation : undefined;
}

export function getTotalTimeMs(attempt: QuizAttempt, results: QuestionResult[]) {
  if (attempt.startedAt && attempt.completedAt) {
    return getElapsedMs(attempt.startedAt, attempt.completedAt);
  }

  return results.reduce((total, result) => total + result.durationMs, 0);
}

export function getElapsedMs(startIso: string, endIso: string) {
  const start = new Date(startIso).getTime();
  const end = new Date(endIso).getTime();

  if (!Number.isFinite(start) || !Number.isFinite(end)) return 0;

  return Math.max(0, end - start);
}

export function getFastestResult(results: QuestionResult[]) {
  return results
    .filter((result) => result.durationMs > 0)
    .sort((a, b) => a.durationMs - b.durationMs)[0];
}

export function getSlowestResult(results: QuestionResult[]) {
  return [...results].sort((a, b) => b.durationMs - a.durationMs)[0];
}

export function formatQuestionMetric(result?: QuestionResult) {
  if (!result) return "-";

  return `Soal ${result.index + 1} - ${formatDuration(result.durationMs)}`;
}

export function getQuestionTypeInsight(results: QuestionResult[]) {
  const groups = new Map<
    QuizQuestion["type"],
    { count: number; incorrect: number; totalTimeMs: number }
  >();

  for (const result of results) {
    const group = groups.get(result.question.type) ?? {
      count: 0,
      incorrect: 0,
      totalTimeMs: 0,
    };
    group.count += 1;
    group.incorrect += result.correct ? 0 : 1;
    group.totalTimeMs += result.durationMs;
    groups.set(result.question.type, group);
  }

  const bestGroup = Array.from(groups.entries()).sort((a, b) => {
    const incorrectDifference = b[1].incorrect - a[1].incorrect;
    if (incorrectDifference !== 0) return incorrectDifference;

    return b[1].totalTimeMs / b[1].count - a[1].totalTimeMs / a[1].count;
  })[0];

  if (!bestGroup) return "Belum ada data.";

  const [type, group] = bestGroup;
  const average = group.totalTimeMs / group.count;

  return `${questionTypeLabels[type]} - ${group.incorrect} salah - rata-rata ${formatDuration(
    average,
  )}`;
}

export function formatDuration(milliseconds: number) {
  if (!Number.isFinite(milliseconds) || milliseconds <= 0) return "0 dtk";

  const totalSeconds = Math.max(1, Math.round(milliseconds / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes === 0) return `${seconds} dtk`;
  if (seconds === 0) return `${minutes} mnt`;

  return `${minutes} mnt ${seconds} dtk`;
}

function normalizeShortAnswer(answer: string, question: ShortAnswerQuestion) {
  const normalized = answer.trim().replace(/\s+/g, " ");

  return question.caseSensitive ? normalized : normalized.toLowerCase();
}
