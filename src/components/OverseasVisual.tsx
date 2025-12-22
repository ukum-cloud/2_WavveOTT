import React, { useEffect, useState } from "react";
import bgMain from "/images/visual/bg-overseas.png";
import bgCircle from "/images/visual/bg-overseas-circle.png";
import bgEffect from "/images/visual/bg-overseas-effect.png";
import overseasLeft from "/images/visual/overseasLeft.svg";
import overseasRight from "/images/visual/overseasRight.svg";
import "./scss/OverseasVisual.scss";

const OverseasVisual: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // 3. 컴포넌트가 마운트된 직후 실행
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100); // 0.1초 뒤에 실행하여 브라우저 렌더링 타이밍 확보
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="overseas-container">
      <div className="title-box">
        <h2>
          해외시리즈 <span style={{ opacity: 0.6 }}>WAVVE</span>
        </h2>
        <p>지금 가장 뜨거운 해외 시리즈</p>
      </div>
      {/* 배경 레이어 (정적인 배경) */}
      <div className="bg-container">
        <img src={bgMain} className="bg-img main" alt="" />
        <img src={bgCircle} className="bg-img circle" alt="" />
        <img src={bgEffect} className="bg-img effect" alt="" />
      </div>

      {/* 슬라이드 업 되는 PNG 이미지들 */}
      <div className={`png-container ${isLoaded ? "active" : ""}`}>
        <img
          src={overseasLeft}
          className="floating-img left"
          alt="Left Decor"
        />
        <img
          src={overseasRight}
          className="floating-img right"
          alt="Right Decor"
        />
      </div>
    </div>
  );
};

export default OverseasVisual;
