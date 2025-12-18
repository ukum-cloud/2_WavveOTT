import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useMovieStore } from '../stores/useMovieStore';

import { getGenres, getGrades } from '../utils/mapping';
import { getContentImages } from '../utils/getData';

import MovieRecommend from '../components/MovieRecommend';
import MovieRelative from '../components/MovieRelative';
import Modal from '../components/Modal';


import { useAuthStore } from '../stores/useAuthStore';  // KEH  왓치리스트를 위해 추가
import { saveWatchHistory } from '../firebase/firebase';  // KEH  왓치리스트를 위해 추가


import './scss/ContentsDetail.scss';

const MovieDetail = () => {


    const { user, selectedCharId } = useAuthStore(); // KEH  왓치리스트를 위해 추가


    const { type, id } = useParams<{ type: string; id: string }>();

    const navigate = useNavigate();

    const { popularMovies, selectedPopular, onFetchPopular, setSelectedPopular } = useMovieStore();

    const [shareOpen, setShareOpen] = useState(false);
    const [activeMenu, setActiveMenu] = useState('relative');
    const [showVideo, setShowVideo] = useState(false);

    // type에 따라 fetch
    useEffect(() => {
        if (!type) return;

        if (type === 'movie') {
            onFetchPopular();
        }
    }, [type, onFetchPopular]);

    // type에 따라 select
    useEffect(() => {
        if (!id || !type) return;

        if (type === 'movie') {
            if (popularMovies.length > 0) {
                setSelectedPopular(Number(id));
            }
        }
    }, [id, type, popularMovies, setSelectedPopular]);

    let selectedContent: any = null;

    if (type === 'movie') {
        selectedContent = selectedPopular;
    }

    const videoKey = selectedContent?.videos?.[0]?.key;
    const { background, logo } = selectedContent
        ? getContentImages(selectedContent)
        : { background: null, logo: null };

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

    // 비디오가 들어있는지 없는지 체크해서
    const hasVideos = selectedContent.videos?.length > 0;
    // 실제 화면에 보여줄 메뉴
    const visibleMenu = hasVideos ? activeMenu : 'recommend';

    // 등급 데이터 [] 배열일 수도 있고, NR 수도 있어서 한꺼번에 변수 설정
    const certificationValue = Array.isArray(selectedContent.certificationMovie)
        ? selectedContent.certificationMovie[0]?.certification
        : selectedContent.certificationMovie; // 'NR'





    // ========== 3. handlePlayClick 함수 추가 (김은희 추가) ==========
    const handlePlayClick = async () => {
        if (user && selectedCharId && selectedContent) {
            try {
                await saveWatchHistory(
                    user.uid,
                    selectedCharId,
                    {
                        id: selectedContent.id,
                        title: selectedContent.title,
                        backdrop_path: selectedContent.backdrop_path,
                        poster_path: selectedContent.poster_path,
                        runtime: selectedContent.runtime,
                    },
                    'movie',
                    0
                );
                console.log('시청 기록 저장 완료');
            } catch (error) {
                console.error('시청 기록 저장 실패:', error);
            }
        }
        navigate(`/player/${videoKey}`);
    };

    // ==========/// 3. handlePlayClick 함수 추가 (김은희 추가) ==========

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
                            />
                        )}
                    </div>
                    <div className="detail-title-box">
                        <div className="detail-title-left">
                            <p className="title-certification">
                                <img src={getGrades(certificationValue)} alt="certification" />
                            </p>
                            <p className="title-star"></p>
                            <p className="title-vote seperate">
                                {selectedContent.vote_average.toFixed(1)}
                            </p>
                            <p className="title-genre seperate">
                                {getGenres(selectedContent.genre_ids).slice(0, 2).join(' · ') ||
                                    '기타'}
                            </p>
                            <p className="title-episode">{selectedContent.runtime}분</p>
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
                                {selectedContent.overview?.trim() ? (
                                    <p>{selectedContent.overview}</p>
                                ) : (
                                    <p>제공된 줄거리 정보가 없습니다.</p>
                                )}
                            </div>
                            <div className="detail-content-right">
                                {/* <button
                                    className="btn default primary"
                                    onClick={() => navigate(`/player/${videoKey}`)}
                                >
                                    재생하기
                                </button> */}

                                <button
                                    className="btn default primary"
                                    onClick={handlePlayClick}  // KEH  왓치리스트를 위해 추가
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
                        {/* 관련영상이 있을 때만 버튼 표시 */}
                        {hasVideos && (
                            <button
                                className={
                                    visibleMenu === 'relative' ? 'active' : 'detail-menu-btn'
                                }
                                onClick={() => setActiveMenu('relative')}
                            >
                                관련영상
                            </button>
                        )}
                        <button
                            className={visibleMenu === 'recommend' ? 'active' : 'detail-menu-btn'}
                            onClick={() => setActiveMenu('recommend')}
                        >
                            추천 컨텐츠
                        </button>
                    </div>
                    <div className="detail-menu-line"></div>

                    {/* 메뉴 */}
                    <div className="detail-menu-content">
                        {visibleMenu === 'relative' && (
                            <MovieRelative videos={selectedContent.videos} />
                        )}
                        {visibleMenu === 'recommend' && (
                            <MovieRecommend popularMovies={popularMovies} />
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
};

export default MovieDetail;
