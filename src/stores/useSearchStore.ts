import { create } from "zustand";
import type {
  Search,
  SearchResultItem,
  SearchState,
} from "../types/searchtodo";
import {
  searchMultiPagedFull,
  fetchTrendingKeywords,
  fetchRecommendedKeywords,
} from "../api/tmdb";
import type { MultiItemFull } from "../api/tmdb";

// ===== localStorage: 최근검색어 =====
const RECENT_KEY = "wavve_recent_searches_v1";
const RECENT_LIMIT = 10;

const loadTodos = (): Search[] => {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Search[];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (v) => v && typeof v.id === "number" && typeof v.text === "string"
      )
      .slice(0, RECENT_LIMIT);
  } catch {
    return [];
  }
};

const saveTodos = (next: Search[]) => {
  try {
    localStorage.setItem(
      RECENT_KEY,
      JSON.stringify(next.slice(0, RECENT_LIMIT))
    );
  } catch {
    // 차단/시크릿모드 등 무시
  }
};

// ===== MultiItemFull -> SearchResultItem =====
const toResultItem = (it: MultiItemFull): SearchResultItem | null => {
  if (it.media_type === "movie") {
    return {
      id: it.id,
      kind: "movie",
      label: it.title ?? "",
      overview: it.overview,
      poster_path: it.poster_path ?? null,
      backdrop_path: it.backdrop_path ?? null,
    };
  }

  if (it.media_type === "tv") {
    return {
      id: it.id,
      kind: "tv",
      label: it.name ?? "",
      overview: it.overview,
      poster_path: it.poster_path ?? null,
      backdrop_path: it.backdrop_path ?? null,
    };
  }

  if (it.media_type === "person") {
    return {
      id: it.id,
      kind: "person",
      label: it.name ?? "",
      profile_path: it.profile_path ?? null,
    };
  }

  return null;
};

// ===== 정렬/중복 =====
const normalize = (s: string) => s.toLowerCase().trim().replace(/\s+/g, " ");

const scoreMatch = (label: string, keyword: string) => {
  const l = normalize(label);
  const k = normalize(keyword);
  if (!k) return 999;
  if (l === k) return 0;
  if (l.startsWith(k)) return 1;
  if (l.includes(k)) return 2;
  return 3;
};

const dedupeByKindAndId = (items: SearchResultItem[]) => {
  const seen = new Set<string>();
  const out: SearchResultItem[] = [];
  for (const it of items) {
    const key = `${it.kind}-${it.id}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(it);
  }
  return out;
};

export const useSearchStore = create<SearchState>((set, get) => ({
  // ✅ 최근검색어
  todos: loadTodos(),

  onAddTextTodo: (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const prev = get().todos;
    const lowered = trimmed.toLowerCase();

    const filtered = prev.filter((t) => t.text.toLowerCase() !== lowered);
    const next: Search[] = [
      { id: Date.now(), text: trimmed },
      ...filtered,
    ].slice(0, RECENT_LIMIT);

    saveTodos(next);
    set({ todos: next });
  },

  onRemoveTodos: (id: number) => {
    const next = get().todos.filter((t) => t.id !== id);
    saveTodos(next);
    set({ todos: next });
  },

  onRemoveAll: () => {
    saveTodos([]);
    set({ todos: [] });
  },

  // ✅ 검색결과
  results: [],
  loading: false,

  onClearResults: () => set({ results: [], loading: false }),

  onFetchSearch: async (query: string, maxPages: number = 3) => {
    const trimmed = query.trim();
    if (!trimmed) {
      set({ results: [], loading: false });
      return;
    }

    set({ loading: true });

    try {
      const data = await searchMultiPagedFull(trimmed, maxPages);

      // popularity map
      const pop = new Map<string, number>();
      for (const it of data) {
        if (
          it.media_type === "movie" ||
          it.media_type === "tv" ||
          it.media_type === "person"
        ) {
          pop.set(`${it.media_type}-${it.id}`, it.popularity ?? 0);
        }
      }

      // 변환
      const mapped = data
        .map(toResultItem)
        .filter(Boolean) as SearchResultItem[];

      // 중복 제거
      const unique = dedupeByKindAndId(mapped);

      // 정렬
      const sorted = unique
        .map((item, idx) => ({ item, idx }))
        .sort((a, b) => {
          const aScore = scoreMatch(a.item.label, trimmed);
          const bScore = scoreMatch(b.item.label, trimmed);
          if (aScore !== bScore) return aScore - bScore;

          const ap = pop.get(`${a.item.kind}-${a.item.id}`) ?? 0;
          const bp = pop.get(`${b.item.kind}-${b.item.id}`) ?? 0;
          if (bp !== ap) return bp - ap;

          return a.idx - b.idx;
        })
        .map((x) => x.item);

      set({ results: sorted, loading: false });
    } catch {
      set({ results: [], loading: false });
    }
  },

  // ✅ 트렌딩 키워드
  trendingKeywords: [],

  onFetchTrendingKeywords: async () => {
    const keywords = await fetchTrendingKeywords(10);
    set({ trendingKeywords: keywords });
  },

  // ✅ 추천 검색어
  recommendedKeywords: [],

  onFetchRecommendedKeywords: async () => {
    const keywords = await fetchRecommendedKeywords(8);
    set({ recommendedKeywords: keywords });
  },

  // ✅ 첫 결과 얻기
  fetchSearchAndGetFirst: async (query: string, maxPages: number = 3) => {
    const trimmed = query.trim();
    if (!trimmed) return null;

    await get().onFetchSearch(trimmed, maxPages);

    const latest = get().results;
    return latest.length > 0 ? latest[0] : null;
  },
}));
