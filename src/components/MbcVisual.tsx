import React, { useRef, useEffect, useState } from 'react';

const MBCVisual: React.FC = () => {
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

        const stars = Array.from({ length: 65 }, () => ({
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 1.5 + 0.5,
            opacity: Math.random(),
            speed: Math.random() * 0.01 + 0.005,
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
                ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
                ctx.fill();
                star.opacity += star.speed;
                if (star.opacity > 0.8 || star.opacity < 0.1) star.speed *= -1;
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

    const charData = [
        {
            src: 'bg-mbc-left-1.svg',
            left: '0%',
            bottom: '-50px',
            height: '320px',
            delay: '0s',
            duration: '5s',
            z: 3,
        },
        {
            src: 'bg-mbc-left-2.svg',
            left: '8%',
            top: '12%',
            height: '180px',
            delay: '0.8s',
            duration: '4s',
            z: 1,
        },
        {
            src: 'bg-mbc-left-3.svg',
            left: '22%',
            bottom: '280px',
            height: '160px',
            delay: '1.5s',
            duration: '6s',
            z: 2,
        },
        {
            src: 'bg-mbc-left-4.svg',
            left: '40%',
            top: '15%',
            height: '60px',
            delay: '1.5s',
            duration: '6s',
            z: 4,
        },
        {
            src: 'bg-mbc-right-1.svg',
            right: '15%',
            bottom: '15%',
            height: '450px',
            delay: '0.3s',
            duration: '5.5s',
            z: 2,
        },
        {
            src: 'bg-mbc-right-2.svg',
            right: '5%',
            top: '10%',
            height: '180px',
            delay: '1.1s',
            duration: '4.5s',
            z: 1,
        },
        {
            src: 'bg-mbc-right-3.svg',
            right: '30%',
            bottom: '-2%',
            height: '120px',
            delay: '1.8s',
            duration: '6.5s',
            z: 3,
        },
        {
            src: 'bg-mbc-right-4.svg',
            right: '10%',
            bottom: '-2%',
            height: '40px',
            delay: '1.8s',
            duration: '6.5s',
            z: 3,
        },
    ];

    return (
        <section
            ref={containerRef}
            style={{
                position: 'relative',
                width: '100%',
                height: '680px',
                overflow: 'hidden',
                backgroundColor: '#030822',
                background: 'url("/images/bg-mbc-bg.svg") center/cover no-repeat',
                display: 'flex',
                alignItems: 'center', // 수직 정중앙
                justifyContent: 'center', // 수평 정중앙
            }}
        >
            <canvas
                ref={canvasRef}
                style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none' }}
            />

            {/* 캐릭터 레이어 */}
            <div style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none' }}>
                {charData.map((char, i) => (
                    <img
                        key={i}
                        src={`/images/${char.src}`}
                        style={{
                            position: 'absolute',
                            left: char.left,
                            right: char.right,
                            top: char.top,
                            bottom: char.bottom,
                            height: char.height,
                            width: 'auto',
                            zIndex: char.z,
                            animation: `floatSway ${char.duration} ease-in-out infinite ${char.delay}`,
                            filter: 'drop-shadow(0 15px 30px rgba(0,0,0,0.3))',
                            opacity: isLoaded ? 1 : 0,
                            transition: 'opacity 1s ease-out',
                        }}
                        alt={`mbc-char-${i}`}
                    />
                ))}
            </div>

            {/* [KBS와 동일하게 수정] 완벽 정중앙 중앙 콘텐츠 */}
            <div
                style={{
                    position: 'relative',
                    zIndex: 10,
                    textAlign: 'center',
                    pointerEvents: 'none',
                }}
            >
                {/* 로고: KBS와 동일한 textFocus 효과 (Blur + Scale) */}
                <div
                    style={{
                        opacity: isLoaded ? 1 : 0,
                        filter: isLoaded ? 'blur(0)' : 'blur(15px)',
                        transform: isLoaded ? 'scale(1)' : 'scale(1.1)',
                        transition: 'all 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                    }}
                >
                    <img
                        src="/images/bg-mbc-logo.svg"
                        alt="MBC"
                        style={{
                            width: 'auto',
                            maxHeight: '190px', // MBC 기존 크기 유지
                            display: 'block',
                            margin: '0 auto',
                            filter: 'drop-shadow(0 10px 40px rgba(0,0,0,0.15))',
                        }}
                    />
                </div>

                {/* 부제목: KBS와 동일한 fadeInUp 효과 (1.2s 딜레이) */}
                <p
                    style={{
                        fontSize: '1.2rem',
                        color: '#fff',
                        marginTop: '15px',
                        fontWeight: 300,
                        letterSpacing: '-0.04em',
                        textShadow: '0 5px 25px rgba(0,0,0,0.5)',
                        opacity: isLoaded ? 0.9 : 0,
                        transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
                        transition: 'all 0.8s ease-out 1.2s',
                    }}
                >
                    만나면 좋은 친구
                </p>
            </div>

            <style>{`
                @keyframes floatSway {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    50% { transform: translateY(-15px) rotate(1.5deg); }
                }
            `}</style>
        </section>
    );
};

export default MBCVisual;
