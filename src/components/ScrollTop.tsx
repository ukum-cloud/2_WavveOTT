import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollTop = () => {
  //useLocation => 현재 주소(URL)의 경로를 가져오는 react-hook
  //ex) https://site.com/movie/123?tab=info => pathname:movie/123 => 경로변경시 scroll위치변경
  const { pathname } = useLocation();

  useEffect(() => {
    //scrollTo => ({ top(y축), left(x축), behavior(빡 이동할건가? / 부드럽게 이동할건가?)})
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  return null;
};

export default ScrollTop;
