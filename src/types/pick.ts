export interface Pick {
  contentId?: number;
  updatedAt?: number;

  id?: number;
  tmdb_id?: string | number | null;

  main_img?: string | null;
  poster_path?: string | null;
  seasonposterimage?: string | null;
  backdrop_path?: string | null;
  season_horizontal_logoN_image?: string | null;

  logo?: string | null;
  seasontitlelogoimage?: string | null;

  name?: string;
  title?: string;
  series_title?: string;

  targetage?: string;
  certificationMovie?: string;

  media_type?: "movie" | "tv" | "wavve" | "news" | string;

  genretext?: string;
  genre_ids?: number[];

  tvsVideo?: {
    type: string;
    site: string;
    key: string;
  } | null;

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
