// api/tmdb.ts
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

type MultiItem = {
  id: number;
  media_type: "movie" | "tv" | "person" | string;
  title?: string;
  name?: string;
  popularity?: number;
};

type MultiResponse = {
  page: number;
  results: MultiItem[];
  total_pages: number;
  total_results: number;
};

export const searchMulti = async (keyword: string) => {
  if (!keyword) return [];

  const res = await fetch(
    `${BASE_URL}/search/multi?api_key=${API_KEY}&language=ko-KR&query=${keyword}`
  );

  const data = await res.json();
  return data.results;
};

export const searchMultiPaged = async (
  keyword: string,
  //“최대 몇 페이지까지만 가져올지” 제한 maxPages
  maxPages = 3
): Promise<MultiItem[]> => {
  const q = keyword.trim();
  if (!q) return [];

  //encodeURIComponent → 검색어가 한글/공백/특수문자면 URL이 깨질 수 있어 안전하게 서버로 전달하는 역할
  const query = encodeURIComponent(q);

  //1) 먼저 1페이지 호출해서 total_pages 확보
  const firstRes = await fetch(
    `${BASE_URL}/search/multi?api_key=${API_KEY}&language=ko-KR&include_adult=false&query=${query}&page=1`
  );

  if (!firstRes.ok) return [];

  const firstData = (await firstRes.json()) as MultiResponse;

  //서버가 가진 전체 페이지 수(total_pages)와 내가 제한한 최대 페이지 수(maxPages) 중 더 작은 값을 선택
  const total = Math.min(firstData.total_pages || 1, maxPages);
  const all: MultiItem[] = [...(firstData.results ?? [])];

  //2) 2페이지부터 total까지 추가 호출해서 합치기
  for (let page = 2; page <= total; page++) {
    const res = await fetch(
      `${BASE_URL}/search/multi?api_key=${API_KEY}&language=ko-KR&include_adult=false&query=${query}&page=${page}`
    );
    if (!res.ok) continue;

    const data = (await res.json()) as MultiResponse;
    all.push(...(data.results ?? []));
  }

  return all;
};
