import React, { useEffect, useState } from 'react';

const KBSVisual: React.FC = () => {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoaded(true);
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        <section
            style={{
                position: 'relative',
                width: '100%',
                height: '680px',
                overflow: 'hidden',
                background: 'linear-gradient(135deg, #041390 0%, #0419B2 50%, #0653D9 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            {/* 배경 레이어 (기존 동일) */}
            <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
                <div
                    style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        width: '60%',
                        height: '100%',
                        background:
                            'radial-gradient(circle at 0% 50%, rgba(153, 236, 252, 0.2), transparent 70%)',
                        opacity: isLoaded ? 1 : 0,
                        transition: 'opacity 1.5s ease-out',
                    }}
                />
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '45%',
                        background:
                            'linear-gradient(to bottom, rgba(255, 255, 255, 0.25), transparent)',
                        clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 100%)',
                        transform: isLoaded ? 'translateY(0)' : 'translateY(-50%)',
                        opacity: isLoaded ? 0.8 : 0,
                        transition: 'transform 1.2s ease-out, opacity 1.2s ease-out',
                    }}
                />
                <div
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        height: '25%',
                        background:
                            'linear-gradient(to top, rgba(255, 255, 255, 0.15), transparent)',
                        clipPath: 'polygon(0 100%, 100% 100%, 100% 80%, 0 20%)',
                        transform: isLoaded ? 'translateY(0)' : 'translateY(50%)',
                        opacity: isLoaded ? 1 : 0,
                        transition: 'transform 1.2s ease-out 0.2s, opacity 1.2s ease-out 0.2s',
                    }}
                />
            </div>

            {/* KBS 건물 그래픽 */}
            <div
                style={{
                    position: 'absolute',
                    right: '0',
                    bottom: '0',
                    height: '100%',
                    width: '50%',
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'flex-end',
                    zIndex: 3,
                    pointerEvents: 'none',
                    transform: isLoaded ? 'translateX(0)' : 'translateX(60px)',
                    opacity: isLoaded ? 1 : 0,
                    transition:
                        'transform 1.5s cubic-bezier(0.16, 1, 0.3, 1) 0.5s, opacity 1.5s ease-out 0.5s',
                }}
            >
                <img
                    src="/images/bg-kbs-right.svg"
                    alt="KBS Building"
                    style={{ height: '88%', width: 'auto' }}
                />
            </div>

            {/* 중앙 콘텐츠: AnimationVisual의 애니메이션 기법 적용 */}
            <div
                style={{
                    position: 'relative',
                    zIndex: 10,
                    textAlign: 'center',
                    pointerEvents: 'none',
                }}
            >
                {/* 로고: textFocus 애니메이션 (블러 + 스케일) */}
                <div
                    style={{
                        opacity: isLoaded ? 1 : 0,
                        filter: isLoaded ? 'blur(0)' : 'blur(15px)',
                        transform: isLoaded ? 'scale(1)' : 'scale(1.1)',
                        transition: 'all 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                    }}
                >
                    <img
                        src="/images/bg-KBS-logo.svg"
                        alt="KBS"
                        style={{
                            width: 'auto',
                            maxHeight: '160px',
                            display: 'block',
                            margin: '0 auto',
                            filter: 'drop-shadow(0 10px 40px rgba(0,0,0,0.15))',
                        }}
                    />
                </div>

                {/* 부제목: fadeInUp 애니메이션 (0.8s 딜레이) */}
                <p
                    style={{
                        fontSize: '1.2rem',
                        color: '#fff',
                        marginTop: '15px',
                        fontWeight: 300,
                        letterSpacing: '-0.04em',
                        opacity: isLoaded ? 0.9 : 0,
                        transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
                        transition: 'all 0.8s ease-out 1.2s',
                    }}
                >
                    즐거움과 감동을 제공하는 세상의 창
                </p>
            </div>
        </section>
    );
};

export default KBSVisual;
// import React, { useEffect, useState } from 'react';

// const KBSVisual: React.FC = () => {
//     const [isLoaded, setIsLoaded] = useState(false);

//     useEffect(() => {
//         const timer = setTimeout(() => {
//             setIsLoaded(true);
//         }, 100);
//         return () => clearTimeout(timer);
//     }, []);

