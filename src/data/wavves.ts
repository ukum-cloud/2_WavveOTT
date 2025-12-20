import type { Episodes } from "../types/movie";

export interface Wavves {
  index: number;

  series_title: string;
  series_refer_id: string;
  content_refer_id: string;
  program_refer_id?: string;
  channelname: string;
  genretext: string;
  programtitle: string;
  seasonnumbertitle: string;
  context_type: "vod" | "movie" | string;
  seasontitle: string;

  season_horizontal_logoY_image: string;
  season_horizontal_logoN_image: string;
  season_vertical_logoY_image: string;
  seasonposterimage: string;
  seasontitlelogoimage: string;

  targetage: string;

  actors: string[];
  directors: string[];
  tags: string[];
  season_writers?: string[];

  tmdb_id: number | null;
  tmdb_search_status: string;
  episodes?: Episodes[];
  youtube_key?: string;
}
