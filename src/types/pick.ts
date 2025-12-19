export interface Pick {
  contentId?: number;
  updateAt?: number;
  id?: number;
  tmdb_id?: number | null;

  main_img?: string;
  poster_path?: string;
  seasonposterimage?: string;

  tvsVideo?: {
    type: string;
    site: string;
    key: string;
  };

  backdrop_path?: string;
  season_horizontal_logoN_image?: string;

  name?: string;
  title?: string;
  series_title?: string;

  logo?: string;
  seasontitlelogoimage?: string;

  targetage?: string;
  certificationMovie?: string;

  media_type?: string;

  genretext?: string;
  genre_ids?: number[];

  videos?: Video[];
}

export interface PickState {
  pickList: Pick[];
  isPickModalOpen: boolean;
  pickAction: string;

  closePickModal: () => void;
  onTogglePick: (item: Pick) => Promise<void>;
  onFetchPick: () => Promise<void>;
}

export interface Video {
  type: string;
  site: string;
  key: string;
}
