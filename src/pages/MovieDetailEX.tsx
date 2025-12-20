import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { usePickStore } from "../stores/usePickStore";

import { getGenres, getGrades } from "../utils/mapping";
import { getContentImages } from "../utils/getData";

import MovieRecommend from "../components/MovieRecommend";
import MovieRelative from "../components/MovieRelative";
import Modal from "../components/Modal";
import LoadingBar from "../components/LoadingBar"; 

import { useAuthStore } from "../stores/useAuthStore";
import { saveWatchHistory } from "../firebase/firebase";

import type { CreditPerson } from "../types/movie";

import "./scss/ContentsDetail.scss";

// API 호출 설정
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

const MovieDetailEX = () => {
  const { user, selectedCharId } = useAuthStore();
  const { type, id } = useParams<{ type: string; id: string }>();
  const navigate = useNavigate();
  
  const { onTogglePick, pickList, pickAction } = usePickStore();

  const [shareOpen, setShareOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("relative");
  const [showVideo, setShowVideo] = useState(false);
  const [isWatched, setIsWatched] = useState(false);
  const [modalSize, setModalSize] = useState<"xsmall" | "small" | "default" | "large">("default");
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // ✨ 영화 상세 데이터를 저장할 state
  const [selectedContent, setSelectedContent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [popularMovies, setPopularMovies] = useState<any[]>([]);

  // ✨ 영화 상세 정보 가져오기
  useEffect(() => {
    const fetchMovieDetail = async () => {
      if (!id || type !== "movie") return;
      
      setIsLoading(true);
      
      try {
        console.log(`🎬 영화 ID ${id} 상세 정보 가져오는 중...`);
        
        // 1. 영화 기본 정보
        const movieRes = await fetch(
          `${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=ko-KR`
        );
        const movieData = await movieRes.json();
        
        // 2. 비디오 정보
        const videoRes = await fetch(
          `${BASE_URL}/movie/${id}/videos?api_key=${API_KEY}&language=ko-KR`
        );
        const videoData = await videoRes.json();
        
        // 3. 크레딧 정보 (출연진, 감독, 작가)
        const creditRes = await fetch(
          `${BASE_URL}/movie/${id}/credits?api_key=${API_KEY}&language=ko-KR`
        );
        const creditData = await creditRes.json();
        
        // 4. 등급 정보
        const certRes = await fetch(
          `${BASE_URL}/movie/${id}/release_dates?api_key=${API_KEY}`
        );
        const certData = await certRes.json();
        
        // 한국 등급 찾기
        const krRelease = certData.results?.find((r: any) => r.iso_3166_1 === "KR");
        const certification = krRelease?.release_dates?.[0]?.certification || "NR";
        
        // 5. 이미지 정보 (로고)
        const imageRes = await fetch(
          `${BASE_URL}/movie/${id}/images?api_key=${API_KEY}`
        );
        const imageData = await imageRes.json();
        
        // 로고 찾기
        const logo = imageData.logos?.find((img: any) => img.iso_639_1 === "ko" || img.iso_639_1 === "en");
        
        // 감독과 작가 분리
        const director = creditData.crew?.filter((c: any) => c.job === "Director") || [];
        const writer = creditData.crew?.filter((c: any) => 
          c.job === "Writer" || c.job === "Screenplay" || c.job === "Story"
        ) || [];
        
        // 통합 데이터 생성
        const fullMovieData = {
          ...movieData,
          media_type: "movie",
          videos: videoData.results || [],
          key: videoData.results?.[0]?.key || null,
          creditData: {
            cast: creditData.cast || [],
            crew: creditData.crew || []
          },
          director,
          writer,
          certificationMovie: certification,
          logo: logo?.file_path || null,
          genre_ids: movieData.genres?.map((g: any) => g.id) || []
        };
        
        setSelectedContent(fullMovieData);
        
        // 추천 영화 목록도 가져오기
        const popularRes = await fetch(
          `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=ko-KR&page=1`
        );
        const popularData = await popularRes.json();
        setPopularMovies(popularData.results || []);
        
      } catch (error) {
        console.error("❌ 영화 상세 정보 가져오기 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMovieDetail();
  }, [id, type]);

  const videoKey = selectedContent?.videos?.[0]?.key;
  
  const { background, logo } = selectedContent
    ? getContentImages(selectedContent)
    : { background: null, logo: null };

  useEffect(() => {
    if (!videoKey) {
      setShowVideo(false);
      return;
    }
    const timer = setTimeout(() => setShowVideo(true), 3000);
    return () => clearTimeout(timer);
  }, [videoKey]);

  // ✨ 로딩 중일 때 로딩바 표시
  if (isLoading) {
    return (
      <div className="loading-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <LoadingBar />
      </div>
    );
  }

  // 데이터 로드 실패 시
  if (!selectedContent) {
    return (
      <div className="loading-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#fff' }}>
        <p>❌ 콘텐츠를 찾을 수 없습니다.</p>
      </div>
    );
  }

  const hasVideos = (selectedContent.videos && selectedContent.videos.length > 0) || false;
  const visibleMenu = hasVideos ? activeMenu : "recommend";

  const isPicked = pickList.some(
    (p) => (p.contentId || p.id) === selectedContent.id
  );

  const handleHeart = async () => {
    await onTogglePick(selectedContent);
    setModalSize("small");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const certificationValue = selectedContent.certificationMovie || "NR";

  const handlePlayClick = async () => {
    if (user && selectedCharId && selectedContent) {
      try {
        await saveWatchHistory(
          user.uid,
          selectedCharId,
          {
            id: selectedContent.id,
            title: selectedContent.title || "",
            backdrop_path: selectedContent.backdrop_path || "",
            poster_path: selectedContent.poster_path || "",
            runtime: selectedContent.runtime || 0,
          },
          "movie",
          0
        );
      } catch (error) {
        console.error("❌ 저장 실패:", error);
      }
    }
    setIsWatched(true);
    if (videoKey) navigate(`/player/${videoKey}`);
  };

  return (
    <main className="main-detail">
      <div className="inner">
        <div className="detail-left">
          <div className="detail-img-box">
            {(!showVideo || !videoKey) && background && (
              <>
                <p className="detail-backdrop">
                  <img src={background} alt={selectedContent.title} />
                </p>
                {logo && (
                  <p className="detail-logo">
                    <img src={logo} alt="logo" style={{ height: '70px', objectFit: 'contain' }} />
                  </p>
                )}
              </>
            )}

            {showVideo && videoKey && (
              <iframe
                key={videoKey}
                className="detail-video"
                src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&mute=1&controls=0&rel=0`}
                title="trailer"
                allow="autoplay; encrypted-media"
              />
            )}
          </div>
          
          <div className="detail-title-box">
            <div className="detail-title-left">
              <p className="title-certification">
                <img src={getGrades(certificationValue)} alt="grade" />
              </p>
              <p className="title-star"></p>
              <p className="title-vote seperate">{selectedContent.vote_average?.toFixed(1) || "0.0"}</p>
              <p className="title-genre seperate">
                {getGenres(selectedContent.genre_ids || []).slice(0, 2).join(" · ")}
              </p>
              <p className="title-episode">{selectedContent.runtime || 0}분</p>
            </div>
            <div className="detail-title-right">
              <button className={`detail-heart-btn ${isPicked ? "active" : ""}`} onClick={handleHeart}></button>
              <button className="detail-share-btn" onClick={() => setShareOpen(true)}></button>
            </div>
          </div>

          <div className="detail-text-box">
            <div className="detail-content">
              <div className="detail-content-left">
                <h3>줄거리</h3>
                <p>{selectedContent.overview || "제공된 줄거리 정보가 없습니다."}</p>
              </div>
              <div className="detail-content-right">
                <button className="btn default primary" onClick={handlePlayClick}>
                  {isWatched ? "이어보기" : "재생하기"}
                </button>
              </div>
            </div>

            <div className="detail-cast">
              <h3>출연진</h3>
              <ul className="detail-cast-list">
                {selectedContent.creditData?.cast?.slice(0, 7).map((actor: CreditPerson) => (
                  <li key={`a-${actor.id}`} className="cast-card">
                    <p className="cast-card-imgbox">
                      <img 
                        src={actor.profile_path 
                          ? `https://image.tmdb.org/t/p/original${actor.profile_path}` 
                          : "/images/actor-no-image.svg"
                        } 
                        alt={actor.name} 
                      />
                    </p>
                    <p className="actor-name">{actor.name}</p>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="detail-crew-list">
              <div className="detail-director">
                <h3>감독</h3>
                <ul className="director-list">
                  {selectedContent.director && selectedContent.director.length > 0 ? (
                    selectedContent.director.slice(0, 3).map((d: any, idx: number) => (
                      <li key={`d-${d.id}-${idx}`}>{d.name}</li>
                    ))
                  ) : (
                    <li>정보 없음</li>
                  )}
                </ul>
              </div>
              <div className="detail-writer">
                <h3>작가</h3>
                <ul className="writer-list">
                  {selectedContent.writer && selectedContent.writer.length > 0 ? (
                    selectedContent.writer.slice(0, 3).map((w: any, idx: number) => (
                      <li key={`w-${w.id}-${idx}`}>{w.name}</li>
                    ))
                  ) : (
                    <li>정보 없음</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="detail-right">
          <div className="detail-menu-wrap">
            {hasVideos && (
              <button 
                className={visibleMenu === "relative" ? "active" : "detail-menu-btn"} 
                onClick={() => setActiveMenu("relative")}
              >
                관련영상
              </button>
            )}
            <button 
              className={visibleMenu === "recommend" ? "active" : "detail-menu-btn"} 
              onClick={() => setActiveMenu("recommend")}
            >
              추천 컨텐츠
            </button>
          </div>
          <div className="detail-menu-line"></div>
          <div className="detail-menu-content">
            {/* 리스트 로딩 처리 */}
            {visibleMenu === "relative" && (
              selectedContent.videos ? <MovieRelative videos={selectedContent.videos} /> : <LoadingBar />
            )}
            {visibleMenu === "recommend" && (
              popularMovies.length > 0 ? <MovieRecommend popularMovies={popularMovies} videoKey={videoKey} /> : <LoadingBar />
            )}
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} size={modalSize}>
        <div className="modal-header">
          <h3 className="modal-title">알림</h3>
          <button className="close-button" onClick={handleCloseModal}><span>닫기</span></button>
        </div>
        <div className="modal-content">
          <p>{pickAction === "add" ? "찜 리스트에 추가되었습니다!" : "찜 리스트에서 제거되었습니다!"}</p>
        </div>
        <div className="modal-footer">
          <button className="btn default primary" onClick={() => { handleCloseModal(); navigate("/profile"); }}>
            찜 바로가기
          </button>
          <button className="btn default secondary-line" onClick={handleCloseModal}>닫기</button>
        </div>
      </Modal>

      <Modal isOpen={shareOpen} onClose={() => setShareOpen(false)} size="default">
        <h3>공유하기</h3>
        <p>SNS 공유 준비 중...</p>
        <button className="btn default primary" onClick={() => setShareOpen(false)}>닫기</button>
      </Modal>
    </main>
  );
};

export default MovieDetailEX;