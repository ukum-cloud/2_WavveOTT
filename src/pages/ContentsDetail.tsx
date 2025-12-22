import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useWavveStore } from "../stores/useWavveStore";
import { useTvStore } from "../stores/useTvStore";
import { usePeopleStore } from "../stores/usePeopleStore";
import { useVarietyStore } from "../stores/useVarietyStore";
import { useNewsStore } from "../stores/useNewsStore";
import { usePickStore } from "../stores/usePickStore";

import { getGenres, getGrades } from "../utils/mapping";
import { getContentImages } from "../utils/getData";

import ContentsEpisode from "../components/ContentsEpisode";
import ContentsRelative from "../components/ContentsRelative";
import ContentsRecommend from "../components/ContentsRecommend";
import Modal from "../components/Modal";

// --- 추가된 임포트 ---
import { useAuthStore } from "../stores/useAuthStore";
import { saveWatchHistory } from "../firebase/firebase";
// --------------------

import type { CreditPerson, Season } from "../types/movie";

import "./scss/ContentsDetail.scss";
import "../style/common-button.scss";

// ========== 시청 기록 저장 타입정의==========
interface WatchHistoryData {
  id: string | number;
  title: string;
  backdrop_path?: string;
  poster_path?: string;
  episodeNumber: number;
  runtime: number;
}
type ContentType = "tv" | "movie";

// ========== // 시청 기록 저장 타입정의=======

