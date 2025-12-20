import "./scss/AnimatedBackground.scss";

const AnimatedBackground = () => {
  return (
    <div className="animated-bg">
      <svg className="wave-svg" viewBox="0 0 1440 600" preserveAspectRatio="none">
        <path
          d="M0,300 C240,200 480,400 720,300 960,200 1200,400 1440,300"
          className="wave wave1"
        />
        <path
          d="M0,320 C240,420 480,220 720,320 960,420 1200,220 1440,320"
          className="wave wave2"
        />
      </svg>
    </div>
  );
};

export default AnimatedBackground;
