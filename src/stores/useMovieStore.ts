import { create } from 'zustand';
import type { MovieState } from '../types/movie';

//TMDB-API키
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

export const useMovieStore = create<MovieState>((set) => ({
  //인기영화
  popularMovies: [],

  //인기영화 호출 메서드
  onFetchPopular: async () => {
    const res = await fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=ko-KR&sort_by=popularity.desc&page=1`
    );
    const data = await res.json();
    const movieWithLogos = await Promise.all(
      data.results.map(async (movie) => {
        const detailRes = await fetch(
          `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${API_KEY}&append_to_response=images`
        );
        const detailData = await detailRes.json();
        const logo = detailData.images?.logos?.[0]?.file_path ?? null;
        return { ...movie, logo };
      })
    );
    set({ popularMovies: movieWithLogos });
  },
}));
