import { useEffect } from 'react';
import './scss/Home.scss';
import RankingCardList from '../components/RankingCardList';
import { Link } from 'react-router-dom';
import { useMovieStore } from '../stores/useMovieStore';

const Home = () => {
  const { onFetchPopular, popularMovies } = useMovieStore();
  useEffect(() => {
    onFetchPopular();
  }, []);

  return (
    <main className="main">
      <div className="">100% 다 쓰는 경우</div>
      <RankingCardList RankingData={popularMovies} />
      <div className="inner">
        <section>1</section>
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
