import { Link } from "react-router-dom";
import { aniHot } from "../data/aniHot";

import Marquee from "react-fast-marquee";

import "./scss/AniKidsEditorRecommendCardList.scss";
import { varietyTop50 } from "../data/2025_varietyTop50_tmdb";

interface Props {
  title: string | null;
}

const EntEditorRecommendCardList = ({ title }: Props) => {
  return (
    <section className="rec-section" style={{ paddingTop: "80px" }}>
      <h2 className="font-wave" style={{ padding: "0 20px" }}>
        {title}
      </h2>
      <div className="swiper-top">
        <Marquee direction="right" speed={60} pauseOnHover={true}>
          {varietyTop50.slice(1, 10).map((l) => (
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
          {varietyTop50.slice(1, 10).map((l) => (
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

export default EntEditorRecommendCardList;
