import React from 'react';
import { Link } from 'react-router-dom';
import style from './scss/RankingCard.module.scss';

interface RankingProps {
  id: number;
  poster: string;
}

const RankingCard = ({ id, poster }: RankingProps) => {
  return (
    <div className={style.Rankingcard}>
      <Link to={`/detail/${id}`}>
        <img src={`http://image.tmdb.org/t/p/w200${poster}`} alt="" />
      </Link>
    </div>
  );
};

export default RankingCard;
