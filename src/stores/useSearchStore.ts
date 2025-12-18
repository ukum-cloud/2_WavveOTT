// import { create } from "zustand";
// import type {
//   SearchText,
//   TmdbCollectionResponse,
//   TmdbMovieResponse,
//   TmdbPersonResponse,
//   SearchResultItem,
//   TmdbTrendingResponse,
// } from "../types/searchtodo";
// import { persist } from "zustand/middleware";

// const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

// if (!API_KEY) {
//   console.warn("VITE_TMDB_API_KEY is missing");
// }

// type SearchStore = SearchText & {
//   results: SearchResultItem[];
//   loading: boolean;
//   onFetchSearch: (query: string) => Promise<void>;
//   onClearResults: () => void;
//   trendingKeywords: string[];
//   onFetchTrendingKeywords: () => Promise<void>;
//   fetchSearchAndGetFirst: (query: string) => Promise<SearchResultItem | null>;
// };

// export const useSearchStore = create<SearchStore>()(
//   persist(
//     (set, get) => ({
//       todos: [],

//       //검색 기록 저장
//       onAddTextTodo: (text) => {
//         const trimmed = text.trim();
//         if (!trimmed) return;

//         set((state) => ({
//           todos: [
//             { id: Date.now(), text: trimmed },
//             ...state.todos.filter((t) => t.text !== trimmed),
//           ].slice(0, 20),
//         }));
//       },

//       //검색 기록을 선택해서 삭제
//       onRemoveTodos: (id) => {
//         set((state) => ({
//           todos: state.todos.filter((t) => t.id !== id),
//         }));
//       },

//       //검색 기록들 전부 삭제
//       onRemoveAll: () => set({ todos: [] }),

//       // 검색 결과
//       results: [],
//       loading: false,

//       onClearResults: () => set({ results: [], loading: false }),

//       // 검색 함수
//       onFetchSearch: async (query: string) => {
//         const trimmed = query.trim();
//         if (!API_KEY) {
//           set({ results: [], loading: false });
//           return;
//         }

//         if (!trimmed) {
//           set({ results: [], loading: false });
//           return;
//         }

//         set({ loading: true });

//         try {
//           const q = encodeURIComponent(trimmed);

//           const [cRes, mRes, pRes] = await Promise.all([
//             fetch(
//               `https://api.themoviedb.org/3/search/collection?api_key=${API_KEY}&include_adult=false&language=ko-KR&page=1&query=${q}`
//             ),
//             fetch(
//               `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&include_adult=false&language=ko-KR&page=1&query=${q}`
//             ),
//             fetch(
//               `https://api.themoviedb.org/3/search/person?api_key=${API_KEY}&include_adult=false&language=ko-KR&page=1&query=${q}`
//             ),
//           ]);

//           const [cData, mData, pData] = await Promise.all([
//             cRes.json() as Promise<TmdbCollectionResponse>,
//             mRes.json() as Promise<TmdbMovieResponse>,
//             pRes.json() as Promise<TmdbPersonResponse>,
//           ]);

//           const merged: SearchResultItem[] = [
//             ...mData.results.slice(0, 5).map((m) => ({
//               id: m.id,
//               kind: "movie" as const,
//               label: m.title,
//               overview: m.overview,
//               poster_path: m.poster_path ?? null,
//               backdrop_path: m.backdrop_path ?? null,
//             })),
//             ...cData.results.slice(0, 5).map((c) => ({
//               id: c.id,
//               kind: "collection" as const,
//               label: c.name,
//               overview: c.overview,
//               poster_path: c.poster_path ?? null,
//               backdrop_path: c.backdrop_path ?? null,
//             })),
//             ...pData.results.slice(0, 5).map((p) => ({
//               id: p.id,
//               kind: "person" as const,
//               label: p.name,
//               profile_path: p.profile_path ?? null,
//             })),
//           ];

//           const qLower = trimmed.toLowerCase();
//           merged.sort((a, b) => {
//             const A = a.label.toLowerCase();
//             const B = b.label.toLowerCase();
//             const aStarts = A.startsWith(qLower) ? 1 : 0;
//             const bStarts = B.startsWith(qLower) ? 1 : 0;
//             if (aStarts !== bStarts) return bStarts - aStarts;
//             return A.localeCompare(B);
//           });

