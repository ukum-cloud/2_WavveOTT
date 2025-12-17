import React, { useState } from "react";
import { backgroundImage, logoImage } from "../utils/getListData";

interface DataType {
  poster_path: string;
  backdrop_path: string;
  title: string;
  id: string;
  logo: string;
  genre_ids: number[];
}

const DefaultSwiperCard = (data) => {
  const [hoverId, setHoverId] = useState<number | null>(null);
  return (
    <>
      {data.map((t) => (
        <div className="poster-wrap badge-new">
          <img
            className="main"
            src={`https://image.tmdb.org/t/p/original${t.poster_path}`}
            alt={t.title}
          />
          {(t.tvsVideo?.key || t.backdrop_path || t.poster_path) && (
            <div className="preview-wrap">
              <div
                className="img-box"
                onMouseEnter={() => setHoverId(t.id)}
                onMouseLeave={() => setHoverId(null)}>
                {t.tvsVideo?.key && hoverId === t.id ? (
                  <iframe
                    className="hover video"
                    src={`https://www.youtube.com/embed/${t.tvsVideo.key}?autoplay=1&mute=1`}
                    allowFullScreen
                    title={t.title}
                  />
                ) : (
                  <img
                    className="hover image"
                    src={
                      backgroundImage(t.id) ||
                      (t.backdrop_path
                        ? `https://image.tmdb.org/t/p/original${t.backdrop_path}`
                        : undefined)
                    }
                    alt={t.title}
                  />
                )}

                <div className="logo-box">
                  <p className="content-logo">
                    <img
                      src={
                        logoImage(t.id) ||
                        (t.logo ? `https://image.tmdb.org/t/p/original${t.logo}` : undefined)
                      }
                      alt="content-logo"
                    />
                  </p>
                  {hoverId === t.id && t.tvsVideo?.key && (
                    <img
                      src="/images/icons/icon-volume-off.svg"
                      alt="sound-icon"
                      className="sound-icon"
                    />
                  )}
                </div>
              </div>

              <div className="preview-badge-top">
                <p>
                  <img src={getGrades(t.certification)} alt="certification" />
                </p>
                <p className="preview-genre">
                  {getGenres(t.genre_ids).slice(0, 2).join(" · ") || "기타"}
                </p>
                <p>에피소드 {t.episodes.length}</p>
              </div>
              <div className="preview-badge-bottom">
                <div className="preview-btn-wrap">
                  <button className="preview-play-btn"></button>
                  <button className="preview-heart-btn" onClick={() => handelAddPick(t)}></button>
                </div>
                <Link to={`/contentsdetail/tv/${t.id}`}></Link>
              </div>
            </div>
          )}
        </div>
      ))}
    </>
  );
};

export default DefaultSwiperCard;
