import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { useWavveStore } from '../stores/useWavveStore';
import { useTvStore } from '../stores/useTvStore';

import { getGenres, getGrades } from '../utils/mapping';
import { getContentImages } from '../utils/getData';

import ContentsEpisode from '../components/ContentsEpisode';
import ContentsRelative from '../components/ContentsRelative';
import ContentsRecommend from '../components/ContentsRecommend';
import Modal from '../components/Modal';

import './scss/ContentsDetail.scss';

const ContentsDetail = () => {
    const { type, id } = useParams<{ type: string; id: string }>();

    const { wavves, selectedWavve, onFetchWavve, setSelectedWavve } = useWavveStore();
    const { tvs, selectedTv, onFetchTv, setSelectedTv } = useTvStore();

    const [shareOpen, setShareOpen] = useState(false);
    const [activeMenu, setActiveMenu] = useState('episode');

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

        // ‼️‼️‼️‼️‼️‼️ 여기에 추가되는 것 넣기 ‼️‼️‼️‼️‼️‼️‼️
        // if (type === 'movie' && popularMovies.length > 0) {
        //     setSelected~~(Number(id));
        // }

        if (type === 'tv') {
            if (wavves.length > 0) {
                setSelectedWavve(Number(id));
            }

            if (tvs.length > 0) {
                setSelectedTv(Number(id));
            }

            // ‼️‼️‼️‼️‼️‼️ 여기에 추가되는 것 넣기 ‼️‼️‼️‼️‼️‼️‼️
            // if (tvs.length > 0) {
            //     setSelectedTv(Number(id));
            // }
        }
    }, [id, type, wavves, tvs, setSelectedWavve, setSelectedTv]);

    // 전체 콘텐츠 (wavves + tvs)
    let selectedContent = null;

    if (type === 'tv') {
        selectedContent = selectedTv || selectedWavve;
    } else if (type === 'wavve') {
        selectedContent = selectedWavve;
    } // ‼️‼️‼️‼️‼️‼️ 여기에 추가되는 것 넣기 ‼️‼️‼️‼️‼️‼️‼️
    // else if (type === 'movie') {
    //   selectedContent = selected~~; // Movie 등등
    // }

    if (!selectedContent) {
        return <div>🔥콘텐츠 불러오는 중🔥</div>;
    }

    console.log('확인', selectedContent);

    const { logo, background, episodeImages } = getContentImages(selectedContent);

    return (
        <main className="main-detail">
            <div className="inner">
                <div className="detail-left">
                    <div className="detail-img-box">
                        <p className="detail-backdrop">
                            {background && <img src={background} alt={selectedContent.title} />}
                        </p>
                        <p className="detail-logo">
                            {logo && <img src={logo} alt={`${selectedContent.title} logo`} />}
                        </p>
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
                                <Link to="/ticket" className="btn default primary">
                                    이용권 구매하기
                                </Link>
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
