import { Swiper, SwiperSlide } from "swiper/react";
import style from "./scss/RankingCard.module.scss";
import "swiper/css";
import { Link } from "react-router-dom";
import type { Wavves } from "../data/wavves";

interface RankingCardListProps {
  title: string;
  data: Wavves[]; // 데이터를 직접 받도록 추가
}

const RankingCardList = ({ title, data }: RankingCardListProps) => {
  return (
    <section className="card-list">
      <h2>{title}</h2>
      <div className={style.RankWrap}>
        <Swiper
          slidesPerView="auto"
          spaceBetween={24}
          className="mySwiper"
          style={{ overflow: "visible" }}>
          {data.map((t, idx) => (
            <SwiperSlide key={t.tmdb_id} style={{ position: "relative" }}>
              <p className={style.RankNum}>{idx + 1}</p>
              <div className={style.Rankingcard}>
                <Link to={`/contentsdetail/tv/${t.tmdb_id}`}>
                  <img src={`https://${t.season_vertical_logoY_image}`} alt={t.series_title} />
                </Link>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default RankingCardList;
