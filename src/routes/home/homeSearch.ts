import type { SortKey } from "../../types";

export type HomeSearch = {
  page?: number;
  q?: string;
  sort?: SortKey;
  subject?: string;
  tags?: string;
};

export function parseHomeSearch(search: Record<string, unknown>): HomeSearch {
  return {
    page: parsePageNumber(search.page),
    q: parseSearchText(search.q),
    sort: parseSortKey(search.sort),
    subject: parseSearchText(search.subject),
    tags: parseTagsParam(search.tags),
  };
}

export function splitTags(value?: string) {
  return value
    ? value
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
    : [];
}

export function cleanHomeSearch(search: HomeSearch): HomeSearch {
  return {
    ...(search.q?.trim() ? { q: search.q.trim() } : {}),
    ...(search.subject && search.subject !== "semua" ? { subject: search.subject } : {}),
    ...(search.tags && splitTags(search.tags).length > 0
      ? { tags: splitTags(search.tags).join(",") }
      : {}),
    ...(search.sort && search.sort !== "title-az" ? { sort: search.sort } : {}),
    ...(search.page && search.page > 1 ? { page: search.page } : {}),
  };
}

function parseSearchText(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function parsePageNumber(value: unknown) {
  const parsed =
    typeof value === "number"
      ? value
      : typeof value === "string" && value.trim()
        ? Number(value)
        : undefined;

  return typeof parsed === "number" && Number.isInteger(parsed) && parsed > 0
    ? parsed
    : undefined;
}

function parseSortKey(value: unknown): SortKey | undefined {
  return value === "title-az" || value === "title-za" ? value : undefined;
}

function parseTagsParam(value: unknown) {
  if (typeof value !== "string") return undefined;

  const tags = splitTags(value);
  return tags.length > 0 ? tags.join(",") : undefined;
}
