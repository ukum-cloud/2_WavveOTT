import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';
import { db, deleteWatchHistory } from '../firebase/firebase';
import { collection, query, orderBy, onSnapshot, limit } from 'firebase/firestore';
import './scss/UserWatchList.scss';

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

interface WatchHistoryItem {
  docId: string;
  id: number | string;
  type: 'movie' | 'tv' | string;
  title: string;
  backdrop_path?: string;
  poster_path?: string;
  runtime?: number;
  lastPosition: number;
  updatedAt: any;
}

const UserWatchList = () => {
  const navigate = useNavigate();
  const { user, selectedCharId } = useAuthStore();
  const [history, setHistory] = useState<WatchHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user || !selectedCharId) {
      setIsLoading(false);
      return;
    }

    const historyRef = collection(db, "users", user.uid, "profiles", String(selectedCharId), "watch_history");
    const q = query(historyRef, orderBy("updatedAt", "desc"), limit(20));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        docId: doc.id,
        ...doc.data()
      } as WatchHistoryItem));
      setHistory(data);
      setIsLoading(false);
    }, (err) => {
      console.error("Snapshot error:", err);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user, selectedCharId]);

  // 삭제 함수
  const handleDelete = async (e: React.MouseEvent, contentId: string | number) => {
    e.stopPropagation(); // 카드 클릭 이벤트 전파 방지
    
    // 에러 해결 포인트: selectedCharId가 null인지 확인
    if (!user?.uid || selectedCharId === null) {
      console.warn("유저 정보 또는 캐릭터 ID가 없습니다.");
      return;
    }

    if (!window.confirm("시청 기록에서 삭제할까요?")) return;

    try {
      await deleteWatchHistory(user.uid, selectedCharId, contentId);
      console.log("삭제 성공");
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  if (isLoading) return <div className="playlist-slider"><p>로딩 중...</p></div>;
  if (history.length === 0) return <div className="playlist-slider"><p className="empty-text">시청 중인 콘텐츠가 없습니다.</p></div>;

  return (
    <div className="playlist-slider">
      {history.map((movie) => {
        const progress = movie.runtime && movie.lastPosition
          ? Math.min((movie.lastPosition / (movie.runtime * 60)) * 100, 100)
          : 0;

        return (
          <div
            key={movie.docId}
            className="play-card"
            onClick={() => {
              navigate(`/detail/${movie.type}/${movie.id}`);
            }}
          >
            <div className="img-box">
              <img src={`${IMAGE_BASE_URL}${movie.backdrop_path || movie.poster_path}`} alt={movie.title} />
              
              {/* 삭제 버튼 (X) */}
              <button className="btn xsmall primary" onClick={(e) => handleDelete(e, movie.id)}>
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