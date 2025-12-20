import { create } from 'zustand';

import { fetchTvVideos } from '../utils/fetchVideoslang';

import type { Episodes, Tv, TvState, CreditPerson, Logo } from '../types/movie';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

export const useTvStore = create<TvState>((set) => ({
    tvs: [],
    selectedTv: null,

    //NewTvList
    fetchTvs: async () => {
        let tvsList: Tv[] = [];

        for (let page = 1; page <= 5; page++) {
            const res = await fetch(
                `https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&language=ko-KR&page=${page}`
            );
            const data = await res.json();
            tvsList = [...tvsList, ...data.results];
        }

        const latestTvList = tvsList
            .sort(
                (a, b) =>
                    new Date(b.first_air_date).getTime() - new Date(a.first_air_date).getTime()
            )
            .slice(0, 20);

        const tvsWithExtra: Tv[] = await Promise.all(
            latestTvList.map(async (tv) => {
                const videos = await fetchTvVideos(tv.id);

                const ratingRes = await fetch(
                    `https://api.themoviedb.org/3/tv/${tv.id}/content_ratings?api_key=${API_KEY}`
                );
                const ratingData = await ratingRes.json();
                const kr = ratingData.results?.find(
                    (r: { iso_3166_1: string; rating: string }) => r.iso_3166_1 === 'KR'
                );
                const certification = kr?.rating || 'NR';

                const timeRes = await fetch(
                    `https://api.themoviedb.org/3/tv/${tv.id}?api_key=${API_KEY}&language=ko-KR`
                );
                const timeData = await timeRes.json();
                const runtime = timeData.episode_run_time?.[0] ?? null;

                const imageRes = await fetch(
                    `https://api.themoviedb.org/3/tv/${tv.id}/images?api_key=${API_KEY}`
                );
                const imageData = await imageRes.json();
                const logo =
                    imageData.logos?.find((l: Logo) => l.iso_639_1 === 'ko')?.file_path ||
                    imageData.logos?.find((l: Logo) => l.iso_639_1 === 'en')?.file_path ||
                    imageData.logos?.find((l: Logo) => l.iso_639_1 === 'zh')?.file_path ||
                    null;

                const epRes = await fetch(
                    `https://api.themoviedb.org/3/tv/${tv.id}/season/1?api_key=${API_KEY}&language=ko-KR`
                );
                const epData = await epRes.json();
                const episodes: Episodes[] = epData.episodes || [];

                return {
                    ...tv,
                    media_type: 'tv',
                    certification,
                    runtime,
                    logo,
                    videos,
                    episodes,
                };
            })
        );

        set({ tvs: tvsWithExtra });
    },

    /* 기존 코드 호환용 */
    onFetchTv: async () => {
        await useTvStore.getState().fetchTvs();
    },

    //detail
    fetchTvDetail: async (id: number) => {
        const tvRes = await fetch(
            `https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}&language=ko-KR`
        );
        const tv = await tvRes.json();

        // const videoRes = await fetch(
        //     `https://api.themoviedb.org/3/tv/${id}/videos?api_key=${API_KEY}&language=ko-KR`
        // );
        // const videoData = await videoRes.json();
        // const videos: Video[] =
        //     videoData.results?.filter((v: Video) => v.site === 'YouTube' && v.type === 'Trailer') ||
        //     [];
        const videos = await fetchTvVideos(tv.id);

        const ratingRes = await fetch(
            `https://api.themoviedb.org/3/tv/${id}/content_ratings?api_key=${API_KEY}`
        );
        const ratingData = await ratingRes.json();
        const kr = ratingData.results?.find(
            (r: { iso_3166_1: string; rating: string }) => r.iso_3166_1 === 'KR'
        );
        const certification = kr?.rating || 'NR';

        const imageRes = await fetch(
            `https://api.themoviedb.org/3/tv/${id}/images?api_key=${API_KEY}`
        );
        const imageData = await imageRes.json();
        const logo =
            imageData.logos?.find((l: Logo) => l.iso_639_1 === 'ko')?.file_path ||
            imageData.logos?.find((l: Logo) => l.iso_639_1 === 'en')?.file_path ||
            imageData.logos?.find((l: Logo) => l.iso_639_1 === 'zh')?.file_path ||
            null;

        const creditRes = await fetch(
            `https://api.themoviedb.org/3/tv/${id}/credits?api_key=${API_KEY}&language=ko-KR`
        );
        const creditData = await creditRes.json();

        const director: CreditPerson[] =
            creditData.crew?.filter((c: CreditPerson) => c.known_for_department === 'Directing') ||
            [];

        const writer: CreditPerson[] =
            creditData.crew?.filter((c: CreditPerson) => c.known_for_department === 'Writing') ||
            [];

        const epRes = await fetch(
            `https://api.themoviedb.org/3/tv/${id}/season/1?api_key=${API_KEY}&language=ko-KR`
        );
        const epData = await epRes.json();
        const episodes: Episodes[] = epData.episodes || [];

        set({
            selectedTv: {
                ...tv,
                media_type: 'tv',
                videos,
                certification,
                logo,
                creditData,
                director,
                writer,
                episodes,
                runtime: tv.episode_run_time?.[0] ?? null,
            },
        });
    },

    /* 🔥 기존 코드 호환용 */
    setSelectedTv: (id: number) =>
        set((state) => ({
            selectedTv: state.tvs.find((tv) => tv.id === id) ?? null,
        })),
}));
