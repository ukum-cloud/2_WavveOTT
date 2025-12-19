// 최근검색어(로컬 저장용)
export interface Search {
  id: number;
  text: string;
}

// TMDB 공통 응답
export interface TmdbListResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

/** search/multi 아이템(핵심 필드만) */
export type TmdbMultiItem =
  | {
      media_type: "movie";
      id: number;
      title: string;
      overview?: string;
      poster_path?: string | null;
      backdrop_path?: string | null;
      release_date?: string;
    }
  | {
      media_type: "tv";
      id: number;
      name: string;
      overview?: string;
      poster_path?: string | null;
      backdrop_path?: string | null;
      first_air_date?: string;
    }
  | {
      media_type: "person";
      id: number;
      name: string;
      profile_path?: string | null;
      known_for_department?: string;
    };

export type TmdbMultiResponse = TmdbListResponse<TmdbMultiItem>;

/** 오버레이에 뿌릴 통합 kind */
export type SearchKind = "movie" | "tv" | "person" | "collection"; // collection은 multi에선 안 옴(확장 대비)

/** 오버레이에 뿌릴 통합 결과 */
export type SearchResultItem =
  | {
      id: number;
      kind: "movie";
      label: string; // title
      overview?: string;
      poster_path: string | null;
      backdrop_path: string | null;
    }
  | {
      id: number;
      kind: "tv";
      label: string; // name
      overview?: string;
      poster_path: string | null;
      backdrop_path: string | null;
    }
  | {
      id: number;
      kind: "person";
      label: string; // name
      profile_path: string | null;
    }
  | {
      id: number;
      kind: "collection";
      label: string;
      overview?: string;
      poster_path: string | null;
      backdrop_path: string | null;
    };

/** Trending */
export interface TmdbTrendingMovie {
  id: number;
  media_type: "movie";
  title: string;
}
export interface TmdbTrendingTv {
  id: number;
  media_type: "tv";
  name: string;
}
export interface TmdbTrendingPerson {
  id: number;
  media_type: "person";
  name: string;
}
export type TmdbTrendingItem =
  | TmdbTrendingMovie
  | TmdbTrendingTv
  | TmdbTrendingPerson;
export type TmdbTrendingResponse = TmdbListResponse<TmdbTrendingItem>;

/** zustand 타입(최근검색어) */
export interface SearchText {
  todos: Search[];
  onAddTextTodo: (text: string) => void;
  onRemoveTodos: (id: number) => void;
  onRemoveAll: () => void;
}

export interface SearchState extends SearchText {
  results: SearchResultItem[];
  loading: boolean;

  onFetchSearch: (query: string, maxPages?: number) => Promise<void>;
  onClearResults: () => void;

  // ✅ 기존
  trendingKeywords: string[];
  onFetchTrendingKeywords: () => Promise<void>;

  // ✅ 추가
  recommendedKeywords: string[];
  onFetchRecommendedKeywords: () => Promise<void>;

  fetchSearchAndGetFirst: (
    query: string,
    maxPages?: number
  ) => Promise<SearchResultItem | null>;
}
