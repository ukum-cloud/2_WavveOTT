import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Swiper, SwiperSlide, type SwiperClass } from "swiper/react";
import { Navigation } from "swiper/modules";

import { usePickStore } from "../stores/usePickStore";

import { backgroundImage, logoImage } from "../utils/getListData";
import { getGenres, getGrades } from "../utils/mapping";

import type { PrimaryItem } from "../types/movie";

import Modal from "./Modal";

import "swiper/css";
import "swiper/css/navigation";
import "./scss/WavveList.scss";
import type { Pick } from "../types/pick";

interface PrimaryListProps {
  title: string;
  randomList: PrimaryItem[];
}

const PrimaryList = ({ title, randomList }: PrimaryListProps) => {
  const { onTogglePick, pickList, pickAction } = usePickStore();

  //어떤거가 호버됐는지 체크
  const [hoverId, setHoverId] = useState<number | null>(null); //숫자로 받기
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSize, setModalSize] = useState<"xsmall" | "small" | "default" | "large">("default");

  //스와이퍼 슬라이드 첫번째,마지막 슬라이더 버튼 숨기기
  const prevBtn = useRef<HTMLDivElement>(null);
  const nextBtn = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  const handleSwiperBtns = (swiper: SwiperClass) => {
    const isFirst = swiper.activeIndex === 0;
    const isLast = swiper.activeIndex === 13;

    if (prevBtn.current) {
      if (isFirst) prevBtn.current.classList.add("hidden");
      else prevBtn.current.classList.remove("hidden");
    }

    if (nextBtn.current) {
      if (isLast) nextBtn.current.classList.add("hidden");
      else nextBtn.current.classList.remove("hidden");
    }
  };

  const handleBeforeInit = (swiper: SwiperClass) => {
    // navigation params 타입 체크
    if (typeof swiper.params.navigation !== "boolean") {
      const navigation = swiper.params.navigation;
      if (navigation) {
        navigation.prevEl = prevBtn.current;
        navigation.nextEl = nextBtn.current;
      }
    }
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleHeart = async (item: PrimaryItem) => {
    const pickItem: Pick = {
      id: item.id,
      tmdb_id: item.id,

      title: item.title,
      name: item.name,
      poster_path: item.poster_path,
      backdrop_path: item.backdrop_path,
      media_type: (item.mediaType ?? "tv") as Pick["media_type"],
    };

    await onTogglePick(pickItem);
    setModalSize("small");
    setIsModalOpen(true);
  };
  return (
    <section className="card-list">
      <div className="title-wrap">
        <h2>{title}</h2>
        <Link to="/drama">더보기</Link>
      </div>
      <Swiper
        modules={[Navigation]}
        navigation={false}
        onBeforeInit={handleBeforeInit}
        onSwiper={handleSwiperBtns}
        onSlideChange={handleSwiperBtns}
        onReachEnd={handleSwiperBtns}
        slidesPerView="auto"
        spaceBetween={24}
        slidesOffsetBefore={0}
        slidesOffsetAfter={0}
        watchSlidesProgress={true}>
        {randomList.map((m, index) => (
          <SwiperSlide key={`d-${m.id}-${index}`}>
            <div
              className="poster-wrap badge-wavve"
              onMouseEnter={() => setHoverId(m.id)}
              onMouseLeave={() => setHoverId(null)}>
              <img
                className="main"
                src={`https://image.tmdb.org/t/p/original${m.poster_path}`}
                alt={m.title}
              />
              {(m.videos?.[0]?.key || m.backdrop_path) && (
                <div className="preview-wrap">
                  <div className="img-box">
                    {m.videos?.[0]?.key && hoverId === m.id ? (
                      <iframe
                        className="hover video"
                        src={`https://www.youtube.com/embed/${m.videos?.[0]?.key}?autoplay=1&mute=1`}
                        allowFullScreen
                        title={`${m.title}`}
                      />
                    ) : (
                      <img
                        className="hover image"
                        src={
                          backgroundImage(m.id) ||
                          (m.backdrop_path
                            ? `https://image.tmdb.org/t/p/original${m.backdrop_path}`
                            : undefined)
                        }
                        alt={m.title}
                      />
                    )}

                    <div className="logo-box">
                      <p className="content-logo">
                        {m.logo ? (
                          <img
                            src={logoImage(m.id) || `https://image.tmdb.org/t/p/original${m.logo}`}
                            alt="content-logo"
                          />
                        ) : null}
                      </p>
                      {hoverId === m.id && m.videos?.[0]?.key && (
                        <img
                          src="/images/icons/icon-volume-off.svg"
                          alt=""
                          className="sound-icon"
                        />
                      )}
                    </div>
                  </div>

                  <div className="preview-badge-top">
                    <p>
                      <img src={getGrades(m.certification ?? "")} alt="certification" />
                    </p>
                    <p className="preview-genre">
                      {getGenres(m.genre_ids).slice(0, 2).join(" · ") || "기타"}
                    </p>
                    {m.episodes?.length ? <p>에피소드 {m.episodes.length}</p> : null}
                  </div>
                  <div className="preview-badge-bottom">
                    <div className="preview-btn-wrap">
                      <button className="preview-play-btn"></button>
                      <button
                        className={`preview-heart-btn ${
                          pickList.some((p) => (p.tmdb_id ?? p.id) === m.id) ? "active" : ""
                        }`}
                        onClick={() => handleHeart(m)}></button>
                    </div>
                    <Link to={`/contentsdetail/tv/${m.id}`}></Link>
                  </div>
                </div>
              )}
            </div>
          </SwiperSlide>
        ))}
        <div className="prev-wrap">
          <div ref={prevBtn} className="swiper-button-prev"></div>
        </div>
        <div className="next-wrap">
          <div ref={nextBtn} className="swiper-button-next"></div>
        </div>
      </Swiper>

      {/* 찜 모달 */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} size={modalSize}>
        {/* 모달 내부 콘텐츠: Header, Body, Footer를 직접 구성 */}
        <div className="modal-header">
          <h3 className="modal-title">알림</h3>
          {/* 닫기 버튼은 onCLose 핸들러를 호출 */}
          <button className="close-button" onClick={handleCloseModal}>
            <span>닫기</span>
          </button>
        </div>
        <div className="modal-content">
          <p>
            {pickAction === "add" ? "찜 리스트에 추가되었습니다!" : "찜 리스트에서 제거되었습니다!"}
          </p>
        </div>
        <div className="modal-footer">
          <button
            className="btn default primary"
            onClick={() => {
              handleCloseModal();
              navigate("/profile");
            }}>
            찜 바로가기
          </button>
          <button className="btn default secondary-line" onClick={handleCloseModal}>
            닫기
          </button>
        </div>
      </Modal>
    </section>
  );
};

export default PrimaryList;
