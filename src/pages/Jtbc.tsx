import { useEffect } from "react";
import { useVarietyStore } from "../stores/useVarietyStore";
import JTBCVisual from "../components/JtbcVisual";

import { JTBCing } from "../data/JTBCing";
import { JTBCDrama } from "../data/JTBCDrama";
import { JTBCVariety } from "../data/JTBCVariety";
import { JTBCNews } from "../data/JTBCNews";
import { JTBCHealing } from "../data/JTBCHealing";

import AniKidsEditorRecommendCardList from "../components/AniKidsEditorRecommendCardList";
import KidsWavveList from "../components/KidsWavveList";

import "./scss/Kids.scss";

const JTBC = () => {
  const { tvVideos, onFetchVariety } = useVarietyStore();

  useEffect(() => {
    JTBCing.forEach((v) => {
      if (v.tmdb_id) {
        onFetchVariety(v.tmdb_id);
      }
    });
    JTBCDrama.forEach((v) => {
      if (v.tmdb_id) {
        onFetchVariety(v.tmdb_id);
      }
    });
    JTBCVariety.forEach((v) => {
      if (v.tmdb_id) {
        onFetchVariety(v.tmdb_id);
      }
    });
    JTBCNews.forEach((v) => {
      if (v.tmdb_id) {
        onFetchVariety(v.tmdb_id);
      }
    });
  }, [onFetchVariety]);

  return (
    <main className="kids-home">
      <JTBCVisual />
      <div className="inner">
        <KidsWavveList title="JTBC 방영 중인 프로그램" video={tvVideos} data={JTBCing} />
        <KidsWavveList title="JTBC 드라마" video={tvVideos} data={JTBCDrama} />
        <KidsWavveList title="JTBC 예능" video={tvVideos} data={JTBCVariety} />
        <KidsWavveList title="JTBC 시사" video={tvVideos} data={JTBCNews} />
        <AniKidsEditorRecommendCardList title="JTBC 힐링" data={JTBCHealing} />
      </div>
    </main>
  );
};

export default JTBC;
