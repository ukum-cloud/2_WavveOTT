import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { useNewsStore } from '../stores/useNewsStore';
import { usePickStore } from '../stores/usePickStore';

import { Swiper, SwiperSlide, type SwiperClass } from 'swiper/react';
import { Navigation } from 'swiper/modules';

import { getGrades } from '../utils/mapping';

import { newsTop50 } from '../data/2025_newsTop50_tmdb';

import type { Episodes, Video } from '../types/movie';

import Modal from './Modal';
import type { Pick } from '../types/pick';

interface NewsNowList {
    title: string;
    video: Record<number, { tvsVideo: Video | null; episodes: Episodes[] }>;
}

const NewsNowList = ({ title, video }: NewsNowList) => {
    const { id } = useParams();

    const { onTogglePick, pickList, pickAction } = usePickStore();

    //어떤거가 호버됐는지 체크
    const [hoverId, setHoverId] = useState<number | null>(null); //숫자로 받기
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalSize, setModalSize] = useState<'xsmall' | 'small' | 'default' | 'large'>('default');

    useEffect(() => {
        if (id) {
            useNewsStore.getState().fetchNewsDetail(Number(id));
        }
    }, [id]);

    //스와이퍼 슬라이드 첫번째,마지막 슬라이더 버튼 숨기기
    const prevBtn = useRef<HTMLDivElement>(null);
    const nextBtn = useRef<HTMLDivElement>(null);

    const navigate = useNavigate();

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

    const videoKey = hoverId ? video[hoverId]?.tvsVideo?.key : undefined;
    const episodes = hoverId ? video[hoverId]?.episodes : null;

    const handleCloseModal = () => setIsModalOpen(false);

    const handleHeart = async (item: Pick) => {
        await onTogglePick(item);
        setModalSize('small');
        setIsModalOpen(true);
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
                {newsTop50.map((t, id) => (
                    <SwiperSlide key={id}>
                        <div
                            className="poster-wrap badge-new"
                            // onMouseEnter={() => setHoverId(t.tmdb_id)}
                            // onMouseLeave={() => setHoverId(null)}
                            onMouseEnter={() => setHoverId(t.tmdb_id)}
                        >
                            <img
                                className="main"
                                // src={`https://image.tmdb.org/t/p/original${t.poster_path}`}
                                src={`https://${t.seasonposterimage}`}
                                alt={t.series_title}
                            />
                            {(videoKey ||
                                t.season_horizontal_logoN_image ||
                                t.seasonposterimage) && (
                                <div className="preview-wrap">
                                    <div className="img-box">
                                        {videoKey && hoverId === t.tmdb_id ? (
                                            <iframe
                                                className="hover video"
                                                src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&mute=1`}
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
                                        {/* {(t.seasonnumbertitle && (
                                            <p>에피소드 {episodes?.length || 0}</p>
                                        )) ||
                                            null} */}
                                        {episodes?.length ? (
                                            <p>에피소드 {episodes.length}</p>
                                        ) : null}
                                    </div>
                                    <div className="preview-badge-bottom">
                                        <div className="preview-btn-wrap">
                                            <button className="preview-play-btn"></button>
                                            <button
                                                className={`preview-heart-btn ${
                                                    pickList.some((p) => p.tmdb_id === t.tmdb_id)
                                                        ? 'active'
                                                        : ''
                                                }`}
                                                onClick={() => handleHeart(t)}
                                            ></button>
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
            {/* 찜 모달 */}
            <Modal isOpen={isModalOpen} onClose={handleCloseModal} size={modalSize}>
                {/* 모달 내부 콘텐츠: Header, Body, Footer를 직접 구성 */}
                <div className="modal-header">
                    <h3 className="modal-title">알림</h3>
                    {/* 닫기 버튼은 onCLose 핸들러를 호출 */}
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

export default NewsNowList;
