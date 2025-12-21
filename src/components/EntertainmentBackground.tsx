import React from "react";
import "./scss/EntertainmentBackground.scss";

const LEFT_LINES = 30;
const RIGHT_LINES = 30;

// 유틸: 0~1 사이 보간
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const EntertainmentBackground = () => {
  return (
    <div className="entertainment-bg" aria-hidden="true">
      <svg className="bg-svg" viewBox="0 0 1440 680" preserveAspectRatio="none">
        <defs>
          {/* 좌측 라인 그라데이션(핑크쪽) */}
          <linearGradient id="gradLeft" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ff3fd1" stopOpacity="0" />
            <stop offset="35%" stopColor="#ff3fd1" stopOpacity="0.9" />
            <stop offset="75%" stopColor="#7a5cff" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#7a5cff" stopOpacity="0" />
          </linearGradient>

          {/* 우측 라인 그라데이션(블루쪽) */}
          <linearGradient id="gradRight" x1="1" y1="0" x2="0" y2="0">
            <stop offset="0%" stopColor="#23d7ff" stopOpacity="0" />
            <stop offset="35%" stopColor="#23d7ff" stopOpacity="0.9" />
            <stop offset="75%" stopColor="#7a5cff" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#7a5cff" stopOpacity="0" />
          </linearGradient>

          {/* 도트 패턴 */}
          <pattern id="dotPattern" width="10" height="10" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.2" fill="#23d7ff" opacity="0.18" />
          </pattern>

          {/* 도트 페이드 마스크 */}
          <radialGradient id="dotFade" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="white" stopOpacity="0.75" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>

          <mask id="dotMask">
            <rect width="1440" height="680" fill="black" />
            <circle cx="220" cy="560" r="220" fill="url(#dotFade)" />
            <circle cx="1240" cy="120" r="220" fill="url(#dotFade)" />
          </mask>
        </defs>

        {/* ✅ 도트 레이어 (옵션) */}
        <g mask="url(#dotMask)">
          <rect width="1440" height="680" fill="url(#dotPattern)" />
        </g>

        {/* ✅ 좌측 번들: 레퍼런스처럼 “위에서 내려오며 말려 들어감” */}
        <g className="bundle bundle-left">
          {Array.from({ length: LEFT_LINES }).map((_, i) => {
            const t = i / (LEFT_LINES - 1); // 0~1
            const y = 90 + i * 10; // 라인 간격(촘촘)
            const op = lerp(0.1, 0.55, t);

            // 말림 중심을 섹션 왼쪽 안쪽(대략 x=240, y=340)으로 잡음
            const x0 = -80;
            const c1x = lerp(70, 160, t);
            const c1y = lerp(60, 160, t);
            const c2x = lerp(260, 320, t);
            const c2y = lerp(240, 300, t);
            const midx = lerp(360, 420, t);
            const midy = lerp(340, 380, t);

            const c3x = lerp(340, 260, t);
            const c3y = lerp(430, 520, t);
            const c4x = lerp(120, 40, t);
            const c4y = lerp(540, 620, t);
            const xEnd = -80;
            const yEnd = lerp(600, 660, t);

            const d = `
              M ${x0} ${y}
              C ${c1x} ${c1y}, ${c2x} ${c2y}, ${midx} ${midy}
              C ${c3x} ${c3y}, ${c4x} ${c4y}, ${xEnd} ${yEnd}
            `;

            return (
              <path
                key={`L-${i}`}
                d={d}
                className="line line-left"
                style={{
                  opacity: op,
                  animationDelay: `${-i * 0.08}s`,
                }}
              />
            );
          })}
        </g>

        {/* ✅ 우측 번들: 레퍼런스처럼 “위에서 내려오며 말려 들어감” */}
        <g className="bundle bundle-right">
          {Array.from({ length: RIGHT_LINES }).map((_, i) => {
            const t = i / (RIGHT_LINES - 1);
            const y = 50 + i * 10;
            const op = lerp(0.1, 0.55, t);

            // 말림 중심을 오른쪽 안쪽(x=1200 근처)로 잡음
            const x0 = 1520;
            const c1x = lerp(1370, 1280, t);
            const c1y = lerp(30, 130, t);
            const c2x = lerp(1180, 1120, t);
            const c2y = lerp(170, 250, t);
            const midx = lerp(1060, 1000, t);
            const midy = lerp(310, 360, t);

            const c3x = lerp(1100, 1180, t);
            const c3y = lerp(420, 520, t);
            const c4x = lerp(1320, 1460, t);
            const c4y = lerp(540, 640, t);
            const xEnd = 1520;
            const yEnd = lerp(560, 660, t);

            const d = `
              M ${x0} ${y}
              C ${c1x} ${c1y}, ${c2x} ${c2y}, ${midx} ${midy}
              C ${c3x} ${c3y}, ${c4x} ${c4y}, ${xEnd} ${yEnd}
            `;

            return (
              <path
                key={`R-${i}`}
                d={d}
                className="line line-right"
                style={{
                  opacity: op,
                  animationDelay: `${-i * 0.08}s`,
                }}
              />
            );
          })}
        </g>
      </svg>
    </div>
  );
};

export default EntertainmentBackground;
