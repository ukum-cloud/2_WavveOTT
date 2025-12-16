import { create } from 'zustand';
import type { Episodes, MediaBase, OnlyWavve, OnlyWavveState, Video } from '../types/movie';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
export const useWavveStore = create<OnlyWavveState>((set) => ({
    wavves: [],
    onFetchWavve: async () => {
        const res = await fetch(
            `https://api.themoviedb.org/3/discover/tv` +
                `?api_key=${API_KEY}` +
                `&language=ko-KR` +
                `&with_networks=3357` +
                '&with_watch_providers=356' +
                `&page=1`
        );
        const data = await res.json();

        // 각 tv에 Certification(등급),러닝타임 가져오기
        const tvsWithExtra = await Promise.all(
            data.results.map(async (tv: OnlyWavve) => {
                /* 등급 */
                // 등급 가져오기
                const ratingRes = await fetch(
                    `https://api.themoviedb.org/3/tv/${tv.id}/content_ratings?api_key=${API_KEY}`
                );
                const ratingData = await ratingRes.json();

                // 한국(KR) 등급 찾기
                const kr = ratingData.results.find((r: OnlyWavve) => r.iso_3166_1 === 'KR');
                const certification = kr?.rating || 'NR'; // NR = Not Rated

                // 시즌 목록
                const seasons = ratingData.seasons || [];
                const seasonsNumber = seasons.number_of_seasons || 1;

                /* 러닝타임 */
                // 러닝타임 가져오기
                const timeRes = await fetch(
                    `https://api.themoviedb.org/3/tv/${tv.id}?api_key=${API_KEY}&language=ko-KR`
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
                const koLogo = imageData.logos?.find((logo: OnlyWavve) => logo.iso_639_1 === 'ko');
                //영어 로고 찾기
                const enLogo = imageData.logos?.find((logo: OnlyWavve) => logo.iso_639_1 === 'en');

                // 첫 번째 이미지 선택 (한국어 찾고 없으면 영어 찾기)
                const logo = koLogo?.file_path || enLogo?.file_path || null;

                /* 비디오 */
                // 비디오 불러오기
                const videoRes = await fetch(
                    `https://api.themoviedb.org/3/tv/${tv.id}/videos?api_key=${API_KEY}&language=ko-KR`
                );
                const videoData = await videoRes.json();
                const videos: Video[] = videoData.results;

                //예고편 비디오 찾기
                let wavveVideo =
                    videoData.results.find(
                        (v: Video) => v.type === 'Trailer' && v.site.toLowerCase() === 'youtube'
                    ) ||
                    videoData.results.find(
                        (v: Video) => v.type === 'Teaser' && v.site.toLowerCase() === 'youtube'
                    );

                //Trailer가 없으면 아무거나 하나 가져오기
                if (!wavveVideo) {
                    wavveVideo = videoData.results.find((v: Video) => v.site === 'youtube') || null;
                }

                /* 작감배 찾기 */
                //배우,감독 등 불러오기
                const credit = await fetch(
                    `https://api.themoviedb.org/3/tv/${tv.id}/credits?api_key=${API_KEY}&language=ko-KR`
                );
                const creditData = await credit.json();

                //감독 찾기
                const director =
                    creditData.crew.filter(
                        (c: MediaBase) => c.known_for_department === 'Directing'
                    ) || null;

                //작가 찾기
                const writer =
                    creditData.crew.filter(
                        (c: MediaBase) => c.known_for_department === 'Writing'
                    ) || null;

                //에피소드 찾기
                const season = 1;
                const ep = await fetch(
                    `https://api.themoviedb.org/3/tv/${tv.id}/season/${season}?api_key=${API_KEY}&language=ko-KR`
                );
                const epData = await ep.json();
                const episodes: Episodes[] = epData.episodes;

                return {
                    ...tv,
                    certification,
                    seasons,
                    seasonsNumber,
                    runtime,
                    episodeCount,
                    logo_path: logo,
                    logo,
                    videoData,
                    videos,
                    wavveVideo,
                    creditData,
                    director,
                    writer,
                    episodes,
                };
            })
        );
        set({ wavves: tvsWithExtra });
        console.log('웨이브확인', tvsWithExtra);
    },

    selectedWavve: null,
    setSelectedWavve: (id: number) =>
        set(
            (state): Partial<OnlyWavveState> => ({
                selectedWavve: state.wavves.find((w) => w.id === id) ?? null,
            })
        ),
}));
