import React, { useEffect, useMemo, useState } from "react";
import "./scss/SearchOverlay.scss";
import { useSearchStore } from "../stores/useSearchStore";
import { useNavigate } from "react-router-dom";


interface Props {
  onClose: () => void;
}

const SearchOverlay = ({ onClose }: Props) => {
  const [text, setText] = useState("");
  const [nowDate, setNowDate] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  // store state/actions (selector 방식)
  const todos = useSearchStore((s) => s.todos);
  const onAddTextTodo = useSearchStore((s) => s.onAddTextTodo);
  const onRemoveTodos = useSearchStore((s) => s.onRemoveTodos);
  const onRemoveAll = useSearchStore((s) => s.onRemoveAll);

  const results = useSearchStore((s) => s.results);
  const loading = useSearchStore((s) => s.loading);
  const onFetchSearch = useSearchStore((s) => s.onFetchSearch);
  const onClearResults = useSearchStore((s) => s.onClearResults);

  const trendingKeywords = useSearchStore((s) => s.trendingKeywords);
  const onFetchTrendingKeywords = useSearchStore((s) => s.onFetchTrendingKeywords);
  const fetchSearchAndGetFirst = useSearchStore((s) => s.fetchSearchAndGetFirst);

  const navigate = useNavigate();

  const trimmed = text.trim();
  const isTyping = trimmed.length > 0;

  // 오버레이 떠있을 때만 body 스크롤 잠금
  // useEffect(() => {
  //   const prev = document.body.style.overflow;
  //   document.body.style.overflow = "hidden";
  //   return () => {
  //     document.body.style.overflow = prev;
  //   };
  // }, []);

  // 현재 시간 표시
  useEffect(() => {
    const update = () => {
      const d = new Date();
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      const hh = String(d.getHours()).padStart(2, "0");
      const min = String(d.getMinutes()).padStart(2, "0");
      setNowDate(`${yyyy}.${mm}.${dd} ${hh}:${min}`);
    };

    update();
    const timer = window.setInterval(update, 60000);
    return () => window.clearInterval(timer);
  }, []);

  // 트렌딩 키워드 1회 로딩
  useEffect(() => {
    onFetchTrendingKeywords();
  }, [onFetchTrendingKeywords]);

  // 입력 즉시 검색 (디바운스 300ms)
  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (!isTyping) {
        onClearResults();
        setHasSearched(false);
        return;
      }
      setHasSearched(true);
      onFetchSearch(trimmed);
    }, 300);

    return () => window.clearTimeout(timer);
  }, [isTyping, trimmed, onFetchSearch, onClearResults]);

  // 자동완성(트렌딩 기반)
  const previewList = useMemo(() => {
    if (!isTyping) return [];
    return trendingKeywords.filter((k) => k.includes(trimmed)).slice(0, 10);
  }, [isTyping, trimmed, trendingKeywords]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trimmed) return;
    onAddTextTodo(trimmed);
  };

  const goDetailByKeyword = async (keyword: string) => {
    const trimmed = keyword.trim();
    if (!trimmed) return;

    setText(trimmed);
    onAddTextTodo(trimmed);

    const first = await fetchSearchAndGetFirst(trimmed);
    if (!first) return;

    if (first.kind === "movie") {
      navigate(`/moviedetail/movie/${first.id}`);
    } else {
      navigate(`/contentsdetail/${first.kind}/${first.id}`);
    }

    onClose();
  };

  const renderHighlighted = (label: string, query: string) => {
    const q = query.trim();
    if (!q) return <span className="txt">{label}</span>;

    // 정규식 특수문자 escape
    const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(escaped, "gi"); // 대소문자 무시

    const nodes: React.ReactNode[] = [];
    let lastIndex = 0;

    // label에서 query 매칭되는 모든 구간을 찾아서 쪼개기
    for (const match of label.matchAll(regex)) {
      const start = match.index ?? 0;
      const end = start + match[0].length;

      if (start > lastIndex) {
        nodes.push(
          <span key={`rest-${lastIndex}`} className="rest">
            {label.slice(lastIndex, start)}
          </span>
        );
      }

      nodes.push(
        <span key={`hit-${start}`} className="hit">
          {label.slice(start, end)}
        </span>
      );

      lastIndex = end;
    }

    if (lastIndex < label.length) {
      nodes.push(
        <span key={`rest-tail`} className="rest">
          {label.slice(lastIndex)}
        </span>
      );
    }

    return <span className="txt">{nodes}</span>;
  };

  return (
    <div className="search-popup" role="dialog" aria-modal="true">
      <div className="search-inner-wrap">
        <div className="close-bg" onClick={onClose} aria-label="닫기" />
        <div className="search-inner">
          <div className="keyboard-box">
            <form className="keyboard-top" name="search" onSubmit={handleSubmit}>
              <input type="text" placeholder="장르, 제목, 배우로 검색해보세요."
                className="font-wave" id="search" value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <button type="submit" className="img-box" aria-label="검색">
                <img src="/images/icons/icon-search.svg" alt="검색" />
              </button>
            </form>

            {/* 입력 중일 때 */}
            {isTyping ? (
              <div className="typing-panel">
                {/* 검색을 시작했으면(TMDb 패널) / 아니면(추천패널) */}
                {hasSearched ? (
                  <div className={`tmdb-result ${loading ? "is-loading" : "auto-hide"}`}>
                    
                    {loading && <p className="hint">검색 중...</p>}

                    {!loading && results.length === 0 && (
                      <p className="hint">검색 결과가 없습니다.</p>
                    )}

                    {!loading && results.length > 0 && (
                      <ul className="result-list">
                        {results.map((r) => (
                          <li key={`${r.kind}-${r.id}`}>
                            <button type="button" onClick={() => {
                                setText(r.label);
                                onAddTextTodo(r.label);
                                if (r.kind === "movie"){
                                  navigate(`/moviedetail/movie/${r.id}`);
                                } else {
                                  navigate(`/contentsdetail/${r.kind}/${r.id}`);
                                }
                                onClose(); }}
                            >
                              <span className="word">{renderHighlighted(r.label, trimmed)}</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <>
                    <ul className="preview-list">
                      {previewList.map((t) => (
                        <li key={t}>
                          <button type="button" className="preview-item" onClick={() => goDetailByKeyword(t)}>
                            {renderHighlighted(t, trimmed)}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
                <div className="recommend-box">
                  <p className="recommend-title font-wave">추천 검색어</p>
                  <div className="chips">
                    {trendingKeywords.slice(0, 8).map((k) => (
                      <button type="button" key={k} className="chip" onClick={() => goDetailByKeyword(k)}>
                        {k}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="search-bottom">
                <div className="latest-searches-box bottom-search-box">
                  <div className="searches-title">
                    <p className="title-left font-wave">최근 검색어</p>
                    <button onClick={onRemoveAll} type="button">
                      전체삭제
                    </button>
                  </div>

                  {todos.length === 0 ? (
                    <p className="empty-text">최근 검색 내역이 없습니다.</p>
                  ) : (
                    <ul className="latest-searches-list">
                      {todos.map((todo) => (
                        <li key={todo.id}>
                          <button type="button" className="latest-text" onClick={() => goDetailByKeyword(todo.text)}>
                            {todo.text}
                          </button>
                          <button type="button" onClick={() => onRemoveTodos(todo.id)} aria-label="삭제">
                            <img src="/images/icons/icon-search-remove.svg" alt="" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="popular-searches-box bottom-search-box">
                  <div className="searches-title">
                    <p className="title-left font-wave">실시간 인기 검색어</p>
                    <div className="date-box">
                      <p className="now-date">{nowDate}</p>
                      <p>기준</p>
                    </div>
                  </div>

                  <ol className="popular-searches-list">
                    {trendingKeywords.slice(0, 10).map((t, i) => (
                      <li key={t}>
                        <button type="button" onClick={() => goDetailByKeyword(t)}>
                          <span className="rank font-wave">{i + 1}</span>
                          <span className="word">{t}</span>
                        </button>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchOverlay;
