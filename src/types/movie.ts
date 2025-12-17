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
    certification: string;
    season_number: number;
    episodeCount: number;
    logo_path: string;
    runtime?: number;
    creditData: {
        cast: {
            id: number;
            name: string;
            profile_path: string;
        }[];
    };
    known_for_department: string;
    director: { id: number; name: string }[];
    writer: { id: number; name: string }[];
}

// 영화에대한 타입 -> 더 사용할내용있으면 추가
export interface Movie extends MediaBase {
    release_data: string;
    logo: string | null;
    key: string;
    videos: Video[];
    certificationMovie: string;
    release_date: string;
    type: number;
}

export interface MovieWithLogo extends Movie {
    logo: string | null;
    file_path: string;
}

export interface MovieState {
    popularMovies: MovieWithLogo[];
    newMovies: MovieWithLogo[];
    selectedPopular: Movie | null;
    selectedNewMovie: Movie | null;
    onFetchPopular: () => Promise<void>;
    setSelectedPopular: (id: number) => void;
    onFetchNewMovie: () => Promise<void>;
    setSelectedNewMovie: (id: number) => void;
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
    name: string;
    episodes: Episodes[];
    videos: Video[];
    seasons?: Season[];
    season_number: number;
    first_air_date: string;
    logo: string | null;
}

export interface Video {
    type: string;
    site: string;
    key: string;
}

export interface Episodes extends MediaBase {
    name: string;
    episode_number: number;
    still_path: string;
    show_id: number;
    runtime: number;
    image?: string;
    // episodeImages?: string;
}

export interface Season {
    id: number;
    name: string;
    season_number: number;
    episode_count: number;
    air_date?: string;
    overview?: string;
    poster_path?: string;
}

export interface OnlyWavveState {
    wavves: OnlyWavve[];
    selectedWavve: OnlyWavve | null;
    onFetchWavve: () => Promise<void>;
    setSelectedWavve: (id: number) => void;
}

//tv 시리즈 타입
export interface Tv extends MediaBase {
    tvsVideo: Video | null;
    first_air_date: string;
    logo: string;
    results: Video[];
    episodes: Episodes[];
    videos: Video[];
    seasons?: Season[];
    season_number: number;
}
export interface TvState {
    tvs: Tv[];
    selectedTv: Tv | null;
    onFetchTv: () => Promise<void>;
    setSelectedTv: (id: number) => void;
}

export interface PrimaryItem extends MediaBase {
    id: number;
    poster_path: string | null;
    name?: string; // tv
    mediaType: string;
    videos: Video[];
    logo: string | null;
}

export interface People {
    cast: {
        id: number;
        name: string;
        character: string;
        poster_path: string | null;
        first_air_date?: string;
        adult: boolean;
        genre_ids: number[];
        backdrop_path: string | null;
        overview: string;
        title: string;
        vote_average: number;
        iso_3166_1: string;
        iso_639_1: string;
        certification: string;
        season_number: number;
        episodeCount: number;
        logo_path: string;
        runtime?: number;
        creditData: {
            cast: {
                id: number;
                name: string;
                profile_path: string;
            }[];
        };
        known_for_department: string;
        director: { id: number; name: string }[];
        writer: { id: number; name: string }[];
        videos: Video[];
        logo: string | null;
    }[];
}

export interface PeopleState {
    people: People[];
    onFetchPeople: () => Promise<void>;
}

export interface cast {
    id: number;
    name: string;
    character: string;
    poster_path: string | null;
    first_air_date?: string;
}
