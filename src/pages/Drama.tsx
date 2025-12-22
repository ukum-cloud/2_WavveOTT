import { useEffect } from "react";
import { useVarietyStore } from "../stores/useVarietyStore";

import DramaVisual from "../components/DramaVisual";
import AniKidsRankingList from "../components/AniKidsRankingList";
import AniKidsHotList from "../components/AniKidsHotList";
import AniKidsPrimaryList from "../components/AniKidsPrimaryList";
import AniKidsNewList from "../components/AniKidsNewList";
import DramaEditorRecommendList from "../components/DramaEditorRecommendList";

import { dramaHot } from "../data/dramaHot";
import { dramaPrimary } from "../data/dramaPrimary";
import { dramaNew } from "../data/dramaNew";
import { dramaTop10 } from "../data/dramaTop10";

import "./scss/Animation.scss";

const Drama = () => {
  const { tvVideos, onFetchVariety } = useVarietyStore();

  useEffect(() => {
    dramaTop10.forEach((v) => {
      if (v.tmdb_id) {
        onFetchVariety(v.tmdb_id);
      }
    });
    dramaPrimary.forEach((v) => {
      if (v.tmdb_id) {
        onFetchVariety(v.tmdb_id);
      }
    });
    dramaHot.forEach((v) => {
      if (v.tmdb_id) {
        onFetchVariety(v.tmdb_id);
      }
    });
    dramaPrimary.forEach((v) => {
      if (v.tmdb_id) {
        onFetchVariety(v.tmdb_id);
      }
    });
  }, [onFetchVariety]);

  return (
    <main className="ani-home">
      {/* 분리된 비주얼 컴포넌트 */}
      <DramaVisual />

      <div className="inner">
        <AniKidsRankingList title="드라마 실시간 TOP10" data={dramaTop10} />
        <AniKidsNewList title="지금 주목받는 드라마" video={tvVideos} data={dramaHot} />
        <AniKidsPrimaryList title="이건 꼭 봐야해!" video={tvVideos} data={dramaPrimary} />
        <AniKidsHotList title="NEW! 새로 올라왔어요" video={tvVideos} data={dramaNew} />
      </div>

      <DramaEditorRecommendList title="웨이브 드라마 추천작" />
    </main>
  );
};

export default Drama;

// import { useEffect } from "react";
// import { useTvStore } from "../stores/useTvStore";
// import { useNavigate } from "react-router-dom";
// import DramaRankingCardList from "../components/DramaRankingCardList";
// import DramaCardList from "../components/DramaCardList";
// import DramaEditorRecommendCardList from "../components/DramaEditorRecommendCardList";
// import DramaVisual from "../components/DramaVisual";
// import "./scss/Drama.scss";

// const Drama = () => {
//   const navigate = useNavigate();
//   const { tvs, onFetchTv } = useTvStore();

//   useEffect(() => {
//     void onFetchTv();
//   }, [onFetchTv]);

//   const goDetail = (id: number) => navigate(`/contentsdetail/tv/${id}`);

//   const editorDramas = tvs.slice(0, 10); // 임시: 상단 10개

//   if (!tvs || tvs.length === 0) {
//     return <div>드라마 불러오는 중</div>;
//   }

//   // const top10 = tvs.slice(0, 10);
//   // const top10ForRank = top10.map((tv) => ({
//   //   id: tv.id,
//   //   title: tv.name,
//   //   poster_path: tv.poster_path,
//   // }));

//   const spotlight = tvs.slice(5, 15);
//   const mustWatch = tvs.slice(8, 18);
//   const newArrivals = tvs;

//   // const poster = (path?: string | null) =>
//   //   path ? `https://image.tmdb.org/t/p/w500${path}` : "/images/no-poster.png";

//   return (
//     <main className="sub-drama-main">
//       <DramaVisual />

//       <div className="inner">
//         <DramaRankingCardList
//           title="드라마 실시간 TOP 10"
//           data={tvs}
//           limit={10}
//         />

//         <DramaCardList
//           title="지금 주목받는 드라마"
//           items={spotlight}
//           onClick={goDetail}
//         />

//         <DramaCardList
//           title="이건 꼭 봐야해!"
//           items={mustWatch}
//           onClick={goDetail}
//         />

//         <DramaCardList
//           title="NEW! 새로 올라온 드라마"
//           items={newArrivals}
//           onClick={goDetail}
//         />

//         <DramaEditorRecommendCardList title="웨이브 드라마 추천작" list={editorDramas} />
//       </div>
//     </main>
//   );
// };

// export default Drama;
