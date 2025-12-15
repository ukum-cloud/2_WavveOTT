import { useRef, useState } from "react";
import mSection from "../data/mainSection.json";
import mStyle from "./scss/MainSection.module.scss";

const MainSlider = () => {
  const main = mSection[0];
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [showVideo, setShowVideo] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleStartVideo = () => {
    setShowVideo(true);
    videoRef.current?.play();
  };
  const handlePauseVideo = () => {
    setIsPlaying(false);
    videoRef.current?.pause();
  };

  return (
    <div className={mStyle.sectionBox} style={{ position: "relative" }}>
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
            <span>
              <img src="images/badge/badge-19.svg" alt="" style={{ height: "30px" }} />
            </span>
            <span>{main.genres[0].name} </span>
            <span>|</span>
            <span>{main.next_episode_to_air.runtime || "2시간 3분"}</span>
          </p>
          <p className="textM-b">{main.main_desc}</p>
        </div>

        <div className={mStyle.btnBox}>
          <div className={mStyle.btnBoxT}>
            {!isPlaying ? (
              <span onClick={handleStartVideo}>
                <img src="/images/icons/icon-play-sm.svg" alt="" />
              </span>
            ) : (
              <span onClick={handlePauseVideo}>
                <img src="/images/icons/icon-search-remove.svg" alt="" />
              </span>
            )}

            <span>
              <img src="/images/icons/icon-heart-sm.svg" alt="" />
            </span>
          </div>
          <div className={mStyle.btnBoxB}>콘크리트마켓 보러가기</div>
        </div>
      </div>
    </div>
  );
};

export default MainSlider;
