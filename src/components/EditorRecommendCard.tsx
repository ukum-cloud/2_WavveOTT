import { Link } from "react-router-dom";
import "./scss/EditorRecommend.scss";

interface EditorType {
  backposter: string;
  id: number;
  title: string | null;
}

const EditorRecommendCard = ({ backposter, id, title }: EditorType) => {
  return (
    <Link to={`/detail/${id}`} className="rec-card">
      <img src={`http://image.tmdb.org/t/p/w500${backposter}`} alt="" className="R-b-poster" />
      <img src={`https://image.tmdb.org/t/p/original${title}`} alt="" className="R-b-logo" />
    </Link>
  );
};

export default EditorRecommendCard;
