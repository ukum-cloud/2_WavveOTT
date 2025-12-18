import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";
import { db, deleteWatchHistory } from "../firebase/firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  limit,
  Timestamp,
} from "firebase/firestore";
import "./scss/UserWatchList.scss";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

interface WatchHistoryItem {
  docId: string;
  id: number | string;
  type: "movie" | "tv" | string;
  title: string;
  backdrop_path?: string;
  poster_path?: string;
  runtime?: number;
  lastPosition: number;
  updatedAt: Timestamp;
  episodeNumber?: number; // 에피소드 회차 정보가 저장되어 있다고 가정
}

const UserWatchList = () => {
  const navigate = useNavigate();
  const { user, selectedCharId } = useAuthStore();
  const [history, setHistory] = useState<WatchHistoryItem[]>([]);
  const [isFetched, setIsFetched] = useState(false);

  useEffect(() => {
    if (!user || !selectedCharId) return;

    const historyRef = collection(
      db,
      "users",
      user.uid,
      "profiles",
      String(selectedCharId),
      "watch_history"
    );
    const q = query(historyRef, orderBy("updatedAt", "desc"), limit(20));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map(
          (doc) =>
            ({
              docId: doc.id,
              ...doc.data(),
            } as WatchHistoryItem)
        );
        setHistory(data);
        setIsFetched(true);
      },
      (err) => {
        console.error("Snapshot error:", err);
        setIsFetched(true);
      }
    );

    return () => unsubscribe();
  }, [user, selectedCharId]);

  const isLoading = user && selectedCharId && !isFetched;

  const handleDelete = async (
    e: React.MouseEvent,
    contentId: string | number
  ) => {
    e.stopPropagation();
    if (!user?.uid || selectedCharId === null) return;
    if (!window.confirm("시청 기록에서 삭제할까요?")) return;

    try {
      await deleteWatchHistory(user.uid, selectedCharId, contentId);
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const formatDate = (timestamp: Timestamp) => {
    const date = timestamp.toDate();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const week = ["일", "월", "화", "수", "목", "금", "토"][date.getDay()];
    return { fullDate: `${year}.${month}.${day}`, week: `(${week})` };
  };

  if (isLoading)
    return (
      <div className="playlist-slider">
        <p>로딩 중...</p>
      </div>
    );
  if (isFetched && history.length === 0)
    return (
      <div className="watchList-slider">
        <p className="empty-text">시청 중인 콘텐츠가 없습니다.</p>
      </div>
    );

  return (
    <div className="watchList-slider">
      <ul className="watch-list">
        {history.map((movie) => {
          const { fullDate, week } = formatDate(movie.updatedAt);
          const progress =
            movie.runtime && movie.lastPosition
              ? Math.min((movie.lastPosition / (movie.runtime * 60)) * 100, 100)
              : 0;
          const remainingMinutes = movie.runtime
            ? Math.max(Math.floor(movie.runtime - movie.lastPosition / 60), 0)
            : 0;

          return (
            <li
              key={movie.docId}
              onClick={() =>
                navigate(`/contentsdetail/${movie.type}/${movie.id}`)
              }
              className="watch-item"
            >
              <div className="img-box">
                <img
                  src={`${IMAGE_BASE_URL}${
                    movie.backdrop_path || movie.poster_path
                  }`}
                  alt={movie.title}
                />
                <div className="progress-bar">
                  <div className="fill" style={{ width: `${progress}%` }} />
                </div>
              </div>

              <div className="text-info">
                <p className="title">{movie.title}</p>

                {/* 단편 영화가 아니고(tv), 에피소드 정보가 있을 때만 노출 */}
                {movie.type === "tv" && (
                  <p className="episode">
                    {movie.episodeNumber
                      ? `${movie.episodeNumber}회`
                      : "시청 중"}
                  </p>
                )}

                <div className="bottom-info">
                  <p className="date-group">
                    <span className="running-time">
                      남은 시간 {remainingMinutes}분
                    </span>
                    <span className="date">{fullDate}</span>
                    <span className="week">{week}</span>
                  </p>
                  <button
                    className="btn small primary"
                    onClick={(e) => handleDelete(e, movie.id)}
                  >
                    시청내역삭제
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default UserWatchList;
