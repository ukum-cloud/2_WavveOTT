import { useEffect } from "react";
import KidsVisual from "../components/KidsVisual";
import { useVarietyStore } from "../stores/useVarietyStore";

import { kidsTop20 } from "../data/kidsTop20";
import { kidsNew } from "../data/kidsNew";
import { kidsEdu } from "../data/kidsEdu";
import { KidsEng50 } from "../data/kidsEngTop50";
import { kidsTV } from "../data/kidsTVmanhwa";
import { kidsSong } from "../data/kidsSongs";

import AniKidsRankingList from "../components/AniKidsRankingList";
import AniKidsPrimaryList from "../components/AniKidsPrimaryList";
// import AniKidsNewList from "../components/AniKidsNewList";
import KidsWavveList from "../components/KidsWavveList";

import "./scss/Kids.scss";

const Kids = () => {
  const { tvVideos, onFetchVariety } = useVarietyStore();

  useEffect(() => {
    kidsTop20.forEach((v) => {
      if (v.tmdb_id) {
        onFetchVariety(v.tmdb_id);
      }
    });
    kidsTV.forEach((v) => {
      if (v.tmdb_id) {
        onFetchVariety(v.tmdb_id);
      }
    });
    // kidsNew.forEach((v) => {
    //   if (v.tmdb_id) {
    //     onFetchVariety(v.tmdb_id);
    //   }
    // });
  }, [onFetchVariety]);

  return (
    <main className="kids-home">
      <KidsVisual />
      <div className="inner">
        <AniKidsRankingList title="키즈 실시간 TOP 20" data={kidsTop20} />
        <KidsWavveList
          title="NEW! 새로 올라왔어요"
          video={tvVideos}
          data={kidsNew}
        />
        <KidsWavveList
          title="볼수록 유익해 #교육"
          video={tvVideos}
          data={kidsEdu}
        />
        <KidsWavveList
          title="Hello #영어로 말해요"
          video={tvVideos}
          data={KidsEng50}
        />
        <KidsWavveList
          title="같이 불러요! #동요"
          video={tvVideos}
          data={kidsSong}
        />
        <AniKidsPrimaryList
          title="시선 집중! #TV만화"
          video={tvVideos}
          data={kidsTV}
        />
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
