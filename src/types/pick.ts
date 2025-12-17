export interface Pick {
  id?: number;
  tmdb_id?: number;
  main_img?: string;
  poster_path: string;
  media_type: string;
}

export interface PickState {
  pickList: Pick[];
  onAddPick: (item: Pick) => Promise<void>;
}
