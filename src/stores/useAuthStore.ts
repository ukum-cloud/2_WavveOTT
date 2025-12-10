import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  type User,
  onAuthStateChanged, // 추가: 상태 변경 리스너
  setPersistence, // 추가: 세션 유지 관리
  browserSessionPersistence, // 브라우저 탭/창 종료 시 세션 만료
} from "firebase/auth";
import { create } from "zustand";
import { auth } from "../firebase/firebase";
interface AuthState {
  user: User | null;
  onMember: (email: string, password: string) => Promise<void>;
  onLogin: (email: string, password: string) => Promise<void>;
  onLogout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => {
  // onAuthStateChanged 리스너는 객체 정의 외부에 위치시키고,
  // 스토어 초기화 시 실행되어야 합니다.
  onAuthStateChanged(auth, (user) => {
    set({ user: user });
  });

  // 반드시 객체({ ... })를 반환해야 합니다.
  return {
    user: null, // 초기 상태

    // 회원가입 메서드
    onMember: async (email, password) => {
      try {
        // setPersistence를 로그인/회원가입 작업 직전에 적용
        await setPersistence(auth, browserSessionPersistence);

        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        set({ user: userCredential.user });
        alert("회원가입이 완료됐습니다");
      } catch (err: any) {
        alert("회원 가입 실패");
        console.log("회원 가입 실패", err.message);
        throw err; // 에러를 컴포넌트로 다시 던져 처리
      }
    },

    // 로그인 메서드
    onLogin: async (email, password) => {
      try {
        // setPersistence를 로그인/회원가입 작업 직전에 적용
        await setPersistence(auth, browserSessionPersistence);

        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        set({ user: userCredential.user });
        alert("로그인 성공");
      } catch (err: any) {
        alert("로그인 실패: " + err.message);
        console.log("로그인 실패", err.message);
        throw err; // 에러를 컴포넌트로 다시 던져 처리
      }
    },

    // 로그아웃 메서드
    onLogout: async () => {
      await signOut(auth);
      set({ user: null });
    },
  };
});
