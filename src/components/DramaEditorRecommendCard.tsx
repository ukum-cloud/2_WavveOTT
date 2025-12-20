import { Link } from "react-router-dom";
import "./scss/EditorRecommend.scss";

interface Props {
  id: number;
  backposter: string;        // backdrop_path
  title: string;             // 로고가 없으니 title 텍스트로 대체(또는 name)
  logoPath?: string | null;  // 있으면 이미지 로고로 표시
}

const DramaEditorRecommendCard = ({ id, backposter, title, logoPath }: Props) => {
  return (
    <Link to={`/contentsdetail/tv/${id}`} className="rec-card">
      <img
        src={`https://image.tmdb.org/t/p/w500${backposter}`}
        alt={title}
        className="R-b-poster"
      />

      {/* 로고 이미지가 있으면 로고, 없으면 텍스트(선택) */}
      {logoPath ? (
        <img
          src={`https://image.tmdb.org/t/p/original${logoPath}`}
          alt={title}
          className="R-b-logo"
        />
      ) : (
        <span className="R-b-title-fallback">{title}</span>
      )}
    </Link>
  );
};

export default DramaEditorRecommendCard;
