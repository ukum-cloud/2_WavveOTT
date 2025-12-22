import { useEffect } from 'react';

import { useVarietyStore } from '../stores/useVarietyStore';

import MBCVisual from '../components/MbcVisual';
import MbcEditorRecommendCardList from '../components/MbcEditorRecommendCardList';

import { MBC_ing } from '../data/MBC_ing_tmdb';
import { MBC_variety } from '../data/MBC_variety_tmdb';
import { MBC_MBCevery } from '../data/MBC_MBCevery_tmdb';
import { MBC_drama } from '../data/MBC_drama_tmdb';

import AniKidsRankingList from '../components/AniKidsRankingList';
import AniKidsHotList from '../components/AniKidsHotList';
import AniKidsPrimaryList from '../components/AniKidsPrimaryList';
import AniKidsNewList from '../components/AniKidsNewList';

import './scss/Animation.scss';

const Mbc = () => {
    const { tvVideos, onFetchVariety } = useVarietyStore();

    useEffect(() => {
        MBC_ing.forEach((v) => {
            if (v.tmdb_id) {
                onFetchVariety(v.tmdb_id);
            }
        });
        MBC_variety.forEach((v) => {
            if (v.tmdb_id) {
                onFetchVariety(v.tmdb_id);
            }
        });
        MBC_MBCevery.forEach((v) => {
            if (v.tmdb_id) {
                onFetchVariety(v.tmdb_id);
            }
        });
        MBC_drama.forEach((v) => {
            if (v.tmdb_id) {
                onFetchVariety(v.tmdb_id);
            }
        });
    }, [onFetchVariety]);

    return (
        <main className="ani-home">
            {/* 분리된 비주얼 컴포넌트 */}
            <MBCVisual />

            <div className="inner">
                <AniKidsRankingList title="MBC 실시간 TOP10" data={MBC_ing} />
                <AniKidsNewList
                    title="지금 주목받는 프로그램"
                    video={tvVideos}
                    data={MBC_variety}
                />
                <AniKidsPrimaryList title="이건 꼭 봐야해!" video={tvVideos} data={MBC_MBCevery} />
                <AniKidsHotList title="NEW! 새로 올라왔어요" video={tvVideos} data={MBC_drama} />
            </div>

            <MbcEditorRecommendCardList title="MBC 추천 프로그램" />
        </main>
    );
};

export default Mbc;
