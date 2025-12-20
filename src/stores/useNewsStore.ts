import { create } from "zustand";
import type { Episodes, Tv, Video, CreditPerson, NewsState } from "../types/movie";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

export const useNewsStore = create<NewsState>((set) => ({
  news: [],
  newsVideos: {},
  onFetchNews: async (id: number) => {
    const videoRes = await fetch(
      `https://api.themoviedb.org/3/tv/${id}/videos?api_key=${API_KEY}&language=ko-KR`
    );
    const videoData = await videoRes.json();
    const videos: Video[] = videoData.results || [];

    const tvsVideo =
      videos.find((v) => v.type === "Trailer" && v.site === "YouTube") ||
      videos.find((v) => v.site === "YouTube") ||
      null;

    /* 에피소드 (시즌 1만) */
    const epRes = await fetch(
      `https://api.themoviedb.org/3/tv/${id}/season/1?api_key=${API_KEY}&language=ko-KR`
    );
    const epData = await epRes.json();
    const episodes: Episodes[] = epData.episodes || [];

    set((state) => ({
      newsVideos: {
        ...state.newsVideos,
        [id]: { tvsVideo, episodes },
        media_type: "tv",
      },
    }));
  },

  selectedNews: null,

  fetchNewsDetail: async (id: number) => {
    /* 기본 정보 */
    const tvRes = await fetch(
      `https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}&language=ko-KR`
    );
    const tv = await tvRes.json();

    /* 비디오 */
    const videoRes = await fetch(
      `https://api.themoviedb.org/3/tv/${id}/videos?api_key=${API_KEY}&language=ko-KR`
    );
    const videoData = await videoRes.json();
    const videos: Video[] = videoData.results || [];

    const tvsVideo =
      videos.find((v) => v.type === "Trailer" && v.site === "YouTube") ||
      videos.find((v) => v.site === "YouTube") ||
      null;

    /* 등급 */
    const ratingRes = await fetch(
      `https://api.themoviedb.org/3/tv/${id}/content_ratings?api_key=${API_KEY}`
    );
    const ratingData = await ratingRes.json();
    const kr = ratingData.results?.find((r: { iso_3166_1: string }) => r.iso_3166_1 === "KR");
    const certification = kr?.rating || "NR";

    /* 로고 */
    const imageRes = await fetch(`https://api.themoviedb.org/3/tv/${id}/images?api_key=${API_KEY}`);
    const imageData = await imageRes.json();
    const koLogo = imageData.logos?.find((l: { iso_639_1: string }) => l.iso_639_1 === "ko");
    const enLogo = imageData.logos?.find((l: { iso_639_1: string }) => l.iso_639_1 === "en");
    const logo = koLogo?.file_path || enLogo?.file_path || null;

    /* 크레딧 */
    const creditRes = await fetch(
      `https://api.themoviedb.org/3/tv/${id}/credits?api_key=${API_KEY}&language=ko-KR`
    );
    const creditData = await creditRes.json();

    const director: CreditPerson[] =
      creditData.crew?.filter((c: CreditPerson) => c.known_for_department === "Directing") || [];

    const writer: CreditPerson[] =
      creditData.crew?.filter((c: CreditPerson) => c.known_for_department === "Writing") || [];

    /* 에피소드 */
    const epRes = await fetch(
      `https://api.themoviedb.org/3/tv/${id}/season/1?api_key=${API_KEY}&language=ko-KR`
    );
    const epData = await epRes.json();
    const episodes: Episodes[] = epData.episodes || [];

    const newsDetail: Tv = {
      ...tv,
      media_type: "news",
      videos,
      tvsVideo,
      certification,
      logo,
      creditData,
      director,
      writer,
      episodes,
      runtime: tv.episode_run_time?.[0] ?? null,
    };

    set({
      news: [newsDetail],
      selectedNews: newsDetail,
    });
  },
}));
