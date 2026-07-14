import { useMemo } from "react";
import { Check, X } from "lucide-react";
import type { Choice, MultipleChoiceQuestion } from "../../types";
import { QuestionDiagram } from "./QuestionDiagram";
import type { AnswerHandler } from "./questionViewTypes";
import { RichContent } from "./RichContent";

type MultipleChoiceQuestionViewProps = {
  question: MultipleChoiceQuestion;
  selectedChoiceId?: string;
  onAnswer: AnswerHandler;
  shuffleChoices?: boolean;
  choiceShuffleSeed?: string;
};

export function MultipleChoiceQuestionView({
  question,
  selectedChoiceId,
  onAnswer,
  shuffleChoices = false,
  choiceShuffleSeed = "",
}: MultipleChoiceQuestionViewProps) {
  const hasAnswer = Boolean(selectedChoiceId);
  const isCorrect = selectedChoiceId === question.answer;
  const choices = useMemo(() => {
    if (!shuffleChoices) return question.choices;

    return shuffleChoicesBySeed(
      question.choices,
      `${choiceShuffleSeed}:${question.id}`,
    );
  }, [choiceShuffleSeed, question.choices, question.id, shuffleChoices]);

  return (
    <article className="question-block">
      <div className="question-title">
        <RichContent text={question.prompt} className="question-prompt" />
      </div>
      <QuestionDiagram diagram={question.diagram} />

      <div className="choice-list">
        {choices.map((choice) => {
          const selected = choice.id === selectedChoiceId;
          const correct = hasAnswer && choice.id === question.answer;
          const wrong = selected && !isCorrect;
          const flagChoice = isFlagEmojiChoice(choice.text);

          return (
            <button
              key={choice.id}
              type="button"
              className={[
                "choice-button",
                flagChoice ? "flag-choice-button" : "",
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

function shuffleChoicesBySeed(choices: Choice[], seed: string) {
  const shuffled = [...choices];
  const random = seededRandom(seed);

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled;
}

function seededRandom(seed: string) {
  let state = hashSeed(seed) || 0x6d2b79f5;

  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);

    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function hashSeed(seed: string) {
  let hash = 2166136261;

  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function isFlagEmojiChoice(text: string) {
  const codePoints = Array.from(text.trim());

  return (
    codePoints.length === 2 &&
    codePoints.every((codePoint) => {
      const value = codePoint.codePointAt(0);
      return value !== undefined && value >= 0x1f1e6 && value <= 0x1f1ff;
    })
  );
}
