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
import { auth, db } from "../firebase/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

// ----------------------------------------------------
// 카카오 타입 선언
// ----------------------------------------------------
declare global {
  interface Window {
    Kakao: {
      init: (key: string) => void;
      isInitialized: () => boolean;
      Auth: {
        login: (params: {
          scope: string;
          success: (authObj: any) => void;
          fail: (error: any) => void;
        }) => void;
      };
      API: {
        request: (params: {
          url: string;
          success?: (response: any) => void;
          fail?: (error: any) => void;
        }) => void;
      };
    };
  }
}

// 카카오 사용자 응답 타입
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
// 인터페이스 정의 (캐릭터 선택 상태 추가)
// ----------------------------------------------------
interface AuthState {
  user: User | null;
  isInitializing: boolean;

  // 캐릭터 선택 상태
  selectedCharId: number | null;
  selectedCharNickname: string | null;

  onMember: (email: string, password: string) => Promise<void>;
  onLogin: (email: string, password: string) => Promise<void>;
  onLogout: () => Promise<void>;
  onGoogleLogin: () => Promise<boolean>;
  onKakaoLogin: (navigate?: (path: string) => void) => Promise<void>;

  // 캐릭터 선택 액션
  selectChar: (id: number, nickname: string) => void;
}

// ----------------------------------------------------
// Zustand 스토어 정의
// ----------------------------------------------------
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => {
      const initialState = {
        user: null,
        isInitializing: true,
        selectedCharId: null,
        selectedCharNickname: null,
      };

      setPersistence(auth, browserSessionPersistence).catch((error) => {
        console.error("Firebase Persistence 설정 실패:", error);
      });

      onAuthStateChanged(auth, (user) => {
        set({ user: user, isInitializing: false });
      });

      return {
        ...initialState,

        // 캐릭터 선택 액션
        selectChar: (id, nickname) =>
          set({ selectedCharId: id, selectedCharNickname: nickname }),

        onMember: async (email, password) => {
          try {
            const userCredential = await createUserWithEmailAndPassword(
              auth,
              email,
              password
            );
            console.log("회원가입 성공:", userCredential.user.uid);
          } catch (error) {
            console.error("회원 가입 실패", error);
            throw error;
          }
        },

        onLogin: async (email, password) => {
          try {
            const userCredential = await signInWithEmailAndPassword(
              auth,
              email,
              password
            );
            console.log("로그인 성공:", userCredential.user.uid);
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

            // 1. 카카오 로그인
            const authObj = await new Promise((resolve, reject) => {
              window.Kakao.Auth.login({
                scope: "profile_nickname, profile_image",
                success: resolve,
                fail: reject,
              });
            });
            console.log("카카오 로그인 성공:", authObj);

            // 2. 사용자 정보 요청 (Promise 기반)
            const res = await new Promise<KakaoUserResponse>(
              (resolve, reject) => {
                window.Kakao.API.request({
                  url: "/v2/user/me",
                  success: resolve,
                  fail: reject,
                });
              }
            );
            console.log("카카오 사용자 정보:", res);

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

            // 3. Firestore에 사용자 정보 저장/확인
            const userRef = doc(db, "users", uid);
            const userDoc = await getDoc(userRef);

            if (!userDoc.exists()) {
              await setDoc(userRef, kakaoUser);
              console.log("신규 카카오 회원 Firestore에 등록 완료");
            } else {
              console.log("기존 카카오 회원 Firestore 데이터 있음");
            }

            // 4. Zustand 상태 업데이트 (Firebase User 타입과 호환되도록)
            set({
              user: {
                uid: kakaoUser.uid,
                email: kakaoUser.email,
                displayName: kakaoUser.displayName,
                photoURL: kakaoUser.photoURL,
              } as User,
            });

            alert(`${kakaoUser.nickname}님, 카카오 로그인 성공!`);

            // 5. 페이지 이동 (신규/기존 분기)
            if (navigate) {
              if (!userDoc.exists()) {
                navigate("/welcome"); // 신규 회원
              } else {
                navigate("/choice-char"); // 기존 회원
              }
            }
          } catch (err: any) {
            console.error("카카오 로그인 중 오류:", err);
            alert("카카오 로그인 실패: " + (err?.message || "알 수 없는 오류"));
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
            // 로그아웃 시 캐릭터 선택 정보도 초기화
            set({
              user: null,
              selectedCharId: null,
              selectedCharNickname: null,
            });
            console.log("로그아웃 성공");
          } catch (error) {
            console.error("로그아웃 실패", error);
            throw error;
          }
        },
      };
    },
    {
      name: "auth-storage", // localStorage 키
      partialize: (state) => ({
        // user는 Firebase가 관리하므로 캐릭터 정보만 persist
        selectedCharId: state.selectedCharId,
        selectedCharNickname: state.selectedCharNickname,
      }),
    }
  )
);
