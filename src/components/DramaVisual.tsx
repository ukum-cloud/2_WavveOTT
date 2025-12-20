import "./scss/DramaVisual.scss";

const DramaVisual = () => {
  return (
    <section className="drama-visual">
      <img
        className="drama-visual__bg"
        src="/images/visual/bg-visual-drama.jpg"
        alt=""
        aria-hidden
      />

      <div className="drama-visual__fx" aria-hidden />

      {/* 배우 이미지: absolute 레이어 */}
      <img
        className="drama-visual__actor drama-visual__actor--left"
        src="/images/visual/visual-drama-main-actor2.png"
        alt=""
        draggable={false}
        aria-hidden
      />

      <img
        className="drama-visual__actor drama-visual__actor--right"
        src="/images/visual/visual-drama-main-actor1.png"
        alt=""
        draggable={false}
        aria-hidden
      />

      {/* 텍스트만 가운데 정렬 */}
      <div className="drama-visual__inner">
        <div className="drama-visual__center">
          <h1 className="drama-visual__title">드라마</h1>
          <p className="drama-visual__sub">하루의 끝, 함께하는 드라마</p>
        </div>
      </div>
    </section>
  );
};

export default DramaVisual;
