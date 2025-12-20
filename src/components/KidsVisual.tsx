import React, { useState } from "react";
import styles from "./scss/kidsVisual.module.scss";
import kidsLeft from "../../public/images/bg-kids-left.svg";
import kidsRight from "../../public/images/bg-kids-right.svg";

const colos = [
  "#FFD700",
  "#FF69B4",
  "#00FFFF",
  "#ADFF2F",
  "#FFA500",
  "#FFFFFF",
];

const KidsVisual: React.FC = () => {
  const confettiParticles = Array.from({ length: 100 });

  const [confettiStyles] = useState(() =>
    confettiParticles.map((_, i) => ({
      left: `${Math.random() * 100}%`,
      color: colos[i % colos.length],
      duration: `${Math.random() * 2 + 2}s`,
      delay: `${Math.random() * 5}s`,
      radius: i % 2 === 0 ? "50%" : "2px",
      size: `${Math.random() * 10 + 5}px`,
    }))
  );

  return (
    <div className={styles.bannerContainer}>
      <div className={styles.confettiContainer}>
        {confettiStyles.map((c, i) => (
          <div
            key={i}
            className={styles.confetti}
            style={{
              left: c.left,
              backgroundColor: c.color,
              animationDuration: c.duration,
              animationDelay: c.delay,
              borderRadius: c.radius,
              width: c.size,
              height: c.size,
            }}
          />
        ))}
      </div>

      <img
        src={kidsLeft}
        alt="Kids Left"
        className={`${styles.character} ${styles.left}`}
      />

      <div className={styles.Title}>
        <h2>
          키즈 <span style={{ opacity: 0.6 }}>WAVVE</span>
        </h2>
        <p>매일매일 즐거운 모험!</p>
      </div>

      <img
        src={kidsRight}
        alt="Kids Right"
        className={`${styles.character} ${styles.right}`}
      />
    </div>
  );
};

export default KidsVisual;
