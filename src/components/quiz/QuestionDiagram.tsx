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
    case "angle":
      return <AngleDiagram diagram={diagram} />;
    case "parallel-lines":
      return <ParallelLinesDiagram diagram={diagram} />;
    case "quadrilateral":
      return <QuadrilateralDiagram diagram={diagram} />;
    case "circle":
      return <CircleDiagram diagram={diagram} />;
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

function AngleDiagram({
  diagram,
}: {
  diagram: Extract<QuestionDiagramType, { type: "angle" }>;
}) {
  return (
    <figure
      className="question-diagram angle-diagram"
      aria-label={diagram.title ?? "Diagram sudut"}
    >
      <svg viewBox="0 0 320 220" role="img" aria-hidden="true" focusable="false">
        <path className="diagram-line" d="M76 166 H264 M76 166 L230 58" />
        <path className="diagram-accent-line" d="M116 166 A42 42 0 0 1 110 140" />
        <circle className="diagram-point" cx="76" cy="166" r="5" />
      </svg>

      <DiagramLabel className="angle-vertex-label" text={diagram.vertexLabel} />
      <DiagramLabel className="angle-first-ray-label" text={diagram.firstRayLabel} />
      <DiagramLabel className="angle-second-ray-label" text={diagram.secondRayLabel} />
      <DiagramLabel className="angle-angle-label" text={diagram.angleLabel} />
      <DiagramLabel className="diagram-question-label" text={diagram.questionLabel} />
    </figure>
  );
}

function ParallelLinesDiagram({
  diagram,
}: {
  diagram: Extract<QuestionDiagramType, { type: "parallel-lines" }>;
}) {
  return (
    <figure
      className="question-diagram parallel-lines-diagram"
      aria-label={diagram.title ?? "Diagram garis sejajar"}
    >
      <svg viewBox="0 0 320 220" role="img" aria-hidden="true" focusable="false">
        <path className="diagram-line" d="M44 78 H276 M44 154 H276" />
        <path className="diagram-muted-line" d="M112 34 L214 190" />
        <path className="diagram-accent-line" d="M112 78 A34 34 0 0 1 132 62" />
        <path className="diagram-accent-line" d="M178 154 A34 34 0 0 1 198 138" />
      </svg>

      <DiagramLabel className="parallel-top-label" text={diagram.topLineLabel} />
      <DiagramLabel className="parallel-bottom-label" text={diagram.bottomLineLabel} />
      <DiagramLabel className="parallel-transversal-label" text={diagram.transversalLabel} />
      <DiagramLabel className="parallel-upper-angle-label" text={diagram.upperAngleLabel} />
      <DiagramLabel className="parallel-lower-angle-label" text={diagram.lowerAngleLabel} />
      <DiagramLabel className="diagram-question-label" text={diagram.questionLabel} />
    </figure>
  );
}

function QuadrilateralDiagram({
  diagram,
}: {
  diagram: Extract<QuestionDiagramType, { type: "quadrilateral" }>;
}) {
  return (
    <figure
      className="question-diagram quadrilateral-diagram"
      aria-label={diagram.title ?? "Diagram segi empat"}
    >
      <svg viewBox="0 0 320 220" role="img" aria-hidden="true" focusable="false">
        <polygon className="diagram-face primary-face" points="86,58 236,58 264,166 58,166" />
        <path className="diagram-line" d="M86 58 H236 L264 166 H58 Z" />
        <path className="diagram-muted-line" d="M86 58 L264 166" />
      </svg>

      <DiagramLabel className="quad-label-a" text={diagram.pointLabels?.a ?? "A"} />
      <DiagramLabel className="quad-label-b" text={diagram.pointLabels?.b ?? "B"} />
      <DiagramLabel className="quad-label-c" text={diagram.pointLabels?.c ?? "C"} />
      <DiagramLabel className="quad-label-d" text={diagram.pointLabels?.d ?? "D"} />
      <DiagramLabel className="quad-top-label" text={diagram.topLabel} />
      <DiagramLabel className="quad-right-label" text={diagram.rightLabel} />
      <DiagramLabel className="quad-bottom-label" text={diagram.bottomLabel} />
      <DiagramLabel className="quad-left-label" text={diagram.leftLabel} />
      <DiagramLabel className="quad-diagonal-label" text={diagram.diagonalLabel} />
      <DiagramLabel className="diagram-question-label" text={diagram.questionLabel} />
    </figure>
  );
}

function CircleDiagram({
  diagram,
}: {
  diagram: Extract<QuestionDiagramType, { type: "circle" }>;
}) {
  return (
    <figure
      className="question-diagram circle-diagram"
      aria-label={diagram.title ?? "Diagram lingkaran"}
    >
      <svg viewBox="0 0 320 220" role="img" aria-hidden="true" focusable="false">
        <circle className="diagram-face primary-face" cx="160" cy="112" r="70" />
        <circle className="diagram-line" cx="160" cy="112" r="70" />
        <path className="diagram-accent-line" d="M160 112 L224 84" />
        <path className="diagram-line" d="M94 138 L214 168" />
        <path className="diagram-muted-line" d="M70 42 H250" />
        <circle className="diagram-point" cx="160" cy="112" r="4.5" />
      </svg>

      <DiagramLabel className="circle-center-label" text={diagram.centerLabel} />
      <DiagramLabel className="circle-radius-label" text={diagram.radiusLabel} />
      <DiagramLabel className="circle-chord-label" text={diagram.chordLabel} />
      <DiagramLabel className="circle-tangent-label" text={diagram.tangentLabel} />
      <DiagramLabel className="circle-angle-label" text={diagram.angleLabel} />
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
