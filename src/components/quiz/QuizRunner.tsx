import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
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
  const startedFromCtaRef = useRef(false);
  const [timerNowMs, setTimerNowMs] = useState(() => Date.now());
  const questionMode = quiz.settings?.questionMode ?? "all";
  const requireAnswerBeforeNext = quiz.settings?.requireAnswerBeforeNext ?? false;
  const disableQuestionNavigation = quiz.settings?.disableQuestionNavigation ?? false;
  const currentQuestionIndex = Math.max(
    0,
    Math.min(
      questionIndex ?? attempt.currentQuestionIndex ?? firstUnansweredIndex(quiz, attempt),
      Math.max(quiz.questions.length - 1, 0),
    ),
  );
  const currentQuestion = quiz.questions[currentQuestionIndex];
  const currentQuestionAnswered = currentQuestion
    ? Boolean(attempt.answers[currentQuestion.id])
    : false;
  const answeredCount = Object.keys(attempt.answers).length;
  const score = quiz.questions.reduce((total, question) => {
    return total + (isCorrectAnswer(question, attempt.answers[question.id]) ? 1 : 0);
  }, 0);
  const isComplete = answeredCount === quiz.questions.length;
  const percentage = quiz.questions.length
    ? Math.round((score / quiz.questions.length) * 100)
    : 0;
  const typeLabel = getQuestionTypeSummary(quiz.questions);
  const timerRunning = Boolean(attempt.startedAt && !isComplete);
  const timerElapsedMs = getStopwatchElapsedMs(
    attempt.startedAt,
    attempt.completedAt,
    timerNowMs,
  );
  const timerValue = formatStopwatchDuration(timerElapsedMs);
  const timerStateLabel = timerRunning ? "berjalan" : "berhenti";
  const showIntro = !attempt.startedAt && answeredCount === 0 && !isComplete;

  useEffect(() => {
    if (startedFromCtaRef.current || answeredCount > 0 || !attempt.startedAt) return;

    setAttempt((current) => {
      if (Object.keys(current.answers).length > 0 || !current.startedAt) return current;

      return {
        ...current,
        activeQuestionId: undefined,
        activeQuestionStartedAt: undefined,
        completedAt: undefined,
        lastAnsweredAt: undefined,
        startedAt: undefined,
      };
    });
  }, [answeredCount, attempt.startedAt, setAttempt]);

  useEffect(() => {
    if (!timerRunning) return;

    const intervalId = window.setInterval(() => {
      setTimerNowMs(Date.now());
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [timerRunning]);

  useEffect(() => {
    if (questionMode !== "single" || !attempt.startedAt || isComplete || !currentQuestion) {
      return;
    }

    setAttempt((current) => {
      const updates: Partial<QuizAttempt> = {};

      if (
        (current.activeQuestionId !== currentQuestion.id || !current.activeQuestionStartedAt)
      ) {
        const timestamp = new Date().toISOString();
        updates.activeQuestionId = currentQuestion.id;
        updates.activeQuestionStartedAt = timestamp;
      }

      return Object.keys(updates).length > 0 ? { ...current, ...updates } : current;
    });
  }, [attempt.startedAt, currentQuestion, isComplete, questionMode, setAttempt]);

  function startQuiz() {
    const timestamp = new Date().toISOString();
    startedFromCtaRef.current = true;
    setTimerNowMs(Date.now());

    setAttempt((current) => ({
      ...current,
      startedAt: current.startedAt ?? timestamp,
      activeQuestionId: currentQuestion?.id,
      activeQuestionStartedAt: timestamp,
      currentQuestionIndex,
    }));
  }

  function answerQuestion(questionId: string, answer: string) {
    const timestamp = new Date().toISOString();
    const answeredQuestionIndex = quiz.questions.findIndex(
      (question) => question.id === questionId,
    );
    const nextQuestionIndex =
      questionMode === "single" &&
      disableQuestionNavigation &&
      answeredQuestionIndex >= 0 &&
      answeredQuestionIndex < quiz.questions.length - 1
        ? answeredQuestionIndex + 1
        : undefined;

    setTimerNowMs(Date.now());

    setAttempt((current) => {
      const startedAt = current.startedAt ?? timestamp;
      const answers = { ...current.answers, [questionId]: answer };
      const answeredBefore = Boolean(current.answers[questionId]);
      const complete = Object.keys(answers).length === quiz.questions.length;
      const timingStartedAt =
        current.activeQuestionId === questionId && current.activeQuestionStartedAt
          ? current.activeQuestionStartedAt
          : current.lastAnsweredAt ?? current.startedAt ?? timestamp;
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
        currentQuestionIndex:
          nextQuestionIndex ?? current.currentQuestionIndex ?? currentQuestionIndex,
        completedAt: complete ? current.completedAt ?? timestamp : undefined,
      };
    });

    if (nextQuestionIndex !== undefined) {
      onQuestionIndexChange?.(nextQuestionIndex);
    }
  }

  function goToQuestion(index: number) {
    if (disableQuestionNavigation) return;

    if (
      requireAnswerBeforeNext &&
      index > currentQuestionIndex &&
      !currentQuestionAnswered
    ) {
      return;
    }

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
    startedFromCtaRef.current = false;

    setAttempt({
      answers: {},
      questionTimes: {},
      currentQuestionIndex: 0,
    });
    setTimerNowMs(Date.now());
    onQuestionIndexChange?.(0);
  }

  return (
    <div className="study-panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">{typeLabel}</p>
          <h2>Latihan kuis</h2>
        </div>
        <div
          className={timerRunning ? "quiz-timer running" : "quiz-timer stopped"}
          aria-label={`Timer ${timerStateLabel}: ${timerValue}`}
        >
          <strong>{timerValue}</strong>
        </div>
        <button className="ghost-button" type="button" onClick={resetAttempt}>
          <RotateCcw size={17} aria-hidden="true" />
          Ulang
        </button>
      </div>

      {showIntro ? (
        <section className="quiz-intro" aria-labelledby="quiz-intro-title">
          <div>
            <h3 id="quiz-intro-title">Siap mulai latihan?</h3>
          </div>
          <div className="quiz-intro-meta" aria-label="Ringkasan kuis">
            <span>{quiz.questions.length} soal</span>
            <span>{typeLabel}</span>
          </div>
          <button className="primary-button" type="button" onClick={startQuiz}>
            Mulai kuis
          </button>
        </section>
      ) : (
        <>
          <div className="progress-strip" aria-label="Progres kuis">
            <span style={{ width: `${(answeredCount / quiz.questions.length) * 100}%` }} />
          </div>

          <div className="score-line">
            <span>
              {answeredCount}/{quiz.questions.length} terjawab
            </span>
            <strong>{isComplete ? `${percentage}%` : `${score} benar`}</strong>
          </div>
        </>
      )}

      {!showIntro && isComplete ? (
        <QuizFinishPage
          attempt={attempt}
          passingScore={quiz.settings?.passingScore ?? 70}
          percentage={percentage}
          questions={quiz.questions}
          score={score}
          onRestart={resetAttempt}
        />
      ) : !showIntro && questionMode === "single" && currentQuestion ? (
        <div className="question-flow">
          <QuestionView
            question={currentQuestion}
            selectedAnswer={attempt.answers[currentQuestion.id]}
            onAnswer={answerQuestion}
            autoFocusInput={disableQuestionNavigation}
          />

          {!disableQuestionNavigation ? (
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
                disabled={
                  currentQuestionIndex === quiz.questions.length - 1 ||
                  (requireAnswerBeforeNext && !currentQuestionAnswered)
                }
              >
                Berikutnya
                <ChevronRight size={17} aria-hidden="true" />
              </button>
            </div>
          ) : null}
        </div>
      ) : !showIntro ? (
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
      ) : null}
    </div>
  );
}

function getStopwatchElapsedMs(startIso?: string, completedIso?: string, nowMs = Date.now()) {
  if (!startIso) return 0;

  const startMs = new Date(startIso).getTime();
  const endMs = completedIso ? new Date(completedIso).getTime() : nowMs;

  if (!Number.isFinite(startMs) || !Number.isFinite(endMs)) return 0;

  return Math.max(0, endMs - startMs);
}

function formatStopwatchDuration(milliseconds: number) {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (value: number) => value.toString().padStart(2, "0");

  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}
