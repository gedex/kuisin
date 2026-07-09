import { RotateCcw } from "lucide-react";
import type { QuizAttempt, QuizQuestion } from "../../types";
import {
  formatDuration,
  formatQuestionMetric,
  getFastestResult,
  getQuestionResult,
  getQuestionTypeInsight,
  getSlowestResult,
  getTotalTimeMs,
  type QuestionResult,
} from "./quizUtils";
import { RichContent } from "./RichContent";
import "./QuizFinishPage.css";

type QuizFinishPageProps = {
  attempt: QuizAttempt;
  passingScore: number;
  percentage: number;
  questions: QuizQuestion[];
  score: number;
  onRestart: () => void;
};

export function QuizFinishPage({
  attempt,
  passingScore,
  percentage,
  questions,
  score,
  onRestart,
}: QuizFinishPageProps) {
  const results = questions.map((question, index) =>
    getQuestionResult(question, index, attempt),
  );
  const incorrectResults = results.filter((result) => !result.correct);
  const totalTimeMs = getTotalTimeMs(attempt, results);
  const averageTimeMs = results.length > 0 ? totalTimeMs / results.length : 0;
  const fastestResult = getFastestResult(results);
  const slowestResult = getSlowestResult(results);
  const typeInsight = getQuestionTypeInsight(results);
  const passed = percentage >= passingScore;

  return (
    <div className="finish-page">
      <div className="finish-hero">
        <div>
          <p className="eyebrow">Selesai</p>
          <h3>{passed ? "Latihan tuntas." : "Latihan selesai."}</h3>
          <p>
            {passed
              ? "Bagus, kamu sudah melewati batas kelulusan latihan ini."
              : "Cek lagi bagian yang salah, lalu coba ulangi saat siap."}
          </p>
        </div>
        <div className="finish-score" aria-label={`Skor ${percentage} persen`}>
          <strong>{percentage}%</strong>
          <span>{score}/{questions.length}</span>
        </div>
      </div>

      <div className="finish-metrics" aria-label="Ringkasan hasil">
        <Metric label="Benar" value={score.toString()} tone="good" />
        <Metric label="Salah" value={incorrectResults.length.toString()} tone="bad" />
        <Metric label="Durasi" value={formatDuration(totalTimeMs)} />
        <Metric label="Rata-rata" value={formatDuration(averageTimeMs)} />
        <Metric label="Tercepat" value={formatQuestionMetric(fastestResult)} />
        <Metric label="Terlama" value={formatQuestionMetric(slowestResult)} />
      </div>

      <div className="finish-insight">
        <span>Fokus berikutnya</span>
        <strong>{typeInsight}</strong>
      </div>

      <section className="finish-section" aria-labelledby="time-chart-title">
        <div className="finish-section-heading">
          <div>
            <p className="eyebrow">Waktu per soal</p>
            <h3 id="time-chart-title">Lihat titik yang paling lama.</h3>
          </div>
          <span>{formatDuration(totalTimeMs)} total</span>
        </div>
        <TimeChart results={results} />
      </section>

      <section className="finish-section" aria-labelledby="answer-review-title">
        <div className="finish-section-heading">
          <div>
            <p className="eyebrow">Review jawaban</p>
            <h3 id="answer-review-title">
              {incorrectResults.length === 0 ? "Semua jawaban benar." : "Yang perlu dicek lagi."}
            </h3>
          </div>
          <span>
            {score} benar, {incorrectResults.length} salah
          </span>
        </div>

        {incorrectResults.length === 0 ? (
          <p className="finish-note">Tidak ada jawaban yang salah pada latihan ini.</p>
        ) : (
          <div className="finish-review-list">
            {incorrectResults.map((result) => (
              <AnswerReviewItem key={result.question.id} result={result} />
            ))}
          </div>
        )}
      </section>

      <div className="finish-actions">
        <button className="primary-button" type="button" onClick={onRestart}>
          <RotateCcw size={17} aria-hidden="true" />
          Ulangi latihan
        </button>
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "good" | "bad";
}) {
  return (
    <div className={tone ? `finish-metric ${tone}` : "finish-metric"}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function TimeChart({ results }: { results: QuestionResult[] }) {
  const maxDurationMs = Math.max(1, ...results.map((result) => result.durationMs));

  return (
    <div className="time-chart" role="list">
      {results.map((result) => {
        const width = Math.max(4, (result.durationMs / maxDurationMs) * 100);

        return (
          <div
            key={result.question.id}
            className={result.correct ? "time-row correct" : "time-row wrong"}
            role="listitem"
            aria-label={`Soal ${result.index + 1}, ${result.typeLabel}, ${formatDuration(
              result.durationMs,
            )}, ${result.correct ? "benar" : "salah"}`}
          >
            <span className="time-question">Soal {result.index + 1}</span>
            <span className="time-type">{result.typeLabel}</span>
            <span className="time-track">
              <span style={{ width: `${width}%` }} />
            </span>
            <strong>{formatDuration(result.durationMs)}</strong>
          </div>
        );
      })}
    </div>
  );
}

function AnswerReviewItem({ result }: { result: QuestionResult }) {
  return (
    <article className="finish-review-item">
      <div className="finish-review-top">
        <span>Soal {result.index + 1}</span>
        <strong>Salah</strong>
      </div>
      <RichContent text={result.question.prompt} className="finish-review-prompt" />
      <div className="finish-answer-grid">
        <div>
          <span>Jawabanmu</span>
          <strong>
            <RichContent text={result.answerText} inline />
          </strong>
        </div>
        <div>
          <span>Kunci</span>
          <strong>
            <RichContent text={result.correctAnswerText} inline />
          </strong>
        </div>
      </div>
      {result.explanation ? (
        <div className="finish-explanation">
          <RichContent text={result.explanation} />
        </div>
      ) : null}
    </article>
  );
}
