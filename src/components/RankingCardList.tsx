import RankingCard from "./RankingCard";
import { Swiper, SwiperSlide } from "swiper/react";
import style from "./scss/RankingCard.module.scss";
import "swiper/css";
import type { MovieWithLogo } from "../types/movie";

interface RankingCardListProps {
  RankingData: MovieWithLogo[];
}

const RankingCardList = ({ RankingData }: RankingCardListProps) => {
  return (
    <section className={style.RankSection}>
      <h2 className={style.RankTitle}>실시간 TOP 20</h2>
      <div className={style.RankWrap}>
        <Swiper
          slidesPerView={6}
          spaceBetween={60}
          className="mySwiper"
          style={{ overflow: "visible" }}>
          {RankingData.map((t, idx) => (
            <SwiperSlide key={t.id} style={{ position: "relative" }}>
              <p className={style.RankNum}>{idx + 1}</p>
              <RankingCard poster={t.poster_path ?? ""} id={t.id} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default RankingCardList;
