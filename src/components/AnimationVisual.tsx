// ============== 제목 글자 애니메이션 스타일 버전 2 ===============

import React, { useRef, useEffect } from 'react';

const AnimationVisual: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;

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
                aspectRatio: '2023 / 843',
                minHeight: '600px',
                overflow: 'hidden',
                backgroundColor: '#000',
                background: 'linear-gradient(135deg, #28E7C5 0%, #A3E04E 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
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

            {/* 캐릭터 레이어 (1.3초 동안 등장) */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                    zIndex: 2,
                }}
            >
                <div
                    style={{
                        height: '92%',
                        position: 'relative',
                        bottom: '-40px',
                        // 등장 애니메이션 1.3s
                        animation:
                            'slideInLeft 1.3s cubic-bezier(0.16, 1, 0.3, 1) forwards, idleSway 4s ease-in-out infinite 1.3s',
                    }}
                >
                    <img
                        src="/images/bg-animation-left.svg"
                        style={{ height: '100%', width: 'auto' }}
                        alt="left"
                    />
                </div>

                <div
                    style={{
                        height: '92%',
                        position: 'relative',
                        bottom: '-40px',
                        animation:
                            'slideInRight 1.3s cubic-bezier(0.16, 1, 0.3, 1) forwards, idleSway 4.5s ease-in-out infinite reverse 1.3s',
                    }}
                >
                    <img
                        src="/images/bg-animation-right.svg"
                        style={{ height: '100%', width: 'auto' }}
                        alt="right"
                    />
                </div>
            </div>

            {/* 중앙 텍스트 */}
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
                        letterSpacing: '-0.03em',
                        margin: 0,
                        textShadow: '0 10px 30px rgba(0,0,0,0.5)',
                        opacity: 0,
                        // [수정] 캐릭터가 밀고 들어오는 타이밍에 맞춰 0.3s 뒤에 바로 시작
                        animation: 'fadeInUp 0.8s ease-out forwards 0.3s',
                    }}
                >
                    애니메이션 <span style={{ opacity: 0.6 }}>WAVVE</span>
                </h2>
                <p
                    style={{
                        fontSize: '1.2rem',
                        opacity: 0,
                        marginTop: '12px',
                        fontWeight: 500,
                        textShadow: '0 5px 15px rgba(0,0,0,0.3)',
                        // 소제목은 제목이 어느 정도 올라온 뒤인 1.0s에 등장
                        animation: 'fadeInUp 0.8s ease-out forwards 1.0s',
                    }}
                >
                    아이부터 어른까지, 모두의 애니메이션
                </p>
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

export default AnimationVisual;

// ============== 제목 글자 애니메이션 스타일 버전 1 ===============

// import React, { useRef, useEffect } from 'react';

// const AnimationVisual: React.FC = () => {
//     const canvasRef = useRef<HTMLCanvasElement | null>(null);
//     const containerRef = useRef<HTMLDivElement | null>(null);

//     useEffect(() => {
//         const canvas = canvasRef.current;
//         if (!canvas) return;
//         const ctx = canvas.getContext('2d');
//         if (!ctx) return;

//         let animationFrameId: number;

//         const shapes = Array.from({ length: 8 }, () => ({
//             x: Math.random() * 100,
//             y: Math.random() * 100,
//             width: Math.random() * 150 + 80,
//             height: 700,
//             speed: Math.random() * 0.15 + 0.05,
//         }));

//         const resize = () => {
//             if (containerRef.current) {
//                 canvas.width = containerRef.current.clientWidth;
//                 canvas.height = containerRef.current.clientHeight;
//             }
//         };

//         const draw = () => {
//             ctx.clearRect(0, 0, canvas.width, canvas.height);
//             shapes.forEach((shape) => {
//                 ctx.save();
//                 ctx.translate((shape.x * canvas.width) / 100, (shape.y * canvas.height) / 100);
//                 ctx.rotate(-Math.PI / 4);
//                 ctx.beginPath();
//                 ctx.roundRect(0, 0, shape.width, shape.height, 100);
//                 ctx.fillStyle = 'rgba(255, 255, 255, 0.07)';
//                 ctx.fill();
//                 ctx.restore();
//                 shape.y -= shape.speed;
//                 if (shape.y < -80) shape.y = 120;
//             });
//             animationFrameId = requestAnimationFrame(draw);
//         };

//         window.addEventListener('resize', resize);
//         resize();
//         draw();

//         return () => {
//             window.removeEventListener('resize', resize);
//             cancelAnimationFrame(animationFrameId);
//         };
//     }, []);

//     return (
//         <div
//             ref={containerRef}
//             className="visual-wrapper"
//             style={{
//                 position: 'relative',
//                 width: '100%',
//                 aspectRatio: '2023 / 843',
//                 minHeight: '600px',
//                 overflow: 'hidden',
//                 backgroundColor: '#000',
//                 background: 'linear-gradient(135deg, #28E7C5 0%, #A3E04E 100%)',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//             }}
//         >
//             <canvas
//                 ref={canvasRef}
//                 style={{
//                     position: 'absolute',
//                     top: 0,
//                     left: 0,
//                     width: '100%',
//                     height: '100%',
//                     pointerEvents: 'none',
//                 }}
//             />

