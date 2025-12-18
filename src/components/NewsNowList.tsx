import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { Swiper, SwiperSlide, type SwiperClass } from 'swiper/react';
import { Navigation } from 'swiper/modules';

import { getGrades } from '../utils/mapping';

import { newsTop50 } from '../data/2025_newsTop50_tmdb';

interface VarietyLiveList {
    title: string;
}

const NewsNowList = ({ title }: VarietyLiveList) => {
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
        // navigation params 타입 체크
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
                <Link to="/home"></Link>
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
                {newsTop50.map((t, id) => (
                    <SwiperSlide key={id}>
                        <div className="poster-wrap badge-new">
                            <img
                                className="main"
                                // src={`https://image.tmdb.org/t/p/original${t.poster_path}`}
                                src={`https://${t.seasonposterimage}`}
                                alt={t.series_title}
                            />
                            {(t.season_horizontal_logoN_image || t.seasonposterimage) && (
                                <div className="preview-wrap">
                                    <div
                                        className="img-box"
                                        onMouseEnter={() => setHoverId(t.index)}
                                        onMouseLeave={() => setHoverId(null)}
                                    >
                                        {/* {hoverId === t.index ? (
                                            <iframe
                                                className="hover video"
                                                src={`https://www.youtube.com/embed/${t.tvsVideo.key}?autoplay=1&mute=1`}
                                                allowFullScreen
                                                title={t.series_title}
                                            />
                                        ) : (
                                            <img
                                                className="hover image"
                                                src={
                                                    backgroundImage(t.index) ||
                                                    (t.season_horizontal_logoN_image
                                                        ? `https://image.tmdb.org/t/p/original${t.backdrop_path}`
                                                        : undefined)
                                                }
                                                alt={t.series_title}
                                            />
                                        )} */}
                                        {hoverId === t.index ? (
                                            <iframe
                                                className="hover video"
                                                src={`https://www.youtube.com/embed/?autoplay=1&mute=1`}
                                                allowFullScreen
                                                title={t.series_title}
                                            />
                                        ) : (
                                            <img
                                                className="hover image"
                                                src={`https://${t.season_horizontal_logoN_image}`}
                                                alt={t.series_title}
                                            />
                                        )}

                                        <div className="logo-box">
                                            <p className="content-logo">
                                                <img
                                                    src={`https://${t.seasontitlelogoimage}`}
                                                    // logoImage(t.index) ||
                                                    // (t.seasontitlelogoimage?
                                                    // `https://image.tmdb.org/t/p/original${t.seasontitlelogoimage}`
                                                    // : undefined)

                                                    alt="content-logo"
                                                />
                                            </p>
                                            {hoverId === t.index && (
                                                <img
                                                    src="/images/icons/icon-volume-off.svg"
                                                    alt="sound-icon"
                                                    className="sound-icon"
                                                />
                                            )}
                                        </div>
                                    </div>

                                    <div className="preview-badge-top">
                                        <p>
                                            <img src={getGrades(t.targetage)} alt="certification" />
                                        </p>
                                        <p className="preview-genre">{t.genretext}</p>
                                        {/* <p>에피소드 {t.episodes.length}</p> */}
                                    </div>
                                    <div className="preview-badge-bottom">
                                        <div className="preview-btn-wrap">
                                            <button className="preview-play-btn"></button>
                                            <button className="preview-heart-btn"></button>
                                        </div>
                                        <Link to={`/contentsdetail/tv/${t.tmdb_id}`}></Link>
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

export default NewsNowList;
