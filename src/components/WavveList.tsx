import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { Swiper, SwiperSlide, type SwiperClass } from 'swiper/react';
import { Navigation } from 'swiper/modules';

import type { OnlyWavve } from '../types/movie';

import { getGenres, getGrades } from '../utils/mapping';
import { backgroundImage, logoImage } from '../utils/getListData';

import 'swiper/css';
import 'swiper/css/navigation';
import './scss/WavveList.scss';
import { usePickStore } from '../stores/usePickStore';

interface WavveListProps {
    title: string;
    wavves: OnlyWavve[];
}

const WavveList = ({ title, wavves }: WavveListProps) => {
    //어떤거가 호버됐는지 체크
    const [hoverId, setHoverId] = useState<number | null>(null); //숫자로 받기
    const { onAddPick } = usePickStore();

    //스와이퍼 슬라이드 첫번째,마지막 슬라이더 버튼 숨기기
    const prevBtn = useRef<HTMLDivElement>(null);
    const nextBtn = useRef<HTMLDivElement>(null);

    const handleAddPick = (content) => {
        const pickList = usePickStore.getState().pickList;
        const onAddPick = usePickStore.getState().onAddPick;
        const match = pickList.some((p) => p.id === content.id);
        if (!match) {
            onAddPick(content);
        }
        alert('찜리스트에 추가되었습니다!');
    };

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
                <Link to="/home">더보기</Link>
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
                {wavves.map((m) => (
                    <SwiperSlide key={m.id}>
                        <div className="poster-wrap badge-wavve">
                            <img
                                className="main"
                                src={`https://image.tmdb.org/t/p/original${m.poster_path}`}
                                alt={m.title}
                            />
                            {(m.wavveVideo?.key || m.backdrop_path) && (
                                <div className="preview-wrap">
                                    <div
                                        className="img-box"
                                        onMouseEnter={() => setHoverId(m.id)}
                                        onMouseLeave={() => setHoverId(null)}
                                    >
                                        {m.wavveVideo?.key && hoverId === m.id ? (
                                            <iframe
                                                className="hover video"
                                                src={`https://www.youtube.com/embed/${m.wavveVideo.key}?autoplay=1&mute=1`}
                                                allowFullScreen
                                                title={`${m.title}`}
                                            />
                                        ) : (
                                            <img
                                                className="hover image"
                                                src={
                                                    backgroundImage(m.id) ||
                                                    (m.backdrop_path
                                                        ? `https://image.tmdb.org/t/p/original${m.backdrop_path}`
                                                        : undefined)
                                                }
                                                alt={m.title}
                                            />
                                        )}

                                        <div className="logo-box">
                                            <p className="content-logo">
                                                <img
                                                    src={
                                                        logoImage(m.id) ||
                                                        (m.logo
                                                            ? `https://image.tmdb.org/t/p/original${m.logo}`
                                                            : undefined)
                                                    }
                                                    alt="content-logo"
                                                />
                                            </p>
                                            {hoverId === m.id && m.wavveVideo?.key && (
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
                                                src={getGrades(m.certification)}
                                                alt="certification"
                                            />
                                        </p>
                                        <p className="preview-genre">
                                            {getGenres(m.genre_ids).slice(0, 2).join(' · ') ||
                                                '기타'}
                                        </p>
                                        <p>에피소드 {m.episodes.length}</p>
                                    </div>
                                    <div className="preview-badge-bottom">
                                        <div className="preview-btn-wrap">
                                            <button className="preview-play-btn"></button>
                                            <button
                                                className="preview-heart-btn"
                                                onClick={() => handleAddPick(m)}
                                            ></button>
                                        </div>
                                        <Link to={`/contentsdetail/tv/${m.id}`}></Link>
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

export default WavveList;
