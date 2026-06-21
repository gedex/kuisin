import { Check, X } from "lucide-react";
import type { TrueFalseQuestion } from "../../types";
import type { AnswerHandler } from "./questionViewTypes";
import { isCorrectAnswer } from "./quizUtils";

type TrueFalseQuestionViewProps = {
  question: TrueFalseQuestion;
  selectedAnswer?: string;
  onAnswer: AnswerHandler;
};

export function TrueFalseQuestionView({
  question,
  selectedAnswer,
  onAnswer,
}: TrueFalseQuestionViewProps) {
  const hasAnswer = Boolean(selectedAnswer);
  const isCorrect = isCorrectAnswer(question, selectedAnswer);

  return (
    <article className="question-block">
      <div className="question-title">
        <h3>{question.prompt}</h3>
      </div>

      <div className="true-false-list">
        {[
          { label: "Benar", value: "true" },
          { label: "Salah", value: "false" },
        ].map((choice) => {
          const selected = selectedAnswer === choice.value;
          const correct = hasAnswer && choice.value === String(question.answer);
          const wrong = selected && !isCorrect;

          return (
            <button
              key={choice.value}
              type="button"
              className={[
                "choice-button",
                selected ? "selected" : "",
                correct ? "correct" : "",
                wrong ? "wrong" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() => onAnswer(question.id, choice.value)}
            >
              <span>{choice.label}</span>
              {correct ? <Check size={18} aria-hidden="true" /> : null}
              {wrong ? <X size={18} aria-hidden="true" /> : null}
            </button>
          );
        })}
      </div>

      {hasAnswer && question.explanation ? (
        <p className={isCorrect ? "explanation correct" : "explanation wrong"}>
          {question.explanation}
        </p>
      ) : null}
    </article>
  );
}
