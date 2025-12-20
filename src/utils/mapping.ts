import { GENRE_MAP } from "../constants/genre";
import { GRADE_MAP } from "../constants/grade";

// 시청연령등급 문자열로 통일 후 맵핑
export const getGrades = (cert?: string | number) => {
  if (cert === undefined || cert === null) {
    return GRADE_MAP["15"]; // 기본값
  }

  const value = String(cert);

  // 숫자 등급 (19, 15, 12)
  if (value.includes("19")) return GRADE_MAP["19"];
  if (value.includes("15")) return GRADE_MAP["15"];
  if (value.includes("12")) return GRADE_MAP["12"];

  // 전체관람가 계열
  if (value.includes("ALL") || value.includes("전체") || value === "0") {
    return GRADE_MAP["ALL"];
  }

  // 미등급
  if (value.includes("NR")) {
    return GRADE_MAP["NR"];
  }

  // 최종 fallback
  return GRADE_MAP["15"];
};

// 장르 이름으로 반환 후 맵핑
// export const getGenres = (genre?: number[]) => {
//     if (!genre) return [];

//     return genre.map((id) => GENRE_MAP[id]).filter(Boolean);
// };

// 배우 추가
type GenreInput =
  | number[]
  | { genre_ids?: number[] }
  | { cast?: Array<{ genre_ids?: number[] }> }
  | undefined;

export const getGenres = (genre: GenreInput) => {
  if (!genre) return [];

  // 일반 숫자 배열
  if (Array.isArray(genre)) {
    return genre.map((id) => GENRE_MAP[id]).filter(Boolean);
  }

  // 일반 객체 (genre_ids 직접 포함)
  if ("genre_ids" in genre && Array.isArray(genre.genre_ids)) {
    return genre.genre_ids.map((id) => GENRE_MAP[id]).filter(Boolean);
  }

  // 배우 객체 (cast 안에 genre_ids)
  if ("cast" in genre && Array.isArray(genre.cast) && genre.cast[0]?.genre_ids) {
    return genre.cast[0].genre_ids.map((id) => GENRE_MAP[id]).filter(Boolean);
  }

  return [];
};
