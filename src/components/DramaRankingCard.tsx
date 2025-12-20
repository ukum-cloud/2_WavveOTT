// components/DramaRankingCard.tsx
import { Link } from "react-router-dom";
import style from "./scss/RankingCard.module.scss";

interface Props {
  id: number;
  poster: string;
}

const DramaRankingCard = ({ id, poster }: Props) => {
  return (
    <div className={style.Rankingcard}>
      <Link to={`/contentsdetail/tv/${id}`}>
        <img
          src={`https://image.tmdb.org/t/p/original${poster}`}
          alt=""
        />
      </Link>
    </div>
  );
};

export default DramaRankingCard;
