import { useEffect } from 'react';
import { Link } from 'react-router-dom';

import { useMovieStore } from '../stores/useMovieStore';
import { useWavveStore } from '../stores/useWavveStore';

import RankingCardList from '../components/RankingCardList';
import EditorRecommendCardList from '../components/EditorRecommendCardList';
import WavveList from '../components/WavveList';
import MainNomination from '../components/MainNomination';
import BroadcastList from '../components/BroadcastList';
import NewTvList from '../components/NewTvList';

import './scss/Home.scss';
import { useTvStore } from '../stores/useTvStore';

const Home = () => {
  const { onFetchPopular, popularMovies } = useMovieStore();
  const { wavves, onFetchWavve } = useWavveStore();

  useEffect(() => {
    onFetchPopular();
  }, []);

  useEffect(() => {
    onFetchWavve();
  }, [onFetchWavve]);

  return (
    <main className="main-home">
      <div className="" style={{ minHeight: "200px" }}>
        메인 탑 비주얼 공간
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
          <Link to={"/"}>
            <img
              src="/images/banner/banner-main-event.png"
              alt="banner event"
            />
          </Link>
        </div>
        <section className="card-list">
          <h2>지금 주목받는 스타들</h2>
          <div className="">내용, 슬라이더, 등등</div>
        </section>
        <section className="card-list">
          <h2>이건 꼭 봐야해!</h2>
          <div className="">내용, 슬라이더, 등등</div>
        </section>
        <section className="card-list">
          <h2>NEW! 새로 올라온 영화</h2>
          <div className="">내용, 슬라이더, 등등</div>
        </section>
      </div>
      <EditorRecommendCardList list={popularMovies} />
      <div className="inner">
        <section className="card-list">
          <h2>NEW! 새로 올라온 시리즈</h2>
          <div className="">내용, 슬라이더, 등등</div>
        </section>
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
