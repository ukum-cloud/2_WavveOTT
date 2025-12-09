import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";
import { create } from "zustand";
import { auth } from "../firebase/firebase";

interface AuthState {
  user: User | null;
  onMember: (email: string, password: string) => Promise<void>;
  onLogin: (email: string, password: string) => Promise<void>;
  onLogout: () => Promise<void>;
}
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  // 회원가입 메서드(외부에서 불러 오는 데이타 그래서 async
  onMember: async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      set({ user: userCredential.user });
      alert("회원가입이 완료됐습니다");
    } catch (err: any) {
      alert("회원 가입 실패");
      console.log("회원 가입 실패", err.messge);
    }
  },
  // 로그인 메서드
  onLogin: async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      set({ user: userCredential.user });
      alert("로그인 성공");
    } catch (err: any) {
      alert("로그인 가입 실패111111" + err.messge);
      console.log("로그인 가입 실패", err.message);
    }
  },

  // 로그아웃 메서드
  onLogout: async () => {
    await signOut(auth);
    set({ user: null });
  },
}));
