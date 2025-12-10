import type { OnlyWavve } from '../types/movie';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import './scss/WavveList.scss';

// 시청연령등급 목록
const GRADE_MAP: Record<string, string> = {
    '19': '/images/badge/badge-19.svg',
    '15': '/images/badge/badge-15.svg',
    '12': '/images/badge/badge-12.svg',
    ALL: '/images/badge/badge-all.svg',
    NR: '/images/badge/badge-15.svg',
};

// 장르 목록
const GENRE_MAP: Record<number, string> = {
    10759: '액션',
    18: '드라마',
    35: '코미디',
    80: '범죄',
    9648: '미스터리',
    10764: '리얼리티',
};

// 시청연령등급 문자열로 통일 후 맵핑
const getGrades = (cert?: string | number) => {
    return GRADE_MAP[String(cert)] ?? '/images/15.svg';
};

// 장르 이름으로 반환 후 맵핑
const getGenres = (genre?: number[]) => {
    if (!genre) return [];

    return genre.map((id) => GENRE_MAP[id]).filter(Boolean);
};

interface WavveListProps {
    title: string;
    wavves: OnlyWavve[];
}

const WavveList = ({ title, wavves }: WavveListProps) => {
    return (
        <section className="card-list">
            <div className="title-wrap">
                <h2>{title}</h2>
                <Link to="/">더보기</Link>
            </div>
            <div className="swiper-mask">
                <Swiper
                    modules={[Navigation]}
                    navigation
                    slidesPerView="auto"
                    spaceBetween={24}
                    slidesOffsetBefore={0}
                    slidesOffsetAfter={0}
                >
                    {wavves.map((m) => (
                        <SwiperSlide key={m.id}>
                            <div className="poster-wrap">
                                <img
                                    className="main"
                                    src={`https://image.tmdb.org/t/p/w500${m.poster_path}`}
                                    alt={m.title}
                                />
                                {m.backdrop_path && (
                                    <div className="preview-wrap">
                                        <div className="img-box">
                                            <img
                                                className="hover"
                                                src={`https://image.tmdb.org/t/p/w500${m.backdrop_path}`}
                                                alt={m.title}
                                            />
                                            <div className="logo-blur"></div>
                                            <div className="logo-box">
                                                <img
                                                    src={`https://image.tmdb.org/t/p/w500${m.logo_path}`}
                                                    alt="content-logo"
                                                    className="content-logo"
                                                />

                                                <img
                                                    src="/images/icons/icon-volume-off.svg"
                                                    alt=""
                                                    className="sound-icon"
                                                />
                                            </div>
                                        </div>

                                        <div className="preview-badge-top">
                                            <p>
                                                <img
                                                    src={getGrades(m.certification)}
                                                    alt="certification"
                                                />
                                            </p>
                                            <p>
                                                {getGenres(m.genre_ids).slice(0, 2).join(' · ') ||
                                                    '기타'}
                                            </p>
                                            <p>에피소드 {m.episodeCount}</p>
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
                                            <p>
                                                <img
                                                    src="/images/icons/icon-play-sm.svg"
                                                    alt="icon-detail"
                                                />
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
};

export default WavveList;
