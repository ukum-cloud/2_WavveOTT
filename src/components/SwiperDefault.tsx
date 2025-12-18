import React, { useState } from "react";
import { SwiperSlide, Swiper } from "swiper/react";
import { backgroundImage, logoImage } from "../utils/getListData";
import { getGenres, getGrades } from "../utils/mapping";
import { Link } from "react-router-dom";
import { usePickStore } from "../stores/usePickStore";
import Modal from "./Modal";

const SwiperDefault = ({ data }) => {
  const { onTogglePick, pickList, pickAction } = usePickStore();

  const [hoverId, setHoverId] = useState<number | null>(null);
  const list = Array.isArray(data) ? data : [];

  const [modalSize, setModalSize] = useState<"xsmall" | "small" | "default" | "large">("default"); //모달 size
  const [isModalOpen, setIsModalOpen] = useState(false); //모달오픈 상태변수

  const handleHeart = async (item) => {
    await onTogglePick(item);
    setModalSize("small");
    setIsModalOpen(true);
  };

  //모달 닫기 핸들러
  const handleCloseModal = () => setIsModalOpen(false);

  if (!Array.isArray(data)) {
    console.log("SwiperDefault 받은 data가 배열이 아님:", data);
  }
  return (
    <div className="default-list">
      <Swiper slidesPerView="auto" spaceBetween={24}>
        {list.map((d) => (
          <SwiperSlide key={d.id}>
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
                  {d.tvsVideos?.key && hoverId === d.id ? (
                    <iframe
                      className="hover video"
                      src={`https://www.youtube.com/embed/${d.tvsVideo.key}?autoplay=1&mute=1`}
                      allowFullScreen
                      title={d.title}></iframe>
                  ) : (
                    <img
                      className="hover image"
                      src={
                        backgroundImage(d.id) ||
                        (d.backdrop_path
                          ? `https://image.tmdb.org/t/p/original${d.backdrop_path}`
                          : undefined)
                      }
                      alt={d.title}></img>
                  )}
                  <div className="logo-box">
                    <p className="content-logo">
                      <img
                        src={
                          logoImage(d.id) ||
                          (d.logo ? `https://image.tmdb.org/t/p/original${d.logo}` : undefined)
                        }
                        alt="content-logo"
                      />
                    </p>
                    {hoverId === d.id && d.video?.[0]?.key && (
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
                    <img src={getGrades(d.certificationMovie)} alt="certification" />
                  </p>
                  <p className="preview-genre">
                    {getGenres(d.genre_ids).slice(0, 2).join(" · ") || "기타"}
                  </p>
                </div>
                <div className="preview-badge-bottom">
                  <div className="preview-btn-wrap">
                    <button className="preview-play-btn"></button>
                    <button
                      className="preview-heart-btn active"
                      onClick={() => handleHeart(d)}></button>
                  </div>
                  <Link
                    to={
                      d.media_type === "tv"
                        ? `/contentsdetail/tv/${d.tmdb_id ?? d.id}`
                        : `/moviedetail/movie/${d.id}`
                    }
                  />
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
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
    </div>
  );
};

export default SwiperDefault;
