import { create } from 'zustand';

import { ACTOR_ID_LIST } from '../constants/actor';
import type { PeopleState } from '../types/movie';

//TMDB-API키
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

export const usePeopleStore = create<PeopleState>((set) => ({
    people: [],

    onFetchPeople: async () => {
        try {
            const results = await Promise.all(
                ACTOR_ID_LIST.map(async (id) => {
                    const res = await fetch(
                        `https://api.themoviedb.org/3/person/${id}/tv_credits?api_key=${API_KEY}&language=ko-KR`
                    );

                    return res.json();
                })
            );
            set({ people: results });
            console.log('배우 확인', results);
        } catch (error) {
            console.error('배우 실패', error);
        }
    },
}));
