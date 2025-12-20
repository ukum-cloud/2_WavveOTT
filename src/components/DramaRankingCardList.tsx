import DramaRankingCard from "./DramaRankingCard";
import { Swiper, SwiperSlide } from "swiper/react";
import style from "./scss/RankingCard.module.scss";
import "swiper/css";
import type { Tv } from "../types/movie";

interface Props {
  title: string;
  data: Tv[];
  limit?: number;
}

const DramaRankingCardList = ({ title, data, limit = 10 }: Props) => {
  const displayData = data.slice(0, limit);

  return (
    <section className="card-list">
      <h2>{title}</h2>
      <div className={style.RankWrap}>
        <Swiper slidesPerView={6} spaceBetween={60} style={{ overflow: "visible" }}>
          {displayData.map((tv, idx) => (
            <SwiperSlide key={tv.id} style={{ position: "relative" }}>
              <p className={style.RankNum}>{idx + 1}</p>
              <DramaRankingCard
                id={tv.id}
                poster={tv.poster_path ?? ""}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default DramaRankingCardList;
