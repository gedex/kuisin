import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { useEffect } from "react";
import { useLocalStorageState } from "../../lib/storage";
import type { QuizAttempt, QuizContent } from "../../types";
import { QuestionView } from "./QuestionView";
import { QuizFinishPage } from "./QuizFinishPage";
import {
  firstUnansweredIndex,
  getElapsedMs,
  getQuestionTypeSummary,
  isCorrectAnswer,
} from "./quizUtils";
import "./QuizRunner.css";

type Props = {
  quiz: QuizContent;
  slug: string;
  questionIndex?: number;
  onQuestionIndexChange?: (index: number) => void;
};

export function QuizRunner({
  quiz,
  slug,
  questionIndex,
  onQuestionIndexChange,
}: Props) {
  const [attempt, setAttempt] = useLocalStorageState<QuizAttempt>(
    `kuisin:quiz:${slug}`,
    { answers: {} },
  );
  const questionMode = quiz.settings?.questionMode ?? "all";
  const currentQuestionIndex = Math.max(
    0,
    Math.min(
      questionIndex ?? attempt.currentQuestionIndex ?? firstUnansweredIndex(quiz, attempt),
      Math.max(quiz.questions.length - 1, 0),
    ),
  );
  const currentQuestion = quiz.questions[currentQuestionIndex];
  const answeredCount = Object.keys(attempt.answers).length;
  const score = quiz.questions.reduce((total, question) => {
    return total + (isCorrectAnswer(question, attempt.answers[question.id]) ? 1 : 0);
  }, 0);
  const isComplete = answeredCount === quiz.questions.length;
  const percentage = quiz.questions.length
    ? Math.round((score / quiz.questions.length) * 100)
    : 0;
  const typeLabel = getQuestionTypeSummary(quiz.questions);

  useEffect(() => {
    const timestamp = new Date().toISOString();

    setAttempt((current) => {
      const updates: Partial<QuizAttempt> = {};

      if (!current.startedAt) {
        updates.startedAt = timestamp;
      }

      if (
        questionMode === "single" &&
        currentQuestion &&
        (current.activeQuestionId !== currentQuestion.id || !current.activeQuestionStartedAt)
      ) {
        updates.activeQuestionId = currentQuestion.id;
        updates.activeQuestionStartedAt = timestamp;
      }

      return Object.keys(updates).length > 0 ? { ...current, ...updates } : current;
    });
  }, [currentQuestion, questionMode, setAttempt]);

  function answerQuestion(questionId: string, answer: string) {
    setAttempt((current) => {
      const timestamp = new Date().toISOString();
      const startedAt = current.startedAt ?? timestamp;
      const answers = { ...current.answers, [questionId]: answer };
      const answeredBefore = Boolean(current.answers[questionId]);
      const complete = Object.keys(answers).length === quiz.questions.length;
      const timingStartedAt =
        current.activeQuestionId === questionId && current.activeQuestionStartedAt
          ? current.activeQuestionStartedAt
          : current.lastAnsweredAt ?? startedAt;
      const questionTimes = { ...(current.questionTimes ?? {}) };

      if (!answeredBefore || questionTimes[questionId] === undefined) {
        questionTimes[questionId] = getElapsedMs(timingStartedAt, timestamp);
      }

      return {
        ...current,
        answers,
        questionTimes,
        startedAt,
        lastAnsweredAt: timestamp,
        currentQuestionIndex: current.currentQuestionIndex ?? currentQuestionIndex,
        completedAt: complete ? current.completedAt ?? timestamp : undefined,
      };
    });
  }

  function goToQuestion(index: number) {
    const nextQuestionIndex = Math.max(
      0,
      Math.min(Math.max(index, 0), Math.max(quiz.questions.length - 1, 0)),
    );

    setAttempt((current) => ({
      ...current,
      currentQuestionIndex: nextQuestionIndex,
    }));
    onQuestionIndexChange?.(nextQuestionIndex);
  }

  function resetAttempt() {
    const timestamp = new Date().toISOString();

    setAttempt({
      answers: {},
      questionTimes: {},
      currentQuestionIndex: 0,
      startedAt: timestamp,
      activeQuestionId: quiz.questions[0]?.id,
      activeQuestionStartedAt: timestamp,
    });
    onQuestionIndexChange?.(0);
  }

  return (
    <div className="study-panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">{typeLabel}</p>
          <h2>Latihan kuis</h2>
        </div>
        <button className="ghost-button" type="button" onClick={resetAttempt}>
          <RotateCcw size={17} aria-hidden="true" />
          Ulang
        </button>
      </div>

      <div className="progress-strip" aria-label="Progres kuis">
        <span style={{ width: `${(answeredCount / quiz.questions.length) * 100}%` }} />
      </div>

      <div className="score-line">
        <span>
          {answeredCount}/{quiz.questions.length} terjawab
        </span>
        <strong>{isComplete ? `${percentage}%` : `${score} benar`}</strong>
      </div>

      {isComplete ? (
        <QuizFinishPage
          attempt={attempt}
          passingScore={quiz.settings?.passingScore ?? 70}
          percentage={percentage}
          questions={quiz.questions}
          score={score}
          onRestart={resetAttempt}
        />
      ) : questionMode === "single" && currentQuestion ? (
        <div className="question-flow">
          <QuestionView
            question={currentQuestion}
            selectedAnswer={attempt.answers[currentQuestion.id]}
            onAnswer={answerQuestion}
          />

          <div className="quiz-nav" aria-label="Navigasi soal">
            <button
              className="soft-button"
              type="button"
              onClick={() => goToQuestion(currentQuestionIndex - 1)}
              disabled={currentQuestionIndex === 0}
            >
              <ChevronLeft size={17} aria-hidden="true" />
              Sebelumnya
            </button>
            <span>
              Soal {currentQuestionIndex + 1} dari {quiz.questions.length}
            </span>
            <button
              className="primary-button"
              type="button"
              onClick={() => goToQuestion(currentQuestionIndex + 1)}
              disabled={currentQuestionIndex === quiz.questions.length - 1}
            >
              Berikutnya
              <ChevronRight size={17} aria-hidden="true" />
            </button>
          </div>
        </div>
      ) : (
        <div className="question-list">
          {quiz.questions.map((question) => (
            <QuestionView
              key={question.id}
              question={question}
              selectedAnswer={attempt.answers[question.id]}
              onAnswer={answerQuestion}
            />
          ))}
        </div>
      )}
    </div>
  );
}
