import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide, type SwiperClass } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

import type { UnifiedData } from "../types/movieTypes";
import { getGenres, getGrades } from "../utils/mapping";
import { backgroundImage, logoImage } from "../utils/getListData";
import { usePickStore } from "../stores/usePickStore";
import Modal from "./Modal";
import LoadingBar from "./LoadingBar";

interface CommonCardListProps {
  title: string;
  items: UnifiedData[];
  count?: number; // 표시할 개수 (선택적)
}

const CommonCardList = ({ title, items, count }: CommonCardListProps) => {
  const { onTogglePick, pickList, pickAction } = usePickStore();
  const navigate = useNavigate();

  const [hoverId, setHoverId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const prevBtn = useRef<HTMLDivElement>(null);
  const nextBtn = useRef<HTMLDivElement>(null);

  const handleSwiperBtns = (swiper: SwiperClass) => {
    if (!prevBtn.current || !nextBtn.current) return;

    if (swiper.activeIndex === 0) {
      prevBtn.current.classList.add("hidden");
    } else {
      prevBtn.current.classList.remove("hidden");
    }

    if (swiper.isEnd) {
      nextBtn.current.classList.add("hidden");
    } else {
      nextBtn.current.classList.remove("hidden");
    }
  };

  const handleBeforeInit = (swiper: SwiperClass) => {
    if (
      typeof swiper.params.navigation !== "boolean" &&
      swiper.params.navigation
    ) {
      swiper.params.navigation.prevEl = prevBtn.current;
      swiper.params.navigation.nextEl = nextBtn.current;
    }
  };

  const isNewContent = (dateString?: string) => {
    if (!dateString) return false;
    const releaseDate = new Date(dateString).getTime();
    const now = new Date().getTime();
    const twoMonthsInMs = 60 * 24 * 60 * 60 * 1000;
    return now - releaseDate <= twoMonthsInMs && now >= releaseDate;
  };

  // count가 있으면 해당 개수만큼만 자르기
  const limitedItems = count ? items.slice(0, count) : items;

  // 영상 데이터가 있는 아이템만 필터링
  const filteredItems = limitedItems.filter((item) => {
    const hasVideo =
      (item.videos && item.videos.length > 0 && item.videos[0].key) || item.key;
    return hasVideo;
  });

  // 데이터가 없거나 로딩 중일 때 로딩바 표시
  if (!filteredItems || filteredItems.length === 0) {
    return (
      <section className="card-list">
        <div className="title-wrap">
          <h2>{title}</h2>
        </div>
        <div style={{ padding: "40px 0" }}>
          <LoadingBar />
        </div>
      </section>
    );
  }

  return (
    <section className="card-list">
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
        watchSlidesProgress={true}
      >
        {filteredItems.map((item) => {
          const displayTitle = item.title || item.name || "제목 없음";
          const videoKey = item.videos?.[0]?.key || item.key;
          const currentId = item.id;

          const isPicked = pickList.some(
            (p) => (p.tmdb_id ?? p.id) === (item.tmdb_id ?? currentId)
          );

          const gradeValue = item.certificationMovie || item.certification;
          const mediaType = item.media_type || "movie";
          const detailPath = `/moviedetailEX/${mediaType}/${currentId}`;
          const isNew = isNewContent(item.release_date || item.first_air_date);

          // 로고 이미지 우선순위 로직
          const getLogoUrl = () => {
            const staticLogo = logoImage(currentId);
            if (staticLogo) return staticLogo;

            const path = item.logo || item.file_path;
            if (path) {
              return path.startsWith("http")
                ? path
                : `https://image.tmdb.org/t/p/original${path}`;
            }
            return "";
          };

          const contentLogo = getLogoUrl();

          return (
            <SwiperSlide key={`${mediaType}-${currentId}`}>
              <div
                className="poster-wrap"
                onMouseEnter={() => setHoverId(currentId)}
                onMouseLeave={() => setHoverId(null)}
                style={{ position: "relative" }}
              >
                <img
                  className="main"
                  src={
                    item.poster_path
                      ? `https://image.tmdb.org/t/p/original${item.poster_path}`
                      : ""
                  }
                  alt={displayTitle}
                />

                {isNew && (
                  <span
                    className="badge-text-type"
                    style={{
                      position: "absolute",
                      top: "10px",
                      left: "10px",
                      zIndex: 5,
                    }}
                  >
                    NEW
                  </span>
                )}

                <div className="preview-wrap">
                  <div className="img-box">
                    {videoKey && hoverId === currentId ? (
                      <iframe
                        className="hover video"
                        src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&mute=1&controls=0`}
                        allowFullScreen
                        title={displayTitle}
                      />
                    ) : (
                      <img
                        className="hover image"
                        src={
                          backgroundImage(currentId) ||
                          (item.backdrop_path
                            ? `https://image.tmdb.org/t/p/original${item.backdrop_path}`
                            : undefined)
                        }
                        alt={displayTitle}
                      />
                    )}

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
                          onError={(e) =>
                            (e.currentTarget.style.display = "none")
                          }
                        />
                      )}
                    </div>
                  </div>

                  <div className="preview-badge-top">
                    <p>
                      <img src={getGrades(gradeValue)} alt="grade" />
                    </p>
                    <p className="preview-genre">
                      {getGenres(item.genre_ids || [])
                        .slice(0, 2)
                        .join(" · ")}
                    </p>
                  </div>

                  <div className="preview-badge-bottom">
                    <div className="preview-btn-wrap">
                      <button
                        className="preview-play-btn"
                        onClick={() => navigate(detailPath)}
                      ></button>
                      <button
                        className={`preview-heart-btn ${
                          isPicked ? "active" : ""
                        }`}
                        onClick={async (e) => {
                          e.preventDefault();
                          await onTogglePick(item);
                          setIsModalOpen(true);
                        }}
                      ></button>
                    </div>
                    <Link to={detailPath} className="full-link"></Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
        <div className="prev-wrap">
          <div ref={prevBtn} className="swiper-button-prev"></div>
        </div>
        <div className="next-wrap">
          <div ref={nextBtn} className="swiper-button-next"></div>
        </div>
      </Swiper>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        size="small"
      >
        <div className="modal-content">
          <p>
            {pickAction === "add"
              ? "찜 리스트에 추가되었습니다!"
              : "찜 리스트에서 제거되었습니다!"}
          </p>
        </div>
        <div className="modal-footer">
          <button
            className="btn default primary"
            onClick={() => navigate("/profile")}
          >
            찜 바로가기
          </button>
          <button
            className="btn default secondary-line"
            onClick={() => setIsModalOpen(false)}
          >
            닫기
          </button>
        </div>
      </Modal>
    </section>
  );
};

export default CommonCardList;
