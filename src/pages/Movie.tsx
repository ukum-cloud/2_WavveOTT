import React, { useEffect, useMemo } from "react";
import MovieVisual from "../components/MovieVisual";
import EditorRecommendCardList from "../components/EditorRecommendCardList";
import { useMovieStore } from "../stores/useMovieStore";
import RankingCardList from "../components/RankingCardList";
import PrimaryList from "../components/PrimaryList";
import NewMovieList from "../components/NewMovieList";
import WavveList from "../components/WavveList";
import type { MovieWithLogo, OnlyWavve, PrimaryItem } from "../types/movie";
import "./scss/Movie.scss";

const Movie: React.FC = () => {
  const {
    popularMovies,
    newMovies,
    topRatedMovies = [],
    onFetchPopular,
    onFetchNewMovie,
    onFetchTopRated,
  } = useMovieStore();

  // useEffect 의존성 경고 해결
  useEffect(() => {
    if (popularMovies.length === 0) onFetchPopular();
    if (newMovies.length === 0) onFetchNewMovie();
    if (topRatedMovies.length === 0) onFetchTopRated();
  }, [
    onFetchPopular,
    onFetchNewMovie,
    onFetchTopRated,
    popularMovies.length,
    newMovies.length,
    topRatedMovies.length,
  ]);

  const currentMonth = new Date().getMonth() + 1;

  // 1. [신작] 필터링 - any 제거
  const recentOneMonthMovies = useMemo(() => {
    if (!newMovies || newMovies.length === 0) return [];
    const today = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setDate(today.getDate() - 30);

    return newMovies.filter((movie: MovieWithLogo) => {
      if (!movie.release_date) return false;
      const releaseDate = new Date(movie.release_date);
      return releaseDate >= oneMonthAgo && releaseDate <= today;
    });
  }, [newMovies]);

  // 2. [WavveList용] 매핑 - any 제거 및 certification 대응
  const formattedTopRated = useMemo((): OnlyWavve[] => {
    if (!topRatedMovies.length) return [];
    return topRatedMovies.slice(0, 10).map((m: MovieWithLogo) => ({
      ...m,
      name: m.title || "", // WavveList 전용 name
      wavveVideo: m.videos?.[0] || null, // m.wavveVideo.key 대응
      media_type: "tv" as const,
    })) as unknown as OnlyWavve[];
  }, [topRatedMovies]);

  // 3. [PrimaryList용] 매핑 - any 제거 및 certification 대응
  const safeRandomList = useMemo((): PrimaryItem[] => {
    if (!topRatedMovies.length) return [];

    const targetGenres = [28, 18, 10749, 35];
    const filtered = topRatedMovies
      .slice(10)
      .filter((m: MovieWithLogo) =>
        m.genre_ids?.some((id: number) => targetGenres.includes(id))
      );

    const baseList =
      filtered.length > 0 ? filtered : topRatedMovies.slice(10, 25);

    return baseList.map((m: MovieWithLogo) => ({
      ...m,
      id: m.id,
      title: m.title || "",
      name: m.title || "",
      mediaType: "movie" as const,
      certification: m.certification || "",
    })) as unknown as PrimaryItem[];
  }, [topRatedMovies]);

  if (popularMovies.length === 0 || topRatedMovies.length === 0) {
    return (
      <div
        style={{
          color: "#fff",
          padding: "100px",
          textAlign: "center",
          backgroundColor: "#000",
          height: "100vh",
        }}
      >
        데이터를 불러오는 중입니다...
      </div>
    );
  }

  return (
    <main className="sub-movie-main">
      <MovieVisual />
      <div className="inner">
        <section className="card-list">
          <RankingCardList
            RankingData={popularMovies}
            title="영화 실시간 TOP 10"
            limit={10}
          />
        </section>

        <section className="card-list">
          <WavveList
            title="시간이 흘러도 사랑받는 명작"
            wavves={formattedTopRated}
          />
        </section>

        <section className="card-list">
          <PrimaryList title="이건 꼭 봐야해!" randomList={safeRandomList} />
        </section>

        <section className="card-list">
          <NewMovieList
            title={`${currentMonth}월 신작 영화`}
            newMovies={
              recentOneMonthMovies.length > 0
                ? recentOneMonthMovies
                : newMovies.slice(0, 15)
            }
          />
        </section>
      </div>

      <EditorRecommendCardList
        title="웨이브 영화 추천작"
        list={popularMovies}
      />
    </main>
  );
};

export default Movie;