const ContentsDetail = () => {
  const { user, selectedCharId } = useAuthStore();
  const { type, id } = useParams<{ type: string; id: string }>();
  const navigate = useNavigate();

  // 콘텐츠 데이터 스토어
  const { wavves, selectedWavve, fetchWavveDetail } = useWavveStore();
  const { selectedTv, fetchTvDetail } = useTvStore();
  const { selectedPeople, onFetchPeople } = usePeopleStore();
  const { selectedVariety, fetchVarietyDetail } = useVarietyStore();
  const { selectedNews, fetchNewsDetail } = useNewsStore();

  // 찜 스토어
  const { onTogglePick, pickList, pickAction } = usePickStore();

  const [shareOpen, setShareOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [activeMenu, setActiveMenu] = useState("episode");
  const [showVideo, setShowVideo] = useState(false);
  const [isWatched, setIsWatched] = useState(false);

  const [modalSize, setModalSize] = useState<
    "xsmall" | "small" | "default" | "large"
  >("default"); //모달 size
  const [isModalOpen, setIsModalOpen] = useState(false); //모달오픈 상태변수

  useEffect(() => {
    if (!type || !id) return;
    const contentId = Number(id);

    if (type === "wavve") fetchWavveDetail(contentId);
    if (type === "tv") fetchTvDetail(contentId);
    if (type === "variety") fetchVarietyDetail(contentId);
    if (type === "news") fetchNewsDetail(contentId);
    if (type === "people") onFetchPeople();
  }, [
    type,
    id,
    fetchWavveDetail,
    fetchTvDetail,
    fetchVarietyDetail,
    fetchNewsDetail,
    onFetchPeople,
  ]);

  let selectedContent = null;
  if (type === "wavve") selectedContent = selectedWavve;
  if (type === "tv") selectedContent = selectedTv;
  if (type === "variety") selectedContent = selectedVariety;
  if (type === "news") selectedContent = selectedNews;
  if (type === "people") selectedContent = selectedPeople;

  // 비디오 키값 받아올 변수 추가
  const videoKey: string | undefined =
    selectedContent?.videos?.[0]?.key ?? undefined;

  useEffect(() => {
    if (!videoKey) return;
    const timer = setTimeout(() => setShowVideo(true), 3000);
    return () => clearTimeout(timer);
  }, [videoKey]);

  if (!selectedContent) {
    return <div>🔥콘텐츠 불러오는 중🔥</div>;
  }

  // 시즌 데이터 받아올 변수 추가
  const seasonsForEpisode: Season[] =
    selectedContent.seasons?.map((s) => {
      const season: Season = {
        id: s.season_number,
        season_number: s.season_number,
        name: `시즌 ${s.season_number}`, // 원래대로 번호만
        episode_count: "episode_count" in s ? s.episode_count : undefined,
        episodes: "episodes" in s ? s.episodes : undefined,
      };
      return season;
    }) ?? [];

  // ========== 공유 기능 ==========
  const handleShareClick = async () => {
    try {
      // 카카오톡 공유 또는 URL 복사
      const shareUrl = window.location.href;

      // 클립보드 복사
      await navigator.clipboard.writeText(shareUrl);

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

  // ========== 찜 기능 ==========
  const contentId =
    "tmdb_id" in selectedContent ? selectedContent.tmdb_id : selectedContent.id;

  const isPicked = pickList.some((p) => p.contentId === contentId);
  // ===========================

  // tmbd + 웨이브 이미지 둘 다 불러오기
  const { logo, background, episodeImages } = getContentImages(selectedContent);

  // ========== 찜 기능 ==========
  const handleCloseModal = () => setIsModalOpen(false);
  const handleHeart = async () => {
    await onTogglePick(selectedContent);
    setModalSize("small");
    setIsModalOpen(true);
  };
  // ===========================

  // ========== 시청 기록 저장 및 재생 함수==========
  const handlePlayClick = async () => {
    if (user && selectedCharId && selectedContent) {
      try {
        // unknown을 거쳐서 안전하게 변환
        const content = selectedContent as unknown as Record<string, unknown>;

        const watchData: WatchHistoryData = {
          id: content.id as string | number,
          title: String(content.name || content.title || "제목 없음"),
          backdrop_path: content.backdrop_path as string | undefined,
          poster_path: content.poster_path as string | undefined,
          episodeNumber:
            (Array.isArray(content.episodes) &&
              content.episodes[0]?.episode_number) ||
            1,
          runtime:
            ((Array.isArray(content.episode_run_time)
              ? content.episode_run_time[0]
              : content.runtime) as number) || 0,
        };

        await saveWatchHistory(
          String(user.uid),
          String(selectedCharId),
          watchData,
          (type || "tv") as ContentType,
          0
        );

        console.log("시청 기록 저장 완료");
      } catch (error) {
        console.error("시청 기록 저장 실패:", error);
      }
    }

    setIsWatched(true);
    navigate(`/player/${videoKey}`);
  };
  // ============================================================

  return (
    <main className="main-detail">
      <div className="inner">
        <div className="detail-left">
          <div className="detail-img-box">
            {(!showVideo || !videoKey) && background && (
              <>
                <p className="detail-backdrop">
                  <img
                    src={background}
                    alt={selectedContent.name || "TV 콘텐츠"}
                  />
                </p>
                {logo && (
                  <p className="detail-logo">
                    <img src={logo} alt={`${selectedContent.name} 로고`} />
                  </p>
                )}
              </>
            )}

            {showVideo && videoKey && (
              <iframe
                key={videoKey}
                className="detail-video"
                src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&mute=1&controls=0&rel=0`}
                allow="autoplay; fullscreen"
                allowFullScreen
                title={`${selectedContent.name} trailer`}
              />
            )}
          </div>

          <div className="detail-title-box">
            <div className="detail-title-left">
              <p className="title-certification">
                <img
                  src={getGrades(selectedContent.certification)}
                  alt="certification"
                />
              </p>

              <p className="title-star"></p>

              <p className="title-vote seperate">
                {selectedContent.vote_average
                  ? selectedContent.vote_average.toFixed(1)
                  : "0.0"}
              </p>

              <p className="title-genre seperate">
                {selectedContent.genre_ids
                  ? getGenres(selectedContent.genre_ids).slice(0, 2).join(" · ")
                  : "기타"}
              </p>

              {(selectedContent.episodes?.length ?? 0) > 0 && (
                <p className="title-episode">
                  에피소드 {selectedContent.episodes?.length}
                </p>
              )}
            </div>

            <div className="detail-title-right">
              <button
                className={`detail-heart-btn ${isPicked ? "active" : ""}`}
                onClick={handleHeart}
              ></button>
              <button
                className="detail-share-btn"
                onClick={() => setShareOpen(true)}
              ></button>
              <Modal
                isOpen={shareOpen}
                onClose={() => setShareOpen(false)}
                size="small"
              >
                <div className="share-modal-top">
                  <h3>공유하기</h3>
                  <button onClick={() => setShareOpen(false)}>
                    <img src="/images/button/btn-close.svg" alt="closeBtn" />
                  </button>
                </div>
                <div className="share-modal-middle">
                  <button onClick={handleShareClick}>
                    <img
                      src="/images/icons/icon-kakao-login.svg"
                      alt="kakao-icon"
                    />
                    <span>카카오톡</span>
                  </button>
                  <button>
                    <img
                      src="/images/icons/icon-twitter.svg"
                      alt="twitter-icon"
                    />
                    <span>트위터</span>
                  </button>
                  <button>
                    <img
                      src="/images/icons/icon-facebook.svg"
                      alt="facebook-icon"
                    />
                    <span>페이스북</span>
                  </button>
                </div>
                <div className="share-modal-bottom">
                  <span>https://deep.wavve.com/content/C9901_C99000000170</span>
                  <button
                    className="btn small primary"
                    onClick={handleShareClick}
                  >
                    공유하기
                  </button>
                </div>
                {/* 알림 메시지 */}
                {alertMessage && (
                  <div className="share-alert">{alertMessage}</div>
                )}
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
                {/* 수정한 부분: onClick 핸들러 연결  // KEH  왓치리스트를 위해 추가*/}
                <button
                  className="btn default primary"
                  onClick={handlePlayClick}
                >
                  {isWatched ? "이어보기" : "재생하기"}
                </button>
              </div>
            </div>

            <div className="detail-cast">
              <h3>출연진</h3>
              <ul className="detail-cast-list">
                {selectedContent.creditData?.cast ? (
                  selectedContent.creditData.cast
                    .slice(0, 7)
                    .map((actor: CreditPerson) => (
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
                  <li className="empty-message">
                    제공된 출연진 정보가 없습니다.
                  </li>
                )}
              </ul>
            </div>
            <div className="detail-crew-list">
              <div className="detail-director">
                <h3>감독</h3>
                <ul className="director-list">
                  {selectedContent.director &&
                  selectedContent.director.length > 0 ? (
                    selectedContent.director
                      .map((d, index) => (
                        <li key={`d-${d.id}-${index}`}>{d.name}</li>
                      ))
                      .slice(0, 7)
                  ) : (
                    <li className="empty-message">
                      제공된 감독 정보가 없습니다
                    </li>
                  )}
                </ul>
              </div>
              <div className="detail-writer">
                <h3>작가</h3>
                <ul className="writer-list">
                  {selectedContent.writer &&
                  selectedContent.writer.length > 0 ? (
                    selectedContent.writer
                      ?.map((w, index) => (
                        <li key={`w-${w.id}-${index}`}>{w.name}</li>
                      ))
                      .slice(0, 7)
                  ) : (
                    <li className="empty-message">
                      제공된 작가 정보가 없습니다
                    </li>
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
            <button
              className={activeMenu === "episode" ? "active" : ""}
              onClick={() => setActiveMenu("episode")}
            >
              에피소드
            </button>
            {/* 관련영상이 있을 때만 버튼 표시 */}

            {(selectedContent.videos?.length ?? 0) > 0 && (
              <button
                className={activeMenu === "relative" ? "active" : ""}
                onClick={() => setActiveMenu("relative")}
              >
                관련영상
              </button>
            )}

            <button
              className={activeMenu === "recommend" ? "active" : ""}
              onClick={() => setActiveMenu("recommend")}
            >
              추천 컨텐츠
            </button>
          </div>
          <div className="detail-menu-line"></div>
          {/* 메뉴 */}
          <div className="detail-menu-content">
            {activeMenu === "episode" && (
              <ContentsEpisode
                episodes={selectedContent.episodes ?? []}
                seasons={seasonsForEpisode}
                episodeImages={episodeImages}
                videoKey={videoKey}
                selectedPerson={{
                  id: selectedContent.id,
                  name: selectedContent.name ?? "",
                }}
              />
            )}
            {activeMenu === "relative" && (
              <ContentsRelative
                videos={selectedContent.videos ?? []} // 항상 배열
                backdrop={selectedContent.backdrop_path ?? null}
              />
            )}
            {activeMenu === "recommend" && (
              <ContentsRecommend wavves={wavves} videoKey={videoKey} />
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
            {pickAction === "add"
              ? "찜 리스트에 추가되었습니다!"
              : "찜 리스트에서 제거되었습니다!"}
          </p>
        </div>
        <div className="modal-footer">
          <button
            className="btn default primary"
            onClick={() => {
              handleCloseModal();
              navigate("/profile");
            }}
          >
            찜 바로가기
          </button>
          <button
            className="btn default secondary-line"
            onClick={handleCloseModal}
          >
            닫기
          </button>
        </div>
      </Modal>
    </main>
  );
};

export default ContentsDetail;
