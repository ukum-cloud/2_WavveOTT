import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { Tv } from "../types/movie";

import { Swiper, SwiperSlide, type SwiperClass } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

import "./scss/DramaCardList.scss";

// ✅ CommonCardList에서 쓰는 매핑 유틸을 그대로 재사용 (프로젝트에 이미 있음)
import { getGenres, getGrades } from "../utils/mapping";

interface Props {
  title: string;
  items: Tv[];
  onClick: (id: number) => void; // 기존 호환용 (필요하면 유지)
}

const DramaCardList = ({ title, items }: Props) => {
  const navigate = useNavigate();

  const [hoverId, setHoverId] = useState<number | null>(null);

  const prevBtn = useRef<HTMLDivElement>(null);
  const nextBtn = useRef<HTMLDivElement>(null);

  const handleSwiperBtns = (swiper: SwiperClass) => {
    if (!prevBtn.current || !nextBtn.current) return;
    swiper.activeIndex === 0
      ? prevBtn.current.classList.add("hidden")
      : prevBtn.current.classList.remove("hidden");
    swiper.isEnd
      ? nextBtn.current.classList.add("hidden")
      : nextBtn.current.classList.remove("hidden");
  };

  const handleBeforeInit = (swiper: SwiperClass) => {
    if (typeof swiper.params.navigation !== "boolean" && swiper.params.navigation) {
      swiper.params.navigation.prevEl = prevBtn.current;
      swiper.params.navigation.nextEl = nextBtn.current;
    }
  };

  const posterSrc = (path?: string | null) =>
    path ? `https://image.tmdb.org/t/p/original${path}` : "";

  const backdropSrc = (path?: string | null) =>
    path ? `https://image.tmdb.org/t/p/original${path}` : "";

  const logoSrc = (path?: string | null) =>
    path ? (path.startsWith("http") ? path : `https://image.tmdb.org/t/p/original${path}`) : "";

  // ✅ 영상 없는 아이템은 "비디오 대신 배경이미지"로 표시되게 (CommonCardList와 동일 개념)
  const safeItems = items ?? [];

  if (!safeItems || safeItems.length === 0) {
    return (
      <section className="card-list">
        <div className="title-wrap">
          <h2>{title}</h2>
        </div>
        <div style={{ padding: "40px 0" }}>드라마 불러오는 중...</div>
      </section>
    );
  }

  return (
    <section className="card-list drama-card-list">
      <div className="title-wrap">
        <h2>{title}</h2>
      </div>

      <Swiper
        modules={[Navigation]}
        navigation={false}
        onBeforeInit={handleBeforeInit}
        onSwiper={handleSwiperBtns}
        onSlideChange={handleSwiperBtns}
        slidesPerView="auto"
        spaceBetween={24}
        watchSlidesProgress
        className="drama-swiper"
      >
        {safeItems.map((tv) => {
          const currentId = tv.id;
          const displayTitle = tv.name || "제목 없음";

          // ✅ useTvStore에서 tv.videos를 붙여두는 구조
          const videoKey = tv.videos?.[0]?.key ?? null;

          const gradeValue = (tv as any).certification; // 스토어에서 certification 넣고 있음
          const genreText = getGenres(tv.genre_ids || []).slice(0, 2).join(" · ");

          // ✅ 상세 경로 (당신 라우팅 기준)
          const detailPath = `/contentsdetail/tv/${currentId}`;

          // ✅ 로고 (스토어에서 logo 넣고 있음)
          const contentLogo = logoSrc((tv as any).logo ?? null);

          return (
            <SwiperSlide key={`tv-${currentId}`} className="drama-slide">
              <div
                className="poster-wrap"
                onMouseEnter={() => setHoverId(currentId)}
                onMouseLeave={() => setHoverId(null)}
                style={{ position: "relative" }}
              >
                {/* 메인 포스터 */}
                <img className="main" src={posterSrc(tv.poster_path)} alt={displayTitle} />

                {/* ✅ hover preview 영역 (CommonCardList 구조 그대로) */}
                <div className="preview-wrap">
                  <div className="img-box">
                    {/* hover 중이면 비디오, 아니면 백드롭 이미지 */}
                    {hoverId === currentId && videoKey ? (
                      <iframe
                        className="hover video"
                        src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&mute=1&controls=0&rel=0&playsinline=1`}
                        allowFullScreen
                        title={displayTitle}
                      />
                    ) : (
                      <img
                        className="hover image"
                        src={backdropSrc(tv.backdrop_path) || posterSrc(tv.poster_path)}
                        alt={displayTitle}
                      />
                    )}

                    {/* 로고 */}
                    <div className="logo-box">
                      {contentLogo && (
                        <img
                          src={contentLogo}
                          alt="content-logo"
                          className="content-logo-img"
                          style={{
                            height: "60px",
                            width: "auto",
                            maxWidth: "80%",
                            objectFit: "contain",
                          }}
                          onError={(e) => (e.currentTarget.style.display = "none")}
                        />
                      )}
                    </div>
                  </div>

                  {/* 상단 배지(등급/장르) */}
                  <div className="preview-badge-top">
                    <p>
                      <img src={getGrades(gradeValue)} alt="grade" />
                    </p>
                    <p className="preview-genre">{genreText}</p>
                  </div>

                  {/* 하단 버튼 + 전체 링크 */}
                  <div className="preview-badge-bottom">
                    <div className="preview-btn-wrap">
                      {/* 재생 버튼(상세로 이동) */}
                      <button
                        className="preview-play-btn"
                        type="button"
                        onClick={() => navigate(detailPath)}
                      />
                      {/* 필요하면 여기 찜 버튼도 영화처럼 붙이면 됨 */}
                      {/* <button className="preview-heart-btn" type="button" /> */}
                    </div>

                    {/* 전체 클릭 영역 */}
                    <Link to={detailPath} className="full-link" aria-label={`${displayTitle} 상세`} />
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}

        {/* Swiper prev/next (CommonCardList 스타일 그대로) */}
        <div className="prev-wrap">
          <div ref={prevBtn} className="swiper-button-prev" />
        </div>
        <div className="next-wrap">
          <div ref={nextBtn} className="swiper-button-next" />
        </div>
      </Swiper>
    </section>
  );
};

export default DramaCardList;
