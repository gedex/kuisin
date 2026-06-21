export type QuizSearch = {
  soal?: number;
};

export function parseQuizSearch(search: Record<string, unknown>): QuizSearch {
  return {
    soal: parseQuestionNumber(search.soal),
  };
}

export function clampQuestionNumber(questionNumber: number, questionCount: number) {
  return Math.max(1, Math.min(questionNumber, Math.max(questionCount, 1)));
}

function parseQuestionNumber(value: unknown) {
  const parsed =
    typeof value === "number"
      ? value
      : typeof value === "string" && value.trim()
        ? Number(value)
        : undefined;

  return typeof parsed === "number" && Number.isInteger(parsed) && parsed > 0
    ? parsed
    : undefined;
}
