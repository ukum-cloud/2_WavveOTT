// 공통 타입
export interface MediaBase {
    adult: boolean;
    genre_ids: number[];
    backdrop_path: string | null;
    id: number;
    overview: string;
    poster_path: string | null;
    title: string;
    vote_average: number;
    iso_3166_1: string;
    iso_639_1: string;
    certification: number;
    episodeCount: number;
    logo_path: string;
}

// 영화에대한 타입 -> 더 사용할내용있으면 추가
export interface Movie extends MediaBase {
    release_data: string;
}

export interface MovieWithLogo extends MediaBase {
    logo: string | null;
}

export interface MovieState {
    popularMovies: MovieWithLogo[];
    onFetchPopular: () => Promise<void>;
}

// 웨이브 콘텐츠 타입
export interface OnlyWavve extends MediaBase {
    rating: string;
    context_type: string;
    context_id: string;
    results: Video[];
    wavveVideo: Video | null;
    isWavveOnly: boolean;
    isNew: boolean;
}

export interface Video {
    type: string;
    site: string;
    key: string;
}

export interface OnlyWavveState {
    wavves: OnlyWavve[];
    onFetchWavve: () => Promise<void>;
}

//tv 시리즈 타입
export interface Tv extends MediaBase {
    tvsVideo: Video | null;
    first_air_date: string;
    results: Video[];
}
export interface TvState {
    tvs: Tv[];
    onFetchTv: () => Promise<void>;
}
