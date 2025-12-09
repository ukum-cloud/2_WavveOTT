import React, { useEffect, useState } from 'react'
import "./scss/MainNomination.scss";

interface Movie{
  id: number;
  title: string;
  overview: string;
  backdrop_path: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
  adult: boolean;
}

const MainNomination = () => {
  const API_KEY = import.meta.env.VITE_TMDB_API_KEY as string;
  const [movies, setMovies] = useState<Movie[]>([]);

  const onFetchThree = async() => {
    const res = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=ko-KR&sort_by=popularity.desc&page=1`);
    const data: {results: Movie[]} = await res.json();
    setMovies(data.results.slice(0, 3));
  }

  useEffect(() => {
    (async () => {
      await onFetchThree();
    })();
  });

  return (
    <div className='main-nomination'>
      <div className="left-text">
        <div className="item">
          <h3 className='font-wave'>웨이브님을 위한 추천 콘텐츠</h3>
          <p>지금, 찜한 콘텐츠로 <br /> 가장 완벽한 순간을 시작하세요.</p>
        </div>
        <button>찜 목록 보러가기</button>
      </div>

      <ul className="content-list">
        {movies.map((m) => (
          <li key={m.id}>
            <img src={`https://image.tmdb.org/t/p/w500${m.poster_path}`} alt={m.title} />
          </li>
        ))}
      </ul>
    </div>
  )
}

export default MainNomination