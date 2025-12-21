import { Swiper, SwiperSlide } from "swiper/react";
import { varietyTop50 } from "../data/2025_varietyTop50_tmdb";

import style from "./scss/RankingCard.module.scss";
import "swiper/css";

import { Link } from "react-router-dom";

interface RankingCardListProps {
  title: string;
}

const EntertainmetTop10 = ({ title }: RankingCardListProps) => {
  return (
    <section className="card-list" style={{ paddingTop: "80px" }}>
      <h2>{title}</h2>

      <div className={style.RankWrap}>
        <Swiper
          slidesPerView={6}
          spaceBetween={60}
          className="mySwiper"
          style={{ overflow: "visible" }}>
          {varietyTop50.slice(0, 10).map((t, idx) => (
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

export default EntertainmetTop10;