//           set({ results: merged, loading: false });
//         } catch (err) {
//           console.error(err);
//           set({ results: [], loading: false });
//         }
//       },

//       trendingKeywords: [],

//       onFetchTrendingKeywords: async () => {
//         if (!API_KEY) {
//           set({ results: [], loading: false });
//           return;
//         }
//         const res = await fetch(
//           `https://api.themoviedb.org/3/trending/all/day?api_key=${API_KEY}&language=ko-KR`
//         );
//         const data: TmdbTrendingResponse = await res.json();

//         const keywords = data.results
//           .map((item) => {
//             if (item.media_type === "movie") return item.title;
//             if (item.media_type === "tv" || item.media_type === "person") return item.name;
//             return null;
//           })
//           .filter((v): v is string => Boolean(v))
//           .slice(0, 10);

//         set({ trendingKeywords: keywords });
//       },

//       fetchSearchAndGetFirst: async (query: string) => {
//         await get().onFetchSearch(query);
//         return get().results[0] ?? null;
//       },
//     }),
//     { name: "search-store" }
//   )
// );
// import { create } from "zustand";
// import { persist } from "zustand/middleware";
// import type {
//   SearchState,
//   TmdbMultiResponse,
//   SearchResultItem,
//   TmdbTrendingResponse,
// } from "../types/searchtodo";

// const API_KEY = import.meta.env.VITE_TMDB_API_KEY as string | undefined;

// async function fetchJsonOrThrow<T>(url: string): Promise<T> {
//   const res = await fetch(url);
//   const data = await res.json().catch(() => null);
//   if (!res.ok) {
//     const msg = (data && data.status_message) || `HTTP ${res.status}`;
//     throw new Error(msg);
//   }
//   return data as T;
// }

// export const useSearchStore = create<SearchState>()(
//   persist(
//     (set, get) => ({
//       todos: [],

//       onAddTextTodo: (text) => {
//         const trimmed = text.trim();
//         if (!trimmed) return;

//         set((state) => ({
//           todos: [
//             { id: Date.now(), text: trimmed },
//             ...state.todos.filter((t) => t.text !== trimmed),
//           ].slice(0, 20),
//         }));
//       },

//       onRemoveTodos: (id) =>
//         set((state) => ({ todos: state.todos.filter((t) => t.id !== id) })),
//       onRemoveAll: () => set({ todos: [] }),

//       results: [],
//       loading: false,
//       onClearResults: () => set({ results: [], loading: false }),

//       // ✅ multi 검색 + 페이지 합치기
//       onFetchSearch: async (query: string, maxPages = 3) => {
//         const trimmed = query.trim();
//         if (!API_KEY) {
//           console.warn("VITE_TMDB_API_KEY is missing");
//           set({ results: [], loading: false });
//           return;
//         }
//         if (!trimmed) {
//           set({ results: [], loading: false });
//           return;
//         }

//         set({ loading: true });

//         try {
//           const q = encodeURIComponent(trimmed);

//           const all: SearchResultItem[] = [];
//           let totalPages = 1;

//           // 1페이지 먼저 받아서 total_pages 확보
//           const first = await fetchJsonOrThrow<TmdbMultiResponse>(
//             `https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&include_adult=false&language=ko-KR&page=1&query=${q}`
//           );
//           totalPages = first.total_pages ?? 1;

//           const pushItems = (items: TmdbMultiResponse["results"]) => {
//             for (const it of items ?? []) {
//               if (it.media_type === "movie") {
//                 all.push({
//                   id: it.id,
//                   kind: "movie",
//                   label: it.title,
//                   overview: it.overview,
//                   poster_path: it.poster_path ?? null,
//                   backdrop_path: it.backdrop_path ?? null,
//                 });
//               } else if (it.media_type === "tv") {
//                 all.push({
//                   id: it.id,
//                   kind: "tv",
//                   label: it.name,
//                   overview: it.overview,
//                   poster_path: it.poster_path ?? null,
//                   backdrop_path: it.backdrop_path ?? null,
//                 });
//               } else if (it.media_type === "person") {
//                 all.push({
//                   id: it.id,
//                   kind: "person",
//                   label: it.name,
//                   profile_path: it.profile_path ?? null,
//                 });
//               }
//             }
//           };

