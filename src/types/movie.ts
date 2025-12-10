// 영화에대한 타입 -> 더 사용할내용있으면 추가
export interface Movie {
  adult: boolean;
  backdrop_path: string;
  id: number;
  overview: string;
  title: string;
  poster_path: string;
  vote_average: number;
  release_data: string;
}

export interface MovieState {
  popularMovies: Movie[];

  onFetchPopular: () => Promise<void>;
}
