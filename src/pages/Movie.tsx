import React from "react";
import MovieVisual from "../components/MovieVisual";
import EditorRecommendCardList from "../components/EditorRecommendCardList";
import { useMovieStore } from "../stores/useMovieStore";

const Movie: React.FC = () => {
  const { popularMovies } = useMovieStore();

  return (
    <main>
      {/* 분리된 비주얼 컴포넌트 */}
      <MovieVisual />

      <div className="inner">
        <section className="card-list">
          <h2>영화 실시간 TOP 10</h2>
          <div>내용</div>
        </section>
        <section className="card-list">
          <h2>지금 주목받는 영화</h2>
          <div>내용</div>
        </section>

        <section className="card-list">
          <h2>이건 꼭 봐야해!</h2>
          <div>내용</div>
        </section>

        <section className="card-list">
          <h2>NEW! 새로 올라왔어요</h2>
          <div>내용</div>
        </section>
      </div>

      <EditorRecommendCardList
        title="웨이브 영화  추천작"
        list={popularMovies}
      />
    </main>
  );
};

export default Movie;
