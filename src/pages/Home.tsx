import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';

import { useMovieStore } from '../stores/useMovieStore';
import { useWavveStore } from '../stores/useWavveStore';
import { useTvStore } from '../stores/useTvStore';

import RankingCardList from '../components/RankingCardList';
import EditorRecommendCardList from '../components/EditorRecommendCardList';
import WavveList from '../components/WavveList';
import MainNomination from '../components/MainNomination';
import BroadcastList from '../components/BroadcastList';
import NewTvList from '../components/NewTvList';
import MainSlider from '../components/MainSection';
import NewMovieList from '../components/NewMovieList';
import PrimaryList from '../components/PrimaryList';

import type { PrimaryItem } from '../types/movie';

import { randomArray } from './randomData';

import './scss/Home.scss';

const Home = () => {
    const { popularMovies, newMovies, onFetchPopular, onFetchNewMovie } = useMovieStore();
    const { wavves, onFetchWavve } = useWavveStore();
    const { tvs, onFetchTv } = useTvStore();

    useEffect(() => {
        onFetchPopular();
        onFetchWavve();
        onFetchNewMovie();
        onFetchTv();
    }, [onFetchPopular, onFetchWavve, onFetchNewMovie, onFetchTv]);

    const randomList = useMemo<PrimaryItem[]>(() => {
        return randomArray([
            ...popularMovies.map((v) => ({ ...v, mediaType: 'movie' })),
            ...wavves.map((v) => ({ ...v, mediaType: 'tv' })),
            ...tvs.map((v) => ({ ...v, mediaType: 'tv' })),
        ])
            .filter((v) => v.poster_path) // 이미지 없는 거 제거
            .slice(0, 20);
    }, [popularMovies, wavves, tvs]);

    return (
        <main className="main-home">
            <div className="" style={{ minHeight: '200px' }}>
                <MainSlider />
            </div>
            <div className="inner">
                <BroadcastList />
                <section className="card-list">
                    <h2>지금 시청중인 컨텐츠</h2>
                    <div className="">내용, 슬라이더, 등등</div>
                </section>
            </div>

            <MainNomination />

            <div className="inner">
                <RankingCardList RankingData={popularMovies} />
                <WavveList title="오직 웨이브에서만" wavves={wavves} />
                <div className="banner-event">
                    <Link to={'/event/1'}>
                        <img src="/images/banner/banner-main-event.png" alt="banner event" />
                    </Link>
                </div>
                <section className="card-list">
                    <h2>지금 주목받는 스타들</h2>
                    <div className="">내용, 슬라이더, 등등</div>
                </section>
                <PrimaryList title="이건 꼭 봐야해!" randomList={randomList} />
                <NewMovieList title="NEW! 새로 올라온 영화" newMovies={newMovies} />
            </div>
            <EditorRecommendCardList list={popularMovies} />
            <div className="inner">
                <NewTvList title="NEW! 새로 올라온 시리즈" tvs={tvs} />
                <section className="card-list">
                    <h2>지금 방영중인 예능</h2>
                    <div className="">내용, 슬라이더, 등등</div>
                </section>
                <section className="card-list">
                    <h2>꼭 봐야하는 이슈</h2>
                    <div className="">내용, 슬라이더, 등등</div>
                </section>
            </div>
        </main>
    );
};

export default Home;
