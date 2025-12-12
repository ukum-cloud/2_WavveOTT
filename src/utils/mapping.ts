import { GENRE_MAP } from '../constants/genre';
import { GRADE_MAP } from '../constants/grade';

// 시청연령등급 문자열로 통일 후 맵핑
export const getGrades = (cert?: string | number) => {
    return GRADE_MAP[String(cert)] ?? '/images/15.svg';
};

// 장르 이름으로 반환 후 맵핑
export const getGenres = (genre?: number[]) => {
    if (!genre) return [];

    return genre.map((id) => GENRE_MAP[id]).filter(Boolean);
};
