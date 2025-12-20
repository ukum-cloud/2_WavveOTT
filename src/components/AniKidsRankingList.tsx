import { Swiper, SwiperSlide } from 'swiper/react';

import { aniTop10 } from '../data/aniTop10';

import style from './scss/RankingCard.module.scss';
import 'swiper/css';

import { Link } from 'react-router-dom';

interface RankingCardListProps {
    title: string;
}

const RankingCardList = ({ title }: RankingCardListProps) => {
    return (
        <section className="card-list">
            <h2>{title}</h2>
            <div className={style.RankWrap}>
                <Swiper
                    slidesPerView={6}
                    spaceBetween={60}
                    className="mySwiper"
                    style={{ overflow: 'visible' }}
                >
                    {aniTop10.map((t, idx) => (
                        <SwiperSlide key={t.tmdb_id} style={{ position: 'relative' }}>
                            <p className={style.RankNum}>{idx + 1}</p>
                            <div className={style.Rankingcard}>
                                <Link to={`/contentsdetail/tv/${t.tmdb_id}`}>
                                    <img
                                        src={`https://${t.season_vertical_logoY_image}`}
                                        alt={t.series_title}
                                    />
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
