import { create } from "zustand";
import { useAuthStore } from "./useAuthStore";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

export const usePickStore = create((set, get) => ({
  pickList: [],
  onAddPick: async (item) => {
    const contentId = item.tmdb_id ?? item.id;
    if (!contentId) {
      console.warn("ID값 없음", item);
      return;
    }
    const { user, selectedCharId } = useAuthStore.getState();
    if (!user) {
      alert("로그인 해주세요.");
      return;
    }
    if (!selectedCharId) {
      alert("프로필을 선택해주세요.");
      return;
    }
    const exists = get().pickList.some((w) => (w.tmdb_id ?? w.id) === contentId);
    if (exists) return;
    const ref = doc(
      db,
      "users",
      user.uid,
      "profiles",
      String(selectedCharId),
      "pickList",
      String(contentId)
    );
    const data = {
      ...item,
      contentId,
      updatedAt: Date.now(),
    };
    // await setDoc(ref, data);
    set({
      pickList: [...get().pickList, data],
    });
  },
}));