//           pushItems(first.results);

//           // 2페이지부터 for문으로 추가 수집
//           const end = Math.min(totalPages, maxPages);
//           for (let page = 2; page <= end; page++) {
//             const data = await fetchJsonOrThrow<TmdbMultiResponse>(
//               `https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&include_adult=false&language=ko-KR&page=${page}&query=${q}`
//             );
//             pushItems(data.results);
//           }

//           // ✅ 중복 제거 (kind-id 기준)
//           const uniqMap = new Map<string, SearchResultItem>();
//           for (const r of all) uniqMap.set(`${r.kind}-${r.id}`, r);
//           const merged = Array.from(uniqMap.values());

//           // ✅ 검색어 우선 정렬(시작 > 포함 > 가나다)
//           const low = trimmed.toLowerCase();
//           merged.sort((a, b) => {
//             const A = a.label.toLowerCase();
//             const B = b.label.toLowerCase();
//             const aStarts = A.startsWith(low) ? 1 : 0;
//             const bStarts = B.startsWith(low) ? 1 : 0;
//             if (aStarts !== bStarts) return bStarts - aStarts;

//             const aInc = A.includes(low) ? 1 : 0;
//             const bInc = B.includes(low) ? 1 : 0;
//             if (aInc !== bInc) return bInc - aInc;

//             return A.localeCompare(B);
//           });

//           set({ results: merged, loading: false });
//         } catch (err) {
//           console.error("TMDB multi search failed:", err);
//           set({ results: [], loading: false });
//         }
//       },

//       trendingKeywords: [],

//       onFetchTrendingKeywords: async () => {
//         if (!API_KEY) {
//           set({ trendingKeywords: [] });
//           return;
//         }
//         try {
//           const data = await fetchJsonOrThrow<TmdbTrendingResponse>(
//             `https://api.themoviedb.org/3/trending/all/day?api_key=${API_KEY}&language=ko-KR`
//           );

//           const keywords = (data.results ?? [])
//             .map((item) => {
//               if (item.media_type === "movie") return item.title;
//               if (item.media_type === "tv" || item.media_type === "person")
//                 return item.name;
//               return null;
//             })
//             .filter((v): v is string => Boolean(v))
//             .slice(0, 10);

//           set({ trendingKeywords: keywords });
//         } catch (err) {
//           console.error("TMDB trending failed:", err);
//           set({ trendingKeywords: [] });
//         }
//       },

//       fetchSearchAndGetFirst: async (query: string, maxPages = 3) => {
//         await get().onFetchSearch(query, maxPages);
//         return get().results[0] ?? null;
//       },
//     }),
//     {
//       name: "search-store",
//       partialize: (state) => ({ todos: state.todos }),
//     }
//   )
// );
//store/useSearchStore
import { create } from "zustand";
import { searchMulti } from "../api/tmdb";

// TMDB multi 검색 결과에서 우리가 쓰는 최초 필드 타입
type MultiItem = {
  id: number;
  media_type: "movie" | "tv" | "person" | string;
  title?: string;
  name?: string;
  popularity?: number;
};

interface SearchStore {
  results: MultiItem[];
  search: (keyword: string) => Promise<void>;
}

const normalize = (s: string) =>
  s
    .toLowerCase()
    .trim()
    // 공백 여러 개를 1개로
    .replace(/\s+/g, " ");

const getLabel = (item: MultiItem) => {
  if (item.media_type === "movie") return item.title ?? "";
  return item.name ?? "";
};

const scoreMatch = (label: string, keyword: string) => {
  const l = normalize(label);
  const k = normalize(keyword);

  if (!k) return 999;

  if (l === k) return 0;
  if (l.startsWith(k)) return 1;
  if (l.includes(k)) return 2;
  return 3;
};

export const useSearchStore = create<SearchStore>((set) => ({
  results: [],

  search: async (keyword) => {
    const trimmed = await keyword.trim();
    if (!trimmed) {
      set({ results: [] });
      return;
    }
  },
}));
