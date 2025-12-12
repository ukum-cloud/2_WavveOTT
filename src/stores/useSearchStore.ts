import { create } from "zustand";
import type { SearchText } from "../types/searchtodo";

export const useSearchStore = create<SearchText>((set) => ({
  todos: [],

  //검색 기록 저장
  onAddTextTodo: (text) => {
    set((state => ({
      todos: [...state.todos, {id: Date.now(), text: text}]
    })))
  },

  //검색 기록을 선택해서 삭제
  onRemoveTodos: (id) => {
    set((state) => ({
      todos: state.todos.filter((todo) => todo.id !== id)
    }))
  },

  //검색 기록들 전부 삭제
  onRemoveAll: () => {
    set({todos: []})
  }
}))