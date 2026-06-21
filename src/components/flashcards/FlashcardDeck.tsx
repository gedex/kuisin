import { Check, ChevronLeft, ChevronRight, RotateCcw, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useLocalStorageState } from "../../lib/storage";
import type { Flashcard, FlashcardProgress } from "../../types";
import "./FlashcardDeck.css";

type Props = {
  cards: Flashcard[];
  slug: string;
};

export function FlashcardDeck({ cards, slug }: Props) {
  const [flipped, setFlipped] = useState(false);
  const [progress, setProgress] = useLocalStorageState<FlashcardProgress>(
    `kuisin:flashcards:${slug}`,
    { currentIndex: 0, knownCardIds: [], reviewedCardIds: [] },
  );

  const safeIndex = Math.min(progress.currentIndex, Math.max(cards.length - 1, 0));
  const card = cards[safeIndex];
  const knownSet = useMemo(
    () => new Set(progress.knownCardIds),
    [progress.knownCardIds],
  );
  const reviewedSet = useMemo(
    () => new Set(progress.reviewedCardIds),
    [progress.reviewedCardIds],
  );

  function moveTo(index: number) {
    setFlipped(false);
    setProgress((current) => ({
      ...current,
      currentIndex: Math.min(Math.max(index, 0), cards.length - 1),
    }));
  }

  function markCard(known: boolean) {
    if (!card) return;

    setProgress((current) => {
      const nextKnown = new Set(current.knownCardIds);
      const nextReviewed = new Set(current.reviewedCardIds);
      nextReviewed.add(card.id);

      if (known) {
        nextKnown.add(card.id);
      } else {
        nextKnown.delete(card.id);
      }

      return {
        ...current,
        knownCardIds: Array.from(nextKnown),
        reviewedCardIds: Array.from(nextReviewed),
      };
    });
  }

  function resetProgress() {
    setFlipped(false);
    setProgress({ currentIndex: 0, knownCardIds: [], reviewedCardIds: [] });
  }

  if (!card) {
    return (
      <div className="study-panel">
        <div className="state-panel">
          <p>Belum ada kartu untuk kuis ini.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="study-panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Kartu belajar</p>
          <h2>Ingat lewat bolak-balik</h2>
        </div>
        <button className="ghost-button" type="button" onClick={resetProgress}>
          <RotateCcw size={17} aria-hidden="true" />
          Reset
        </button>
      </div>

      <div className="progress-strip" aria-label="Progres kartu">
        <span style={{ width: `${(reviewedSet.size / cards.length) * 100}%` }} />
      </div>

      <div className="score-line">
        <span>
          {safeIndex + 1}/{cards.length} kartu
        </span>
        <strong>{knownSet.size} ingat</strong>
      </div>

      <button
        type="button"
        className={flipped ? "flashcard flipped" : "flashcard"}
        onClick={() => setFlipped((value) => !value)}
      >
        <span className="flashcard-face flashcard-front">
          <small>Depan</small>
          <strong>{card.front}</strong>
          {card.hint ? <em>{card.hint}</em> : null}
        </span>
        <span className="flashcard-face flashcard-back">
          <small>Belakang</small>
          <strong>{card.back}</strong>
        </span>
      </button>

      <div className="flashcard-actions">
        <button
          type="button"
          className="icon-button"
          onClick={() => moveTo(safeIndex - 1)}
          disabled={safeIndex === 0}
          aria-label="Kartu sebelumnya"
          title="Kartu sebelumnya"
        >
          <ChevronLeft size={18} aria-hidden="true" />
        </button>
        <button type="button" className="soft-button" onClick={() => markCard(false)}>
          <X size={17} aria-hidden="true" />
          Ulangi
        </button>
        <button type="button" className="primary-button" onClick={() => markCard(true)}>
          <Check size={17} aria-hidden="true" />
          Ingat
        </button>
        <button
          type="button"
          className="icon-button"
          onClick={() => moveTo(safeIndex + 1)}
          disabled={safeIndex === cards.length - 1}
          aria-label="Kartu berikutnya"
          title="Kartu berikutnya"
        >
          <ChevronRight size={18} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
