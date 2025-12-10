import { create } from 'zustand';
import type { OnlyWavve, OnlyWavveState } from '../types/movie';

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
                `&sort_by=popularity.desc` +
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
                const koLogo = imageData.logos?.find((logo: OnlyWavve) => logo.iso_639_1 === 'ko');
                //영어 로고 찾기
                const enLogo = imageData.logos?.find((logo: OnlyWavve) => logo.iso_639_1 === 'en');

                // 첫 번째 이미지 선택 (한국어 찾고 없으면 영어 찾기)
                const logo = koLogo?.file_path || enLogo?.file_path || null;

                /* 웨이브 api 가져오기 */
                // // 오직 웨이브 전체 목록 api
                // const listRes = await fetch(
                //     `https://apis.wavve.com/v1/catalog?broadcastid=EN400&catalogType=manualband&code=EN400----GN51&limit=40&manualbandId=400&offset=0&orderby=default&uicode=EN400&uiparent=GN51-EN400&uirank=0&uitype=band_14`
                // );
                // const listData = await listRes.json();

                // const vodContexts = listData.context_list.filter(
                //     (item: any) => item.context_type === 'vod'
                // );
                // const programId = vodContexts.map((item: any) => item.context_id);

                // // 오직 웨이브 상세 뽑아오기
                // const detailRes = await fetch(
                //     `https://apis.wavve.com/fz/vod/contents-detail/${programId}.1?device=pc&partner=pooq&apikey=...`
                // );
                // const detailData = await detailRes.json();

                // const logoImage = detailData.seasontitlelogoimage;
                // const targetAge = detailData.targetage;
                // console.log(programId, logoImage, targetAge);

                return {
                    ...tv,
                    certification,
                    runtime,
                    episodeCount,
                    logo_path: logo,
                    // programId,
                    // logoImage,
                    // targetAge,
                };
            })
        );
        set({ wavves: tvsWithExtra });
        console.log('오직웨이브 + 등급 + 러닝타임 + 에피소드 + 로고 이미지', tvsWithExtra);
    },
}));
