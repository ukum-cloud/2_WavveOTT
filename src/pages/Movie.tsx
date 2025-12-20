import React, { useEffect, useMemo, useState } from "react";
import MovieVisual from "../components/MovieVisual";
import EditorRecommendCardList from "../components/EditorRecommendCardList";
import { useMovieStore } from "../stores/useMovieStore";
import RankingCardList from "../components/RankingCardList";
import CommonCardList from "../components/CommonCardList";
import LoadingBar from "../components/LoadingBar";

import type { UnifiedData } from "../types/movieTypes";
import "./scss/Movie.scss";

// API 호출 설정
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

const Movie: React.FC = () => {
  const {
    popularMovies,
    newMovies,
    topRatedMovies = [],
    onFetchPopular,
    onFetchNewMovie,
    onFetchTopRated,
  } = useMovieStore();

  const [isLoading, setIsLoading] = useState(true);
  
  // CommonCardList를 위한 전용 데이터 상태
  const [fullRomanceList, setFullRomanceList] = useState<UnifiedData[]>([]);
  const [fullMasterpieceList, setFullMasterpieceList] = useState<UnifiedData[]>([]);
  const [fullActionList, setFullActionList] = useState<UnifiedData[]>([]);

  // 영화 상세 정보를 가져오는 공통 함수
  const fetchMovieDetails = async (movie: any) => {
    try {
      // 비디오 정보
      const videoRes = await fetch(
        `${BASE_URL}/movie/${movie.id}/videos?api_key=${API_KEY}&language=ko-KR`
      );
      const videoData = await videoRes.json();
      
      // 등급 정보
      const certRes = await fetch(
        `${BASE_URL}/movie/${movie.id}/release_dates?api_key=${API_KEY}`
      );
      const certData = await certRes.json();
      const krRelease = certData.results?.find((r: any) => r.iso_3166_1 === "KR");
      const certification = krRelease?.release_dates?.[0]?.certification || "NR";
      
      // 로고 이미지 정보
      const imageRes = await fetch(
        `${BASE_URL}/movie/${movie.id}/images?api_key=${API_KEY}`
      );
      const imageData = await imageRes.json();
      const logo = imageData.logos?.find((img: any) => 
        img.iso_639_1 === "ko" || img.iso_639_1 === "en"
      );
      
      return {
        ...movie,
        media_type: "movie" as const,
        videos: videoData.results || [],
        key: videoData.results?.[0]?.key || null,
        certificationMovie: certification,
        logo: logo?.file_path || null
      };
    } catch (error) {
      console.error(`영화 ${movie.id} 정보 가져오기 실패:`, error);
      return { 
        ...movie, 
        media_type: "movie" as const, 
        videos: [], 
        key: null,
        certificationMovie: "NR",
        logo: null
      };
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // 1. 기존 스토어 데이터 (랭킹/추천용)
        const storePromises = [
          popularMovies.length === 0 ? onFetchPopular() : Promise.resolve(),
          newMovies.length === 0 ? onFetchNewMovie() : Promise.resolve(),
          topRatedMovies.length === 0 ? onFetchTopRated() : Promise.resolve(),
        ];

        // 2. 로맨틱 코미디 가져오기 (로맨스 + 코미디) - 애니메이션 제외
        const fetchRomance = async () => {
          const limit = 40;
          console.log(`로맨틱 코미디 (로맨스+코미디, 평점 7.0 이상) 최대 ${limit}개 데이터 가져오는 중...`);
          
          const pagesNeeded = Math.ceil(limit / 20);
          const pages = Array.from({ length: pagesNeeded }, (_, i) => i + 1);
          
          const romancePromises = pages.map(page =>
            // 로맨스(10749) + 코미디(35), 애니메이션 제외
            fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=10749,35&without_genres=16&sort_by=popularity.desc&vote_count.gte=300&vote_average.gte=7.0&language=ko-KR&page=${page}`)
              .then(res => res.json())
          );
          
          const results = await Promise.all(romancePromises);
          const combined = results.flatMap(data => data.results || []);
          
          console.log('로맨틱 코미디 원본 데이터:', combined.slice(0, 10).map(m => ({ 
            title: m.title, 
            vote_average: m.vote_average,
            vote_count: m.vote_count,
            genre_ids: m.genre_ids 
          })));
          
          // 중복 제거
          const unique = Array.from(new Map(combined.map(m => [m.id, m])).values());
          const topN = unique.slice(0, limit);
          
          console.log(`로맨틱 코미디 기본 데이터: ${topN.length}개`);
          
          const moviesWithDetails = await Promise.all(
            topN.map(movie => fetchMovieDetails(movie))
          );
          
          console.log(`로맨틱 코미디 최종 데이터: ${moviesWithDetails.length}개`);
          console.log('로맨틱 코미디 TOP 10:', moviesWithDetails.slice(0, 10).map(m => `${m.title} (평점: ${m.vote_average})`));
          
          setFullRomanceList(moviesWithDetails);
        };

        // 3. 인생 명작 가져오기 - 애니메이션 제외
        const fetchMasterpiece = async () => {
          const limit = 40;
          console.log(`인생 명작 최대 ${limit}개 데이터 가져오는 중...`);
          
          const pagesNeeded = Math.ceil(limit / 20);
          const pages = Array.from({ length: pagesNeeded }, (_, i) => i + 1);
          
          const masterpiecePromises = pages.map(page =>
            // 애니메이션(16) 제외
            fetch(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}&without_genres=16&language=ko-KR&page=${page}`)
              .then(res => res.json())
          );
          
          const results = await Promise.all(masterpiecePromises);
          const combined = results.flatMap(data => data.results || []);
          
          // 추가 필터: 애니메이션 genre_ids에 16 포함된 것 제거
          const filtered = combined.filter((movie: any) => 
            !movie.genre_ids?.includes(16)
          );
          
          const topN = filtered.slice(0, limit);
          
          console.log(`인생 명작 기본 데이터: ${topN.length}개 (애니메이션 제외됨)`);
          
          const moviesWithDetails = await Promise.all(
            topN.map(movie => fetchMovieDetails(movie))
          );
          
          console.log(`인생 명작 최종 데이터: ${moviesWithDetails.length}개`);
          console.log('인생 명작 샘플:', moviesWithDetails.slice(0, 5).map(m => m.title));
          
          setFullMasterpieceList(moviesWithDetails);
        };

        // 액션 영화 가져오기 (장르 ID: 28) - 애니메이션 제외
        const fetchAction = async () => {
          const limit = 40;
          console.log(`액션 영화 최대 ${limit}개 데이터 가져오는 중...`);
          
          const pagesNeeded = Math.ceil(limit / 20);
          const pages = Array.from({ length: pagesNeeded }, (_, i) => i + 1);
          
          const actionPromises = pages.map(page =>
            // 액션(28), 애니메이션 제외, 인기순
            fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=28&without_genres=16&sort_by=popularity.desc&vote_count.gte=500&vote_average.gte=7.0&language=ko-KR&page=${page}`)
              .then(res => res.json())
          );
          
          const results = await Promise.all(actionPromises);
          const combined = results.flatMap(data => data.results || []);
          
          console.log('액션 영화 원본 데이터:', combined.slice(0, 10).map(m => ({ 
            title: m.title, 
            vote_average: m.vote_average,
            genre_ids: m.genre_ids 
          })));
          
          // 중복 제거
          const unique = Array.from(new Map(combined.map(m => [m.id, m])).values());
          const topN = unique.slice(0, limit);
          
          console.log(`액션 영화 기본 데이터: ${topN.length}개`);
          
          const moviesWithDetails = await Promise.all(
            topN.map(movie => fetchMovieDetails(movie))
          );
          
          console.log(`액션 영화 최종 데이터: ${moviesWithDetails.length}개`);
          console.log('액션 영화 TOP 10:', moviesWithDetails.slice(0, 10).map(m => m.title));
          
          setFullActionList(moviesWithDetails);
        };

        // 데이터는 넉넉하게 가져오고, 표시는 CommonCardList에서 제한
        await Promise.all([
          ...storePromises, 
          fetchRomance(),
          fetchMasterpiece(),
          fetchAction()
        ]);
        
        console.log('모든 데이터 로드 완료!');
      } catch (error) {
        console.error("전체 데이터 호출 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, [popularMovies.length, newMovies.length, topRatedMovies.length, onFetchPopular, onFetchNewMovie, onFetchTopRated]);

  const currentMonth = new Date().getMonth() + 1;

  // 신작 리스트 필터링 (최근 두달 신작)
  const recentOneMonthMovies = useMemo((): UnifiedData[] => {
    if (!newMovies?.length) return [];
    const now = Date.now();
    const oneMonthAgo = now - 60 * 24 * 60 * 60 * 1000;
    const filtered = newMovies.filter((movie) => {
      if (!movie.release_date) return false;
      const releaseTime = new Date(movie.release_date).getTime();
      return releaseTime >= oneMonthAgo && releaseTime <= now;
    });
    return (filtered.length > 0 ? filtered : newMovies.slice(0, 15)).map(m => ({ ...m, media_type: 'movie' }));
  }, [newMovies]);

  if (isLoading || popularMovies.length === 0) {
    return <LoadingBar />;
  }

  return (
    <main className="sub-movie-main">
      <MovieVisual />

      <div className="inner">
        {/* 실시간 랭킹 */}
        <RankingCardList RankingData={popularMovies} title="영화 실시간 TOP 10" limit={10} />

        {/* 로맨틱 코미디 */}
        {fullRomanceList.length > 0 && (
          <CommonCardList 
            title="달달하고 웃긴 로맨틱 코미디 추천" 
            items={fullRomanceList}
            count={40}
          />
        )}

        {/* 인생 명작 */}
        {fullMasterpieceList.length > 0 && (
          <CommonCardList 
            title="시간이 흘러도 사랑받는 인생 명작" 
            items={fullMasterpieceList}
            count={40}
            />
          )}

        {/* 액션 */}
        {fullActionList.length > 0 && (
          <CommonCardList 
          title="스릴 넘치는 액션 블록버스터" 
          items={fullActionList}
          count={40}
          />
        )}

        {/* 신작 리스트 */}
        <CommonCardList
          title={`${currentMonth}월 신작 영화`}
          items={recentOneMonthMovies}
        />
      </div>

      <EditorRecommendCardList title="웨이브 영화 추천작" list={popularMovies} />
    </main>
  );
};

export default Movie;