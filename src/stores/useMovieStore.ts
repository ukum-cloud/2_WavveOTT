import { create } from "zustand";
import type {
  MediaBase,
  Movie,
  MovieState,
  MovieWithLogo,
  Video,
} from "../types/movie";

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
    const movieWithExtra = await Promise.all(
      data.results.map(async (movie: MediaBase) => {
        const detailRes = await fetch(
          `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${API_KEY}&append_to_response=images`
        );
        const detailData = await detailRes.json();

        /* 등급 */
        // 등급 가져오기
        const ratingRes = await fetch(
          `https://api.themoviedb.org/3/movie/${movie.id}/release_dates?api_key=${API_KEY}`
        );
        const ratingData = await ratingRes.json();

        // 한국(KR) 등급 찾기
        const kr = ratingData.results.find((r: Movie) => r.iso_3166_1 === "KR");
        const certificationMovie = kr?.release_dates || "NR"; // NR = Not Rated

        /* 로고 */
        //한국어 로고 찾기
        const koLogo = detailData.images?.logos?.find(
          (logo: MovieWithLogo) => logo.iso_639_1 === "ko"
        );
        //영어 로고 찾기
        const enLogo = detailData.images?.logos?.find(
          (logo: MovieWithLogo) => logo.iso_639_1 === "en"
        );
        //중국어 로고 찾기
        const cnLogo = detailData.images?.logos?.find(
          (logo: MovieWithLogo) => logo.iso_639_1 === "zh"
        );

        // 첫 번째 이미지 선택 (한국어 찾고 없으면 영어 찾기)
        const logo =
          koLogo?.file_path || enLogo?.file_path || cnLogo?.file_path || null;

        /* 러닝타임 */
        // 러닝타임 가져오기
        const timeRes = await fetch(
          `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${API_KEY}&language=ko-KR`
        );
        const timeData = await timeRes.json();

        // 러닝타임 찾기
        const runtime = timeData.runtime ?? null;

        /* 비디오 */
        // 비디오 불러오기
        const videoRes = await fetch(
          `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${API_KEY}&language=ko-KR`
        );
        const videoData = await videoRes.json();
        const videos: Video[] = videoData.results;

        // //예고편 비디오 찾기
        // let wavveVideo =
        //     videoData.results.find(
        //         (v: Video) => v.type === 'Trailer' && v.site.toLowerCase() === 'youtube'
        //     ) ||
        //     videoData.results.find(
        //         (v: Video) => v.type === 'Teaser' && v.site.toLowerCase() === 'youtube'
        //     );

        // //Trailer가 없으면 아무거나 하나 가져오기
        // if (!wavveVideo) {
        //     wavveVideo = videoData.results.find((v: Video) => v.site === 'youtube') || null;
        // }

        /* 작감배 찾기 */
        //배우,감독 등 불러오기
        const credit = await fetch(
          `https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=${API_KEY}&language=ko-KR`
        );
        const creditData = await credit.json();

        //감독 찾기
        const director =
          creditData.crew.filter(
            (c: MediaBase) => c.known_for_department === "Directing"
          ) || null;

        //작가 찾기
        const writer =
          creditData.crew.filter(
            (c: MediaBase) => c.known_for_department === "Writing"
          ) || null;

        return {
          ...movie,
          media_type: "movie",
          certificationMovie,
          logo,
          runtime,
          creditData,
          director,
          writer,
          videos,
        };
      })
    );
    set({ popularMovies: movieWithExtra });
  },

  selectedPopular: null,
  setSelectedPopular: (id: number) =>
    set(
      (state): Partial<MovieState> => ({
        selectedPopular: state.popularMovies.find((w) => w.id === id) ?? null,
      })
    ),

  newMovies: [],
  onFetchNewMovie: async () => {
    const res = await fetch(
      `https://api.themoviedb.org/3/discover/movie` +
        `?api_key=${API_KEY}` +
        `&language=ko-KR` +
        `&sort_by=popularity.desc` +
        `&primary_release_date.gte=2025-01-01` +
        `&vote_count.gte=80` +
        `&watch_region=KR` +
        `&without_watch_providers=8` +
        `&page=1`
    );
    const data = await res.json();
    const movieWithExtra = await Promise.all(
      data.results.map(async (movie: MediaBase) => {
        const detailRes = await fetch(
          `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${API_KEY}&append_to_response=images`
        );
        const detailData = await detailRes.json();

        /* 등급 */
        // 등급 가져오기
        const ratingRes = await fetch(
          `https://api.themoviedb.org/3/movie/${movie.id}/release_dates?api_key=${API_KEY}`
        );
        const ratingData = await ratingRes.json();

        // 한국(KR) 등급 찾기
        const kr = ratingData.results.find((r: Movie) => r.iso_3166_1 === "KR");
        const theatrical = kr?.release_dates?.find((d: Movie) => d.type === 3);

        const certificationMovie = theatrical?.certification ?? "NR";
        // const certificationMovie = kr?.release_dates?.[0]?.certification || 'NR'; // NR = Not Rated

        /* 로고 */
        //한국어 로고 찾기
        const koLogo = detailData.images?.logos?.find(
          (logo: MovieWithLogo) => logo.iso_639_1 === "ko"
        );
        //영어 로고 찾기
        const enLogo = detailData.images?.logos?.find(
          (logo: MovieWithLogo) => logo.iso_639_1 === "en"
        );
        //중국어 로고 찾기
        const cnLogo = detailData.images?.logos?.find(
          (logo: MovieWithLogo) => logo.iso_639_1 === "zh"
        );

        // 첫 번째 이미지 선택 (한국어 찾고 없으면 영어 찾기)
        const logo =
          koLogo?.file_path || enLogo?.file_path || cnLogo?.file_path || null;

        /* 러닝타임 */
        // 러닝타임 가져오기
        const timeRes = await fetch(
          `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${API_KEY}&language=ko-KR`
        );
        const timeData = await timeRes.json();

        // 러닝타임 찾기
        const runtime = timeData.runtime ?? null;

        /* 비디오 */
        // 비디오 불러오기
        const videoRes = await fetch(
          `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${API_KEY}&language=ko-KR`
        );
        const videoData = await videoRes.json();
        const videos: Video[] = videoData.results;

        // //예고편 비디오 찾기
        // let wavveVideo =
        //     videoData.results.find(
        //         (v: Video) => v.type === 'Trailer' && v.site.toLowerCase() === 'youtube'
        //     ) ||
        //     videoData.results.find(
        //         (v: Video) => v.type === 'Teaser' && v.site.toLowerCase() === 'youtube'
        //     );

        // //Trailer가 없으면 아무거나 하나 가져오기
        // if (!wavveVideo) {
        //     wavveVideo = videoData.results.find((v: Video) => v.site === 'youtube') || null;
        // }

        /* 작감배 찾기 */
        //배우,감독 등 불러오기
        const credit = await fetch(
          `https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=${API_KEY}&language=ko-KR`
        );
        const creditData = await credit.json();

        //감독 찾기
        const director =
          creditData.crew.filter(
            (c: MediaBase) => c.known_for_department === "Directing"
          ) || null;

        //작가 찾기
        const writer =
          creditData.crew.filter(
            (c: MediaBase) => c.known_for_department === "Writing"
          ) || null;

        return {
          ...movie,
          media_type: "movie",
          certificationMovie,
          logo,
          runtime,
          creditData,
          director,
          writer,
          videos,
        };
      })
    );
    set({ newMovies: movieWithExtra });
    // console.log('신작 영화', movieWithExtra);
  },

  selectedNewMovie: null,
  setSelectedNewMovie: (id: number) =>
    set(
      (state): Partial<MovieState> => ({
        selectedNewMovie: state.newMovies.find((w) => w.id === id) ?? null,
      })
    ),

  /// /movie 메인을 위한
  topRatedMovies: [],
  onFetchTopRated: async () => {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=ko-KR&page=1`
    );
    const data = await res.json();

    const movieWithExtra = await Promise.all(
      data.results.map(async (movie: MediaBase) => {
        const detailRes = await fetch(
          `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${API_KEY}&append_to_response=images`
        );
        const detailData = await detailRes.json();

        const ratingRes = await fetch(
          `https://api.themoviedb.org/3/movie/${movie.id}/release_dates?api_key=${API_KEY}`
        );
        const ratingData = await ratingRes.json();
        const kr = ratingData.results.find((r: Movie) => r.iso_3166_1 === "KR");

        // 등급이 없거나 NR일 경우 15로 고정
        const certValue = kr?.release_dates?.[0]?.certification;
        const certification =
          !certValue || certValue === "NR" ? "15" : certValue;

        const koLogo = detailData.images?.logos?.find(
          (logo: MovieWithLogo) => logo.iso_639_1 === "ko"
        );
        const enLogo = detailData.images?.logos?.find(
          (logo: MovieWithLogo) => logo.iso_639_1 === "en"
        );
        const logo = koLogo?.file_path || enLogo?.file_path || null;

        const videoRes = await fetch(
          `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${API_KEY}&language=ko-KR`
        );
        const videoData = await videoRes.json();

        return {
          ...movie,
          media_type: "movie" as const,
          logo,
          certification,
          certificationMovie: certification,
          videos: videoData.results || [],
        };
      })
    );
    set({ topRatedMovies: movieWithExtra });
  },
}));
