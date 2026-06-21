import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { useEffect, useMemo } from "react";
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "../../components/ui/RouteState";
import { fetchQuizIndex } from "../../lib/data";
import type { QuizIndexItem, SortKey } from "../../types";
import { cleanHomeSearch, splitTags, type HomeSearch } from "./homeSearch";
import "./HomePage.css";

const pageSize = 20;

export function HomePage() {
  const search = useSearch({ from: "/" });
  const navigate = useNavigate({ from: "/" });
  const query = search.q ?? "";
  const subject = search.subject ?? "semua";
  const activeTags = useMemo(() => splitTags(search.tags), [search.tags]);
  const sort = search.sort ?? "title-az";
  const page = search.page ?? 1;
  const indexQuery = useQuery({
    queryKey: ["quiz-index"],
    queryFn: fetchQuizIndex,
  });

  const quizzes = indexQuery.data?.items ?? [];
  const subjects = useMemo(
    () => Array.from(new Set(quizzes.map((quiz) => quiz.subject))).sort(),
    [quizzes],
  );
  const tags = useMemo(
    () => Array.from(new Set(quizzes.flatMap((quiz) => quiz.tags))).sort(),
    [quizzes],
  );

  const filteredQuizzes = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const filtered = quizzes.filter((quiz) => {
      const matchesQuery =
        !normalizedQuery ||
        [quiz.title, quiz.description, quiz.subject, ...quiz.tags]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);
      const matchesSubject = subject === "semua" || quiz.subject === subject;
      const matchesTags =
        activeTags.length === 0 ||
        activeTags.every((tag) => quiz.tags.includes(tag));

      return matchesQuery && matchesSubject && matchesTags;
    });

    return filtered.sort((a, b) =>
      sort === "title-az"
        ? a.title.localeCompare(b.title, "id")
        : b.title.localeCompare(a.title, "id"),
    );
  }, [activeTags, query, quizzes, sort, subject]);

  const pageCount = Math.max(1, Math.ceil(filteredQuizzes.length / pageSize));
  const normalizedPage = Math.min(page, pageCount);
  const visibleQuizzes = filteredQuizzes.slice(
    (normalizedPage - 1) * pageSize,
    normalizedPage * pageSize,
  );

  useEffect(() => {
    if (page === normalizedPage) return;

    void navigate({
      replace: true,
      search: (previous) =>
        cleanHomeSearch({
          ...previous,
          page: normalizedPage,
        }),
    });
  }, [navigate, normalizedPage, page]);

  function updateHomeSearch(nextSearch: Partial<HomeSearch>, replace = false) {
    void navigate({
      replace,
      search: (previous) =>
        cleanHomeSearch({
          ...previous,
          ...nextSearch,
        }),
    });
  }

  function toggleTag(tag: string) {
    const nextTags = activeTags.includes(tag)
      ? activeTags.filter((activeTag) => activeTag !== tag)
      : [...activeTags, tag];

    updateHomeSearch({ tags: nextTags.join(","), page: 1 });
  }

  return (
    <section className="home-view">
      <div className="toolbar">
        <label className="search-field">
          <Search size={18} aria-hidden="true" />
          <span className="sr-only">Cari kuis</span>
          <input
            value={query}
            onChange={(event) => {
              updateHomeSearch({ q: event.target.value, page: 1 }, true);
            }}
            placeholder="Cari judul, deskripsi, tag..."
          />
        </label>

        <label className="select-field">
          <span>Subject</span>
          <select
            value={subject}
            onChange={(event) => {
              updateHomeSearch({ subject: event.target.value, page: 1 });
            }}
          >
            <option value="semua">Semua</option>
            {subjects.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label className="select-field">
          <span>Urut</span>
          <select
            value={sort}
            onChange={(event) =>
              updateHomeSearch({ sort: event.target.value as SortKey, page: 1 })
            }
          >
            <option value="title-az">Judul A-Z</option>
            <option value="title-za">Judul Z-A</option>
          </select>
        </label>
      </div>

      {tags.length > 0 ? (
        <div className="tag-filter" aria-label="Filter tag">
          <SlidersHorizontal size={18} aria-hidden="true" />
          {tags.map((tag) => (
            <button
              key={tag}
              className={activeTags.includes(tag) ? "chip active" : "chip"}
              onClick={() => toggleTag(tag)}
              type="button"
            >
              {tag}
            </button>
          ))}
        </div>
      ) : null}

      {indexQuery.isLoading ? <LoadingState label="Memuat daftar kuis..." /> : null}
      {indexQuery.isError ? (
        <ErrorState message="Daftar kuis belum bisa dimuat. Cek koneksi atau file JSON host." />
      ) : null}

      {!indexQuery.isLoading && !indexQuery.isError ? (
        <>
          <div className="result-line">
            <strong>{filteredQuizzes.length}</strong>
            <span>hasil ditemukan</span>
          </div>

          {visibleQuizzes.length > 0 ? (
            <div className="quiz-grid">
              {visibleQuizzes.map((quiz) => (
                <QuizCard key={quiz.slug} quiz={quiz} />
              ))}
            </div>
          ) : (
            <EmptyState />
          )}

          <Pagination
            page={normalizedPage}
            pageCount={pageCount}
            onPageChange={(nextPage) => updateHomeSearch({ page: nextPage })}
          />
        </>
      ) : null}
    </section>
  );
}

function QuizCard({ quiz }: { quiz: QuizIndexItem }) {
  return (
    <Link
      className="quiz-card"
      to="/kuis/$slug"
      params={{ slug: quiz.slug }}
      preload="intent"
    >
      <div className="quiz-card-top">
        <span>{quiz.subject}</span>
        <BookOpen size={18} aria-hidden="true" />
      </div>
      <h2>{quiz.title}</h2>
      <p>{quiz.description}</p>
      <div className="quiz-card-meta">
        <span>{quiz.questionCount} soal</span>
        {quiz.flashcardCount ? <span>{quiz.flashcardCount} kartu</span> : null}
      </div>
      <div className="tag-row">
        {quiz.tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
    </Link>
  );
}

function Pagination({
  page,
  pageCount,
  onPageChange,
}: {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
}) {
  if (pageCount <= 1) return null;

  return (
    <nav className="pagination" aria-label="Paginasi kuis">
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page === 1}
        aria-label="Halaman sebelumnya"
      >
        <ChevronLeft size={18} aria-hidden="true" />
      </button>
      <span>
        {page} / {pageCount}
      </span>
      <button
        type="button"
        onClick={() => onPageChange(Math.min(pageCount, page + 1))}
        disabled={page === pageCount}
        aria-label="Halaman berikutnya"
      >
        <ChevronRight size={18} aria-hidden="true" />
      </button>
    </nav>
  );
}
