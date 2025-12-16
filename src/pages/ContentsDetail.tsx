import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useMovieStore } from '../stores/useMovieStore';
import { useWavveStore } from '../stores/useWavveStore';
import { useTvStore } from '../stores/useTvStore';

import { getGenres, getGrades } from '../utils/mapping';

import ContentsEpisode from '../components/ContentsEpisode';
import ContentsRelative from '../components/ContentsRelative';
import ContentsRecommend from '../components/ContentsRecommend';

import './scss/ContentsDetail.scss';

const ContentsDetail = () => {
    const { type, id } = useParams<{ type: string; id: string }>();

    const { popularMovies, onFetchPopular } = useMovieStore();
    const { wavves, selectedWavve, onFetchWavve, setSelectedWavve } = useWavveStore();
    const { tvs, selectedTv, onFetchTv, setSelectedTv } = useTvStore();

    const [activeMenu, setActiveMenu] = useState('episode');

    // type에 따라 fetch
    useEffect(() => {
        if (!type) return;

        if (type === 'movie') onFetchPopular();
        if (type === 'tv') {
            onFetchTv();
            onFetchWavve();
        }
    }, [type, onFetchPopular, onFetchWavve, onFetchTv]);

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
        }
    }, [id, type, popularMovies, wavves, tvs, setSelectedWavve, setSelectedTv]);

    // 공통 콘텐츠
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

    return (
        <main className="main-detail">
            <div className="inner">
                <div className="detail-left">
                    <div className="detail-img-box">
                        <p className="detail-backdrop">
                            <img
                                src={`https://image.tmdb.org/t/p/w500${
                                    selectedContent.backdrop_path || selectedContent.poster_path
                                }`}
                                alt={selectedContent.title}
                            />
                        </p>
                        <p className="detail-logo">
                            <img
                                src={`https://image.tmdb.org/t/p/w500${selectedContent.logo_path}`}
                                alt=""
                            />
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
                            <p className="title-vote seperate">
                                <img src="/images/icons/icon-star.svg" alt="starIcon" />
                                <span>{selectedContent.vote_average}</span>
                            </p>
                            <p className="title-genre seperate">
                                {getGenres(selectedContent.genre_ids).slice(0, 2).join(' · ') ||
                                    '기타'}
                            </p>
                            <p className="title-episode">에피소드 {selectedContent.episodeCount}</p>
                        </div>
                        <div className="detail-title-right">
                            <p>
                                <img src="/images/icons/icon-heart-sm.svg" alt="heartIcon" />
                            </p>
                            <p>공유</p>
                        </div>
                    </div>
                    <div className="detail-text-box">
                        <div className="detail-content">
                            <div className="detail-content-left">
                                <h3>줄거리</h3>
                                <p>{selectedContent.overview}</p>
                            </div>
                            <div className="detail-content-right">
                                <button className="btn default primary">이용권 구매하기</button>
                            </div>
                        </div>
                        <div className="detail-cast">
                            <h3>출연진</h3>
                            <ul className="detail-cast-list">
                                {selectedContent.creditData.cast.slice(0, 7).map((actor) => (
                                    <li key={`a-${actor.id}`} className="cast-card">
                                        <p className="cast-card-imgbox">
                                            <img
                                                src={`https://image.tmdb.org/t/p/w500${actor.profile_path}`}
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
                                    {selectedContent.director?.map((d, index) => (
                                        <li key={`d-${d.id}-${index}`}>{d.name}</li>
                                    ))}
                                </ul>
                            </div>
                            <div className="detail-writer">
                                <h3>작가</h3>
                                <ul className="writer-list">
                                    {selectedContent.writer?.map((w, index) => (
                                        <li key={`w-${w.id}-${index}`}>{w.name}</li>
                                    ))}
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
                            className={activeMenu === 'episode' ? 'active' : ''}
                            onClick={() => setActiveMenu('episode')}
                        >
                            에피소드
                        </button>
                        <button
                            className={activeMenu === 'relative' ? 'active' : ''}
                            onClick={() => setActiveMenu('relative')}
                        >
                            관련영상
                        </button>
                        <button
                            className={activeMenu === 'recommend' ? 'active' : ''}
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
                            />
                        )}
                        {activeMenu === 'relative' && (
                            <ContentsRelative
                                videos={selectedContent.videos}
                                backdrop={selectedContent.backdrop_path}
                            />
                        )}
                        {activeMenu === 'recommend' && <ContentsRecommend />}
                    </div>
                </div>
            </div>
        </main>
    );
};

export default ContentsDetail;
