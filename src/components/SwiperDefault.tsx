import React, { useState } from "react";
import { SwiperSlide } from "swiper/react";
import { backgroundImage } from "../utils/getListData";

const SwiperDefault = (data) => {
  const [hoverId, setHoverId] = useState<number | null>(null);
  return (
    <>
      {data.map((d) => (
        <SwiperSlide>
          <div className="poster-wrap badge-new">
            <img
              className="main"
              src={`https://image.tmdb.org/t/p/original${d.poster_path}`}
              alt={d.title}
            />
            <div className="preview-wrap">
              <div
                className="img-box"
                onMouseEnter={() => setHoverId(d.id)}
                onMouseLeave={() => setHoverId(null)}>
                {d.tvsVide0?.key && hoverId === d.id ? (
                  <iframe
                    className="hover video"
                    src={`https://www.youtube.com/embed/${t.tvsVideo.key}?autoplay=1&mute=1`}
                    allowFullScreen
                    title={d.title}></iframe>
                ) : (
                  <img
                    className="hover image"
                    src={
                      backgroundImage(d.id) ||
                      (d.backfrop_path
                        ? `https://image.tmdb.org/t/p/original${t.backdrop_path}`
                        : undefined)
                    }></img>
                )}
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </>
  );
};

export default SwiperDefault;
