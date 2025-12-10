import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

import EditorRecommendCard from './EditorRecommendCard';
import 'swiper/css';
import { Autoplay, Grid } from 'swiper/modules';

const EditorRecommendCardList = ({ list }) => {
  return (
    <section style={{ gap: '30px' }} className="rec-section">
      <h2 style={{ marginLeft: '270px', marginTop: '140px', marginBottom: '34px' }}>
        믿고보는 에디터 추천작
      </h2>
      <div className="swiper-top">
        <Swiper
          modules={[Autoplay]}
          slidesPerView={3.5}
          spaceBetween={24}
          loop={true}
          freeMode={true}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
            // pauseOnMouseEnter: true,
            reverseDirection: true,
          }}
          speed={6000}
          className="editorSwiper">
          {list.map((l) => (
            <SwiperSlide key={l.id} style={{ width: '200px' }}>
              <EditorRecommendCard backposter={l.backdrop_path} id={l.id} title={l.logo} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className="swiper-bot">
        <Swiper
          modules={[Autoplay]}
          slidesPerView={3.5}
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
          className="editorSwiper">
          {list.map((l) => (
            <SwiperSlide key={l.id} style={{ width: '200px' }}>
              <EditorRecommendCard backposter={l.backdrop_path} id={l.id} title={l.logo} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default EditorRecommendCardList;
