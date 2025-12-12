import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { Swiper, SwiperSlide, type SwiperClass } from 'swiper/react';
import { Navigation } from 'swiper/modules';

import type { Tv } from '../types/movie';

import { getGenres, getGrades } from '../utils/mapping';

interface NewTvListProps {
    title: string;
    tvs: Tv[];
}
const NewTvList = ({ title, tvs }: NewTvListProps) => {
    //어떤거가 호버됐는지 체크
    const [hoverId, setHoverId] = useState<number | null>(null); //숫자로 받기

    //스와이퍼 슬라이드 첫번째,마지막 슬라이더 버튼 숨기기
    const prevBtn = useRef<HTMLDivElement>(null);
    const nextBtn = useRef<HTMLDivElement>(null);

    const handleSwiperBtns = (swiper: SwiperClass) => {
        const isFirst = swiper.activeIndex === 0;
        const isLast = swiper.activeIndex === 13;

        if (prevBtn.current) {
            if (isFirst) prevBtn.current.classList.add('hidden');
            else prevBtn.current.classList.remove('hidden');
        }

        if (nextBtn.current) {
            if (isLast) nextBtn.current.classList.add('hidden');
            else nextBtn.current.classList.remove('hidden');
        }
    };

    const handleBeforeInit = (swiper: SwiperClass) => {
        // navigation params 타입 체크 후 ref 할당
        if (typeof swiper.params.navigation !== 'boolean') {
            const navigation = swiper.params.navigation;
            if (navigation) {
                navigation.prevEl = prevBtn.current;
                navigation.nextEl = nextBtn.current;
            }
        }
    };

    return (
        <section className="card-list">
            <div className="title-wrap">
                <h2>{title}</h2>
                <Link to="/"></Link>
            </div>
            <Swiper
                modules={[Navigation]}
                navigation={false}
                onBeforeInit={handleBeforeInit}
                onSwiper={handleSwiperBtns}
                onSlideChange={handleSwiperBtns}
                onReachEnd={handleSwiperBtns}
                slidesPerView="auto"
                spaceBetween={24}
                slidesOffsetBefore={0}
                slidesOffsetAfter={0}
                watchSlidesProgress={true}
            >
                {tvs.map((t, id) => (
                    <SwiperSlide key={id}>
                        <div className="poster-wrap badge-new">
                            <img
                                className="main"
                                src={`https://image.tmdb.org/t/p/w500${t.poster_path}`}
                                alt={t.title}
                            />
                            {(t.tvsVideo?.key || t.backdrop_path || t.poster_path) && (
                                <div className="preview-wrap">
                                    <div
                                        className="img-box"
                                        onMouseEnter={() => setHoverId(t.id)}
                                        onMouseLeave={() => setHoverId(null)}
                                    >
                                        {t.tvsVideo?.key && hoverId === t.id ? (
                                            <iframe
                                                className="hover video"
                                                src={`https://www.youtube.com/embed/${t.tvsVideo.key}?autoplay=1&mute=1`}
                                                allow="autoplay; fullscreen"
                                                allowFullScreen
                                                title={t.title}
                                            />
                                        ) : (
                                            <img
                                                className="hover image"
                                                src={`https://image.tmdb.org/t/p/w500${
                                                    t.backdrop_path || t.poster_path
                                                }`}
                                                alt={t.title}
                                            />
                                        )}

                                        <div className="logo-box">
                                            <p className="content-logo">
                                                <img
                                                    src={`https://image.tmdb.org/t/p/w500${t.logo}`}
                                                    alt="content-logo"
                                                />
                                            </p>
                                            {hoverId === t.id && t.tvsVideo?.key && (
                                                <img
                                                    src="/images/icons/icon-volume-off.svg"
                                                    alt=""
                                                    className="sound-icon"
                                                />
                                            )}
                                        </div>
                                    </div>

                                    <div className="preview-badge-top">
                                        <p>
                                            <img
                                                src={getGrades(t.certification)}
                                                alt="certification"
                                            />
                                        </p>
                                        <p className="preview-genre">
                                            {getGenres(t.genre_ids).slice(0, 2).join(' · ') ||
                                                '기타'}
                                        </p>
                                        <p>에피소드 {t.episodeCount}</p>
                                    </div>
                                    <div className="preview-badge-bottom">
                                        <div className="preview-btn-wrap">
                                            <p>
                                                <img
                                                    src="/images/icons/icon-play-sm.svg"
                                                    alt="icon-play"
                                                />
                                            </p>
                                            <p>
                                                <img
                                                    src="/images/icons/icon-heart-sm.svg"
                                                    alt="icon-heart"
                                                />
                                            </p>
                                        </div>
                                        <Link to="/tvdetail">
                                            <img
                                                src="/images/icons/icon-play-sm.svg"
                                                alt="icon-detail"
                                            />
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </SwiperSlide>
                ))}
                <div className="prev-wrap">
                    <div ref={prevBtn} className="swiper-button-prev"></div>
                </div>
                <div className="next-wrap">
                    <div ref={nextBtn} className="swiper-button-next"></div>
                </div>
            </Swiper>
        </section>
    );
};

export default NewTvList;
