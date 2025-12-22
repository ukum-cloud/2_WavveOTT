import { useEffect, useState } from "react";
import OverseasVisual from "../components/OverseasVisual";
import { useVarietyStore } from "../stores/useVarietyStore";

import { overseasTop20 } from "../data/overseasTop20";
import { overseasNewFun } from "../data/overseasNewFun";
import { overseasLimit } from "../data/overseasLimit";
import { overseasNew } from "../data/overseasNew";
import { overseasEditor } from "../data/overseasEditor";

import AniKidsRankingList from "../components/AniKidsRankingList";
import AniKidsEditorRecommendCardList from "../components/AniKidsEditorRecommendCardList";
import KidsWavveList from "../components/KidsWavveList";
import "./scss/OverseasSeries.scss";

const OverseasSeries = () => {
  const { tvVideos, onFetchVariety } = useVarietyStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      // isLoading을 쓰지 않고, 데이터가 들어오는 대로 화면에 그리도록 함
      const targetIds = overseasTop20
        .map((v) => v.tmdb_id)
        .filter((id): id is number => id !== null);

      // Promise.all을 쓰되, 화면 전체를 block하지 않음
      try {
        await Promise.all(targetIds.map((id) => onFetchVariety(id)));
      } finally {
        setIsLoading(false); // 데이터 로딩 완료 후 스켈레톤 제거
      }
    };
    fetchAllData();
  }, [onFetchVariety]);

  return (
    <main className="overseas-home">
      <OverseasVisual />
      <div className="inner">
        <AniKidsRankingList title="해외시리즈 실시간 TOP 20" data={overseasTop20} />
        {/* API 데이터가 필요한 리스트들 */}
        {isLoading ? (
          <div className="skeleton-container">대신 예쁜 회색 박스들...</div>
        ) : (
          <>
            <KidsWavveList title="새로운 즐거움의 발견" video={tvVideos} data={overseasNewFun} />
            <KidsWavveList title="종료예정 콘텐츠" video={tvVideos} data={overseasLimit} />
            <KidsWavveList
              title="NEW! 새로 올라온 해외시리즈"
              video={tvVideos}
              data={overseasNew}
            />
          </>
        )}

        <AniKidsEditorRecommendCardList title="웨이브 에디터 추천 컬렉션" data={overseasEditor} />
      </div>
    </main>
  );
};

export default OverseasSeries;
