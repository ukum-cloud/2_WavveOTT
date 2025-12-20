import { useEffect } from "react";
import { useVarietyStore } from "../stores/useVarietyStore";
import AnimationVisual from "../components/AnimationVisual";
import AniKidsEditorRecommendCardList from "../components/AniKidsEditorRecommendCardList";

import { aniTop10 } from "../data/aniTop10";
import { aniPrimary } from "../data/aniPrimary";
import { aniHot } from "../data/aniHot";
import { aniNew } from "../data/aniNew";

import AniKidsRankingList from "../components/AniKidsRankingList";
import AniKidsHotList from "../components/AniKidsHotList";
import AniKidsPrimaryList from "../components/AniKidsPrimaryList";
import AniKidsNewList from "../components/AniKidsNewList";
import "./scss/Animation.scss";

const Animation = () => {
  const { tvVideos, onFetchVariety } = useVarietyStore();

  useEffect(() => {
    aniTop10.forEach((v) => {
      if (v.tmdb_id) {
        onFetchVariety(v.tmdb_id);
      }
    });
    aniPrimary.forEach((v) => {
      if (v.tmdb_id) {
        onFetchVariety(v.tmdb_id);
      }
    });
    aniHot.forEach((v) => {
      if (v.tmdb_id) {
        onFetchVariety(v.tmdb_id);
      }
    });
    aniNew.forEach((v) => {
      if (v.tmdb_id) {
        onFetchVariety(v.tmdb_id);
      }
    });
  }, [onFetchVariety]);

  return (
    <main className="ani-home">
      {/* 분리된 비주얼 컴포넌트 */}
      <AnimationVisual />

      <div className="inner">
        <AniKidsRankingList title="애니메이션 실시간 TOP10" data={aniTop10} />
        <AniKidsNewList
          title="지금 주목받는 애니메이션"
          video={tvVideos}
          data={aniNew}
        />
        <AniKidsPrimaryList
          title="이건 꼭 봐야해!"
          video={tvVideos}
          data={aniPrimary}
        />
        <AniKidsHotList
          title="NEW! 새로 올라왔어요"
          video={tvVideos}
          data={aniHot}
        />
      </div>

      <AniKidsEditorRecommendCardList title="웨이브 애니메이션 추천작" />
    </main>
  );
};

export default Animation;