//             <div
//                 style={{
//                     position: 'absolute',
//                     inset: 0,
//                     display: 'flex',
//                     justifyContent: 'space-between',
//                     alignItems: 'flex-end',
//                     zIndex: 2,
//                 }}
//             >
//                 <div
//                     style={{
//                         height: '92%',
//                         position: 'relative',
//                         bottom: '-40px',
//                         animation:
//                             'slideInLeft 1.3s cubic-bezier(0.16, 1, 0.3, 1) forwards, idleSway 4s ease-in-out infinite 1.3s',
//                     }}
//                 >
//                     <img
//                         src="/images/bg-animation-left.svg"
//                         style={{ height: '100%', width: 'auto' }}
//                         alt="left"
//                     />
//                 </div>

//                 <div
//                     style={{
//                         height: '92%',
//                         position: 'relative',
//                         bottom: '-40px',
//                         animation:
//                             'slideInRight 1.3s cubic-bezier(0.16, 1, 0.3, 1) forwards, idleSway 4.5s ease-in-out infinite reverse 1.3s',
//                     }}
//                 >
//                     <img
//                         src="/images/bg-animation-right.svg"
//                         style={{ height: '100%', width: 'auto' }}
//                         alt="right"
//                     />
//                 </div>
//             </div>

//             {/* --- 중앙 텍스트 컨테이너 수정됨 --- */}
//             <div
//                 style={{
//                     position: 'relative', // absolute 대신 부모의 flex 영향을 받도록 설정
//                     zIndex: 3,
//                     textAlign: 'center',
//                     color: '#fff',
//                     pointerEvents: 'none',
//                 }}
//             >
//                 <h2
//                     style={{
//                         fontSize: 'clamp(2rem, 5vw, 4.5rem)',
//                         fontWeight: 900,
//                         letterSpacing: '-0.03em',
//                         margin: 0,
//                         textShadow: '0 10px 30px rgba(0,0,0,0.5)',
//                         animation: 'textFocus 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) both',
//                     }}
//                 >
//                     애니메이션 <span style={{ opacity: 0.6 }}>WAVVE</span>
//                 </h2>
//                 <p
//                     style={{
//                         fontSize: '1.2rem',
//                         opacity: 0,
//                         marginTop: '12px',
//                         fontWeight: 500,
//                         animation: 'fadeInUp 0.8s ease-out forwards 1.2s',
//                         textShadow: '0 5px 15px rgba(0,0,0,0.3)',
//                     }}
//                 >
//                     아이부터 어른까지, 모두의 애니메이션
//                 </p>
//             </div>

//             <style>{`
//         @keyframes slideInLeft {
//           from { opacity: 0; transform: translateX(-100%); }
//           to { opacity: 1; transform: translateX(0); }
//         }
//         @keyframes slideInRight {
//           from { opacity: 0; transform: translateX(100%); }
//           to { opacity: 1; transform: translateX(0); }
//         }
//         @keyframes idleSway {
//           0%, 100% { transform: translateY(0); }
//           50% { transform: translateY(-20px); }
//         }
//         /* transform에서 translate를 빼고 scale만 조절해서 정중앙 유지 */
//         @keyframes textFocus {
//           0% { filter: blur(15px); opacity: 0; transform: scale(1.1); }
//           100% { filter: blur(0); opacity: 1; transform: scale(1); }
//         }
//         @keyframes fadeInUp {
//           from { opacity: 0; transform: translateY(20px); }
//           to { opacity: 0.9; transform: translateY(0); }
//         }
//       `}</style>
//         </div>
//     );
// };

// export default AnimationVisual;

//2차 살리기

// import React, { useRef, useEffect } from 'react';

// const AnimationVisual: React.FC = () => {
//     const canvasRef = useRef<HTMLCanvasElement | null>(null);
//     const containerRef = useRef<HTMLDivElement | null>(null);

//     useEffect(() => {
//         const canvas = canvasRef.current;
//         if (!canvas) return;
//         const ctx = canvas.getContext('2d');
//         if (!ctx) return;

//         let animationFrameId: number;

//         // 1. 몽환적인 유리 레이어 (주석 버전 복구)
//         const shapes = Array.from({ length: 8 }, () => ({
//             x: Math.random() * 100,
//             y: Math.random() * 100,
//             width: Math.random() * 150 + 80,
//             height: 700,
//             speed: Math.random() * 0.15 + 0.05,
//         }));

//         const resize = () => {
//             if (containerRef.current) {
//                 canvas.width = containerRef.current.clientWidth;
//                 canvas.height = containerRef.current.clientHeight;
//             }
//         };

//         const draw = () => {
//             ctx.clearRect(0, 0, canvas.width, canvas.height);

