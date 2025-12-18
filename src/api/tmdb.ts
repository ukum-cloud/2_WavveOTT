// api/tmdb.ts
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export const searchMulti = async (keyword: string) => {
  if (!keyword) return [];

  const res = await fetch(
    `${BASE_URL}/search/multi?api_key=${API_KEY}&language=ko-KR&query=${keyword}`
  );

  const data = await res.json();
  return data.results;
};
