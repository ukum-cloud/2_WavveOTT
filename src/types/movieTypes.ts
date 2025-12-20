// ../types/movieTypes.ts

export interface MediaBase {
  id: number;
  backdrop_path?: string | null;
  poster_path?: string | null;
  adult?: boolean;
  overview?: string;
  vote_average?: number;
  certification?: string;
  tmdb_id?: number;
}

export interface Video {
  type: string;
  site: string;
  key: string;
}

/**
 * 모든 미디어(영화, TV, 애니)를 아우르는 통합 인터페이스
 */
export interface UnifiedData extends MediaBase {
  title?: string;       // 영화용
  name?: string;        // TV/애니용
  release_date?: string;
  first_air_date?: string;
  media_type: 'movie' | 'tv'; 
  videos?: Video[];
  key?: string;
  logo?: string | null;
  file_path?: string;
  certificationMovie?: string;
  genre_ids?: number[];
}