//             shapes.forEach((shape) => {
//                 ctx.save();
//                 ctx.translate((shape.x * canvas.width) / 100, (shape.y * canvas.height) / 100);
//                 ctx.rotate(-Math.PI / 4);

//                 ctx.beginPath();
//                 ctx.roundRect(0, 0, shape.width, shape.height, 100);
//                 ctx.fillStyle = 'rgba(255, 255, 255, 0.07)';
//                 ctx.fill();
//                 ctx.restore();

//                 shape.y -= shape.speed;
//                 if (shape.y < -80) shape.y = 120;
//             });

//             animationFrameId = requestAnimationFrame(draw);
//         };

//         window.addEventListener('resize', resize);
//         resize();
//         draw();

//         return () => {
//             window.removeEventListener('resize', resize);
//             cancelAnimationFrame(animationFrameId);
//         };
//     }, []);

//     return (
//         <div
//             ref={containerRef}
//             style={{
//                 position: 'relative',
//                 width: '100%',
//                 height: '843px',
//                 overflow: 'hidden',
//                 background: 'linear-gradient(135deg, #28E7C5 0%, #A3E04E 100%)',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//             }}
//         >
//             {/* 배경 캔버스 */}
//             <canvas
//                 ref={canvasRef}
//                 style={{
//                     position: 'absolute',
//                     top: 0,
//                     left: 0,
//                     width: '100%',
//                     height: '100%',
//                     pointerEvents: 'none',
//                 }}
//             />

//             {/* 캐릭터 레이어 - 양 끝에 딱 붙임 */}
//             <div
//                 style={{
//                     position: 'absolute',
//                     inset: 0,
//                     display: 'flex',
//                     justifyContent: 'space-between',
//                     alignItems: 'flex-end',
//                     zIndex: 2,
//                 }}
//             >
//                 {/* 왼쪽 캐릭터: 왼쪽 끝에 밀착 + 하단 여유 */}
//                 <div
//                     style={{
//                         height: '90%',
//                         position: 'relative',
//                         left: '0',
//                         bottom: '-30px', // 짤린 바닥면 숨김
//                         animation:
//                             'slideInLeft 1.3s cubic-bezier(0.16, 1, 0.3, 1) forwards, idleSway 4s ease-in-out infinite 1.3s',
//                     }}
//                 >
//                     <img
//                         src="/images/bg-animation-left.svg"
//                         style={{ height: '100%', width: 'auto', display: 'block' }}
//                         alt="left"
//                     />
//                 </div>

//                 {/* 오른쪽 캐릭터: 오른쪽 끝에 밀착 + 하단 여유 */}
//                 <div
//                     style={{
//                         height: '90%',
//                         position: 'relative',
//                         right: '0',
//                         bottom: '-30px',
//                         animation:
//                             'slideInRight 1.3s cubic-bezier(0.16, 1, 0.3, 1) forwards, idleSway 4.5s ease-in-out infinite reverse 1.3s',
//                     }}
//                 >
//                     <img
//                         src="/images/bg-animation-right.svg"
//                         style={{ height: '100%', width: 'auto', display: 'block' }}
//                         alt="right"
//                     />
//                 </div>
//             </div>

//             {/* 중앙 타이포그래피 */}
//             <div
//                 style={{
//                     position: 'relative',
//                     zIndex: 3,
//                     textAlign: 'center',
//                     color: '#fff',
//                 }}
//             >
//                 <h2
//                     style={{
//                         fontSize: '120px',
//                         fontWeight: 900,
//                         margin: 0,
//                         letterSpacing: '-0.05em',
//                         animation: 'textFocus 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) both',
//                         textShadow: '0 10px 40px rgba(0,0,0,0.15)',
//                     }}
//                 >
//                     애니메이션
//                 </h2>
//                 <p
//                     style={{
//                         fontSize: '24px',
//                         opacity: 0,
//                         marginTop: '10px',
//                         fontWeight: 300,
//                         animation: 'fadeInUp 0.8s ease-out forwards 1.2s',
//                     }}
//                 >
//                     아이부터 어른까지, 모두의 애니메이션
//                 </p>
//             </div>

//             <style>{`
//         @keyframes slideInLeft {
//           from { opacity: 0; transform: translateX(-150px); }
//           to { opacity: 1; transform: translateX(0); }
//         }
//         @keyframes slideInRight {
//           from { opacity: 0; transform: translateX(150px); }
//           to { opacity: 1; transform: translateX(0); }
//         }
//         @keyframes idleSway {
//           0%, 100% { transform: translateY(0); }
//           50% { transform: translateY(-15px); }
//         }
//         @keyframes textFocus {
//           0% { filter: blur(15px); opacity: 0; transform: scale(1.1); }
//           100% { filter: blur(0); opacity: 1; transform: scale(1); }
//         }
//         @keyframes fadeInUp {
//           from { opacity: 0; transform: translateY(20px); }
//           to { opacity: 0.9; transform: translateY(0); }
//         }
//       `}</style>
//         </div>
//     );
// };

// export default AnimationVisual;
