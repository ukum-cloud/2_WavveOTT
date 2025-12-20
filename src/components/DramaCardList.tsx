// components/DramaCardList.tsx
import type { Tv } from "../types/movie";

interface Props {
  title: string;
  items: Tv[];
  onClick: (id: number) => void;
}

const DramaCardList = ({ title, items, onClick }: Props) => {
  const poster = (path?: string | null) =>
    path
      ? `https://image.tmdb.org/t/p/w500${path}`
      : "/images/no-poster.png";

  return (
    <section className="card-list">
      <h2>{title}</h2>

      <div className="row">
        {items.map((tv) => (
          <button
            key={tv.id}
            type="button"
            className="drama-card"
            onClick={() => onClick(tv.id)}
          >
            <img src={poster(tv.poster_path)} alt={tv.name} />
            <p className="title">{tv.name}</p>
          </button>
        ))}
      </div>
    </section>
  );
};

export default DramaCardList;
