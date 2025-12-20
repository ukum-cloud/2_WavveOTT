// src/api/tmdbTV.ts
const API_KEY = import.meta.env.VITE_TMDB_API_KEY as string;
const BASE_URL = "https://api.themoviedb.org/3";

const fetchJson = async <T>(url: string): Promise<T | null> => {
  const res = await fetch(url);
  if (!res.ok) return null;
  return (await res.json()) as T;
};

// ====== Types (최소) ======
export type Genre = { id: number; name: string };

export type DiscoverTvItem = {
  id: number;
  name: string;
  first_air_date?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  overview?: string;
  vote_average?: number;
  genre_ids?: number[];
};

export type PagedResponse<T> = {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
};

// ====== APIs ======

// 1) TV 장르 목록
export const fetchTvGenres = async (): Promise<Genre[]> => {
  const data = await fetchJson<{ genres: Genre[] }>(
    `${BASE_URL}/genre/tv/list?api_key=${API_KEY}&language=ko-KR`
  );
  return data?.genres ?? [];
};

// 2) Discover TV (정렬/장르/페이지)
export const fetchDiscoverTv = async (opts?: {
  page?: number;
  sortBy?: string;      // 예: "popularity.desc" | "vote_average.desc" | "first_air_date.desc"
  withGenres?: number;  // genre id
  includeAdult?: boolean;
}): Promise<PagedResponse<DiscoverTvItem> | null> => {
  const page = opts?.page ?? 1;
  const sortBy = opts?.sortBy ?? "popularity.desc";
  const withGenres = typeof opts?.withGenres === "number" ? `&with_genres=${opts.withGenres}` : "";
  const adult = opts?.includeAdult ? "true" : "false";

  return fetchJson<PagedResponse<DiscoverTvItem>>(
    `${BASE_URL}/discover/tv?api_key=${API_KEY}&language=ko-KR&include_adult=${adult}&page=${page}&sort_by=${sortBy}${withGenres}`
  );
};

// 3) Trending TV
export const fetchTrendingTv = async (timeWindow: "day" | "week" = "day") => {
  const data = await fetchJson<{ results: DiscoverTvItem[] }>(
    `${BASE_URL}/trending/tv/${timeWindow}?api_key=${API_KEY}&language=ko-KR`
  );
  return data?.results ?? [];
};

// 4) TV 검색 (필요할 때)
export const searchTv = async (keyword: string, page = 1) => {
  const q = keyword.trim();
  if (!q) return null;
  const query = encodeURIComponent(q);

  return fetchJson<PagedResponse<DiscoverTvItem>>(
    `${BASE_URL}/search/tv?api_key=${API_KEY}&language=ko-KR&query=${query}&page=${page}&include_adult=false`
  );
};
