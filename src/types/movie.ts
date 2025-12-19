//  공통 타입

export interface MediaBase {
  id: number;
  adult?: boolean;
  backdrop_path?: string | null;
  poster_path?: string | null;
  overview?: string;
  vote_average?: number;

  iso_3166_1?: string;
  iso_639_1?: string;

  certification?: string;
  runtime?: number | null;

  logo_path?: string | null;
}

//Video
export interface Video {
  type: string;
  site: string;
  key: string;
}

//Episode / Season
export interface Episodes {
  id: number;
  name: string;
  episode_number: number;
  still_path: string | null;
  show_id: number;
  runtime?: number;
  season_number?: number;
  overview?: string;
  backdrop_path?: string;
}

export interface Season {
  id: number;
  name: string;
  season_number: number;
  episode_count: number;
  air_date?: string;
  overview?: string;
  poster_path?: string;
  episodes?: Episodes[];
}

//credit
export interface CreditPerson {
  id: number;
  name: string;
  profile_path: string | null;
  known_for_department?: string;
  character: string;
}

//movie
export interface Movie extends MediaBase {
  title: string;
  release_date: string;

  videos?: Video[];
  key?: string;

  logo?: string | null;
  certificationMovie?: string;

  genre_ids?: number[];
  type?: number;
}

export interface MovieWithLogo extends Movie {
  file_path?: string;
}

// logo
export interface Logo {
  file_path: string;
  iso_639_1: string | null;
}

//wavve
export interface OnlyWavve extends MediaBase {
  media_type: "tv";

  name: string;
  first_air_date: string;

  videos?: Video[];
  wavveVideo?: Video | null;

  genre_ids?: number[];

  episodes?: Episodes[];
  seasons?: Season[];

  rating?: string;
  isWavveOnly?: boolean;
  isNew?: boolean;

  logo?: string | null;

  creditData?: {
    cast: CreditPerson[];
    crew: CreditPerson[];
  };

  director?: CreditPerson[];
  writer?: CreditPerson[];
}

//tv
export interface Tv extends MediaBase {
  media_type: "tv";

  name: string;
  first_air_date: string;

  videos?: Video[];
  tvsVideo?: Video | null;

  genre_ids?: number[];

  episodes?: Episodes[];
  seasons?: Season[];

  logo?: string | null;

  creditData?: {
    cast: CreditPerson[];
    crew: CreditPerson[];
  };

  director?: CreditPerson[];
  writer?: CreditPerson[];
}

//tv state
export interface TvState {
  tvs: Tv[];
  selectedTv: Tv | null;

  /* 리스트 */
  onFetchTv: () => Promise<void>;
  fetchTvs: () => Promise<void>;

  /* 상세 */
  fetchTvDetail: (id: number) => Promise<void>;

  setSelectedTv: (id: number) => void;
}

//people
export interface People {
  id: number;
  name: string;
  profile_path: string | null;
  cast: PersonCast[];
}

//person cast
export interface PersonCast {
  id: number;
  name: string;
  character?: string;
  poster_path: string | null;

  certification?: string;
  videos?: Video[];

  creditData?: {
    cast: CreditPerson[];
    crew: CreditPerson[];
  };

  director?: CreditPerson[];
  writer?: CreditPerson[];

  episodes?: Episodes[];
  runtime?: number | null;
  logo?: string | null;

  profile_path?: string;

  vote_average?: number;
  genre_ids?: number[];
  overview?: string;

  backdrop_path?: string;

  seasons?: { season_number: number; episodes: Episodes[] }[];
}
export interface TMDBTvCast {
  id: number;
  name: string;
  character?: string;
  poster_path: string | null;
  backdrop_path: string | null;
}

//people state
export interface PeopleState {
  people: People[];
  selectedPeople: PersonCast | null;
  onFetchPeople: () => Promise<void>;
  setSelectedPeople: (id: number) => void;
  wavveIds: number[];
}

//onlywavvestate
export interface OnlyWavveState {
  wavves: OnlyWavve[];
  selectedWavve: OnlyWavve | null;
  fetchWavves: () => Promise<void>;
  fetchWavveDetail: (id: number) => Promise<void>;
}

//primaryItem
export interface PrimaryItem {
  id: number;
  poster_path?: string | null;
  backdrop_path?: string | null;
  title?: string;
  name?: string;
  vote_average?: number;
  mediaType: "tv" | "movie";
  videos?: { key: string }[];
  logo?: string | null;
  certification?: string | null;
  genre_ids?: number[];
  episodes?: Episodes[];
}

//Variety
export interface Variety {
  id: number;
  name: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  overview?: string;
  videos?: Video[];
  episodes?: Episodes[];
  seasons?: Season[];
  genre_ids?: number[];
  runtime?: number | null;
  logo?: string | null;
  creditData?: {
    cast: CreditPerson[];
    crew: CreditPerson[];
  };
  director?: CreditPerson[];
  writer?: CreditPerson[];
}

export interface VarietyState {
  selectedVariety: Tv | null;
  tvVideos: Record<number, { tvsVideo: Video | null; episodes: Episodes[] }>;
  onFetchVariety: (id: number) => Promise<void>;
  fetchVarietyDetail: (id: number) => Promise<void>;
  clearVariety: () => void;
  wavveIds: number[];
}

export interface News {
  id: number;
  name: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  overview?: string;
  videos?: Video[];
  episodes?: Episodes[];
  seasons?: Season[];
  genre_ids?: number[];
  runtime?: number | null;
  logo?: string | null;
  creditData?: {
    cast: CreditPerson[];
    crew: CreditPerson[];
  };
  director?: CreditPerson[];
  writer?: CreditPerson[];
}

export interface NewsState {
  news: Tv[];
  selectedNews: Tv | null;
  newsVideos: Record<number, { tvsVideo: Video | null; episodes: Episodes[] }>;
  onFetchNews: (id: number) => Promise<void>;
  fetchNewsDetail: (id: number) => Promise<void>;
}

// movie state 인터페이스 추가
export interface MovieState {
  popularMovies: MovieWithLogo[];
  newMovies: MovieWithLogo[];
  topRatedMovies: MovieWithLogo[]; // Movie.tsx에서 사용하는 명작 리스트

  /* 상세 선택 상태 */
  selectedPopular: MovieWithLogo | null;
  setSelectedPopular: (id: number) => void;

  selectedNewMovie: MovieWithLogo | null;
  setSelectedNewMovie: (id: number) => void;

  /* 데이터 호출 메서드 */
  onFetchPopular: () => Promise<void>;
  onFetchNewMovie: () => Promise<void>;
  onFetchTopRated: () => Promise<void>; // Movie.tsx에서 호출하는 함수
}
