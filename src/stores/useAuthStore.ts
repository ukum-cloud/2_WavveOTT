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
import { auth } from "../firebase/firebase";

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
