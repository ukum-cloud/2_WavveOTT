import React, { useEffect, useState } from "react";
import bgMain from "/images/visual/bg-cjenm.png";
import "./scss/CJenmVisual.scss";

const CJenmVisual: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="cjenm-container">
      {/* 1. 텍스트 레이어 */}
      <div className="title-box">
        <h2>
          <img src="/images/visual/cjenmLogo.svg" alt="CJENM" />
        </h2>
        <p>익숙하지만 늘 새로운 즐거움 </p>
      </div>

      {/* 2. 곡선 효과 레이어 (추가) */}
      {/* 2. 곡선 효과 레이어 */}
      <div className={`curve-effect-layer ${isLoaded ? "active" : ""}`}>
        <svg viewBox="0 0 1000 400" preserveAspectRatio="none">
          <path
            className="curve-line line-1"
            d="M-50,200 C150,50 400,350 1050,150"
          />
          <path
            className="curve-line line-2"
            d="M-50,250 C300,400 600,0 1050,200"
          />
          {/* 세 번째 곡선 추가: 하단에서 위로 완만하게 올라가는 라인 */}
          <path
            className="curve-line line-3"
            d="M-50,350 C200,300 700,450 1050,300"
          />
        </svg>
      </div>

      {/* 3. 배경 레이어 */}
      <div className={`bg-container ${isLoaded ? "active" : ""}`}>
        <img src={bgMain} className="bg-img main" alt="" />
      </div>
    </div>
  );
};

export default CJenmVisual;