//     return (
//         <section
//             style={{
//                 position: 'relative',
//                 width: '100%',
//                 height: '680px',
//                 overflow: 'hidden',
//                 background: 'linear-gradient(135deg, #041390 0%, #0419B2 50%, #0653D9 100%)',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//             }}
//         >
//             {/* 1. 배경 효과 레이어들 */}
//             <div
//                 style={{
//                     position: 'absolute',
//                     left: 0,
//                     top: 0,
//                     width: '60%',
//                     height: '100%',
//                     background:
//                         'radial-gradient(circle at 0% 50%, rgba(153, 236, 252, 0.2), transparent 70%)',
//                     zIndex: 1,
//                     opacity: isLoaded ? 1 : 0,
//                     transition: 'opacity 1.5s ease-out',
//                 }}
//             />
//             <div
//                 style={{
//                     position: 'absolute',
//                     top: 0,
//                     left: 0,
//                     width: '100%',
//                     height: '45%',
//                     background:
//                         'linear-gradient(to bottom, rgba(255, 255, 255, 0.25), transparent)',
//                     clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 100%)',
//                     zIndex: 2,
//                     transform: isLoaded ? 'translateY(0)' : 'translateY(-50%)',
//                     opacity: isLoaded ? 0.8 : 0,
//                     transition: 'transform 1.2s ease-out, opacity 1.2s ease-out',
//                 }}
//             />
//             <div
//                 style={{
//                     position: 'absolute',
//                     bottom: 0,
//                     left: 0,
//                     width: '100%',
//                     height: '25%',
//                     background: 'linear-gradient(to top, rgba(255, 255, 255, 0.15), transparent)',
//                     clipPath: 'polygon(0 100%, 100% 100%, 100% 80%, 0 20%)',
//                     zIndex: 2,
//                     transform: isLoaded ? 'translateY(0)' : 'translateY(50%)',
//                     opacity: isLoaded ? 1 : 0,
//                     transition: 'transform 1.2s ease-out 0.2s, opacity 1.2s ease-out 0.2s',
//                 }}
//             />

//             {/* 2. KBS 건물 그래픽 */}
//             <div
//                 style={{
//                     position: 'absolute',
//                     right: '0',
//                     bottom: '0',
//                     height: '100%',
//                     width: '50%',
//                     display: 'flex',
//                     alignItems: 'flex-end',
//                     justifyContent: 'flex-end',
//                     zIndex: 3,
//                     pointerEvents: 'none',
//                     transform: isLoaded ? 'translateX(0)' : 'translateX(60px)',
//                     opacity: isLoaded ? 1 : 0,
//                     transition:
//                         'transform 1.5s cubic-bezier(0.16, 1, 0.3, 1) 0.5s, opacity 1.5s ease-out 0.5s',
//                 }}
//             >
//                 <img
//                     src="/images/bg-kbs-right.svg"
//                     alt="KBS Building"
//                     style={{ height: '88%', width: 'auto' }}
//                 />
//             </div>

//             {/* 3. 중앙 텍스트 (AnimationVisual 스타일 적용) */}
//             <div
//                 style={{
//                     position: 'relative',
//                     zIndex: 10,
//                     textAlign: 'center',
//                     color: '#fff',
//                     pointerEvents: 'none',
//                     // JTBC와 동일한 수직 위치 보정
//                     transform: isLoaded ? 'translateY(-20px)' : 'translateY(20px)',
//                     opacity: isLoaded ? 1 : 0,
//                     transition: 'transform 0.8s ease-out 0.3s, opacity 0.8s ease-out 0.3s',
//                 }}
//             >
//                 {/* 제목 스타일 (AnimationVisual 스타일 복제) */}
//                 <h2
//                     style={{
//                         fontSize: 'clamp(2rem, 5vw, 4.5rem)', // 반응형 크기
//                         fontWeight: 900,
//                         letterSpacing: '-0.03em',
//                         margin: 0,
//                         textShadow: '0 10px 30px rgba(0,0,0,0.5)',
//                         opacity: isLoaded ? 1 : 0,
//                         transform: isLoaded ? 'translateY(0)' : 'translateY(30px)',
//                         transition: 'transform 0.8s ease-out 0.3s, opacity 0.8s ease-out 0.3s',
//                     }}
//                 >
//                     KBS <span style={{ opacity: 0.6 }}>WAVVE</span>
//                 </h2>

//                 {/* 부제목 스타일 (AnimationVisual 스타일 복제) */}
//                 <p
//                     style={{
//                         fontSize: '1.2rem',
//                         marginTop: '12px',
//                         fontWeight: 500,
//                         textShadow: '0 5px 15px rgba(0,0,0,0.3)',
//                         opacity: isLoaded ? 1 : 0,
//                         transform: isLoaded ? 'translateY(0)' : 'translateY(30px)',
//                         transition: 'transform 0.8s ease-out 1.0s, opacity 0.8s ease-out 1.0s',
//                     }}
//                 >
//                     즐거움과 감동을 제공하는 세상의 창
//                 </p>
//             </div>
//         </section>
//     );
// };

// export default KBSVisual;
