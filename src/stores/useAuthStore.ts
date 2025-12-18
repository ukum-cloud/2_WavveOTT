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
import { doc, getDoc, setDoc } from "firebase/firestore";

// ----------------------------------------------------
// 카카오 타입 선언 (에러 해결: any 대신 구체적인 타입 정의)
// ----------------------------------------------------
interface KakaoAuthResponse {
  access_token: string;
  refresh_token: string;
  // 필요한 다른 속성들을 추가할 수 있습니다.
}

declare global {
  interface Window {
    Kakao: {
      init: (key: string) => void;
      isInitialized: () => boolean;
      Auth: {
        login: (params: {
          scope: string;
          success: (authObj: KakaoAuthResponse) => void; // any -> KakaoAuthResponse
          fail: (error: Error) => void; // any -> Error
        }) => void;
      };
      API: {
        request: (params: {
          url: string;
          success?: (response: KakaoUserResponse) => void; // any -> KakaoUserResponse
          fail?: (error: Error) => void; // any -> Error
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
      };

      setPersistence(auth, browserSessionPersistence).catch((error) => {
        console.error("Firebase Persistence 설정 실패:", error);
      });

      onAuthStateChanged(auth, (user) => {
        set({ user: user, isInitializing: false });
      });

      return {
        ...initialState,

        updateNickname: async (nickname: string) => {
          const { user, selectedCharId } = get();
          set({ selectedCharNickname: nickname });

          if (user?.uid && selectedCharId !== null) {
            try {
              await updateProfileNickname(user.uid, selectedCharId, nickname);
              console.log(`Firebase DB 닉네임 업데이트 완료: ${nickname}`);
            } catch (err) {
              console.error("Firebase DB 닉네임 업데이트 실패:", err);
            }
          }
        },

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

            // 에러 해결: 사용하지 않는 authObj 변수 할당 제거
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
            // 에러 해결: any 제거 (err는 기본적으로 unknown)
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
            console.log("로그아웃 성공");
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
        selectedCharId: state.selectedCharId,
        selectedCharNickname: state.selectedCharNickname,
      }),
    }
  )
);
