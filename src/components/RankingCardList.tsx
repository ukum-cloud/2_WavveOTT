import RankingCard from "./RankingCard";
import { Swiper, SwiperSlide } from "swiper/react";
import style from "./scss/RankingCard.module.scss";
import "swiper/css";
import type { MovieWithLogo } from "../types/movie";

interface RankingCardListProps {
  RankingData: MovieWithLogo[];
  title: string;
  limit?: number; // ?를 붙여서 선택적으로 받을 수 있게 추가 (10개 혹은 20개)
}

const RankingCardList = ({ title, RankingData, limit }: RankingCardListProps) => {
  // limit 프롭스가 있으면 해당 개수만큼 자르고, 없으면 원본 데이터를 사용합니다.
  const displayData = limit ? RankingData.slice(0, limit) : RankingData;

  return (
    <section className="card-list">
      <h2>{title}</h2>
      <div className={style.RankWrap}>
        <Swiper slidesPerView={6} spaceBetween={60} className="mySwiper">
          {displayData.map((t, idx) => (
            <SwiperSlide key={t.id}>
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
