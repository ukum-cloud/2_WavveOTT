import { useEffect } from 'react';
import { useVarietyStore } from '../stores/useVarietyStore';

import RecapVisual from '../components/RecapVisual';
// import AniKidsRankingList from '../components/AniKidsRankingList';
import AniKidsHotList from '../components/AniKidsHotList';

import { varietyTop50 } from '../data/2025_varietyTop50_tmdb';
import { overseasTop50 } from '../data/overseasTop50';
import { dramaTop50 } from '../data/2025_dramaTop50_tmdb';
import { moviePlusTop50 } from '../data/2025_moviePlusTop50_tmdb';
import { newsTop50 } from '../data/2025_newsTop50_tmdb';
import { aniTop50 } from '../data/2025_aniTop50_tmdb';
import { kidsTop50 } from '../data/2025_kidsTop50_tmdb';

import './scss/Animation.scss';

const Recap = () => {
    const { tvVideos, onFetchVariety } = useVarietyStore();

    useEffect(() => {
        varietyTop50.forEach((v) => {
            if (v.tmdb_id) {
                onFetchVariety(v.tmdb_id);
            }
        });
        overseasTop50.forEach((v) => {
            if (v.tmdb_id) {
                onFetchVariety(v.tmdb_id);
            }
        });
        dramaTop50.forEach((v) => {
            if (v.tmdb_id) {
                onFetchVariety(v.tmdb_id);
            }
        });
        moviePlusTop50.forEach((v) => {
            if (v.tmdb_id) {
                onFetchVariety(v.tmdb_id);
            }
        });
        newsTop50.forEach((v) => {
            if (v.tmdb_id) {
                onFetchVariety(v.tmdb_id);
            }
        });
        aniTop50.forEach((v) => {
            if (v.tmdb_id) {
                onFetchVariety(v.tmdb_id);
            }
        });
        kidsTop50.forEach((v) => {
            if (v.tmdb_id) {
                onFetchVariety(v.tmdb_id);
            }
        });
    }, [onFetchVariety]);

    return (
        <main className="ani-home">
            {/* 분리된 비주얼 컴포넌트 */}
            <RecapVisual />

            <div className="inner">
                {/* <AniKidsRankingList title="2025년 TOP 50 영화" data={moviePlusTop50} /> */}
                <AniKidsHotList
                    title="2025년 TOP 50 해외시리즈"
                    video={tvVideos}
                    data={overseasTop50}
                />
                <AniKidsHotList title="2025년 TOP 50 드라마" video={tvVideos} data={dramaTop50} />
                <AniKidsHotList title="2025년 TOP 50 예능" video={tvVideos} data={varietyTop50} />
                <AniKidsHotList title="2025년 TOP 50 뉴스" video={tvVideos} data={newsTop50} />
                <AniKidsHotList title="2025년 TOP 50 애니" video={tvVideos} data={aniTop50} />
                <AniKidsHotList title="2025년 TOP 50 키즈" video={tvVideos} data={kidsTop50} />
            </div>
        </main>
    );
};

export default Recap;
