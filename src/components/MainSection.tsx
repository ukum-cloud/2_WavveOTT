import { useEffect, useRef, useState } from "react";
import mSection from "../data/mainSection.json";
import mStyle from "./scss/MainSection.module.scss";

const MainSlider = () => {
  const main = mSection[0];
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [showVideo, setShowVideo] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowVideo(true);
      videoRef.current?.play();
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={mStyle.sectionBox} style={{ position: "relative" }}>
      <div className={mStyle.visualBox}>
        {!showVideo && <img src={main.main_img} alt="poster" />}
        {showVideo && (
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
        )}
        <span className={mStyle.visualBoxOverlay}></span>
      </div>

      <div className={mStyle.textBox}>
        <p className={`${isPlaying ? mStyle.hideText : mStyle.textT}`}>
          <span className={mStyle.tTag}>
            <img src="/images/badge/badge-wavve-original.svg" alt="W-original" />
          </span>
          <span className={mStyle.tTitle}>
            <img src={main.main_Title} alt="title" />
          </span>
        </p>
        <p className={`${isPlaying ? mStyle.hideText : mStyle.textM}`}>
          <span>
            <img src="images/badge/badge-19.svg" alt="" style={{ height: "30px" }} />
          </span>
          <span>{main.genres[0].name} </span>
          <span>|</span>
          <span>{main.next_episode_to_air.runtime || "2시간 3분"}</span>
        </p>
        <p className={` ${isPlaying ? mStyle.hideText : mStyle.textB}`}>{main.main_desc}</p>

        <p className={mStyle.btnBox}>
          <span>
            <img src="/images/icons/icon-play-sm.svg" alt="" />
          </span>
          <span>
            <img src="/images/icons/icon-heart-sm.svg" alt="" />
          </span>
        </p>
      </div>
    </div>
  );
};

export default MainSlider;
