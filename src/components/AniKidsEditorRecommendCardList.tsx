import { Link } from "react-router-dom";
import type { Wavves } from "../data/wavves";

import Marquee from "react-fast-marquee";

import "./scss/AniKidsEditorRecommendCardList.scss";

interface Props {
  title: string | null;
  data: Wavves[];
}

const AniKidsEditorRecommendCardList = ({ title, data }: Props) => {
  return (
    <section className="rec-section">
      <h2 className="font-wave">{title}</h2>
      <div className="swiper-top">
        <Marquee direction="right" speed={60} pauseOnHover={true}>
          {data.map((l) => (
            <div key={l.index} className="marquee-item">
              <Link to={`/contentsdetail/tv/${l.tmdb_id}`} className="rec-card">
                <img
                  src={`https://${l.season_horizontal_logoY_image}`}
                  alt=""
                  className="R-b-poster"
                />
                {/* <img
                                    src={`https://image.tmdb.org/t/p/original${title}`}
                                    alt=""
                                    className="R-b-logo"
                                /> */}
              </Link>
            </div>
          ))}
        </Marquee>
      </div>
      <div className="swiper-bot">
        <Marquee speed={60} pauseOnHover={true}>
          {data.map((l) => (
            <div key={l.index} className="marquee-item">
              <Link to={`/contentsdetail/tv/${l.tmdb_id}`} className="rec-card">
                <img
                  src={`https://${l.season_horizontal_logoY_image}`}
                  alt=""
                  className="R-b-poster"
                />
                <img
                  src={`https://image.tmdb.org/t/p/original${title}`}
                  alt=""
                  className="R-b-logo"
                />
              </Link>
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
};

export default AniKidsEditorRecommendCardList;
