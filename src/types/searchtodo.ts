export interface Search{
  id: number;
  text: string;
  overview?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
}

export interface SearchText{
  todos: Search[];
  onAddTextTodo: (text: string) => void;
  onRemoveTodos: (id: number) => void;
  onRemoveAll: () => void;
}