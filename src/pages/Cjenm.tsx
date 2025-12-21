import { useEffect } from "react";
import CJenmVisual from "../components/CJenmVisual";
import { useVarietyStore } from "../stores/useVarietyStore";

import { CJtvN } from "../data/CJtvN";
import { CJMovie } from "../data/CJMovie";
import { CJChaina } from "../data/CJChaina";
import { CJTooniverse } from "../data/CJTooniverse";
import { CJOCN } from "../data/CJOCN";

import AniKidsEditorRecommendCardList from "../components/AniKidsEditorRecommendCardList";
import KidsWavveList from "../components/KidsWavveList";

import "./scss/Kids.scss";

const CJenm = () => {
  const { tvVideos, onFetchVariety } = useVarietyStore();

  useEffect(() => {
    CJtvN.forEach((v) => {
      if (v.tmdb_id) {
        onFetchVariety(v.tmdb_id);
      }
    });
    CJChaina.forEach((v) => {
      if (v.tmdb_id) {
        onFetchVariety(v.tmdb_id);
      }
    });
    CJTooniverse.forEach((v) => {
      if (v.tmdb_id) {
        onFetchVariety(v.tmdb_id);
      }
    });
  }, [onFetchVariety]);

  return (
    <main className="kids-home">
      <CJenmVisual />
      <div className="inner">
        <KidsWavveList
          title="즐거움엔 끝이 없다 tvN"
          video={tvVideos}
          data={CJtvN}
        />
        <KidsWavveList
          title="대한민국 대표 영화 스튜디오 CJ ENM"
          video={tvVideos}
          data={CJMovie}
        />
        <KidsWavveList
          title="차이나는 즐거움"
          video={tvVideos}
          data={CJChaina}
        />
        <KidsWavveList
          title="애니메이션 전문 채널 #투니버스"
          video={tvVideos}
          data={CJTooniverse}
        />
        <AniKidsEditorRecommendCardList
          title="장르물의 대가 OCN 드라마"
          data={CJOCN}
        />
      </div>
    </main>
  );
};

export default CJenm;
