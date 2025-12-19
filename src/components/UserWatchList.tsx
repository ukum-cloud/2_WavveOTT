import React, { useEffect, useState, memo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";
import type { WatchHistoryItem } from "../stores/useAuthStore";
import { db, deleteWatchHistory } from "../firebase/firebase";
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import "./scss/UserWatchList.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import { Scrollbar } from "swiper/modules";
import EmptyList from "./EmptyList";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const UserWatchList = () => {
  const navigate = useNavigate();
  const { user, selectedCharId, watchHistoryCache, setWatchHistoryCache } =
    useAuthStore();

  const [isLoaded, setIsLoaded] = useState(watchHistoryCache.length > 0);

  useEffect(() => {
    if (!user || !selectedCharId) return;

    const fetchData = async () => {
      try {
        const historyRef = collection(
          db,
          "users",
          user.uid,
          "profiles",
          String(selectedCharId),
          "watch_history"
        );
        const q = query(historyRef, orderBy("updatedAt", "desc"), limit(20));
        const snap = await getDocs(q);

        const data: WatchHistoryItem[] = snap.docs.map(
          (doc) =>
            ({
              docId: doc.id,
              ...doc.data(),
            } as WatchHistoryItem)
        );

        setWatchHistoryCache(data);
        setIsLoaded(true);
      } catch (err) {
        console.error("데이터 로딩 실패:", err);
        setIsLoaded(true);
      }
    };

    fetchData();
  }, [user, selectedCharId, setWatchHistoryCache]);

  const handleDelete = async (
    e: React.MouseEvent,
    contentId: string | number
  ) => {
    e.stopPropagation();
    if (!user?.uid || selectedCharId === null) return;
    if (!window.confirm("시청 기록에서 삭제할까요?")) return;

    try {
      await deleteWatchHistory(user.uid, selectedCharId, contentId);
      const updated = watchHistoryCache.filter(
        (item) => String(item.id) !== String(contentId)
      );
      setWatchHistoryCache(updated);
    } catch (err) {
      console.error("삭제 실패:", err);
    }
  };

  const formatDate = (timestamp: Timestamp | null | undefined) => {
    if (!timestamp || typeof timestamp.toDate !== "function")
      return { fullDate: "", week: "" };
    const date = timestamp.toDate();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const week = ["일", "월", "화", "수", "목", "금", "토"][date.getDay()];
    return { fullDate: `${year}.${month}.${day}`, week: `(${week})` };
  };

  if (isLoaded && watchHistoryCache.length === 0) {
    return (
      <div className="watch-list-container">
        <EmptyList title="시청중인 데이터가 없습니다." />
      </div>
    );
  }

  return (
    <div className="watch-list-container">
      <Swiper
        className="watch-list mySwiper"
        scrollbar={{ hide: true }}
        modules={[Scrollbar]}
        slidesPerView={"auto"}
        spaceBetween={24}
        wrapperTag="ul"
      >
        {watchHistoryCache.map((movie, index) => {
          const { fullDate, week } = formatDate(movie.updatedAt);

          const progress =
            movie.runtime && movie.lastPosition
              ? Math.min((movie.lastPosition / (movie.runtime * 60)) * 100, 100)
              : 0;

          const runtimeText = movie.runtime ? `${movie.runtime}분` : "";

          return (
            <SwiperSlide
              key={movie.docId || movie.id}
              tag="li"
              // [핵심] 여기에 인라인 스타일로 width: auto를 명시합니다.
              style={{ width: "auto" }}
            >
              <div
                className="watch-item"
                onClick={() => {
                  const path =
                    movie.type === "movie"
                      ? `/moviedetail/movie/${movie.id}`
                      : `/contentsdetail/${movie.type}/${movie.id}`;
                  navigate(path);
                }}
              >
                <div className="img-box">
                  <img
                    src={`${IMAGE_BASE_URL}${
                      movie.backdrop_path || movie.poster_path
                    }`}
                    alt={movie.title}
                    loading={index < 4 ? "eager" : "lazy"}
                  />
                  <div className="progress-bar">
                    <div className="fill" style={{ width: `${progress}%` }} />
                  </div>
                </div>

                <div className="text-info">
                  <p className="title">
                    <span>{movie.title}</span>
                    {movie.type !== "movie" && (
                      <span className="episode">
                        {movie.episodeNumber
                          ? `${movie.episodeNumber}회`
                          : "1회"}
                      </span>
                    )}
                  </p>

                  <div className="bottom-info">
                    <div className="date-group">
                      {runtimeText && (
                        <span className="runtime">{runtimeText}</span>
                      )}
                      <span className="date">{fullDate}</span>{" "}
                      <span className="week">{week}</span>
                    </div>
                    <button
                      className="btn-delete"
                      onClick={(e) => handleDelete(e, movie.id)}
                    >
                      시청내역 삭제
                    </button>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default memo(UserWatchList);
