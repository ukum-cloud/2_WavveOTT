export interface Pick {
  /** === 공통 식별자 === */
  contentId?: number;
  updatedAt?: number;

  id?: number;
  tmdb_id?: number | string | null;

  /** === 이미지 === */
  main_img?: string | null;
  poster_path?: string | null;
  seasonposterimage?: string | null;
  backdrop_path?: string | null;
  season_horizontal_logoN_image?: string | null;
  backdrop?: string | null;

  /** === 로고 === */
  logo?: string | null;
  seasontitlelogoimage?: string | null;

  /** === 타이틀 === */
  name?: string;
  title?: string;
  series_title?: string;
  programtitle?: string; // wavve

  /** === 등급 === */
  targetage?: string; // wavve
  certificationMovie?: string; // TMDB

  /** === 미디어 타입 === */
  media_type?: "movie" | "tv" | "wavve" | "news" | string;

  /** === 장르 === */
  genretext?: string;
  genre_ids?: number[];

  /** === wavve 메타 === */
  actors?: string[];
  directors?: string[];
  season_writers?: string[];
  tags?: string[];
  seasonnumbertitle?: string;
  series_refer_id?: string;
  content_refer_id?: string;
  context_type?: string;

  /** === 비디오 === */
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
