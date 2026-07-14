import { Link, useNavigate, useParams, useSearch } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { FlashcardDeck } from "../../components/flashcards/FlashcardDeck";
import { QuizRunner } from "../../components/quiz/QuizRunner";
import { ErrorState, LoadingState } from "../../components/ui/RouteState";
import { fetchQuizDetail } from "../../lib/data";
import { clampQuestionNumber } from "./quizSearch";
import "./QuizPage.css";

export function QuizPage() {
  const { slug } = useParams({ from: "/kuis/$slug" });
  const search = useSearch({ from: "/kuis/$slug" });
  const navigate = useNavigate({ from: "/kuis/$slug" });
  const [mode, setMode] = useState<"quiz" | "flashcards">("quiz");
  const quizQuery = useQuery({
    queryKey: ["quiz-detail", slug],
    queryFn: () => fetchQuizDetail(slug),
  });
  const questionMode = quizQuery.data?.quiz.settings?.questionMode;
  const questionCount = quizQuery.data?.quiz.questions.length ?? 0;
  const routedQuestionIndex = search.soal ? search.soal - 1 : undefined;

  useEffect(() => {
    if (questionMode !== "single" || !questionCount || !search.soal) return;

    const clampedQuestionNumber = clampQuestionNumber(search.soal, questionCount);
    if (clampedQuestionNumber === search.soal) return;

    void navigate({
      replace: true,
      resetScroll: false,
      search: (previous) => ({
        ...previous,
        soal: clampedQuestionNumber,
      }),
    });
  }, [navigate, questionCount, questionMode, search.soal]);

  function navigateToQuestion(index: number) {
    void navigate({
      resetScroll: false,
      search: (previous) => ({
        ...previous,
        soal: index + 1,
      }),
    });
  }

  if (quizQuery.isLoading) {
    return <LoadingState label="Memuat kuis..." />;
  }

  if (quizQuery.isError || !quizQuery.data) {
    return (
      <section className="detail-view">
        <Link className="back-link" to="/">
          <ArrowLeft size={18} aria-hidden="true" />
          Kembali
        </Link>
        <ErrorState message="Kuis ini belum bisa dimuat. Pastikan file JSON slug ini tersedia." />
      </section>
    );
  }

  const quiz = quizQuery.data;

  return (
    <section className="detail-view">
      <Link className="back-link" to="/">
        <ArrowLeft size={18} aria-hidden="true" />
        Kembali
      </Link>

      <div className="detail-header">
        <div>
          <p className="eyebrow">{quiz.subject}</p>
          <h1>{quiz.title}</h1>
          <p>{quiz.description}</p>
          <div className="tag-row">
            {quiz.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="mode-tabs" role="tablist" aria-label="Mode belajar">
        <button
          type="button"
          role="tab"
          aria-selected={mode === "quiz"}
          className={mode === "quiz" ? "active" : ""}
          onClick={() => setMode("quiz")}
        >
          Kuis
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === "flashcards"}
          className={mode === "flashcards" ? "active" : ""}
          onClick={() => setMode("flashcards")}
        >
          Materi
        </button>
      </div>

      {mode === "quiz" ? (
        <QuizRunner
          quiz={quiz.quiz}
          slug={quiz.slug}
          questionIndex={routedQuestionIndex}
          onQuestionIndexChange={navigateToQuestion}
        />
      ) : (
        <FlashcardDeck cards={quiz.flashcards} slug={quiz.slug} />
      )}
    </section>
  );
}
