import { useEffect } from "react";
import EntEditorRecommendCardList from "../components/EntEditorRecommendCardList";
import EntertainmentVisual from "../components/EntertainmentVisual";
import EntertainmetTop10 from "../components/EntertainmetTop10";
import EntHotList from "../components/EntHotList";

import EntNewList from "../components/EntNewList";
import EntNewList2 from "../components/EntNewList2";
import { varietyTop50 } from "../data/2025_varietyTop50_tmdb";
import { useVarietyStore } from "../stores/useVarietyStore";
import "./scss/Enter.scss";

const Entertainment = () => {
  const { tvVideos, onFetchVariety } = useVarietyStore();

  useEffect(() => {
    varietyTop50.forEach((v) => {
      if (v.tmdb_id) {
        onFetchVariety(v.tmdb_id);
      }
    });
  }, [onFetchVariety]);
  return (
    <main className="entertainment-wrap">
      <EntertainmentVisual
        title="예능"
        subtitle="웃음이 필요한 순간"
        leftSrc="/images/bg-entertainment-left.svg"
        rightSrc="/images/bg-entertainment-right.svg"
        height={680}
      />
      <div className="inner">
        <EntertainmetTop10 title="예능 실시간 TOP10" />
        <EntNewList title="지금 주목받는 예능" video={tvVideos} />
        <EntNewList2 title="이건 꼭 봐야해!" video={tvVideos} />
        <EntHotList title="NEW! 새로 올라온 예능" video={tvVideos} />
      </div>
      <EntEditorRecommendCardList title="웨이브 예능 추천작" />
    </main>
  );
};

export default Entertainment;
