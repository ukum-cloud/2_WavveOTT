import React, { useRef, useEffect } from 'react';

const DramaVisual: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;

        // [AnimationVisual과 동일] 배경 셰이프 설정
        const shapes = Array.from({ length: 8 }, () => ({
            x: Math.random() * 100,
            y: Math.random() * 100,
            width: Math.random() * 150 + 80,
            height: 700,
            speed: Math.random() * 0.15 + 0.05,
        }));

        const resize = () => {
            if (containerRef.current) {
                canvas.width = containerRef.current.clientWidth;
                canvas.height = containerRef.current.clientHeight;
            }
        };

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            shapes.forEach((shape) => {
                ctx.save();
                ctx.translate((shape.x * canvas.width) / 100, (shape.y * canvas.height) / 100);
                ctx.rotate(-Math.PI / 4);
                ctx.beginPath();
                ctx.roundRect(0, 0, shape.width, shape.height, 100);
                ctx.fillStyle = 'rgba(255, 255, 255, 0.07)';
                ctx.fill();
                ctx.restore();
                shape.y -= shape.speed;
                if (shape.y < -80) shape.y = 120;
            });
            animationFrameId = requestAnimationFrame(draw);
        };

        window.addEventListener('resize', resize);
        resize();
        draw();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="visual-wrapper"
            style={{
                position: 'relative',
                width: '100%',
                // aspectRatio: '2023 / 843',
                height: '680px',
                overflow: 'hidden',
                backgroundColor: '#000',
                // 요청하신 보라색 그라데이션 유지
                background: 'linear-gradient(135deg, #7e63ee 0%, #5a31f4 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            {/* 중앙 텍스트 (AnimationVisual 폰트 스타일 및 애니메이션 완벽 복사) */}
            <div
                style={{
                    position: 'relative',
                    zIndex: 3,
                    textAlign: 'center',
                    color: '#fff',
                    pointerEvents: 'none',
                }}
            >
                <h2
                    style={{
                        fontSize: 'clamp(2rem, 5vw, 4.5rem)',
                        fontWeight: 900,
                        letterSpacing: '-0.03em', // 텍스트 자간 수정
                        margin: 0,
                        textShadow: '0 10px 30px rgba(0,0,0,0.5)', // 그림자 효과 복사
                        opacity: 0,
                        animation: 'fadeInUp 0.8s ease-out forwards 0.3s',
                    }}
                >
                    드라마 <span style={{ opacity: 0.6 }}>WAVVE</span>
                </h2>
                <p
                    style={{
                        fontSize: '1.2rem',
                        opacity: 0,
                        marginTop: '12px',
                        fontWeight: 500,
                        textShadow: '0 5px 15px rgba(0,0,0,0.3)',
                        animation: 'fadeInUp 0.8s ease-out forwards 1.0s',
                    }}
                >
                    하루의 끝, 함께하는 드라마
                </p>
            </div>

            <canvas
                ref={canvasRef}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none',
                }}
            />

            {/* 배우 캐릭터 레이어 (AnimationVisual과 동일한 애니메이션 수치) */}
            <div
                style={{
                    // position: 'relative',
                    inset: 0,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                }}
            ></div>
            <div
                style={{
                    // height: '92%',
                    width: '50%',
                    position: 'absolute',
                    left: '0',
                    bottom: '-40px',
                    animation:
                        'slideInLeft 1.3s cubic-bezier(0.16, 1, 0.3, 1) forwards, idleSway 4s ease-in-out infinite 1.3s',
                }}
            >
                <img
                    src="/images/visual/visual-drama-main-actor2.png"
                    style={{ width: '100%' }}
                    alt="left actor"
                />
            </div>

            <div
                style={{
                    // height: '92%',
                    width: '40%',
                    position: 'absolute',
                    right: '0',
                    bottom: '-40px',
                    animation:
                        'slideInRight 1.3s cubic-bezier(0.16, 1, 0.3, 1) forwards, idleSway 4.5s ease-in-out infinite reverse 1.3s',
                }}
            >
                <img
                    src="/images/visual/visual-drama-main-actor1.png"
                    style={{ width: '100%' }}
                    alt="right actor"
                />
            </div>

            <style>{`
                @keyframes slideInLeft {
                    from { opacity: 0; transform: translateX(-100%); }
                    to { opacity: 1; transform: translateX(0); }
                }
                @keyframes slideInRight {
                    from { opacity: 0; transform: translateX(100%); }
                    to { opacity: 1; transform: translateX(0); }
                }
                @keyframes idleSway {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-20px); }
                }
                @keyframes fadeInUp {
                    from { 
                        opacity: 0; 
                        transform: translateY(50px); 
                    }
                    to { 
                        opacity: 1; 
                        transform: translateY(0); 
                    }
                }
            `}</style>
        </div>
    );
};

export default DramaVisual;

// import './scss/DramaVisual.scss';

// const DramaVisual = () => {
//     return (
//         <section className="drama-visual">
//             <img
//                 className="drama-visual__bg"
//                 src="/images/visual/bg-visual-drama.jpg"
//                 alt=""
//                 aria-hidden
//             />

//             <div className="drama-visual__fx" aria-hidden />

//             {/* 배우 이미지: absolute 레이어 */}
//             <img
//                 className="drama-visual__actor drama-visual__actor--left"
//                 src="/images/visual/visual-drama-main-actor2.png"
//                 alt=""
//                 draggable={false}
//                 aria-hidden
//             />

//             <img
//                 className="drama-visual__actor drama-visual__actor--right"
//                 src="/images/visual/visual-drama-main-actor1.png"
//                 alt=""
//                 draggable={false}
//                 aria-hidden
//             />

//             {/* 텍스트만 가운데 정렬 */}
//             <div className="drama-visual__inner">
//                 <div className="drama-visual__center">
//                     <h1 className="drama-visual__title">드라마</h1>
//                     <p className="drama-visual__sub">하루의 끝, 함께하는 드라마</p>
//                 </div>
//             </div>
//         </section>
//     );
// };

// export default DramaVisual;
