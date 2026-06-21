import type { QuizDetail, QuizIndex } from "../types";

const basePath = import.meta.env.BASE_URL || "/";

function assetUrl(path: string) {
  const cleanBase = basePath.endsWith("/") ? basePath : `${basePath}/`;
  const cleanPath = path.replace(/^\.\//, "").replace(/^\//, "");

  return `${cleanBase}${cleanPath}`;
}

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(assetUrl(path), {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Gagal memuat ${path} (${response.status})`);
  }

  return response.json() as Promise<T>;
}

export function getQuizDataFile(slug: string) {
  return `./kuis/${slug}.json`;
}

export function fetchQuizIndex() {
  return fetchJson<QuizIndex>("./kuis/index.json");
}

export function fetchQuizDetail(slug: string) {
  return fetchJson<QuizDetail>(getQuizDataFile(slug));
}
