import React, { useRef, useEffect } from "react";

// Blob 클래스를 컴포넌트 외부로 분리 (ESLint 에러 방지)
class Blob {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  color: string;

  constructor(w: number, h: number, colors: string[]) {
    this.x = Math.random() * w;
    this.y = Math.random() * h;

    // [수정] 볼 사이즈를 기존 대비 1.2배 상향 조정 (약 145 ~ 360)
    this.radius = (Math.random() * 180 + 120) * 1.2;

    // 역동적인 움직임을 위한 속도 설정
    this.vx = (Math.random() - 0.5) * 6;
    this.vy = (Math.random() - 0.5) * 6;
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }

  update(w: number, h: number) {
    this.x += this.vx;
    this.y += this.vy;

    // 화면 경계에서 부드럽게 루프
    if (this.x < -this.radius) this.x = w + this.radius;
    if (this.x > w + this.radius) this.x = -this.radius;
    if (this.y < -this.radius) this.y = h + this.radius;
    if (this.y > h + this.radius) this.y = -this.radius;
  }

  draw(context: CanvasRenderingContext2D) {
    const grad = context.createRadialGradient(
      this.x,
      this.y,
      0,
      this.x,
      this.y,
      this.radius
    );
    grad.addColorStop(0, this.color);
    grad.addColorStop(1, "rgba(0, 0, 0, 0)");

    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    context.fillStyle = grad;
    context.fill();
  }
}

const MovieVisual: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let blobs: Blob[] = [];
    let animationFrameId: number;

    const colors = [
      "rgba(0, 255, 255, 1)", // Cyan
      "rgba(255, 0, 150, 1)", // Magenta
      "rgba(100, 0, 255, 1)", // Purple
      "rgba(0, 100, 255, 1)", // Deep Blue
    ];

    const resize = () => {
      if (container) {
        // 이미지 비율에 따른 높이를 캔버스에 정확히 반영
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        init();
      }
    };

    const init = () => {
      blobs = [];
      for (let i = 0; i < 12; i++) {
        blobs.push(new Blob(canvas.width, canvas.height, colors));
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      blobs.forEach((blob) => {
        blob.update(canvas.width, canvas.height);
        blob.draw(ctx);
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    // 이미지 로드 후 캔버스 사이즈 재설정
    const img = container.querySelector("img");
    if (img) {
      if (img.complete) resize();
      else img.onload = resize;
    }

    window.addEventListener("resize", resize);
    resize();
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="visual-wrapper"
      style={{
        position: "relative",
        width: "100%",
        overflow: "hidden",
        backgroundColor: "#000",
        borderRadius: "0px", // 보더 라디우스 제거
      }}
    >
      {/* 1. 배경 이미지: 원본 이미지 높이를 그대로 유지 */}
      <img
        src="/images/visual/bg-visual-movie.jpg"
        alt=""
        style={{
          width: "100%",
          height: "auto",
          display: "block",
          opacity: 0.4,
        }}
      />

      {/* 2. 메타볼 레이어: 더 커진 사이즈와 강렬한 대비 */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          filter: "blur(40px) contrast(25)", // 볼이 커진 만큼 블러도 살짝 조정
          mixBlendMode: "screen",
          pointerEvents: "none",
        }}
      >
        <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />
      </div>

      {/* 3. 글래시스(유리) 질감 오버레이 */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backdropFilter: "blur(12px) saturate(130%)",
          WebkitBackdropFilter: "blur(12px) saturate(130%)",
          backgroundColor: "rgba(255, 255, 255, 0.04)",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          pointerEvents: "none",
        }}
      />

      {/* 4. 중앙 텍스트 컨텐츠 */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          color: "#fff",
          textAlign: "center",
          zIndex: 3,
          pointerEvents: "none",
        }}
      >
        <h2
          style={{
            fontSize: "clamp(2rem, 5vw, 4.5rem)",
            fontWeight: 900,
            letterSpacing: "-0.03em",
            textShadow: "0 10px 30px rgba(0,0,0,0.5)",
          }}
        >
          영화 <span style={{ opacity: 0.6 }}>WAVVE</span>
        </h2>
        <p
          style={{
            fontSize: "1.2rem",
            opacity: 0.8,
            marginTop: "12px",
            fontWeight: 500,
          }}
        >
          세상을 보는 새로운 시선
        </p>
      </div>
    </div>
  );
};

export default MovieVisual;
