import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useWavveStore } from '../stores/useWavveStore';
import { useTvStore } from '../stores/useTvStore';

import { getGenres, getGrades } from '../utils/mapping';
import { getContentImages } from '../utils/getData';

import ContentsEpisode from '../components/ContentsEpisode';
import ContentsRelative from '../components/ContentsRelative';
import ContentsRecommend from '../components/ContentsRecommend';


// --- 추가된 임포트 ---
import { useAuthStore } from '../stores/useAuthStore'; // KEH  왓치리스트를 위해 추가
import { saveWatchHistory } from '../firebase/firebase'; // KEH  왓치리스트를 위해 추가
// --------------------

import Modal from '../components/Modal';

import './scss/ContentsDetail.scss';

const ContentsDetail = () => {
    // --- 유저 정보 가져오기 ---// KEH  왓치리스트를 위해 추가
    const { user, selectedCharId } = useAuthStore();
    // -
    const { type, id } = useParams<{ type: string; id: string }>();

    const { wavves, selectedWavve, onFetchWavve, setSelectedWavve } = useWavveStore();
    const { tvs, selectedTv, onFetchTv, setSelectedTv } = useTvStore();

    const navigate = useNavigate();

    const [shareOpen, setShareOpen] = useState(false);
    const [activeMenu, setActiveMenu] = useState('episode');
    const [showVideo, setShowVideo] = useState(false);

    // type에 따라 fetch
    useEffect(() => {
        if (!type) return;

        if (type === 'tv') {
            onFetchTv();
            onFetchWavve();
        }
    }, [type, onFetchWavve, onFetchTv]);

    // type에 따라 select
    useEffect(() => {
        if (!id || !type) return;

        if (type === 'tv') {
            if (wavves.length > 0) {
                setSelectedWavve(Number(id));
            }

            if (tvs.length > 0) {
                setSelectedTv(Number(id));
            }
        }
    }, [id, type, wavves, tvs, setSelectedWavve, setSelectedTv]);

    // 전체 콘텐츠 (wavves + tvs)
    let selectedContent = null;

    if (type === 'tv') {
        selectedContent = selectedTv || selectedWavve;
    } else if (type === 'wavve') {
        selectedContent = selectedWavve;
    }

    const videoKey = selectedContent?.videos?.[0]?.key;

    useEffect(() => {
        if (!videoKey) return;

        const timer = setTimeout(() => {
            setShowVideo(true);
        }, 3000);

        return () => clearTimeout(timer);
    }, [videoKey]);

    if (!selectedContent) {
        return <div>🔥콘텐츠 불러오는 중🔥</div>;
    }

    const { logo, background, episodeImages } = getContentImages(selectedContent);

    // ========== 시청 기록 저장 및 재생 함수 (에러 수정 완료) ==========
    // KEH  왓치리스트를 위해 추가
    const handlePlayClick = async () => {
        if (user && selectedCharId && selectedContent) {
            try {
                // 에러 해결을 위해 selectedContent를 잠시 any로 취급
                const content = selectedContent as any;

                const watchData = {
                    id: content.id,
                    // name이나 title이 없을 경우 대비
                    title: (content.name || content.title || '제목 없음') as string,
                    // null을 허용하지 않는 타입을 위해 undefined 처리
                    backdrop_path: content.backdrop_path ?? undefined,
                    poster_path: content.poster_path ?? undefined,
                    // runtime 체크
                    runtime: content.episode_run_time
                        ? content.episode_run_time[0]
                        : (content.runtime || 0),
                };

                await saveWatchHistory(
                    String(user.uid),
                    String(selectedCharId),
                    watchData as any,
                    // (type || 'tv') 뒤에 as any를 붙여서 타입 체크를 통과시킵니다.
                    (type || 'tv') as any,
                    0
                );

                console.log('시청 기록 저장 완료');
            } catch (error) {
                console.error('시청 기록 저장 실패:', error);
            }
        }
        navigate(`/player/${videoKey}`);
    };
    // ============================================================

    return (
        <main className="main-detail">
            <div className="inner">
                <div className="detail-left">
                    <div className="detail-img-box">
                        {!showVideo && background && (
                            <>
                                <p className="detail-backdrop">
                                    <img src={background} alt={selectedContent.title} />
                                </p>
                                <p className="detail-logo">
                                    {logo && (
                                        <img src={logo} alt={`${selectedContent.title} logo`} />
                                    )}
                                </p>
                            </>
                        )}

                        {showVideo && videoKey && (
                            <iframe
                                key={videoKey}
                                className="detail-video"
                                src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&mute=1&controls=0&rel=0`}
                                title={`${selectedContent.title} trailer`}
                                allow="autoplay; fullscreen"
                                allowFullScreen
                            />
                        )}
                    </div>
                    <div className="detail-title-box">
                        <div className="detail-title-left">
                            <p className="title-certification">
                                <img
                                    src={getGrades(selectedContent.certification)}
                                    alt="certification"
                                />
                            </p>
                            <p className="title-star"></p>
                            <p className="title-vote seperate">
                                {selectedContent.vote_average.toFixed(1)}
                            </p>
                            <p className="title-genre seperate">
                                {getGenres(selectedContent.genre_ids).slice(0, 2).join(' · ') ||
                                    '기타'}
                            </p>
                            <p className="title-episode">
                                에피소드 {selectedContent.episodes.length}
                            </p>
                        </div>
                        <div className="detail-title-right">
                            <button className="detail-heart-btn"></button>
                            <button
                                className="detail-share-btn"
                                onClick={() => setShareOpen(true)}
                            ></button>
                            {/* 모달 */}
                            <Modal
                                isOpen={shareOpen}
                                onClose={() => setShareOpen(false)}
                                size="default"
                            >
                                <h3>공유하기</h3>
                                <p>SNS</p>
                                <button onClick={() => setShareOpen(false)}>닫기</button>
                            </Modal>
                        </div>
                    </div>
                    <div className="detail-text-box">
                        <div className="detail-content">
                            <div className="detail-content-left">
                                <h3>줄거리</h3>
                                <p>{selectedContent.overview}</p>
                            </div>
                            <div className="detail-content-right">
                                {/* <button
                                    className="btn default primary"
                                    onClick={() => navigate(`/player/${videoKey}`)}
                                >
                                    재생하기
                                </button> */}
                                {/* 수정한 부분: onClick 핸들러 연결  // KEH  왓치리스트를 위해 추가*/}

                                <button
                                    className="btn default primary"
                                    onClick={handlePlayClick}
                                >
                                    재생하기
                                </button>
                            </div>
                        </div>
                        <div className="detail-cast">
                            <h3>출연진</h3>
                            <ul className="detail-cast-list">
                                {selectedContent.creditData.cast.slice(0, 7).map((actor) => (
                                    <li key={`a-${actor.id}`} className="cast-card">
                                        <p className="cast-card-imgbox">
                                            <img
                                                src={
                                                    actor.profile_path
                                                        ? `https://image.tmdb.org/t/p/original${actor.profile_path}`
                                                        : '/images/actor-no-image.svg'
                                                }
                                                alt={actor.name}
                                            />
                                        </p>
                                        <p className="actor-name">{actor.name}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="detail-crew-list">
                            <div className="detail-director">
                                <h3>감독</h3>
                                <ul className="director-list">
                                    {selectedContent.director &&
                                        selectedContent.director.length > 0 ? (
                                        selectedContent.director
                                            .map((d, index) => (
                                                <li key={`d-${d.id}-${index}`}>{d.name}</li>
                                            ))
                                            .slice(0, 7)
                                    ) : (
                                        <li className="empty-message">
                                            제공된 감독 정보가 없습니다
                                        </li>
                                    )}
                                </ul>
                            </div>
                            <div className="detail-writer">
                                <h3>작가</h3>
                                <ul className="writer-list">
                                    {selectedContent.writer && selectedContent.writer.length > 0 ? (
                                        selectedContent.writer
                                            ?.map((w, index) => (
                                                <li key={`w-${w.id}-${index}`}>{w.name}</li>
                                            ))
                                            .slice(0, 7)
                                    ) : (
                                        <li className="empty-message">
                                            제공된 작가 정보가 없습니다
                                        </li>
                                    )}
                                </ul>
                            </div>
                            <div className="detail-script">
                                <h3>자막</h3>
                                <ul className="script-list">
                                    <li>영어</li>
                                    <li>한국어</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="detail-right">
                    <div className="detail-menu-wrap">
                        <button
                            className={activeMenu === 'episode' ? 'active' : 'detail-menu-btn'}
                            onClick={() => setActiveMenu('episode')}
                        >
                            에피소드
                        </button>
                        {/* 관련영상이 있을 때만 버튼 표시 */}
                        {selectedContent.videos.length > 0 && (
                            <button
                                className={activeMenu === 'relative' ? 'active' : 'detail-menu-btn'}
                                onClick={() => setActiveMenu('relative')}
                            >
                                관련영상
                            </button>
                        )}
                        <button
                            className={activeMenu === 'recommend' ? 'active' : 'detail-menu-btn'}
                            onClick={() => setActiveMenu('recommend')}
                        >
                            추천 컨텐츠
                        </button>
                    </div>
                    <div className="detail-menu-line"></div>

                    {/* 메뉴 */}
                    <div className="detail-menu-content">
                        {activeMenu === 'episode' && (
                            <ContentsEpisode
                                episodes={selectedContent.episodes}
                                seasons={selectedContent.seasons}
                                episodeImages={episodeImages}
                                videoKey={videoKey}
                            />
                        )}
                        {activeMenu === 'relative' && (
                            <ContentsRelative
                                videos={selectedContent.videos}
                                backdrop={selectedContent.backdrop_path}
                            />
                        )}
                        {activeMenu === 'recommend' && <ContentsRecommend wavves={wavves} />}
                    </div>
                </div>
            </div>
        </main>
    );
};

export default ContentsDetail;
