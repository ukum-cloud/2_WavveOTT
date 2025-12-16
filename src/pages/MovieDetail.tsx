import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { useMovieStore } from '../stores/useMovieStore';

import { getGenres, getGrades } from '../utils/mapping';
import { getContentImages } from '../utils/getData';

import MovieRecommend from '../components/MovieRecommend';
import MovieRelative from '../components/MovieRelative';

import './scss/ContentsDetail.scss';

const MovieDetail = () => {
    const { type, id } = useParams<{ type: string; id: string }>();

    const { popularMovies, selectedPopular, onFetchPopular, setSelectedPopular } = useMovieStore();

    const [activeMenu, setActiveMenu] = useState('relative');

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
            // ‼️‼️‼️‼️‼️‼️ 여기에 추가되는 것 넣기 ‼️‼️‼️‼️‼️‼️‼️
            //   if (tvs.length > 0) {
            //     setSelectedTv(Number(id));
            // }
        }
    }, [id, type, popularMovies, setSelectedPopular]);

    let selectedContent = null;

    if (type === 'movie') {
        selectedContent = selectedPopular;
    } // ‼️‼️‼️‼️‼️‼️ 여기에 추가되는 것 넣기 ‼️‼️‼️‼️‼️‼️‼️
    // else if (type === 'movie') {
    //   selectedContent = selected~~; // 섹션별로 더 생기는 것들
    // }

    if (!selectedContent) {
        return <div>🔥콘텐츠 불러오는 중🔥</div>;
    }
    console.log(selectedContent);

    const { logo, background } = getContentImages(selectedContent);

    // 비디오가 들어있는지 없는지 체크해서
    const hasVideos = selectedContent.videos?.length > 0;
    // 실제 화면에 보여줄 메뉴
    const visibleMenu = hasVideos ? activeMenu : 'recommend';

    // 등급 데이터 [] 배열일 수도 있고, NR 수도 있어서 한꺼번에 변수 설정
    const certificationValue = Array.isArray(selectedContent.certificationMovie)
        ? selectedContent.certificationMovie[0]?.certification
        : selectedContent.certificationMovie; // 'NR'

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
                                <img src={getGrades(certificationValue)} alt="certification" />
                            </p>
                            <p className="title-vote seperate">
                                <img src="/images/icons/icon-star.svg" alt="starIcon" />
                                <span>{selectedContent.vote_average.toFixed(1)}</span>
                            </p>
                            <p className="title-genre seperate">
                                {getGenres(selectedContent.genre_ids).slice(0, 2).join(' · ') ||
                                    '기타'}
                            </p>
                            <p className="title-episode">{selectedContent.runtime}분</p>
                        </div>
                        <div className="detail-title-right">
                            <button className="detail-heart-btn"></button>
                            <button className="detail-share-btn"></button>
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
                                                src={`https://image.tmdb.org/t/p/original${actor.profile_path}`}
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
