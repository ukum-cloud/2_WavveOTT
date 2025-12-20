import Marquee from "react-fast-marquee";
import "./scss/EditorRecommend.scss";
import type { Tv } from "../types/movie";
import DramaEditorRecommendCard from "./DramaEditorRecommendCard";

interface Props {
  title: string | null;
  list: Tv[];
}

const DramaEditorRecommendCardList = ({ title, list }: Props) => {
  return (
    <section className="rec-section">
      <h2 className="font-wave">{title}</h2>

      <div className="swiper-top">
        <Marquee direction="right" speed={60} pauseOnHover={true}>
          {list.map((tv) => (
            <div key={tv.id} className="marquee-item">
              <DramaEditorRecommendCard
                id={tv.id}
                backposter={tv.backdrop_path ?? ""}
                title={tv.name}
                logoPath={tv.logo ?? null}   // useTvStore가 logo를 넣어줌 :contentReference[oaicite:2]{index=2}
              />
            </div>
          ))}
        </Marquee>
      </div>

      <div className="swiper-bot">
        <Marquee speed={60} pauseOnHover={true}>
          {list.map((tv) => (
            <div key={tv.id} className="marquee-item">
              <DramaEditorRecommendCard
                id={tv.id}
                backposter={tv.backdrop_path ?? ""}
                title={tv.name}
                logoPath={tv.logo ?? null}
              />
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
};

export default DramaEditorRecommendCardList;
