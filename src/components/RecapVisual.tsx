import React, { useRef, useEffect, useState } from 'react';

const RecapVisual: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoaded(true), 100);

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;

        const stars = Array.from({ length: 45 }, () => ({
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 2 + 0.5,
            opacity: Math.random(),
            speed: Math.random() * 0.02 + 0.01,
        }));

        const lines = Array.from({ length: 5 }, () => ({
            phase: Math.random() * Math.PI * 2,
            speed: 0.004 + Math.random() * 0.004,
        }));

        const resize = () => {
            if (containerRef.current && canvas) {
                canvas.width = containerRef.current.clientWidth;
                canvas.height = containerRef.current.clientHeight;
            }
        };

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            stars.forEach((star) => {
                ctx.beginPath();
                ctx.arc(
                    (star.x * canvas.width) / 100,
                    (star.y * canvas.height) / 100,
                    star.size,
                    0,
                    Math.PI * 2
                );
                ctx.fillStyle = `rgba(255, 230, 150, ${star.opacity})`;
                ctx.shadowBlur = 8;
                ctx.shadowColor = 'rgba(212, 175, 55, 0.6)';
                ctx.fill();
                star.opacity += star.speed;
                if (star.opacity > 1 || star.opacity < 0.2) star.speed *= -1;
            });

            lines.forEach((line, i) => {
                ctx.beginPath();
                ctx.moveTo(0, canvas.height * (0.35 + i * 0.1));
                for (let x = 0; x < canvas.width; x += 10) {
                    const y =
                        Math.sin(x * 0.0015 + line.phase) * 25 + canvas.height * (0.35 + i * 0.1);
                    ctx.lineTo(x, y);
                }
                ctx.strokeStyle = `rgba(212, 175, 55, ${0.08 + i * 0.04})`;
                ctx.lineWidth = 1.5;
                ctx.stroke();
                line.phase += line.speed;
            });
            animationFrameId = requestAnimationFrame(draw);
        };

        window.addEventListener('resize', resize);
        resize();
        draw();

        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <section
            ref={containerRef}
            style={{
                position: 'relative',
                width: '100%',
                height: '680px',
                overflow: 'hidden',
                backgroundColor: '#030822',
                background: 'url("/images/bg-recap-no-logo.svg") center/cover no-repeat',
            }}
        >
            <canvas
                ref={canvasRef}
                style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none' }}
            />

            {/* [수정] JTBC 구조를 유지하되 정가운데 정렬 적용 */}
            <div
                className="title-box"
                style={{
                    position: 'absolute',
                    zIndex: 3,
                    top: '50%',
                    left: '50%',
                    // 중앙 정렬의 핵심: translate(-50%, -50%)
                    transform: isLoaded ? 'translate(-50%, -50%)' : 'translate(-50%, -40%)',
                    textAlign: 'center',
                    pointerEvents: 'none',
                    width: '100%',
                    transition: 'transform 0.8s ease-out 0.3s',
                }}
            >
                {/* 메인 타이틀 로고 (JTBC h2 흐름) */}
                <h2
                    style={{
                        margin: 0,
                        opacity: isLoaded ? 1 : 0,
                        // 개별 요소에도 추가적인 이동감을 주어 입체감 부여
                        transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
                        transition: 'transform 0.8s ease-out 0.3s, opacity 0.8s ease-out 0.3s',
                        filter: 'drop-shadow(0 15px 40px rgba(0,0,0,0.6))',
                    }}
                >
                    <img
                        src="/images/bg-recap-title.svg"
                        style={{
                            width: 'auto',
                            maxHeight: '220px',
                            margin: '0 auto',
                            display: 'block',
                        }}
                        alt="2025 웨이브 연말결산"
                    />
                </h2>

                {/* 하단 설명 문구 (JTBC p 흐름) */}
                <p
                    style={{
                        margin: '32px 0 0 0',
                        fontSize: '1.25rem',
                        color: '#fff',
                        fontWeight: 500,
                        letterSpacing: '-0.04em',
                        textShadow: '0 5px 15px rgba(0,0,0,0.4)',
                        opacity: isLoaded ? 1 : 0,
                        transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
                        transition: 'transform 0.8s ease-out 1.0s, opacity 0.8s ease-out 1.0s',
                    }}
                >
                    올해 웨이비들의 많은 사랑을 받은 작품은?
                </p>
            </div>
        </section>
    );
};

export default RecapVisual;
