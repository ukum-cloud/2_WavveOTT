import { useRef } from "react";
import { Swiper, SwiperSlide, type SwiperClass } from "swiper/react";
import { Navigation } from "swiper/modules";

import type { Tv } from "../types/movie";
import "swiper/css";
import "swiper/css/navigation";

interface Props {
  title: string;
  items: Tv[];
  onClick: (id: number) => void;
}

const DramaCardList = ({ title, items, onClick }: Props) => {
  const poster = (path?: string | null) =>
    path ? `https://image.tmdb.org/t/p/w500${path}` : "/images/no-poster.png";

  // CommonCardList처럼 네비게이션 버튼 ref
  const prevBtn = useRef<HTMLDivElement>(null);
  const nextBtn = useRef<HTMLDivElement>(null);

  // 첫/끝에서 버튼 숨김 처리 (CommonCardList 패턴)
  const handleSwiperBtns = (swiper: SwiperClass) => {
    if (!prevBtn.current || !nextBtn.current) return;

    if (swiper.activeIndex === 0) prevBtn.current.classList.add("hidden");
    else prevBtn.current.classList.remove("hidden");

    if (swiper.isEnd) nextBtn.current.classList.add("hidden");
    else nextBtn.current.classList.remove("hidden");
  };

  // Swiper init 전에 navigation 엘리먼트 연결
  const handleBeforeInit = (swiper: SwiperClass) => {
    if (typeof swiper.params.navigation !== "boolean" && swiper.params.navigation) {
      swiper.params.navigation.prevEl = prevBtn.current;
      swiper.params.navigation.nextEl = nextBtn.current;
    }
  };

  if (!items || items.length === 0) {
    return (
      <section className="card-list">
        <h2>{title}</h2>
        <div style={{ padding: "40px 0" }}>데이터가 없습니다.</div>
      </section>
    );
  }

  return (
    <section className="card-list">
      <h2>{title}</h2>

      <Swiper
        modules={[Navigation]}
        navigation={false}          // ✅ ref로 붙일 거라 false
        onBeforeInit={handleBeforeInit}
        onSwiper={handleSwiperBtns}
        onSlideChange={handleSwiperBtns}
        slidesPerView="auto"        // ✅ 가로 카드형은 auto가 편함 (CommonCardList와 동일)
        spaceBetween={24}
        watchSlidesProgress={true}
      >
        {items.map((tv) => (
          <SwiperSlide key={tv.id} style={{ width: "auto" }}>
            <button
              type="button"
              className="drama-card"
              onClick={() => onClick(tv.id)}
            >
              <img src={poster(tv.poster_path)} alt={tv.name} />
              <p className="title">{tv.name}</p>
            </button>
          </SwiperSlide>
        ))}

        {/* ✅ CommonCardList처럼 버튼 래퍼 */}
        <div className="prev-wrap">
          <div ref={prevBtn} className="swiper-button-prev" />
        </div>
        <div className="next-wrap">
          <div ref={nextBtn} className="swiper-button-next" />
        </div>
      </Swiper>
    </section>
  );
};

export default DramaCardList;
