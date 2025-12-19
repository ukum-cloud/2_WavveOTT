import { create } from "zustand";
import { useAuthStore } from "./useAuthStore";
import { collection, deleteDoc, doc, getDocs, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import type { Pick, PickState } from "../types/pick";

export const usePickStore = create<PickState>((set, get) => ({
  pickList: [],

  isPickModalOpen: false,
  pickAction: "add",

  closePickModal: () => set({ isPickModalOpen: false }),

  onTogglePick: async (item) => {
    const rawId = item.id ?? item.tmdb_id;
    const contentId = Number(rawId);

    const { user, selectedCharId } = useAuthStore.getState();

    if (!user) {
      alert("로그인 해주세요.");
      return;
    }

    if (!rawId || Number.isNaN(contentId)) {
      console.warn("유효하지 않은 contentId", item);
      return;
    }

    const ref = doc(
      db,
      "users",
      user.uid,
      "profiles",
      String(selectedCharId),
      "pickList",
      String(contentId)
    );

    const exists = get().pickList.some((w) => w.contentId === contentId);

    if (exists) {
      await deleteDoc(ref);
      set((state) => ({
        pickList: state.pickList.filter((w) => w.contentId !== contentId),
        isPickModalOpen: true,
        pickAction: "remove",
      }));
      return;
    }

    const data: Pick = {
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
