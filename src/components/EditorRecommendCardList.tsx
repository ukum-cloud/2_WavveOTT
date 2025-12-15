import { Swiper, SwiperSlide } from "swiper/react";
import EditorRecommendCard from "./EditorRecommendCard";
import "swiper/css";
import { Autoplay } from "swiper/modules";
import type { MovieWithLogo } from "../types/movie";

interface Props {
  list: MovieWithLogo[];
}

const EditorRecommendCardList = ({ list }: Props) => {
  return (
    <section className="rec-section">
      <h2 style={{ marginBottom: "32px" }} className="font-wave inner">
        믿고보는 에디터 추천작
      </h2>
      <div className="swiper-top">
        <Swiper
          modules={[Autoplay]}
          slidesPerView={3.3}
          spaceBetween={24}
          loop={true}
          allowTouchMove={false}
          freeMode={{
            enabled: true,
            momentum: false,
          }}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
            // pauseOnMouseEnter: true,
            reverseDirection: true,
          }}
          speed={6000}
          className="editorSwiper"
        >
          {list.map((l) => (
            <SwiperSlide key={l.id} style={{ width: "200px" }}>
              <EditorRecommendCard
                backposter={l.backdrop_path ?? ""}
                id={l.id}
                title={l.logo}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className="swiper-bot">
        <Swiper
          modules={[Autoplay]}
          slidesPerView={3.3}
          spaceBetween={24}
          loop={true}
          freeMode={true}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
            // pauseOnMouseEnter: true,
            reverseDirection: false,
          }}
          speed={6000}
          className="editorSwiper"
        >
          {list.map((l) => (
            <SwiperSlide key={l.id} style={{ width: "200px" }}>
              <EditorRecommendCard
                backposter={l.backdrop_path ?? ""}
                id={l.id}
                title={l.logo}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default EditorRecommendCardList;
