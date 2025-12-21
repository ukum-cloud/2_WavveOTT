import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { Swiper, SwiperSlide, type SwiperClass } from 'swiper/react';
import { Navigation } from 'swiper/modules';

import { usePickStore } from '../stores/usePickStore';

import type { OnlyWavve } from '../types/movie';
import type { Pick } from '../types/pick';

import { getGenres, getGrades } from '../utils/mapping';
import { backgroundImage, logoImage } from '../utils/getListData';

import Modal from './Modal';

import 'swiper/css';
import 'swiper/css/navigation';
import './scss/WavveList.scss';

interface WavveListProps {
    title: string;
    wavves: OnlyWavve[];
}

const WavveList = ({ title, wavves }: WavveListProps) => {
    const { onTogglePick, pickList, pickAction } = usePickStore();

    const [hoverId, setHoverId] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalSize, setModalSize] = useState<'xsmall' | 'small' | 'default' | 'large'>('default');

    const prevBtn = useRef<HTMLDivElement>(null);
    const nextBtn = useRef<HTMLDivElement>(null);

    const navigate = useNavigate();

    const getUid = (item: any) => Number(item.tmdb_id ?? item.contentId ?? item.id);

    const handleSwiperBtns = (swiper: SwiperClass) => {
        const isFirst = swiper.activeIndex === 0;
        const isLast = swiper.activeIndex === 13;

        if (prevBtn.current) {
            prevBtn.current.classList.toggle('hidden', isFirst);
        }

        if (nextBtn.current) {
            nextBtn.current.classList.toggle('hidden', isLast);
        }
    };

    const handleBeforeInit = (swiper: SwiperClass) => {
        if (typeof swiper.params.navigation !== 'boolean') {
            const navigation = swiper.params.navigation;
            if (navigation) {
                navigation.prevEl = prevBtn.current;
                navigation.nextEl = nextBtn.current;
            }
        }
    };

    const handleCloseModal = () => setIsModalOpen(false);

    const handleHeart = async (item: OnlyWavve) => {
        await onTogglePick(item as Pick);
        setModalSize('small');
        setIsModalOpen(true);
    };

    // ========== 재생 함수 ==========
    const handlePlayClick = (item: OnlyWavve) => {
        const videoKey = item.wavveVideo?.key || item.videos?.[0]?.key;
        if (!videoKey) return;

        navigate(`/player/${videoKey}`);
    };

    // ===================================================

    return (
        <section className="card-list">
            <div className="title-wrap">
                <h2>{title}</h2>
                <Link to="/drama">더보기</Link>
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
                watchSlidesProgress={true}
            >
                {wavves.map((m) => {
                    // ✅ 추가된 부분: m 스코프 안에서 isPicked 계산
                    const isPicked = pickList.some((p) => getUid(p) === getUid(m));

                    return (
                        <SwiperSlide key={m.id}>
                            <div
                                className="poster-wrap badge-wavve"
                                onMouseEnter={() => setHoverId(m.id)}
                                onMouseLeave={() => setHoverId(null)}
                            >
                                <img
                                    className="main"
                                    src={`https://image.tmdb.org/t/p/original${m.poster_path}`}
                                    alt={m.name}
                                />

                                {(m.wavveVideo?.key || m.backdrop_path) && (
                                    <div className="preview-wrap">
                                        <div className="img-box">
                                            {m.videos?.[0]?.key && hoverId === m.id ? (
                                                <iframe
                                                    className="hover video"
                                                    src={`https://www.youtube.com/embed/${m.videos[0].key}?autoplay=1&mute=1`}
                                                    allowFullScreen
                                                    title={m.name}
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
                                                    alt={m.name}
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
                                            {m.episodes?.length ? (
                                                <p>에피소드 {m.episodes.length}</p>
                                            ) : null}
                                        </div>

                                        <div className="preview-badge-bottom">
                                            <div className="preview-btn-wrap">
                                                <button
                                                    className="preview-play-btn"
                                                    onClick={() => handlePlayClick(m)}
                                                />
                                                <button
                                                    className={`preview-heart-btn ${
                                                        isPicked ? 'active' : ''
                                                    }`}
                                                    onClick={() => handleHeart(m)}
                                                />
                                            </div>
                                            <Link to={`/contentsdetail/wavve/${m.id}`} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </SwiperSlide>
                    );
                })}

                <div className="prev-wrap">
                    <div ref={prevBtn} className="swiper-button-prev" />
                </div>
                <div className="next-wrap">
                    <div ref={nextBtn} className="swiper-button-next" />
                </div>
            </Swiper>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} size={modalSize}>
                <div className="modal-header">
                    <h3 className="modal-title">알림</h3>
                    <button className="close-button" onClick={handleCloseModal}>
                        <span>닫기</span>
                    </button>
                </div>

                <div className="modal-content">
                    <p>
                        {pickAction === 'add'
                            ? '찜 리스트에 추가되었습니다!'
                            : '찜 리스트에서 제거되었습니다!'}
                    </p>
                </div>

                <div className="modal-footer">
                    <button
                        className="btn default primary"
                        onClick={() => {
                            handleCloseModal();
                            navigate('/profile');
                        }}
                    >
                        찜 바로가기
                    </button>
                    <button className="btn default secondary-line" onClick={handleCloseModal}>
                        닫기
                    </button>
                </div>
            </Modal>
        </section>
    );
};

export default WavveList;
