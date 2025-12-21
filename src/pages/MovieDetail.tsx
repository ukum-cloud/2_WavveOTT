import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useMovieStore } from "../stores/useMovieStore";
import { usePickStore } from "../stores/usePickStore";

import { getGenres, getGrades } from "../utils/mapping";
import { getContentImages } from "../utils/getData";

import MovieRecommend from "../components/MovieRecommend";
import MovieRelative from "../components/MovieRelative";
import Modal from "../components/Modal";

import { useAuthStore } from "../stores/useAuthStore"; // KEH  왓치리스트를 위해 추가
import { saveWatchHistory } from "../firebase/firebase"; // KEH  왓치리스트를 위해 추가

import type { CreditPerson } from "../types/movie";

import "./scss/ContentsDetail.scss";

const MovieDetail = () => {
  const { user, selectedCharId } = useAuthStore(); // KEH  왓치리스트를 위해 추가

  const { type, id } = useParams<{ type: string; id: string }>();

  const navigate = useNavigate();

  const { popularMovies, selectedPopular, onFetchPopular, setSelectedPopular } = useMovieStore();
  const { onTogglePick, pickList, pickAction } = usePickStore();

  const [shareOpen, setShareOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [activeMenu, setActiveMenu] = useState("relative");
  const [showVideo, setShowVideo] = useState(false);
  const [isWatched, setIsWatched] = useState(false);
  const [modalSize, setModalSize] = useState<"xsmall" | "small" | "default" | "large">("default"); //모달 size
  const [isModalOpen, setIsModalOpen] = useState(false); //모달오픈 상태변수

  // type에 따라 fetch
  useEffect(() => {
    if (!type) return;

    if (type === "movie") {
      onFetchPopular();
    }
  }, [type, onFetchPopular]);

  // type에 따라 select
  useEffect(() => {
    if (!id || !type) return;

    if (type === "movie") {
      if (popularMovies.length > 0) {
        setSelectedPopular(Number(id));
      }
    }
  }, [id, type, popularMovies, setSelectedPopular]);

  let selectedContent = null;

  if (type === "movie") {
    selectedContent = selectedPopular;
  }

  const videoKey = selectedContent?.videos?.[0]?.key;
  const { background, logo } = selectedContent
    ? getContentImages(selectedContent)
    : { background: null, logo: null };

  useEffect(() => {
    if (!videoKey) return;

    const timer = setTimeout(() => {
      setShowVideo(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, [videoKey]);

  if (!selectedContent) {
    return <div>🔥콘텐츠 불러오는 중🔥</div>;
  }

  // 비디오가 들어있는지 없는지 체크해서
  const hasVideos = (selectedContent.videos?.length ?? 0) > 0;

  // 실제 화면에 보여줄 메뉴
  const visibleMenu = hasVideos ? activeMenu : "recommend";

  // 찜 리스트에 들어있는지 확인
  const isPicked = pickList.some(
    (p) => p.contentId === (selectedContent.id ?? selectedContent.tmdb_id)
  );

  const handleHeart = async () => {
    await onTogglePick(selectedContent);
    setModalSize("small");
    setIsModalOpen(true);
  };

  //모달 닫기 핸들러
  const handleCloseModal = () => setIsModalOpen(false);

  // ========== 공유 기능 ==========
  const handleShareClick = async () => {
    try {
      // 예: 카카오톡 공유 또는 URL 복사
      const shareUrl = window.location.href;

      // 클립보드 복사
      await navigator.clipboard.writeText(shareUrl);

      // 공유 성공 메시지 표시
      setAlertMessage("복사되었습니다!");

      // 2초 후 메시지 자동 사라지기
      setTimeout(() => setAlertMessage(""), 2000);
    } catch (error) {
      console.error("공유 실패:", error);
      setAlertMessage("공유 실패!");
      setTimeout(() => setAlertMessage(""), 2000);
    }
  };
  // ===========================

  // 등급 데이터 [] 배열일 수도 있고, NR 수도 있어서 한꺼번에 변수 설정
  const certificationValue = Array.isArray(selectedContent.certificationMovie)
    ? selectedContent.certificationMovie[0]?.certification
    : selectedContent.certificationMovie; // 'NR'

  // ========== 3. handlePlayClick 함수 추가 (김은희 추가) ==========
  const handlePlayClick = async () => {
    if (user && selectedCharId && selectedContent) {
      try {
        await saveWatchHistory(
          user.uid,
          selectedCharId,
          {
            id: selectedContent.id,
            title: selectedContent.title,
            backdrop_path: selectedContent.backdrop_path ?? undefined,
            poster_path: selectedContent.poster_path ?? undefined,
            runtime: selectedContent.runtime ?? undefined,
          },
          "movie",
          0
        );
      } catch (error) {
        console.error("시청 기록 저장 실패:", error);
      }
    }
    //===============/// 버튼 누르면 재생하기 -> 이어보기로 변경 ===============
    setIsWatched(true);
    //==============================
    navigate(`/player/${videoKey}`);
  };

  // ==========/// 3. handlePlayClick 함수 추가 (김은희 추가) ==========

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
                    <img src={logo} alt={`${selectedContent.title} logo`} />
                  </p>
                )}
              </>
            )}

            {showVideo && videoKey && (
              <iframe
                key={videoKey}
                className="detail-video"
                src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&mute=1&controls=0&rel=0`}
                title={`${selectedContent.title} trailer`}
              />
            )}

            {/* {!showVideo && background && (
                            <>
                                <p className="detail-backdrop">
                                    <img src={background} alt={selectedContent.title} />
                                </p>
                                <p className="detail-logo">
                                    {logo && (
                                        <img src={logo} alt={`${selectedContent.title} logo`} />
                                    )}
                                </p>
                            </>
                        )}

                        {showVideo && videoKey && (
                            <iframe
                                key={videoKey}
                                className="detail-video"
                                src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&mute=1&controls=0&rel=0`}
                                title={`${selectedContent.title} trailer`}
                            />
                        )} */}
          </div>
          <div className="detail-title-box">
            <div className="detail-title-left">
              <p className="title-certification">
                <img src={getGrades(certificationValue)} alt="certification" />
              </p>
              <p className="title-star"></p>
              <p className="title-vote seperate">
                {selectedContent.vote_average != null
                  ? selectedContent.vote_average.toFixed(1)
                  : ""}
              </p>
              <p className="title-genre seperate">
                {getGenres(selectedContent.genre_ids).slice(0, 2).join(" · ") || "기타"}
              </p>
              <p className="title-episode">{selectedContent.runtime}분</p>
            </div>
            <div className="detail-title-right">
              <button
                className={`detail-heart-btn ${isPicked ? "active" : ""}`}
                onClick={handleHeart}></button>
              <button className="detail-share-btn" onClick={() => setShareOpen(true)}></button>
              {/* 모달 */}
              <Modal isOpen={shareOpen} onClose={() => setShareOpen(false)} size="small">
                <div className="share-modal-top">
                  <h3>공유하기</h3>
                  <button onClick={() => setShareOpen(false)}>
                    <img src="/images/button/btn-close.svg" alt="closeBtn" />
                  </button>
                </div>
                <div className="share-modal-middle">
                  <button onClick={handleShareClick}>
                    <img src="/images/icons/icon-kakao-login.svg" alt="kakao-icon" />
                    <span>카카오톡</span>
                  </button>
                  <button>
                    <img src="/images/icons/icon-twitter.svg" alt="twitter-icon" />
                    <span>트위터</span>
                  </button>
                  <button>
                    <img src="/images/icons/icon-facebook.svg" alt="facebook-icon" />
                    <span>페이스북</span>
                  </button>
                </div>
                <div className="share-modal-bottom">
                  <span>https://deep.wavve.com/content/C9901_C99000000170</span>
                  <button className="btn small primary" onClick={handleShareClick}>
                    공유하기
                  </button>
                </div>
                {/* 알림 메시지 */}
                {alertMessage && <div className="share-alert">{alertMessage}</div>}
              </Modal>
            </div>
          </div>
          <div className="detail-text-box">
            <div className="detail-content">
              <div className="detail-content-left">
                <h3>줄거리</h3>
                {selectedContent.overview?.trim() ? (
                  <p>{selectedContent.overview}</p>
                ) : (
                  <p>제공된 줄거리 정보가 없습니다.</p>
                )}
              </div>
              <div className="detail-content-right">
                {/* <button
                                    className="btn default primary"
                                    onClick={() => navigate(`/player/${videoKey}`)}
                                >
                                    재생하기
                                </button> */}

                <button
                  className="btn default primary"
                  onClick={handlePlayClick} // KEH  왓치리스트를 위해 추가
                >
                  {isWatched ? "이어보기" : "재생하기"}
                </button>
              </div>
            </div>
            <div className="detail-cast">
              <h3>출연진</h3>
              <ul className="detail-cast-list">
                {selectedContent.creditData?.cast ? (
                  selectedContent.creditData.cast.slice(0, 7).map((actor: CreditPerson) => (
                    <li key={`a-${actor.id}`} className="cast-card">
                      <p className="cast-card-imgbox">
                        <img
                          src={
                            actor.profile_path
                              ? `https://image.tmdb.org/t/p/original${actor.profile_path}`
                              : "/images/actor-no-image.svg"
                          }
                          alt={actor.name}
                        />
                      </p>
                      <p className="actor-name">{actor.name}</p>
                    </li>
                  ))
                ) : (
                  <li className="empty-message">제공된 출연진 정보가 없습니다.</li>
                )}
              </ul>
            </div>
            <div className="detail-crew-list">
              <div className="detail-director">
                <h3>감독</h3>
                <ul className="director-list">
                  {selectedContent.director && selectedContent.director.length > 0 ? (
                    selectedContent.director
                      .map((d: CreditPerson, index: number) => (
                        <li key={`d-${d.id}-${index}`}>{d.name}</li>
                      ))
                      .slice(0, 7)
                  ) : (
                    <li className="empty-message">제공된 감독 정보가 없습니다</li>
                  )}
                </ul>
              </div>
              <div className="detail-writer">
                <h3>작가</h3>
                <ul className="writer-list">
                  {selectedContent.writer && selectedContent.writer.length > 0 ? (
                    selectedContent.writer
                      ?.map((w: CreditPerson, index: number) => (
                        <li key={`w-${w.id}-${index}`}>{w.name}</li>
                      ))
                      .slice(0, 7)
                  ) : (
                    <li className="empty-message">제공된 작가 정보가 없습니다</li>
                  )}
                </ul>
              </div>
              <div className="detail-script">
                <h3>자막</h3>
                <ul className="script-list">
                  <li>영어</li>
                  <li>한국어</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="detail-right">
          <div className="detail-menu-wrap">
            {/* 관련영상이 있을 때만 버튼 표시 */}
            {hasVideos && (
              <button
                className={visibleMenu === "relative" ? "active" : "detail-menu-btn"}
                onClick={() => setActiveMenu("relative")}>
                관련영상
              </button>
            )}
            <button
              className={visibleMenu === "recommend" ? "active" : "detail-menu-btn"}
              onClick={() => setActiveMenu("recommend")}>
              추천 컨텐츠
            </button>
          </div>
          <div className="detail-menu-line"></div>

          {/* 메뉴 */}
          <div className="detail-menu-content">
            {visibleMenu === "relative" && <MovieRelative videos={selectedContent.videos ?? []} />}
            {visibleMenu === "recommend" && (
              <MovieRecommend popularMovies={popularMovies} videoKey={videoKey} />
            )}
          </div>
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} size={modalSize}>
        {/* 모달 내부 콘텐츠: Header, Body, Footer를 직접 구성 */}
        <div className="modal-header">
          <h3 className="modal-title">알림</h3>
          {/* 닫기 버튼은 onCLose 핸들러를 호출 */}
          <button className="close-button" onClick={handleCloseModal}>
            <span>닫기</span>
          </button>
        </div>
        <div className="modal-content">
          <p>
            {pickAction === "add" ? "찜 리스트에 추가되었습니다!" : "찜 리스트에서 제거되었습니다!"}
          </p>
        </div>
        <div className="modal-footer">
          <button
            className="btn default primary"
            onClick={() => {
              handleCloseModal();
              navigate("/profile");
            }}>
            찜 바로가기
          </button>
          <button className="btn default secondary-line" onClick={handleCloseModal}>
            닫기
          </button>
        </div>
      </Modal>
    </main>
  );
};

export default MovieDetail;
