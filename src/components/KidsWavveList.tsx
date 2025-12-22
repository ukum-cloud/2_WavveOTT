import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide, type SwiperClass } from 'swiper/react';
import { Navigation } from 'swiper/modules';

// import { useVarietyStore } from "../stores/useVarietyStore";
import { usePickStore } from '../stores/usePickStore';
import type { Wavves } from '../data/wavves';
import { getGrades } from '../utils/mapping';
import type { Episodes, Video } from '../types/movie';

import Modal from './Modal';
import 'swiper/css';

interface KidsWavveProps {
    title: string;
    // 스토어에서 받아온 비디오 데이터 (tmdb_id를 키로 사용)
    video: Record<number, { tvsVideo: Video | null; episodes: Episodes[] }>;
    // 실제 화면에 그릴 메타데이터 (kidsEdu 등)
    data: Wavves[];
}

const KidsWavveList = ({ title, video, data }: KidsWavveProps) => {
    const { onTogglePick, pickList, pickAction } = usePickStore();
    const navigate = useNavigate();

    // 호버랑 비디오검색
    const [hoverId, setHoverId] = useState<number | null>(null);
    const [searchedKeys, setSearchedKeys] = useState<Record<number, string>>({});

    // 유튜브 호출 최적화
    const hoverTimer = useRef<number | null>(null);

    const handleMouseEnter = (item: Wavves) => {
        setHoverId(item.tmdb_id);

        // 기존 타이머 제거 (빠르게 지나가는 경우 방지)
        if (hoverTimer.current) clearTimeout(hoverTimer.current);

        // 400ms 동안 머물러야 유튜브 API 호출
        hoverTimer.current = setTimeout(() => {
            fetchYoutubeVideo(item);
        }, 400);
    };

    const handleMouseLeave = () => {
        setHoverId(null);
        if (hoverTimer.current) clearTimeout(hoverTimer.current);
    };

    // 모달
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalSize, setModalSize] = useState<'xsmall' | 'small' | 'default' | 'large'>('default');

    // 네비게이션 버튼 Ref
    const prevBtn = useRef<HTMLDivElement>(null);
    const nextBtn = useRef<HTMLDivElement>(null);

    const handleCloseModal = () => setIsModalOpen(false);

    const handleHeart = async (item: Wavves) => {
        await onTogglePick(item);
        setModalSize('small');
        setIsModalOpen(true);
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

    const fetchYoutubeVideo = async (item: Wavves) => {
        // [삭제/수정] 기존의 복잡한 체크 로직을 정리합니다.

        // 1. 내가 직접 넣은 youtube_key가 이미 있다면 API 호출을 하지 않고 종료 (가장 중요)
        if (item.youtube_key) {
            console.log('수동 입력된 키가 있어 검색을 건너뜁니다:', item.youtube_key);
            return;
        }

        // 2. 이미 이전에 검색해서 알아낸 키가 있다면 중복 호출 방지
        if (item.tmdb_id && searchedKeys[item.tmdb_id]) return;

        const currentId = item.tmdb_id;
        if (!currentId) return;

        try {
            const query = encodeURIComponent(`${item.series_title} 공식 예고편 trailer official`);
            const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

            const res = await fetch(
                `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=1&q=${query}&key=${API_KEY}`
            );
            const searchData = await res.json();
            const videoId = searchData.items?.[0]?.id?.videoId;

            if (videoId) {
                setSearchedKeys((prev) => ({ ...prev, [currentId]: videoId }));
            }
        } catch (error) {
            // console.error('YouTube API Fetch Error:', error);
        }
    };

    const pickSet = new Set(pickList.map((p) => p.tmdb_id));

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
                {data.map((item) => {
                    // kidsEdu 데이터의 tmdb_id를 이용해 스토어의 비디오 정보를 찾습니다.
                    const videoData = item.tmdb_id ? video[item.tmdb_id] : null;
                    // [수정] 1순위: youtube_key 2순위: 스토어 데이터, 3순위: 유튜브 검색 데이터
                    const videoKey =
                        item.youtube_key ||
                        (item.tmdb_id ? searchedKeys[item.tmdb_id] : null) ||
                        videoData?.tvsVideo?.key;
                    const episodesCount = videoData?.episodes?.length;
                    const isPicked = pickSet.has(item.tmdb_id);

                    return (
                        <SwiperSlide key={item.tmdb_id || item.index}>
                            <div
                                className="poster-wrap"
                                onMouseEnter={() => handleMouseEnter(item)}
                                onMouseLeave={handleMouseLeave}
                            >
                                {/* 기본 포스터 */}
                                <img
                                    className="main"
                                    src={`https://${item.season_vertical_logoY_image}`}
                                    alt={item.series_title}
                                    // loading="lazy" // 스크롤 시 성능 향상
                                />

                                {/* 호버 시 프리뷰 영역 */}
                                <div className="preview-wrap">
                                    <div className="img-box">
                                        {/* 비디오가 있으면 유튜브, 없으면 kidsEdu의 가로형 이미지 */}
                                        {videoKey && hoverId === item.tmdb_id ? (
                                            <iframe
                                                className="hover video"
                                                src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&mute=1&controls=0&modestbranding=1`}
                                                title={item.series_title}
                                                loading="lazy"
                                            />
                                        ) : (
                                            <img
                                                className="hover image"
                                                src={`https://${item.season_horizontal_logoY_image}`}
                                                alt={item.series_title}
                                            />
                                        )}

                                        <div className="logo-box">
                                            {item.seasontitlelogoimage && (
                                                <p className="content-logo">
                                                    <img
                                                        src={`https://${item.seasontitlelogoimage}`}
                                                        alt="logo"
                                                    />
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="preview-badge-top">
                                        <p>
                                            <img src={getGrades(item.targetage)} alt="age" />
                                        </p>
                                        <p className="preview-genre">{item.genretext}</p>
                                        {episodesCount && episodesCount > 0 && (
                                            <p>에피소드 {episodesCount}</p>
                                        )}
                                    </div>

                                    <div className="preview-badge-bottom">
                                        <div className="preview-btn-wrap">
                                            <button className="preview-play-btn"></button>
                                            <button
                                                className={`preview-heart-btn ${
                                                    isPicked ? 'active' : ''
                                                } ${
                                                    pickList.some(
                                                        (p) =>
                                                            (p.tmdb_id ?? p.tmdb_id) ===
                                                            item.tmdb_id
                                                    )
                                                        ? 'active'
                                                        : ''
                                                }`}
                                                onClick={() => handleHeart(item)}
                                            ></button>
                                        </div>
                                        <Link
                                            to={`/contentsdetail/tv/${item.tmdb_id}`}
                                            className="full-link"
                                        ></Link>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    );
                })}
                {/* 커스텀 네비게이션 버튼 */}
                <div className="prev-wrap">
                    <div ref={prevBtn} className="swiper-button-prev hidden"></div>
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

export default KidsWavveList;
