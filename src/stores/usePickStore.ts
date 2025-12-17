import { create } from "zustand";
import { useAuthStore } from "./useAuthStore";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import type { PickState } from "../types/pick";

export const usePickStore = create<PickState>((set, get) => ({
  pickList: [],
  onAddPick: async (item) => {
    //id값, tmdb_id로 들어올 수 있는 변수 설정
    const contentId = item.id ?? item.tmdb_id;
    const posterPath = item.poster_path;
    const type = item.media_type;
    //id값 없으면 return
    if (!contentId) {
      console.warn("ID값 없음", item);
      return;
    }

    const { user, selectedCharId, selectedCharNickname } = useAuthStore.getState();
    //로그인 상태확인
    if (!user) {
      alert("로그인 해주세요.");
      return;
    }
    //중복확인
    const exists = get().pickList.some((w) => (w.tmdb_id ?? w.id) === contentId);
    if (user && exists) return;
    const ref = doc(
      db,
      "users",
      user.uid,
      "profiles",
      String(selectedCharNickname),
      "pickList",
      String(contentId)
    );

    const data = {
      ...item,
      //id값
      contentId,
      //poster경로
      posterPath,
      //디테일 페이지 진입할 media타입변수
      type,
      //순차별로 보여야하는 들어온시간 변수 필요한가?
      updatedAt: Date.now(),
    };
    // await setDoc(ref, data);
    set({
      pickList: [...get().pickList, data],
    });
  },
  onDeletepick: async (id) => {},
  onFetchPick: async () => {
    const user = useAuthStore.getState().user;
    const profileId = useAuthStore.getState().selectedCharId;
    if (!user) return;

    const snap = await getDoc(
      collection(db, "users", user.uid, "profiles", String(profileId), "pickList")
    );

    const data = snap.docs.map((doc) => doc.data());
    set({ pickList: data });
  },
  onResetPick: () => {
    set({ pickList: [] });
  },
}));
