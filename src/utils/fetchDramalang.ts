type Video = {
  id?: string;
  key: string;
  site: string;
  type: string; // Trailer, Teaser ...
  official?: boolean;
};

const API_KEY = import.meta.env.VITE_TMDB_API_KEY as string;
const BASE = "https://api.themoviedb.org/3";

async function fetchVideosOnce(id: number, lang?: string) {
  const langQs = lang ? `&language=${lang}` : "";
  const res = await fetch(`${BASE}/tv/${id}/videos?api_key=${API_KEY}${langQs}`);
  if (!res.ok) return [];
  const data = await res.json();
  return (data.results ?? []) as Video[];
}

function pickBest(list: Video[]) {
  const yt = list.filter((v) => v.site === "YouTube");

  // 우선순위: 공식 Trailer > Trailer > Teaser > 아무거나
  const officialTrailer = yt.find((v) => v.type === "Trailer" && v.official);
  if (officialTrailer) return officialTrailer;

  const trailer = yt.find((v) => v.type === "Trailer");
  if (trailer) return trailer;

  const teaser = yt.find((v) => v.type === "Teaser");
  if (teaser) return teaser;

  return yt[0] ?? null;
}

export async function fetchTvVideos(id: number) {
  // 1) ko-KR → 2) en-US → 3) 언어 없이(전체)
  const ko = await fetchVideosOnce(id, "ko-KR");
  const bestKo = pickBest(ko);
  if (bestKo) return [bestKo];

  const en = await fetchVideosOnce(id, "en-US");
  const bestEn = pickBest(en);
  if (bestEn) return [bestEn];

  const all = await fetchVideosOnce(id);
  const bestAll = pickBest(all);
  return bestAll ? [bestAll] : [];
}
