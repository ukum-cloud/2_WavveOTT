import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  type User,
  onAuthStateChanged,
  setPersistence,
  browserSessionPersistence,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { auth, db, updateProfileNickname } from "../firebase/firebase";
import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore";

// ----------------------------------------------------
// 타입 정의
// ----------------------------------------------------
export interface WatchHistoryItem {
  docId: string;
  id: number | string;
  type: "movie" | "tv" | string;
  title: string;
  backdrop_path?: string;
  poster_path?: string;
  runtime?: number;
  lastPosition: number;
  updatedAt: Timestamp;
  episodeNumber?: number;
}

// ----------------------------------------------------
// 카카오 타입 선언
// ----------------------------------------------------
interface KakaoAuthResponse {
  access_token: string;
  refresh_token: string;
}

declare global {
  interface Window {
    Kakao: {
      init: (key: string) => void;
      isInitialized: () => boolean;
      Auth: {
        login: (params: {
          scope: string;
          success: (authObj: KakaoAuthResponse) => void;
          fail: (error: Error) => void;
        }) => void;
      };
      API: {
        request: (params: {
          url: string;
          success?: (response: KakaoUserResponse) => void;
          fail?: (error: Error) => void;
        }) => void;
      };
    };
  }
}

interface KakaoUserResponse {
  id: number;
  kakao_account?: {
    email?: string;
    profile?: {
      nickname?: string;
      profile_image_url?: string;
    };
  };
}

// ----------------------------------------------------
// 인터페이스 정의
// ----------------------------------------------------
interface AuthState {
  user: User | null;
  isInitializing: boolean;
  selectedCharId: number | null;
  selectedCharNickname: string | null;
  watchHistoryCache: WatchHistoryItem[];
  setWatchHistoryCache: (history: WatchHistoryItem[]) => void;

  onMember: (email: string, password: string) => Promise<void>;
  onLogin: (email: string, password: string) => Promise<void>;
  onLogout: () => Promise<void>;
  onGoogleLogin: () => Promise<boolean>;
  onKakaoLogin: (navigate?: (path: string) => void) => Promise<void>;
  selectChar: (id: number, nickname: string) => void;
  updateNickname: (nickname: string) => Promise<void>;
}

// ----------------------------------------------------
// Zustand 스토어 정의
// ----------------------------------------------------
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => {
      const initialState = {
        user: null,
        isInitializing: true,
        selectedCharId: null,
        selectedCharNickname: null,
        watchHistoryCache: [],
      };

      // 파이어베이스 지속성 설정
      setPersistence(auth, browserSessionPersistence).catch((error) => {
        console.error("Firebase Persistence 설정 실패:", error);
      });

      // 인증 상태 변경 감지
      onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          // 파이어베이스(구글, 이메일) 로그인 사용자인 경우
          set({ user: firebaseUser, isInitializing: false });
        } else {
          // 파이어베이스 로그인이 아닐 때 (카카오 사용자는 로컬 스토리지 값을 유지해야 함)
          // 여기서는 초기화 상태만 해제하고, user 정보는 건드리지 않습니다.
          set({ isInitializing: false });
        }
      });

      return {
        ...initialState,

        setWatchHistoryCache: (history) => set({ watchHistoryCache: history }),

        updateNickname: async (nickname: string) => {
          const { user, selectedCharId } = get();
          set({ selectedCharNickname: nickname });

          if (user?.uid && selectedCharId !== null) {
            try {
              await updateProfileNickname(user.uid, selectedCharId, nickname);
            } catch (err) {
              console.error("Firebase DB 닉네임 업데이트 실패:", err);
            }
          }
        },

        selectChar: (id, nickname) =>
          set({
            selectedCharId: id,
            selectedCharNickname: nickname,
            watchHistoryCache: [],
          }),

        onMember: async (email, password) => {
          try {
            await createUserWithEmailAndPassword(auth, email, password);
          } catch (error) {
            console.error("회원 가입 실패", error);
            throw error;
          }
        },

        onLogin: async (email, password) => {
          try {
            await signInWithEmailAndPassword(auth, email, password);
          } catch (error) {
            console.error("로그인 실패", error);
            throw error;
          }
        },

        onKakaoLogin: async (navigate) => {
          try {
            if (!window.Kakao.isInitialized()) {
              window.Kakao.init("f42c7217dba2db4b19dd471308a132fa");
            }

            await new Promise<KakaoAuthResponse>((resolve, reject) => {
              window.Kakao.Auth.login({
                scope: "profile_nickname, profile_image",
                success: resolve,
                fail: reject,
              });
            });

            const res = await new Promise<KakaoUserResponse>(
              (resolve, reject) => {
                window.Kakao.API.request({
                  url: "/v2/user/me",
                  success: resolve,
                  fail: reject,
                });
              }
            );

            const uid = res.id.toString();
            const kakaoUser = {
              uid,
              email: res.kakao_account?.email || "",
              displayName:
                res.kakao_account?.profile?.nickname || "카카오사용자",
              nickname: res.kakao_account?.profile?.nickname || "카카오사용자",
              photoURL: res.kakao_account?.profile?.profile_image_url || "",
              provider: "kakao",
              createdAt: new Date().toISOString(),
            };

            const userRef = doc(db, "users", uid);
            const userDoc = await getDoc(userRef);
            if (!userDoc.exists()) {
              await setDoc(userRef, kakaoUser);
            }

            // 스토어 상태 업데이트 (persist에 의해 로컬스토리지 저장됨)
            set({
              user: {
                uid: kakaoUser.uid,
                email: kakaoUser.email,
                displayName: kakaoUser.displayName,
                photoURL: kakaoUser.photoURL,
              } as User,
            });

            alert(`${kakaoUser.nickname}님, 카카오 로그인 성공!`);
            if (navigate) {
              if (!userDoc.exists()) {
                navigate("/welcome");
              } else {
                navigate("/choice-char");
              }
            }
          } catch (err) {
            const error = err as Error;
            console.error("카카오 로그인 중 오류:", error);
            alert(
              "카카오 로그인 실패: " + (error.message || "알 수 없는 오류")
            );
          }
        },

        onGoogleLogin: async () => {
          try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            set({ user: result.user });
            alert("구글 로그인 성공");
            return true;
          } catch (err) {
            alert("구글 로그인 실패");
            console.error("구글 로그인 실패", err);
            return false;
          }
        },

        onLogout: async () => {
          try {
            await signOut(auth);
            set({
              user: null,
              selectedCharId: null,
              selectedCharNickname: null,
            });
          } catch (error) {
            console.error("로그아웃 실패", error);
            throw error;
          }
        },
      };
    },
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user, // 핵심: user 정보를 로컬 스토리지에 포함시킴
        selectedCharId: state.selectedCharId,
        selectedCharNickname: state.selectedCharNickname,
      }),
    }
  )
);
