import { create } from 'zustand';
import type {
    OnlyWavve,
    OnlyWavveState,
    Video,
    Episodes,
    CreditPerson,
    TMDBTvCast,
    Logo,
} from '../types/movie';

// 영상 언어 다양하게 해서 찾기
const fetchTvVideos = async (id: number): Promise<Video[]> => {
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

    // 1️⃣ ko-KR 먼저
    const ko = await fetchByLang('ko-KR');
    if (ko.length > 0) return ko;

    // 2️⃣ 없으면 en-US
    return await fetchByLang('en-US');
};

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

export const useWavveStore = create<OnlyWavveState>((set) => ({
    wavves: [],
    selectedWavve: null,

    //WavveList

    fetchWavves: async () => {
        const res = await fetch(
            `https://api.themoviedb.org/3/discover/tv` +
                `?api_key=${API_KEY}` +
                `&language=ko-KR` +
                `&with_networks=3357` +
                `&with_watch_providers=356` +
                `&page=1`
        );
        const data = await res.json();

        const wavves: OnlyWavve[] = await Promise.all(
            data.results.map(async (tv: TMDBTvCast) => {
                /* 등급 */
                const ratingRes = await fetch(
                    `https://api.themoviedb.org/3/tv/${tv.id}/content_ratings?api_key=${API_KEY}`
                );
                const ratingData = await ratingRes.json();
                const kr = ratingData.results?.find(
                    (r: { iso_3166_1: string; rating: string }) => r.iso_3166_1 === 'KR'
                );
                const certification = kr?.rating || 'NR';

                /* 러닝타임 */
                const timeRes = await fetch(
                    `https://api.themoviedb.org/3/tv/${tv.id}?api_key=${API_KEY}&language=ko-KR`
                );
                const timeData = await timeRes.json();
                const runtime = timeData.episode_run_time?.[0] ?? null;

                /* 로고 */
                const imageRes = await fetch(
                    `https://api.themoviedb.org/3/tv/${tv.id}/images?api_key=${API_KEY}`
                );
                const imageData = await imageRes.json();
                const logo =
                    imageData.logos?.find((l: Logo) => l.iso_639_1 === 'ko')?.file_path ||
                    imageData.logos?.find((l: Logo) => l.iso_639_1 === 'en')?.file_path ||
                    null;

                /* 비디오 */
                const videos = await fetchTvVideos(tv.id);
                // const videoRes = await fetch(
                //     `https://api.themoviedb.org/3/tv/${tv.id}/videos?api_key=${API_KEY}&language=ko-KR`
                // );
                // const videoData = await videoRes.json();
                // const videos: Video[] = videoData.results || [];

                /* 에피소드 */
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

        set({ wavves });
    },

    //Detail

    fetchWavveDetail: async (id: number) => {
        const tvRes = await fetch(
            `https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}&language=ko-KR`
        );
        const tv = await tvRes.json();

        const videos = await fetchTvVideos(tv.id);
        // const videoRes = await fetch(
        //     `https://api.themoviedb.org/3/tv/${id}/videos?api_key=${API_KEY}&language=ko-KR`
        // );
        // const videoData = await videoRes.json();
        // const videos: Video[] = videoData.results || [];

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
            selectedWavve: {
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
}));

// import { create } from 'zustand';
// import type { Episodes, MediaBase, OnlyWavve, OnlyWavveState, Video } from '../types/movie';

// const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
// // const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
// export const useWavveStore = create<OnlyWavveState>((set) => ({
//     wavves: [],
//     onFetchWavve: async () => {
//         const res = await fetch(
//             `https://api.themoviedb.org/3/discover/tv` +
//                 `?api_key=${API_KEY}` +
//                 `&language=ko-KR` +
//                 `&with_networks=3357` +
//                 '&with_watch_providers=356' +
//                 `&page=1`
//         );
//         const data = await res.json();

//         // 각 tv에 Certification(등급),러닝타임 가져오기
//         const tvsWithExtra = await Promise.all(
//             data.results.map(async (tv: OnlyWavve) => {
//                 /* 등급 */
//                 // 등급 가져오기
//                 const ratingRes = await fetch(
//                     `https://api.themoviedb.org/3/tv/${tv.id}/content_ratings?api_key=${API_KEY}`
//                 );
//                 const ratingData = await ratingRes.json();

//                 // 한국(KR) 등급 찾기
//                 const kr = ratingData.results.find((r: OnlyWavve) => r.iso_3166_1 === 'KR');
//                 const certification = kr?.rating || 'NR'; // NR = Not Rated

//                 // 시즌 목록
//                 const seasons = ratingData.seasons || [];
//                 const seasonsNumber = seasons.number_of_seasons || 1;

//                 /* 러닝타임 */
//                 // 러닝타임 가져오기
//                 const timeRes = await fetch(
//                     `https://api.themoviedb.org/3/tv/${tv.id}?api_key=${API_KEY}&language=ko-KR`
//                 );
//                 const timeData = await timeRes.json();

//                 // 러닝타임 찾기
//                 const runtime = timeData.episode_run_time?.[0] ?? null;

//                 /* 에피소드 */
//                 // 에피소드 수 가져오기
//                 const episodeCount = timeData.number_of_episodes ?? null;

//                 /* 로고 */
//                 // 로고 이미지 요청
//                 const imageRes = await fetch(
//                     `https://api.themoviedb.org/3/tv/${tv.id}/images?api_key=${API_KEY}`
//                 );
//                 const imageData = await imageRes.json();

//                 //한국어 로고 찾기
//                 const koLogo = imageData.logos?.find((logo: OnlyWavve) => logo.iso_639_1 === 'ko');
//                 //영어 로고 찾기
//                 const enLogo = imageData.logos?.find((logo: OnlyWavve) => logo.iso_639_1 === 'en');

//                 // 첫 번째 이미지 선택 (한국어 찾고 없으면 영어 찾기)
//                 const logo = koLogo?.file_path || enLogo?.file_path || null;

//                 /* 비디오 */
//                 // 비디오 불러오기
//                 const videoRes = await fetch(
//                     `https://api.themoviedb.org/3/tv/${tv.id}/videos?api_key=${API_KEY}&language=ko-KR`
//                 );
//                 const videoData = await videoRes.json();
//                 const videos: Video[] = videoData.results;

//                 //예고편 비디오 찾기
//                 let wavveVideo =
//                     videoData.results.find(
//                         (v: Video) => v.type === 'Trailer' && v.site.toLowerCase() === 'youtube'
//                     ) ||
//                     videoData.results.find(
//                         (v: Video) => v.type === 'Teaser' && v.site.toLowerCase() === 'youtube'
//                     );

//                 // Trailer가 없으면 아무거나 하나 가져오기
//                 if (!wavveVideo) {
//                     wavveVideo = videoData.results.find((v: Video) => v.site === 'youtube') || null;

//                     // 그래도 없으면 YouTube API 검색
//                     // if (!wavveVideo) {
//                     //     const query = encodeURIComponent(tv.title + ' trailer');
//                     //     const searchRes = await fetch(
//                     //         `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=1&q=${query}&key=${YOUTUBE_API_KEY}`
//                     //     );
//                     //     const searchData = await searchRes.json();
//                     //     const firstVideo = searchData.items?.[0]?.id?.videoId;

//                     //     if (firstVideo) {
//                     //         wavveVideo = firstVideo;
//                     //     }
//                     // }
//                 }

//                 /* 작감배 찾기 */
//                 //배우,감독 등 불러오기
//                 const credit = await fetch(
//                     `https://api.themoviedb.org/3/tv/${tv.id}/credits?api_key=${API_KEY}&language=ko-KR`
//                 );
//                 const creditData = await credit.json();

//                 //감독 찾기
//                 const director =
//                     creditData.crew.filter(
//                         (c: MediaBase) => c.known_for_department === 'Directing'
//                     ) || null;

//                 //작가 찾기
//                 const writer =
//                     creditData.crew.filter(
//                         (c: MediaBase) => c.known_for_department === 'Writing'
//                     ) || null;

//                 //에피소드 찾기
//                 const season = 1;
//                 const ep = await fetch(
//                     `https://api.themoviedb.org/3/tv/${tv.id}/season/${season}?api_key=${API_KEY}&language=ko-KR`
//                 );
//                 const epData = await ep.json();
//                 const episodes: Episodes[] = epData.episodes;

//                 return {
//                     ...tv,
//                     media_type: 'tv',
//                     certification,
//                     seasons,
//                     seasonsNumber,
//                     runtime,
//                     episodeCount,
//                     logo_path: logo,
//                     logo,
//                     videoData,
//                     videos,
//                     wavveVideo,
//                     creditData,
//                     director,
//                     writer,
//                     episodes,
//                 };
//             })
//         );
//         set({ wavves: tvsWithExtra });
//     },

//     selectedWavve: null,
//     setSelectedWavve: (id: number) =>
//         set(
//             (state): Partial<OnlyWavveState> => ({
//                 selectedWavve: state.wavves.find((w) => w.id === id) ?? null,
//             })
//         ),
// }));
