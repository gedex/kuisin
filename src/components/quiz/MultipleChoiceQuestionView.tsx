import { Check, X } from "lucide-react";
import type { MultipleChoiceQuestion } from "../../types";
import { QuestionDiagram } from "./QuestionDiagram";
import type { AnswerHandler } from "./questionViewTypes";
import { RichContent } from "./RichContent";

type MultipleChoiceQuestionViewProps = {
  question: MultipleChoiceQuestion;
  selectedChoiceId?: string;
  onAnswer: AnswerHandler;
};

export function MultipleChoiceQuestionView({
  question,
  selectedChoiceId,
  onAnswer,
}: MultipleChoiceQuestionViewProps) {
  const hasAnswer = Boolean(selectedChoiceId);
  const isCorrect = selectedChoiceId === question.answer;

  return (
    <article className="question-block">
      <div className="question-title">
        <RichContent text={question.prompt} className="question-prompt" />
      </div>
      <QuestionDiagram diagram={question.diagram} />

      <div className="choice-list">
        {question.choices.map((choice) => {
          const selected = choice.id === selectedChoiceId;
          const correct = hasAnswer && choice.id === question.answer;
          const wrong = selected && !isCorrect;

          return (
            <button
              key={choice.id}
              type="button"
              className={[
                "choice-button",
                selected ? "selected" : "",
                correct ? "correct" : "",
                wrong ? "wrong" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() => onAnswer(question.id, choice.id)}
            >
              <RichContent text={choice.text} inline />
              {correct ? <Check size={18} aria-hidden="true" /> : null}
              {wrong ? <X size={18} aria-hidden="true" /> : null}
            </button>
          );
        })}
      </div>

      {hasAnswer && question.explanation ? (
        <div className={isCorrect ? "explanation correct" : "explanation wrong"}>
          <RichContent text={question.explanation} />
        </div>
      ) : null}
    </article>
  );
}
