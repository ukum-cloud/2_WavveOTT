import type { Video } from '../types/movie';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

// video 한국어 + 영어 다 가져오기

export const fetchTvVideos = async (id: number): Promise<Video[]> => {
    const fetchByLang = async (lang: string) => {
        const res = await fetch(
            `https://api.themoviedb.org/3/tv/${id}/videos?api_key=${API_KEY}&language=${lang}`
        );
        const data = await res.json();

        return (
            data.results?.filter(
                (v: Video) => v.site === 'YouTube' && ['Trailer', 'Teaser', 'Clip'].includes(v.type)
            ) || []
        );
    };

    // 1️⃣ ko-KR
    const ko = await fetchByLang('ko-KR');
    if (ko.length) return ko;

    // 2️⃣ en-US
    return await fetchByLang('en-US');
};
