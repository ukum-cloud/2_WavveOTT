import { useEffect } from "react";
import KidsVisual from "../components/KidsVisual";
import { useVarietyStore } from "../stores/useVarietyStore";

import { kidsTop20 } from "../data/kidsTop20";
// import { aniPrimary } from "../data/aniPrimary";
// import { aniHot } from "../data/aniHot";
// import { aniNew } from "../data/aniNew";

import AniKidsRankingList from "../components/AniKidsRankingList";
// import AniKidsHotList from "../components/AniKidsHotList";
// import AniKidsPrimaryList from "../components/AniKidsPrimaryList";
// import AniKidsNewList from "../components/AniKidsNewList";
import "./scss/Kids.scss";

const Kids = () => {
  const { tvVideos, onFetchVariety } = useVarietyStore();

  useEffect(() => {
    kidsTop20.forEach((v) => {
      if (v.tmdb_id) {
        onFetchVariety(v.tmdb_id);
      }
    });
    //     kidsHot.forEach((v) => {
    //       if (v.tmdb_id) {
    //         onFetchVariety(v.tmdb_id);
    //       }
    //     });
    //     kidsNew.forEach((v) => {
    //       if (v.tmdb_id) {
    //         onFetchVariety(v.tmdb_id);
    //       }
    //     });
  }, [onFetchVariety]);

  return (
    <main>
      <KidsVisual />
      <div className="inner">
        <AniKidsRankingList title="키즈 실시간 TOP 20" data={kidsTop20} />
        {/* <AniKidsNewList title="NEW! 새로 올라왔어요" video={tvVideos} /> */}
        {/* <AniKids title="볼수록 유익해 #교육" video={tvVideos} />
        <AniKids title="Hello #영어로 말해요" video={tvVideos} />
        <AniKids title="같이 불러요! #동요" video={tvVideos} />
        <AniKids title="시선 집중! #TV만화" video={tvVideos} /> */}
        {/* <section className="card-list">
                    <h2>제목입니다</h2>
                    <div>내용</div>
                </section>
                <section className="card-list">
                    <h2>제목입니다</h2>
                    <div>내용</div>
                </section>
                <div className="">inner 안에서만 보여지면 되는 컨텐츠</div> */}
      </div>
    </main>
  );
};

export default Kids;
