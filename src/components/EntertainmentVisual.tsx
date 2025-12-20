import React, { useEffect, useRef } from "react";
import "./scss/EntertainmentVisual.scss";
import EntertainmentBackground from "./EntertainmentBackground";

type Props = {
  title?: string;
  subtitle?: string;
  leftSrc: string; // "/images/bg-animation-left.svg"
  rightSrc: string; // "/images/bg-animation-right.svg"
  height?: number; // default 680
};

type Shape = {
  x: number; // 0~1
  y: number; // 0~1
  width: number;
  height: number;
  speed: number;
};

const EntertainmentVisual: React.FC<Props> = ({
  title = "예능",
  subtitle = "웃음이 필요한 순간",
  leftSrc,
  rightSrc,
  height = 680,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId = 0;

    // ✅ 세로 유리 라인(캔버스) - 레퍼런스처럼 "은은하게"
    const shapes: Shape[] = Array.from({ length: 8 }, () => ({
      x: Math.random(), // 0~1
      y: Math.random() * 1.2, // 0~1.2
      width: 120 + Math.random() * 160,
      height: 900,
      speed: 0.25 + Math.random() * 0.25, // ⭐ 체감 속도
    }));

    const resize = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = Math.floor(rect.width * devicePixelRatio);
      canvas.height = Math.floor(rect.height * devicePixelRatio);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    };

    const draw = () => {
      const rect = container.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      ctx.clearRect(0, 0, w, h);

      shapes.forEach((s) => {
        ctx.save();

        // 좌표 계산
        const px = s.x * w;
        const py = s.y * h;

        ctx.translate(px, py);
        ctx.rotate(-Math.PI / 10); // 살짝 기울어진 유리 느낌

        // roundRect 지원 안 되는 브라우저 대비
        ctx.beginPath();
        const r = 80;
        const rw = s.width;
        const rh = s.height;

        // 간단 라운드 사각형 path
        ctx.moveTo(0 + r, 0);
        ctx.arcTo(rw, 0, rw, rh, r);
        ctx.arcTo(rw, rh, 0, rh, r);
        ctx.arcTo(0, rh, 0, 0, r);
        ctx.arcTo(0, 0, rw, 0, r);

        ctx.closePath();

        ctx.fillStyle = "rgba(255,255,255,0.06)";
        ctx.fill();

        ctx.restore();

        // 위로 천천히 이동
        s.y -= (s.speed / 1000) * 16; // 프레임 기준 보정
        if (s.y < -1.2) s.y = 1.2;
      });

      rafId = requestAnimationFrame(draw);
    };

    window.addEventListener("resize", resize);
    resize();
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section
      ref={(el) => {
        containerRef.current = el;
      }}
      className="entertainment-visual"
      style={{ height }}>
      {/* 배경(그라데이션 + 라인) */}
      <div className="bg" aria-hidden="true" />

      {/* 🔥 나선 SVG (이 줄이 빠져 있었음) */}
      <EntertainmentBackground />

      {/* 캔버스 유리 레이어 */}
      <canvas ref={canvasRef} className="glass-canvas" />

      {/* 좌/우 캐릭터 이미지 */}
      <div className="characters" aria-hidden="true">
        <div className="char char-left">
          <img src={leftSrc} alt="" />
        </div>
        <div className="char char-right">
          <img src={rightSrc} alt="" />
        </div>
      </div>

      {/* 중앙 텍스트 */}
      <div className="center">
        <h2 className="title">{title}</h2>
        <p className="subtitle">{subtitle}</p>
      </div>
    </section>
  );
};

export default EntertainmentVisual;
