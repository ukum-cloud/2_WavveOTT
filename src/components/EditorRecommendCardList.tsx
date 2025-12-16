import EditorRecommendCard from "./EditorRecommendCard";
import type { MovieWithLogo } from "../types/movie";
import Marquee from "react-fast-marquee";
import "./scss/EditorRecommend.scss";

interface Props {
  list: MovieWithLogo[];
}

const EditorRecommendCardList = ({ list }: Props) => {
  return (
    <section className="rec-section">
      <h2 className="font-wave inner">믿고보는 에디터 추천작</h2>
      <div className="swiper-top">
        <Marquee direction="right" speed={60} pauseOnHover={true}>
          {list.map((l) => (
            <div key={l.id} className="marquee-item">
              <EditorRecommendCard backposter={l.backdrop_path ?? ""} id={l.id} title={l.logo} />
            </div>
          ))}
        </Marquee>
      </div>
      <div className="swiper-bot">
        <Marquee speed={60} pauseOnHover={true}>
          {list.map((l) => (
            <div key={l.id} className="marquee-item">
              <EditorRecommendCard backposter={l.backdrop_path ?? ""} id={l.id} title={l.logo} />
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
};

export default EditorRecommendCardList;
