import { create } from 'zustand';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
export const useVarietyNewsStore = create((set) => ({
    varietyNewsVideo: [],
    onFetchVideo: async () => {
        const res = await fetch(
            `https://api.themoviedb.org/3/tv/${tv_id}/videos?api_key=${API_KEY}&language=ko-KR`
        );
        const data = await res.json();
        const videos = data.results;

        set({ varietyNewsVideo: videos });
    },
}));
