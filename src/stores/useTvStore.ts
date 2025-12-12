import { create } from 'zustand';
import type { Tv, TvState, Video } from '../types/movie';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

export const useTvStore = create<TvState>((set) => ({
    tvs: [],

    onFetchTv: async () => {
        let tvsList: Tv[] = [];

        //1~5페이지 다 가져오기
        for (let page = 1; page <= 5; page++) {
            const res = await fetch(
                `https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&language=ko-KR&with_networks=3357&with_watch_providers=356&page=${page}`
            );
            const data = await res.json();
            tvsList = [...tvsList, ...data.results];
        }

        //최신작 순서로 정렬 후 제일 최신 20개로 추리기
        const latestTvList = tvsList
            .sort(
                (a, b) =>
                    new Date(b.first_air_date).getTime() - new Date(a.first_air_date).getTime()
            )
            .slice(0, 20);

        const tvsWithVideo = await Promise.all(
            latestTvList.map(async (tv: Tv) => {
                /* 비디오 */
                // 비디오 불러오기
                const videoRes = await fetch(
                    `https://api.themoviedb.org/3/tv/${tv.id}/videos?api_key=${API_KEY}&language=ko-KR`
                );
                const videoData = await videoRes.json();

                //예고편 비디오 찾기
                let tvsVideo =
                    videoData.results.find(
                        (v: Video) => v.type === 'Trailer' && v.site.toLowerCase() === 'youtube'
                    ) ||
                    videoData.results.find(
                        (v: Video) => v.type === 'Teaser' && v.site.toLowerCase() === 'youtube'
                    );

                //Trailer가 없으면 아무거나 하나 가져오기
                if (!tvsVideo) {
                    tvsVideo = videoData.results.find((v: Video) => v.site === 'youtube') || null;
                }

                /* 등급 */
                // 등급 가져오기
                const ratingRes = await fetch(
                    `https://api.themoviedb.org/3/tv/${tv.id}/content_ratings?api_key=${API_KEY}`
                );
                const ratingData = await ratingRes.json();

                // 한국(KR) 등급 찾기
                const kr = ratingData.results.find((r: Tv) => r.iso_3166_1 === 'KR');
                const certification = kr?.rating || 'NR'; // NR = Not Rated

                /* 러닝타임 */
                // 러닝타임 가져오기
                const timeRes = await fetch(
                    `https://api.themoviedb.org/3/tv/${tv.id}?api_key=${API_KEY}`
                );
                const timeData = await timeRes.json();

                // 러닝타임 찾기
                const runtime = timeData.episode_run_time?.[0] ?? null;

                /* 에피소드 */
                // 에피소드 수 가져오기
                const episodeCount = timeData.number_of_episodes ?? null;

                /* 로고 */
                // 로고 이미지 요청
                const imageRes = await fetch(
                    `https://api.themoviedb.org/3/tv/${tv.id}/images?api_key=${API_KEY}`
                );
                const imageData = await imageRes.json();

                //한국어 로고 찾기
                const koLogo = imageData.logos?.find((logo: Tv) => logo.iso_639_1 === 'ko');
                //영어 로고 찾기
                const enLogo = imageData.logos?.find((logo: Tv) => logo.iso_639_1 === 'en');

                // 첫 번째 이미지 선택 (한국어 찾고 없으면 영어 찾기)
                const logo = koLogo?.file_path || enLogo?.file_path || null;

                return {
                    ...tv,
                    latestTvList,
                    videoData,
                    tvsVideo,
                    certification,
                    runtime,
                    episodeCount,
                    logo,
                };
            })
        );
        set({ tvs: tvsWithVideo });
        console.log('최신tv비디오', tvsWithVideo);
    },
}));
