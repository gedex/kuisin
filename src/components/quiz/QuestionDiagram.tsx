import type { QuestionDiagram as QuestionDiagramType } from "../../types";
import { RichContent } from "./RichContent";

type QuestionDiagramProps = {
  diagram?: QuestionDiagramType;
};

export function QuestionDiagram({ diagram }: QuestionDiagramProps) {
  if (!diagram) return null;

  switch (diagram.type) {
    case "triangle":
      return <TriangleDiagram diagram={diagram} />;
    case "cube":
      return <CubeDiagram diagram={diagram} />;
  }
}

function TriangleDiagram({
  diagram,
}: {
  diagram: Extract<QuestionDiagramType, { type: "triangle" }>;
}) {
  return (
    <figure
      className="question-diagram triangle-diagram"
      aria-label={diagram.title ?? "Diagram segitiga"}
    >
      <svg viewBox="0 0 320 220" role="img" aria-hidden="true" focusable="false">
        <polygon className="diagram-face primary-face" points="160,34 56,176 264,176" />
        <path className="diagram-line" d="M160 34 L56 176 L264 176 Z" />
        <path className="diagram-accent-line" d="M145 55 Q160 70 175 55" />
      </svg>

      <DiagramLabel className="triangle-label-a" text={diagram.pointLabels?.a ?? "A"} />
      <DiagramLabel className="triangle-label-b" text={diagram.pointLabels?.b ?? "B"} />
      <DiagramLabel className="triangle-label-c" text={diagram.pointLabels?.c ?? "C"} />
      <DiagramLabel className="triangle-angle-label" text={diagram.angleLabel} />
      <DiagramLabel className="triangle-left-label" text={diagram.leftLabel} />
      <DiagramLabel className="triangle-right-label" text={diagram.rightLabel} />
      <DiagramLabel className="triangle-base-label" text={diagram.baseLabel} />
      <DiagramLabel className="diagram-question-label" text={diagram.questionLabel} />
    </figure>
  );
}

function CubeDiagram({
  diagram,
}: {
  diagram: Extract<QuestionDiagramType, { type: "cube" }>;
}) {
  return (
    <figure
      className="question-diagram cube-diagram"
      aria-label={diagram.title ?? "Diagram kubus"}
    >
      <svg viewBox="0 0 320 220" role="img" aria-hidden="true" focusable="false">
        <polygon className="diagram-face primary-face" points="82,82 202,82 202,180 82,180" />
        <polygon className="diagram-face secondary-face" points="118,42 238,42 202,82 82,82" />
        <polygon className="diagram-face tertiary-face" points="202,82 238,42 238,140 202,180" />
        <path
          className="diagram-line"
          d="M82 82 H202 V180 H82 Z M118 42 H238 V140 L202 180 M118 42 L82 82 M238 42 L202 82"
        />
        <path className="diagram-muted-line" d="M118 42 V140 H238 M118 140 L82 180" />
      </svg>

      <DiagramLabel className="cube-edge-label" text={diagram.edgeLabel} />
      <DiagramLabel className="cube-face-label" text={diagram.faceLabel} />
      <DiagramLabel className="diagram-question-label" text={diagram.questionLabel} />
    </figure>
  );
}

function DiagramLabel({ className, text }: { className: string; text?: string }) {
  if (!text) return null;

  return (
    <span className={`diagram-label ${className}`}>
      <RichContent text={text} inline />
    </span>
  );
}
