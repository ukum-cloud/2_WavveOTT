import { create } from "zustand";
import { useAuthStore } from "./useAuthStore";
import { collection, deleteDoc, doc, getDocs, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import type { PickState } from "../types/pick";

export const usePickStore = create<PickState>((set, get) => ({
  pickList: [],

  isPickModalOpen: false,
  pickAction: "add",

  closePickModal: () => set({ isPickModalOepn: false }),

  onTogglePick: async (item) => {
    //id값, tmdb_id로 들어올 수 있는 변수 설정
    const contentId = item.id ?? item.tmdb_id;

    const { user, selectedCharId } = useAuthStore.getState();

    //로그인 상태확인
    if (!user) {
      alert("로그인 해주세요.");
      return;
    }
    //id값 없으면 return
    if (!contentId) {
      console.warn("ID값 없음", item);
      return;
    }

    //firebase안의 하나의 로그인한Users중 하나의 프로필의 픽리시트의 영상데이터하나
    const ref = doc(
      db,
      "users",
      user.uid,
      "profiles",
      String(selectedCharId),
      "pickList",
      String(contentId)
    );

    //중복확인
    const exists = get().pickList.some((w) => (w.tmdb_id ?? w.id) === contentId);
    if (exists) {
      await deleteDoc(ref);
      set((state) => ({
        pickList: state.pickList.filter((w) => (w.tmdb_id ?? w.id) !== contentId),
        isPickModalOpen: true,
        pickAction: "remove",
      }));

      return;
    }

    const data = {
      ...item,
      contentId,
      updatedAt: Date.now(),
    };
    await setDoc(ref, data);

    set((state) => ({
      pickList: [...state.pickList, data],
      isPickModalOpen: true,
      pickAction: "add",
    }));
  },

  onFetchPick: async () => {
    const { user, selectedCharId } = useAuthStore.getState();
    if (!user) return;

    const snap = await getDocs(
      collection(db, "users", user.uid, "profiles", String(selectedCharId), "pickList")
    );

    const data = snap.docs.map((doc) => doc.data());
    set({ pickList: data });
  },
}));
