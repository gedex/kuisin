import type { QuizQuestion } from "../../types";
import { MultipleChoiceQuestionView } from "./MultipleChoiceQuestionView";
import type { AnswerHandler } from "./questionViewTypes";
import { ShortAnswerQuestionView } from "./ShortAnswerQuestionView";
import { TrueFalseQuestionView } from "./TrueFalseQuestionView";
import "./QuestionView.css";

type QuestionViewProps = {
  question: QuizQuestion;
  selectedAnswer?: string;
  onAnswer: AnswerHandler;
  autoFocusInput?: boolean;
  shuffleChoices?: boolean;
  choiceShuffleSeed?: string;
};

export function QuestionView({
  question,
  selectedAnswer,
  onAnswer,
  autoFocusInput = false,
  shuffleChoices = false,
  choiceShuffleSeed,
}: QuestionViewProps) {
  switch (question.type) {
    case "multiple-choice":
      return (
        <MultipleChoiceQuestionView
          question={question}
          selectedChoiceId={selectedAnswer}
          onAnswer={onAnswer}
          shuffleChoices={shuffleChoices}
          choiceShuffleSeed={choiceShuffleSeed}
        />
      );
    case "true-false":
      return (
        <TrueFalseQuestionView
          question={question}
          selectedAnswer={selectedAnswer}
          onAnswer={onAnswer}
        />
      );
    case "short-answer":
      return (
        <ShortAnswerQuestionView
          question={question}
          selectedAnswer={selectedAnswer}
          onAnswer={onAnswer}
          autoFocus={autoFocusInput}
        />
      );
  }
}
