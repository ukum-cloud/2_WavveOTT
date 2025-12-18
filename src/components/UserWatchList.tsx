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
}

const UserWatchList = () => {
  const navigate = useNavigate();
  const { user, selectedCharId } = useAuthStore();
  const [history, setHistory] = useState<WatchHistoryItem[]>([]);

  // 에러 해결 1: 초기값 false, 데이터 로드 완료 여부만 따로 관리
  const [isFetched, setIsFetched] = useState(false);

  useEffect(() => {
    // 정보가 없으면 아무것도 하지 않음 (setIsLoading 호출 제거)
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

    // onSnapshot 콜백 내부(비동기)에서 상태를 바꾸는 것은 ESLint가 허용함
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
        setIsFetched(true); // 데이터 로드 성공 시 완료 표시
      },
      (err) => {
        console.error("Snapshot error:", err);
        setIsFetched(true); // 에러 발생 시에도 완료 표시 (무한 로딩 방지)
      }
    );

    return () => unsubscribe();
  }, [user, selectedCharId]);

  // 에러 해결 2: isLoading을 상태가 아닌 변수로 계산
  // 유저 정보가 있고, 아직 데이터를 가져오는 중일 때만 true
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

  // 로딩 중일 때
  if (isLoading)
    return (
      <div className="playlist-slider">
        <p>로딩 중...</p>
      </div>
    );

  // 시청 내역이 없을 때 (유저 정보는 있지만 데이터가 빈 경우)
  if (isFetched && history.length === 0)
    return (
      <div className="playlist-slider">
        <p className="empty-text">시청 중인 콘텐츠가 없습니다.</p>
      </div>
    );

  return (
    <div className="playlist-slider">
      {history.map((movie) => {
        const progress =
          movie.runtime && movie.lastPosition
            ? Math.min((movie.lastPosition / (movie.runtime * 60)) * 100, 100)
            : 0;

        return (
          <div
            key={movie.docId}
            className="play-card"
            onClick={() =>
              navigate(`/contentsdetail/${movie.type}/${movie.id}`)
            }
          >
            <div className="img-box">
              <img
                src={`${IMAGE_BASE_URL}${
                  movie.backdrop_path || movie.poster_path
                }`}
                alt={movie.title}
              />
              <button
                className="btn xsmall primary"
                onClick={(e) => handleDelete(e, movie.id)}
              >
                ✕
              </button>
              <div className="progress-bar">
                <div className="fill" style={{ width: `${progress}%` }} />
              </div>
            </div>
            <div className="play-info">
              <p className="play-title">{movie.title}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default UserWatchList;
