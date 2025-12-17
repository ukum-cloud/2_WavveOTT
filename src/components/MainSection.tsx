import { useEffect, useRef, useState } from "react";
import mStyle from "./scss/MainSection.module.scss";
import mSection from "../data/wavveOnly.json";
import { useNavigate } from "react-router-dom";
import { usePickStore } from "../stores/usePickStore";
import Modal from "./Modal";

const MainSlider = () => {
  const { onAddPick, pickList } = usePickStore();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [showVideo, setShowVideo] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSize, setModalSize] = useState<"xsmall" | "small" | "default" | "large">("default");
  const handleCloseModal = () => setIsModalOpen(false);
  //하트선택상태변수
  const [activeheart, setActiveHeart] = useState(false);
  //찜리스트 추가예정
  const handleHeart = async () => {
    console.log("하트 클릭 item:", main);
    await onAddPick(main);
    setActiveHeart(!activeheart);
    setModalSize("small");
    setIsModalOpen(true);
    console.log("찜리스트 : ", usePickStore.getState().pickList);
  };
  const navigate = useNavigate("");

  const base = mSection.find((f) => f.series_title === "ONE : 하이스쿨 히어로즈");
  const extraMainData = {
    main_img: "/images/visual/visual-mSection-default.webp",
    main_video: "/videos/video-mSection.mp4",
    main_desc: "학교 폭력 서열을 뒤엎는 하이스쿨 액션 드라마",
    main_Title: "images/badge/badge-mSection-title.png",
  };
  const main = base && {
    ...base,
    ...extraMainData,
  };
  // console.log("원", main);

  const handleNavigate = (type, id) => {
    navigate(`/contentsdetail/tv/${main.tmdb_id}`);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowVideo(true);
      videoRef.current?.play();
    }, 2300);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div
        className={`${mStyle.sectionBox} ${isPlaying ? mStyle.active : ""}`}
        style={{ position: "relative" }}>
        <div className={mStyle.visualBox}>
          {!showVideo && <img src={main.main_img} alt="poster" />}
          {showVideo && (
            <>
              <video
                ref={videoRef}
                className={mStyle.video}
                src={main.main_video}
                onPlay={() => setIsPlaying(true)}
                onEnded={() => {
                  setIsPlaying(false);
                  setShowVideo(false);
                }}
                muted
                autoPlay
                style={{ transition: "0.1s" }}
              />
              {!isPlaying && <div className={mStyle.pauseOverlay}></div>}
            </>
          )}
          <span className={mStyle.visualBoxOverlay}></span>
        </div>

        <div className={mStyle.textBox}>
          <div className={`${isPlaying ? mStyle.hideText : mStyle.textT}`}>
            <span className={mStyle.tTag}>
              <img src="/images/badge/badge-wavve-original.svg" alt="W-original" />
            </span>
            <span className={mStyle.tTitle}>
              <img src={main.main_Title} alt="title" />
            </span>
          </div>
          <div className={`${isPlaying ? mStyle.hideText : mStyle.textM}`}>
            <p className={mStyle.textMT}>
              <span className={mStyle.ageBadge}>
                <img src="images/badge/badge-19.svg" alt="" style={{ height: "30px" }} />
              </span>
              <span>액션</span>
              <span>|</span>
              <span>에피소드 8</span>
            </p>
            <p className={mStyle.textMB}>{main.main_desc}</p>
          </div>

          <div className={mStyle.btnBox}>
            {isPlaying && (
              <div className={mStyle.textT}>
                <span className={mStyle.tTag}>
                  <img src="/images/badge/badge-wavve-original.svg" alt="W-original" />
                </span>
                <span className={mStyle.tTitle}>
                  <img src={main.main_Title} alt="title" />
                </span>
              </div>
            )}
            <div className={mStyle.btnBoxT}>
              <span className={mStyle.playBtn} onClick={handleNavigate}></span>
              <span
                className={`${mStyle.heartBtn} ${activeheart ? mStyle.active : ""}`}
                onClick={handleHeart}></span>
            </div>
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
          <p>찜 리스트에 추가되었습니다!</p>
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
    </>
  );
};

export default MainSlider;
