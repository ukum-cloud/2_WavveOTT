import React from "react";
import { usePickStore } from "../stores/usePickStore";

import { Swiper, SwiperSlide } from "swiper/react";
import { useNavigate } from "react-router-dom";

const UserPickList = () => {
  const { pickList } = usePickStore();
  console.log("찜리스트", pickList);
  const navigate = useNavigate();
  return (
    <Swiper spaceBetween={24} slidesPerView="auto">
      {pickList.map((p, id) => (
        <SwiperSlide
          key={id}
          onClick={() =>
            navigate(
              p.media_type == "tv"
                ? `/contentsdetail/tv/${p.tmdb_id ?? p.id}`
                : `/moviedetail/movie/${p.tmdb_id ?? p.id}`
            )
          }>
          <p style={{ width: "220px", height: "320px", overflow: "hidden", cursor: "pointer" }}>
            <img
              style={{ borderRadius: "12px" }}
              src={` http://image.tmdb.org/t/p/w200${p.poster_path} `}
              alt=""
            />
          </p>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default UserPickList;
