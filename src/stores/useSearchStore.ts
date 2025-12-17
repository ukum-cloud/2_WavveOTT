import { create } from "zustand";
import type {
  SearchText,
  TmdbCollectionResponse,
  TmdbMovieResponse,
  TmdbPersonResponse,
  SearchResultItem,
  TmdbTrendingResponse,
} from "../types/searchtodo";
import { persist } from "zustand/middleware";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

if (!API_KEY) {
  console.warn("VITE_TMDB_API_KEY is missing");
}

type SearchStore = SearchText & {
  results: SearchResultItem[];
  loading: boolean;
  onFetchSearch: (query: string) => Promise<void>;
  onClearResults: () => void;
  trendingKeywords: string[];
  onFetchTrendingKeywords: () => Promise<void>;
  fetchSearchAndGetFirst: (query: string) => Promise<SearchResultItem | null>;
};

export const useSearchStore = create<SearchStore>()(
  persist(
    (set, get) => ({
      todos: [],

      //검색 기록 저장
      onAddTextTodo: (text) => {
        const trimmed = text.trim();
        if (!trimmed) return;

        set((state) => ({
          todos: [
            {id: Date.now(), text: trimmed}, ...state.todos.filter((t) => t.text !== trimmed),
          ].slice(0, 20),
        }))
      },

      //검색 기록을 선택해서 삭제
      onRemoveTodos: (id) => {
        set((state) => ({
          todos: state.todos.filter((t) => t.id !== id)
        }))
      },

      //검색 기록들 전부 삭제
      onRemoveAll: () => set({ todos: [] }),

      // 검색 결과
      results: [],
      loading: false,

      onClearResults: () => set({ results: [], loading: false }),

      // 검색 함수
      onFetchSearch: async (query: string) => {
        const trimmed = query.trim();
        if (!API_KEY) {
          set({ results: [], loading: false });
          return;
        }

        if (!trimmed) {
          set({ results: [], loading: false });
          return;
        }

        set({ loading: true });

        try {
          const q = encodeURIComponent(trimmed);

          const [cRes, mRes, pRes] = await Promise.all([
            fetch(
              `https://api.themoviedb.org/3/search/collection?api_key=${API_KEY}&include_adult=false&language=ko-KR&page=1&query=${q}`
            ),
            fetch(
              `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&include_adult=false&language=ko-KR&page=1&query=${q}`
            ),
            fetch(
              `https://api.themoviedb.org/3/search/person?api_key=${API_KEY}&include_adult=false&language=ko-KR&page=1&query=${q}`
            ),
          ]);

          const [cData, mData, pData] = await Promise.all([
            cRes.json() as Promise<TmdbCollectionResponse>,
            mRes.json() as Promise<TmdbMovieResponse>,
            pRes.json() as Promise<TmdbPersonResponse>,
          ]);

          const merged: SearchResultItem[] = [
            ...mData.results.slice(0, 5).map((m) => ({
              id: m.id,
              kind: "movie" as const,
              label: m.title,
              overview: m.overview,
              poster_path: m.poster_path ?? null,
              backdrop_path: m.backdrop_path ?? null,
            })),
            ...cData.results.slice(0, 5).map((c) => ({
              id: c.id,
              kind: "collection" as const,
              label: c.name,
              overview: c.overview,
              poster_path: c.poster_path ?? null,
              backdrop_path: c.backdrop_path ?? null,
            })),
            ...pData.results.slice(0, 5).map((p) => ({
              id: p.id,
              kind: "person" as const,
              label: p.name,
              profile_path: p.profile_path ?? null,
            })),
          ];

          const qLower = trimmed.toLowerCase();
          merged.sort((a, b) => {
            const A = a.label.toLowerCase();
            const B = b.label.toLowerCase();
            const aStarts = A.startsWith(qLower) ? 1 : 0;
            const bStarts = B.startsWith(qLower) ? 1 : 0;
            if (aStarts !== bStarts) return bStarts - aStarts;
            return A.localeCompare(B);
          });


          set({ results: merged, loading: false });
        } catch (err) {
          console.error(err);
          set({ results: [], loading: false });
        }
      },

      trendingKeywords: [],

      onFetchTrendingKeywords: async () => {
        if (!API_KEY) {
          set({ results: [], loading: false });
          return;
        }
        const res = await fetch(
          `https://api.themoviedb.org/3/trending/all/day?api_key=${API_KEY}&language=ko-KR`
        );
        const data: TmdbTrendingResponse = await res.json();

        const keywords = data.results
          .map((item) => {
            if (item.media_type === "movie") return item.title;
            if (item.media_type === "tv" || item.media_type === "person") return item.name;
            return null;
          })
          .filter((v): v is string => Boolean(v))
          .slice(0, 10);

        set({ trendingKeywords: keywords });
      },

      fetchSearchAndGetFirst: async (query: string) => {
        await get().onFetchSearch(query);
        return get().results[0] ?? null;
      },
    }),
    { name: "search-store" }
  )
);