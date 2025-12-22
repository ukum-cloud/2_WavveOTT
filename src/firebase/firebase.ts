import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import {
  deleteDoc,
  doc,
  getDoc,
  getFirestore,
  serverTimestamp,
  setDoc,
  Timestamp,
  FieldValue,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfin = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Firebase 초기화
const app = initializeApp(firebaseConfin);

export const googleProvider = new GoogleAuthProvider();

export const auth = getAuth(app); // 권한설정 내보내기
export const db = getFirestore(app); // 파이어베이스 내보내기
export const storage = getStorage(app);

// ============================================
// 타입 정의
// ============================================

export interface ContentData {
  id: number | string;
  title?: string;
  name?: string; // TV 시리즈는 name 사용
  backdrop_path?: string;
  poster_path?: string;
  runtime?: number; // 분 단위
  episode_run_time?: number[]; // TV 시리즈
}

export interface WatchHistoryData {
  id: number | string;
  title: string;
  type: "movie" | "tv";
  backdrop_path: string;
  poster_path: string;
  lastPosition: number; // 초 단위
  runtime: number; // 분 단위
  // 에러 해결: any 대신 구체적인 타입 지정
  updatedAt: Timestamp | FieldValue;
  createdAt?: Timestamp | FieldValue;
}

// ============================================
// 시청 기록 저장 함수
// ============================================

export const saveWatchHistory = async (
  userId: string | undefined,
  charId: string | number | undefined,
  content: ContentData,
  type: "movie" | "tv",
  lastPosition: number = 0 // 실제 재생 위치 (초 단위)
): Promise<boolean> => {
  if (!userId || charId === undefined || charId === null || !content?.id) {
    console.warn("시청 기록 저장 실패: 필수 파라미터 누락");
    return false;
  }

  try {
    const historyRef = doc(
      db,
      "users",
      userId,
      "profiles",
      String(charId),
      "watch_history",
      String(content.id)
    );

    // 기존 문서 확인 (createdAt 유지용)
    const existingDoc = await getDoc(historyRef);
    const existingData = existingDoc.exists() ? existingDoc.data() : null;

    // 러닝타임 결정 (TV 시리즈는 평균 에피소드 길이)
    let runtime = content.runtime || 0;
    if (type === "tv" && content.episode_run_time && content.episode_run_time.length > 0) {
      runtime = Math.round(
        content.episode_run_time.reduce((a, b) => a + b, 0) / content.episode_run_time.length
      );
    }

    const watchData: WatchHistoryData = {
      id: content.id,
      title: content.title || content.name || "제목 없음",
      type: type,
      backdrop_path: content.backdrop_path || "",
      poster_path: content.poster_path || "",
      lastPosition: lastPosition, // 실제 재생 위치
      runtime: runtime || 120, // 기본 120분
      updatedAt: serverTimestamp(),
      createdAt: existingData?.createdAt || serverTimestamp(),
    };

    await setDoc(historyRef, watchData, { merge: true });

    console.log(`시청 기록 저장 성공: ${watchData.title} (${Math.round(lastPosition)}초)`);
    return true;
  } catch (error) {
    console.error("시청 기록 저장 에러:", error);
    return false;
  }
};

// ============================================
// 시청 기록 불러오기 (단일)
// ============================================

export const getWatchHistory = async (
  userId: string | undefined,
  charId: string | number | undefined,
  contentId: string | number
): Promise<WatchHistoryData | null> => {
  if (!userId || charId === undefined || !contentId) {
    console.warn("시청 기록 조회 실패: 필수 파라미터 누락");
    return null;
  }

  try {
    const historyRef = doc(
      db,
      "users",
      userId,
      "profiles",
      String(charId),
      "watch_history",
      String(contentId)
    );

    const docSnap = await getDoc(historyRef);

    if (docSnap.exists()) {
      return docSnap.data() as WatchHistoryData;
    }

    return null;
  } catch (error) {
    console.error("시청 기록 조회 에러:", error);
    return null;
  }
};

// ============================================
// 시청 기록 삭제
// ============================================

export const deleteWatchHistory = async (
  userId: string | undefined,
  charId: string | number | undefined,
  contentId: string | number
): Promise<boolean> => {
  if (!userId || charId === undefined || !contentId) {
    console.warn("시청 기록 삭제 실패: 필수 파라미터 누락");
    return false;
  }

  try {
    const historyRef = doc(
      db,
      "users",
      userId,
      "profiles",
      String(charId),
      "watch_history",
      String(contentId)
    );

    await deleteDoc(historyRef);
    return true;
  } catch (error) {
    console.error("시청 기록 삭제 에러:", error);
    return false;
  }
};

// ============================================
// 시청 진행률 계산 유틸
// ============================================

export const calculateProgress = (
  lastPosition: number, // 초
  runtime: number // 분
): number => {
  if (!runtime || runtime <= 0) return 0;
  const runtimeInSeconds = runtime * 60;
  const progress = (lastPosition / runtimeInSeconds) * 100;
  return Math.min(Math.round(progress), 100);
};

// ============================================
// 시간 포맷팅 유틸
// ============================================

export const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }
  return `${minutes}:${String(secs).padStart(2, "0")}`;
};

// ============================================
// 프로필 닉네임 관리 함수
// ============================================

/**
 * 특정 캐릭터(프로필)의 닉네임을 Firestore에 저장합니다.
 */
export const updateProfileNickname = async (
  userId: string | undefined,
  charId: string | number | undefined,
  nickname: string
): Promise<boolean> => {
  if (!userId || charId === undefined || !nickname.trim()) {
    console.warn("닉네임 저장 실패: 필수 파라미터 누락");
    return false;
  }

  try {
    const profileRef = doc(db, "users", userId, "profiles", String(charId));

    await setDoc(
      profileRef,
      {
        nickname: nickname,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    return true;
  } catch (error) {
    console.error("닉네임 저장 에러:", error);
    return false;
  }
};

/**
 * 특정 캐릭터(프로필)의 저장된 닉네임을 가져옵니다.
 */
export const getProfileNickname = async (
  userId: string | undefined,
  charId: string | number | undefined
): Promise<string | null> => {
  if (!userId || charId === undefined) return null;

  try {
    const profileRef = doc(db, "users", userId, "profiles", String(charId));
    const docSnap = await getDoc(profileRef);

    if (docSnap.exists()) {
      return docSnap.data().nickname || null;
    }
    return null;
  } catch (error) {
    console.error("닉네임 조회 에러:", error);
    return null;
  }
};
