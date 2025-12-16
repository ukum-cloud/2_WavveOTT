import { useEffect, useRef, useState } from "react";
import mStyle from "./scss/MainSection.module.scss";
import mSection from "../data/wavveOnly.json";

const MainSlider = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [showVideo, setShowVideo] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  //하트선택상태변수
  const [activeheart, setActiveHeart] = useState(false);
  //찜리스트 추가예정
  const handleHeart = () => {
    setActiveHeart(!activeheart);
  };

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
  console.log("원", main);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowVideo(true);
      videoRef.current?.play();
    }, 2300);

    return () => clearTimeout(timer);
  }, []);

  return (
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

        <div className={`${mStyle.btnBox} ${isPlaying ? mStyle.active : ""}`}>
          <div className={mStyle.btnBoxT}>
            <span className={mStyle.playBtn}></span>
            <span
              className={`${mStyle.heartBtn} ${activeheart ? mStyle.active : ""}`}
              onClick={handleHeart}></span>
          </div>
          <div className={mStyle.btnBoxB}>콘크리트마켓 보러가기</div>
        </div>
      </div>
    </div>
  );
};

export default MainSlider;
