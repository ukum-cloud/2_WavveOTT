import { create } from 'zustand';

import { ACTOR_ID_LIST } from '../constants/actor';
import type { Cast, PeopleState, Video } from '../types/movie';

//TMDB-API키
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

export const usePeopleStore = create<PeopleState>((set) => ({
    people: [],

    onFetchPeople: async () => {
        try {
            const results = await Promise.all(
                ACTOR_ID_LIST.map(async (id) => {
                    // 1. 배우 TV 출연 목록 가져오기
                    const res = await fetch(
                        `https://api.themoviedb.org/3/person/${id}/tv_credits?api_key=${API_KEY}&language=ko-KR`
                    );
                    const data = await res.json(); // cast, crew 포함

                    // 2. 각 작품에 대한 세부 정보 추가
                    const castWithExtra = await Promise.all(
                        data.cast.map(async (tv: Cast) => {
                            // TV 세부 정보
                            const tvRes = await fetch(
                                `https://api.themoviedb.org/3/tv/${tv.id}?api_key=${API_KEY}&language=ko-KR`
                            );
                            const tvData = await tvRes.json();

                            // 등급
                            const ratingRes = await fetch(
                                `https://api.themoviedb.org/3/tv/${tv.id}/content_ratings?api_key=${API_KEY}`
                            );
                            const ratingData = await ratingRes.json();
                            const krRating = ratingData.results.find(
                                (r: Cast) => r.iso_3166_1 === 'KR'
                            );
                            const certification = krRating?.rating || 'NR';

                            // 비디오
                            const videoRes = await fetch(
                                `https://api.themoviedb.org/3/tv/${tv.id}/videos?api_key=${API_KEY}&language=ko-KR`
                            );
                            const videoData = await videoRes.json();
                            const videos: Video[] = videoData.results;

                            // 감독/작가
                            const creditRes = await fetch(
                                `https://api.themoviedb.org/3/tv/${tv.id}/credits?api_key=${API_KEY}&language=ko-KR`
                            );
                            const creditData = await creditRes.json();
                            const director =
                                creditData.crew.filter(
                                    (c: Cast) => c.known_for_department === 'Directing'
                                ) || [];
                            const writer =
                                creditData.crew.filter(
                                    (c: Cast) => c.known_for_department === 'Writing'
                                ) || [];

                            // // 시즌/에피소드
                            // const seasonNumber = 1;
                            // const epRes = await fetch(
                            //     `https://api.themoviedb.org/3/tv/${tv.id}/season/${seasonNumber}?api_key=${API_KEY}&language=ko-KR`
                            // );
                            // const epData = await epRes.json();
                            // const episodes = epData.episodes || [];

                            return {
                                ...tv,
                                certification,
                                videos,
                                creditData,
                                director,
                                writer,
                                // episodes,
                                runtime: tvData.episode_run_time?.[0] || null,
                                logo: tvData.logo_path || null,
                            };
                        })
                    );

                    return {
                        id: data.id,
                        name: data.name,
                        profile_path: data.profile_path,
                        cast: castWithExtra, // 배우 출연작 상세 정보 포함
                    };
                })
            );
            set({ people: results });
        } catch (error) {
            console.error('배우 실패', error);
        }
    },

    selectedPeople: null,
    setSelectedPeople: (id: number) =>
        // set(
        //     (state): Partial<PeopleState> => ({
        //         selectedPeople: state.people.find((w) => w.id === id) ?? null,
        //     })
        // ),
        set((state): Partial<PeopleState> => {
            for (const person of state.people) {
                const found = person.cast.find((c) => c.id === id);
                if (found) return { selectedPeople: found };
            }
            return { selectedPeople: null };
        }),
}));
