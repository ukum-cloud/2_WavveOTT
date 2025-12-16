import { wavveOnly } from '../data/wavveOnly';

// 타입 정의
export interface ContentImages {
    logo: string | null;
    background: string | null;
    tmdbLogo: string | null;
    wavveLogo: string | null;
    tmdbBackground: string | null;
    wavveBackground: string | null;
}

// tmdbId 기준으로 wavve 데이터 찾기
const findWavveItem = (tmdbId: number) => {
    return wavveOnly.find((v) => v.tmdb_id === tmdbId);
};

// 로고 이미지 가져오기 (tmdb id 랑 wavve랑 맵핑해서 가져옴)
export const logoImage = (tmdbId: number): string | null => {
    const item = findWavveItem(tmdbId);
    return item ? `https://${item.seasontitlelogoimage}` : null;
};

// 배경 이미지 가져오기 (tmdb id 랑 wavve랑 맵핑해서 가져옴)
export const backgroundImage = (tmdbId: number): string | null => {
    const item = findWavveItem(tmdbId);
    return item ? `https://${item.season_horizontal_logoN_image}` : null;
};

// tmdb 이미지와 wavve 이미지 같이(wavve 쓰고 없을 땐 tmdb 꺼 쓰기 위해)
export const getContentImages = (tvWavves: {
    id: number;
    logo?: string | null;
    backdrop_path?: string | null;
    episodes?: { still_path?: string | null; backdrop_path?: string | null }[];
}): ContentImages & { episodeImages?: string[] } => {
    //tmdb에서 로고 가져오기
    const tmdbLogo = tvWavves.logo ? `https://image.tmdb.org/t/p/original${tvWavves.logo}` : null;
    //tmdb에서 배경 가져오기
    const tmdbBackground = tvWavves.backdrop_path
        ? `https://image.tmdb.org/t/p/original${tvWavves.backdrop_path}`
        : null;

    //tmdb에는 없고 wavve에는 있는 이미지 가져올 때
    const wavveLogo = logoImage(tvWavves.id);
    const wavveBackground = backgroundImage(tvWavves.id);

    // Wavve 없으면 TMDB 사용
    const logo = wavveLogo ?? tmdbLogo;
    const background = wavveBackground ?? tmdbBackground;

    // 에피소드에 still_path (썸네일) 없을 때 전체 배열에서 backdrop_path 가져오기
    const episodeImages = tvWavves.episodes?.map(
        (e) =>
            e.still_path && e.still_path !== ''
                ? `https://image.tmdb.org/t/p/w500${e.still_path}`
                : tvWavves.backdrop_path
                ? `https://image.tmdb.org/t/p/w500${tvWavves.backdrop_path}`
                : backgroundImage(tvWavves.id) ?? '' // Wavve 이미지, 없으면 빈 문자열
    );

    return {
        logo,
        background,
        tmdbLogo,
        wavveLogo,
        tmdbBackground,
        wavveBackground,
        episodeImages,
    };
};
