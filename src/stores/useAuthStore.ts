import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  type User,
  onAuthStateChanged,
  setPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import { create } from "zustand";
import { auth } from "../firebase/firebase";

// ----------------------------------------------------
// 인터페이스 정의 (캐릭터 선택 상태 추가)
// ----------------------------------------------------
interface AuthState {
  user: User | null;
  isInitializing: boolean;

  // 추가된 캐릭터 선택 상태
  selectedCharId: number | null;
  selectedCharNickname: string | null;

  onMember: (email: string, password: string) => Promise<void>;
  onLogin: (email: string, password: string) => Promise<void>;
  onLogout: () => Promise<void>;

  // 추가된 캐릭터 선택 액션
  selectChar: (id: number, nickname: string) => void;
}

// ----------------------------------------------------
// Zustand 스토어 정의
// ----------------------------------------------------
export const useAuthStore = create<AuthState>((set) => {
  const initialState = {
    user: null,
    isInitializing: true,
    // 초기 캐릭터 선택 상태
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

    // 캐릭터 선택 액션 구현
    selectChar: (id, nickname) =>
      set({ selectedCharId: id, selectedCharNickname: nickname }),

    // (이하 onMember, onLogin, onLogout 함수는 이전 답변과 동일)
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

    onLogout: async () => {
      try {
        await signOut(auth);
        // 로그아웃 시 캐릭터 선택 정보도 초기화
        set({ user: null, selectedCharId: null, selectedCharNickname: null });
        console.log("로그아웃 성공");
      } catch (error) {
        console.error("로그아웃 실패", error);
        throw error;
      }
    },
  };
});
