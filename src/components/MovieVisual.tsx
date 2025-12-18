import React, { useRef, useEffect } from "react";

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
      "rgba(0, 255, 255, 1)",
      "rgba(255, 0, 150, 1)",
      "rgba(100, 0, 255, 1)",
      "rgba(0, 100, 255, 1)",
    ];

    class Blob {
      x: number;
      y: number;
      radius: number;
      vx: number;
      vy: number;
      color: string;

      constructor(w: number, h: number) {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.radius = Math.random() * 180 + 120;
        this.vx = (Math.random() - 0.5) * 6;
        this.vy = (Math.random() - 0.5) * 6;
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update(w: number, h: number) {
        this.x += this.vx;
        this.y += this.vy;

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

    const resize = () => {
      if (container) {
        // 이미지 사이즈에 정확히 맞춤
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        init();
      }
    };

    const init = () => {
      blobs = [];
      for (let i = 0; i < 12; i++) {
        blobs.push(new Blob(canvas.width, canvas.height));
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
        // 보더 라디우스 제거
        borderRadius: "0px",
      }}
    >
      {/* 1. 배경 이미지 (원본 높이 유지) */}
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

      {/* 2. 메타볼 캔버스 레이어 (강력한 대비) */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          filter: "blur(35px) contrast(25)",
          mixBlendMode: "screen",
          pointerEvents: "none",
        }}
      >
        <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />
      </div>

      {/* 3. 글래시스(유리) 오버레이 */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backdropFilter: "blur(10px) saturate(120%)",
          WebkitBackdropFilter: "blur(10px) saturate(120%)",
          backgroundColor: "rgba(255, 255, 255, 0.05)",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          pointerEvents: "none",
        }}
      />

      {/* 4. 텍스트 */}
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
          WAVVE
          <span style={{ opacity: 0.6, fontFamily: "wave" }}>MOVIE</span>
        </h2>
      </div>
    </div>
  );
};

export default MovieVisual;
