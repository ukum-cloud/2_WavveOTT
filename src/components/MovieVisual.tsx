import React, { useRef, useEffect } from 'react';

// Blob 클래스 (변경 없음)
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
        this.radius = (Math.random() * 180 + 120) * 1.2;
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
        const grad = context.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
        grad.addColorStop(0, this.color);
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
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
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let blobs: Blob[] = [];
        let animationFrameId: number;
        const colors = [
            'rgba(0, 255, 255, 1)',
            'rgba(255, 0, 150, 1)',
            'rgba(100, 0, 255, 1)',
            'rgba(0, 100, 255, 1)',
        ];

        const resize = () => {
            if (container) {
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

        const img = container.querySelector('img');
        if (img) {
            if (img.complete) resize();
            else img.onload = resize;
        }

        window.addEventListener('resize', resize);
        resize();
        animate();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    // 애니메이션 키프레임 정의
    const keyframes = `
    /* 왼쪽/오른쪽 슬라이드 인 */
    @keyframes slideInLeft {
      0% { opacity: 0; transform: translateX(-100%); }
      100% { opacity: 1; transform: translateX(0); }
    }
    @keyframes slideInRight {
      0% { opacity: 0; transform: translateX(100%); }
      100% { opacity: 1; transform: translateX(0); }
    }
    
    /* 중앙 텍스트 100px 밑에서 올라오는 효과 */
    @keyframes textRevealUp {
      0% { 
        opacity: 0; 
        transform: translateY(100px); 
      }
      100% { 
        opacity: 1; 
        transform: translateY(0); 
      }
    }

    /* 미세한 부유 효과 */
    @keyframes subtleFloat {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-8px); }
    }
  `;

    return (
        <div
            ref={containerRef}
            className="visual-wrapper"
            style={{
                position: 'relative',
                width: '100%',
                height: '680px',
                overflow: 'hidden',
                backgroundColor: '#000',
                borderRadius: '0px',
            }}
        >
            <style>{keyframes}</style>

            {/* 배경 레이어 */}
            <img
                src="/images/visual/bg-visual-movie.jpg"
                alt=""
                style={{
                    width: '100%',
                    // maxHeight: '680px',
                    height: '100%',
                    display: 'block',
                    opacity: 0.4,
                }}
            />

            {/* 메타볼 캔버스 레이어 */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    filter: 'blur(40px) contrast(25)',
                    mixBlendMode: 'color-dodge',
                    pointerEvents: 'none',
                }}
            >
                <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
            </div>

            {/* 글래시스 오버레이 */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backdropFilter: 'blur(12px) saturate(130%)',
                    WebkitBackdropFilter: 'blur(12px) saturate(130%)',
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    pointerEvents: 'none',
                }}
            />

            {/* 중앙 텍스트 컨텐츠 */}
            <div
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    color: '#fff',
                    textAlign: 'center',
                    zIndex: 3,
                    pointerEvents: 'none',
                }}
            >
                <h2
                    style={{
                        fontSize: 'clamp(2rem, 5vw, 4.5rem)',
                        fontWeight: 900,
                        letterSpacing: '-0.03em',
                        textShadow: '0 10px 30px rgba(0,0,0,0.5)',
                        opacity: 0,
                        animation: 'textRevealUp 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards',
                    }}
                >
                    영화 <span style={{ opacity: 0.6 }}>WAVVE</span>
                </h2>
                <p
                    style={{
                        fontSize: '1.2rem',
                        marginTop: '12px',
                        fontWeight: 500,
                        opacity: 0,
                        animation: 'textRevealUp 1.2s cubic-bezier(0.22, 1, 0.36, 1) 0.3s forwards', // 타이틀 이후 0.3초 뒤 등장
                    }}
                >
                    세상을 보는 새로운 시선
                </p>
            </div>

            {/* 왼쪽 남자 배우 */}
            <div
                style={{
                    position: 'absolute',
                    left: '0',
                    bottom: '-10px',
                    width: '36%',

                    opacity: 0,
                    animation: 'slideInLeft 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
                }}
            >
                <div style={{ animation: 'subtleFloat 6s ease-in-out infinite 1.2s' }}>
                    <img
                        src="/images/visual/visual-movie-main-actor1.png"
                        alt="배우"
                        style={{ width: '100%' }}
                    />
                </div>
            </div>

            {/* 오른쪽 배우들 */}
            <div
                style={{
                    position: 'absolute',
                    right: '0',
                    bottom: '-10px',
                    width: '34%',
                    opacity: 0,
                    animation:
                        'slideInRight 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.3s forwards',
                }}
            >
                <div style={{ animation: 'subtleFloat 7s ease-in-out infinite 1.5s' }}>
                    <img
                        src="/images/visual/visual-movie-main-actor2.png"
                        alt="배우"
                        style={{ width: '100%' }}
                    />
                </div>
            </div>
        </div>
    );
};

export default MovieVisual;
