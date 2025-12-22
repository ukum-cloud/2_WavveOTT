import { useEffect } from "react";

import { useVarietyStore } from "../stores/useVarietyStore";

import KBSVisual from "../components/KbsVisual";
import KbsRecommendCardList from "../components/KbsRecommendlist";

import { KBSing } from "../data/KBSing";
import { KBSVariety } from "../data/KBSVariety";
import { KBSJoy } from "../data/KBSJoy";
import { KBSDrama } from "../data/KBSDrama";

import AniKidsRankingList from "../components/AniKidsRankingList";
import AniKidsHotList from "../components/AniKidsHotList";
import AniKidsPrimaryList from "../components/AniKidsPrimaryList";
import AniKidsNewList from "../components/AniKidsNewList";

import "./scss/Animation.scss";

const Kbs = () => {
  const { tvVideos, onFetchVariety } = useVarietyStore();

  useEffect(() => {
    KBSing.forEach((v) => {
      if (v.tmdb_id) {
        onFetchVariety(v.tmdb_id);
      }
    });
    KBSVariety.forEach((v) => {
      if (v.tmdb_id) {
        onFetchVariety(v.tmdb_id);
      }
    });
    KBSJoy.forEach((v) => {
      if (v.tmdb_id) {
        onFetchVariety(v.tmdb_id);
      }
    });
    KBSDrama.forEach((v) => {
      if (v.tmdb_id) {
        onFetchVariety(v.tmdb_id);
      }
    });
  }, [onFetchVariety]);

  return (
    <main className="ani-home">
      {/* 분리된 비주얼 컴포넌트 */}
      <KBSVisual />

      <div className="inner">
        <AniKidsRankingList title="KBS 실시간 TOP10" data={KBSing} />
        <AniKidsHotList title="NEW! 새로 올라왔어요" video={tvVideos} data={KBSDrama} />
        <AniKidsNewList title="지금 주목받는 프로그램" video={tvVideos} data={KBSJoy} />
        <AniKidsPrimaryList title="이건 꼭 봐야해!" video={tvVideos} data={KBSVariety} />
      </div>

      <KbsRecommendCardList title="KBS 추천 프로그램" />
    </main>
  );
};

export default Kbs;
