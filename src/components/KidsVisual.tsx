import React from 'react';
import styles from './scss/kidsVisual.module.scss';
import kidsLeft from '../../public/images/bg-kids-left.svg';
import kidsRight from '../../public/images/bg-kids-right.svg';

const KidsVisual: React.FC = () => {
    // 꽃가루 20개 생성
    const confettiParticles = Array.from({ length: 100 });
    const colors = ['#FFD700', '#FF69B4', '#00FFFF', '#ADFF2F', '#FFA500', '#FFFFFF'];

    return (
        <div className={styles.bannerContainer}>
            {/* 컨페티 레이어 */}
            {/* <div className={styles.confettiContainer}>
                {confettiParticles.map((_, i) => (
                    <div
                        key={i}
                        className={styles.confetti}
                        style={{
                            left: `${Math.random() * 100}%`,
                            backgroundColor: colors[i % colors.length],
                            animationDuration: `${Math.random() * 3 + 3}s`, // 2~5초 사이 랜덤 속도
                            animationDelay: `${Math.random() * 7}s`,
                            borderRadius: i % 2 === 0 ? '50%' : '2px', // 원형과 사각형 혼합
                            width: `${Math.random() * 8 + 6}px`, // 크기 다양화
                            height: `${Math.random() * 8 + 6}px`,
                        }}
                    />
                ))}
            </div> */}
            <div className={styles.confettiContainer}>
                {confettiParticles.map((_, i) => (
                    <div
                        key={i}
                        className={styles.confetti}
                        style={{
                            left: `${Math.random() * 100}%`,
                            backgroundColor: colors[i % colors.length],
                            // 떨어지는 속도와 흔들림을 랜덤하게
                            animationDuration: `${Math.random() * 2 + 2}s`,
                            animationDelay: `${Math.random() * 5}s`,
                            borderRadius: i % 2 === 0 ? '50%' : '2px',
                            width: `${Math.random() * 10 + 5}px`,
                            height: `${Math.random() * 10 + 5}px`,
                        }}
                    />
                ))}
            </div>

            {/* 왼쪽 캐릭터 그룹 */}
            <img src={kidsLeft} alt="Kids Left" className={`${styles.character} ${styles.left}`} />

            {/* 중앙 타이틀 */}
            <div className={styles.title}>
                <h1>키즈</h1>
                <p>매일매일 즐거운 모험!</p>
            </div>

            {/* 오른쪽 캐릭터 그룹 */}
            <img
                src={kidsRight}
                alt="Kids Right"
                className={`${styles.character} ${styles.right}`}
            />
        </div>
    );
};

export default KidsVisual;
