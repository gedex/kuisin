export function LoadingState({ label }: { label: string }) {
  return (
    <div className="state-panel" role="status">
      <span className="loader" aria-hidden="true" />
      <p>{label}</p>
    </div>
  );
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div className="state-panel error" role="alert">
      <p>{message}</p>
    </div>
  );
}

export function EmptyState() {
  return (
    <div className="state-panel">
      <p>Tidak ada kuis yang cocok.</p>
    </div>
  );
}
