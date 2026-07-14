import { type FormEvent, useEffect, useRef, useState } from "react";
import type { ShortAnswerQuestion } from "../../types";
import { QuestionDiagram } from "./QuestionDiagram";
import type { AnswerHandler } from "./questionViewTypes";
import { getCorrectAnswerText, isCorrectAnswer } from "./quizUtils";
import { RichContent } from "./RichContent";

type ShortAnswerQuestionViewProps = {
  question: ShortAnswerQuestion;
  selectedAnswer?: string;
  onAnswer: AnswerHandler;
  autoFocus?: boolean;
};

export function ShortAnswerQuestionView({
  question,
  selectedAnswer,
  onAnswer,
  autoFocus = false,
}: ShortAnswerQuestionViewProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [draft, setDraft] = useState(selectedAnswer ?? "");
  const hasAnswer = Boolean(selectedAnswer);
  const isCorrect = isCorrectAnswer(question, selectedAnswer);

  useEffect(() => {
    setDraft(selectedAnswer ?? "");
  }, [selectedAnswer]);

  useEffect(() => {
    if (!autoFocus || selectedAnswer) return;

    inputRef.current?.focus();
  }, [autoFocus, question.id, selectedAnswer]);

  function submitAnswer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const answer = draft.trim();
    if (!answer) return;

    onAnswer(question.id, answer);
  }

  return (
    <article className="question-block">
      <div className="question-title">
        <RichContent text={question.prompt} className="question-prompt" />
      </div>
      <QuestionDiagram diagram={question.diagram} />

      <form className="short-answer-form" onSubmit={submitAnswer}>
        <input
          ref={inputRef}
          type={question.inputType ?? "text"}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Tulis jawaban singkat..."
          aria-label="Jawaban singkat"
        />
        <button className="primary-button" type="submit" disabled={!draft.trim()}>
          Jawab
        </button>
      </form>

      {hasAnswer ? (
        <div className={isCorrect ? "explanation correct" : "explanation wrong"}>
          <RichContent
            text={
              isCorrect
                ? question.explanation ?? "Jawaban benar."
                : question.explanation
                  ? `${question.explanation} Kunci: ${getCorrectAnswerText(question)}.`
                  : `Kunci: ${getCorrectAnswerText(question)}.`
            }
          />
        </div>
      ) : null}
    </article>
  );
}
