import { useEffect } from 'react';
import { Link } from 'react-router-dom';

import { useMovieStore } from '../stores/useMovieStore';
import { useWavveStore } from '../stores/useWavveStore';

import RankingCardList from '../components/RankingCardList';
import EditorRecommendCardList from '../components/EditorRecommendCardList';
import WavveList from '../components/WavveList';

import './scss/Home.scss';

const Home = () => {
    const { onFetchPopular, popularMovies } = useMovieStore();
    const { wavves, onFetchWavve } = useWavveStore();

    useEffect(() => {
        onFetchPopular();
    }, []);

    useEffect(() => {
        onFetchWavve();
    }, [onFetchWavve]);

    useEffect(() => {
        console.log('wavves:', wavves);
    }, [wavves]);

    console.log('영화 데이터', popularMovies);

    return (
        <main className="main">
            <div className="">100% 다 쓰는 경우</div>
            <RankingCardList RankingData={popularMovies} />
            <EditorRecommendCardList list={popularMovies} />
            <div className="inner">
                <section>1</section>
                <WavveList title="오직 웨이브에서만" wavves={wavves} />
                <section className="card-list">
                    <h2>지금 주목받는 스타들</h2>
                    <div className="">내용, 슬라이더, 등등</div>
                </section>
                <div className="banner-event">
                    <Link to={'/'}>
                        <img src="/images/banner/banner-main-event.png" alt="banner event" />
                    </Link>
                </div>
            </div>
        </main>
    );
};

export default Home;
