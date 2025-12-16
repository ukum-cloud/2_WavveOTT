import { useEffect } from 'react'
import "./scss/MainNomination.scss";
import { useNavigate } from 'react-router-dom';
import { useMovieStore } from '../stores/useMovieStore';

const MainNomination = () => {
  const navigate = useNavigate();
  const { popularMovies, onFetchPopular } = useMovieStore();

  useEffect(() => {
    onFetchPopular();
  }, []);

  const movies = popularMovies.slice(0, 3);

  return (
    <div className='main-nomination-wrap'>
      <div className="nomination-inner">
        <div className='main-nomination'>
          <div className="left-text">
            <div className="item">
              <h3 className='font-wave'>웨이브님을 위한 추천 콘텐츠</h3>
              <p>지금, 찜한 콘텐츠로 <br /> 가장 완벽한 순간을 시작하세요.</p>
            </div>
            <button className='btn large secondary wFull' onClick={() => navigate("/profile")}>
              찜 목록 보러가기
            </button>
          </div>
          <ul className="content-list">
            {movies.map((m) => (
              <li key={m.id}>
                <img src={`https://image.tmdb.org/t/p/w500${m.poster_path}`} alt={m.title} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default MainNomination