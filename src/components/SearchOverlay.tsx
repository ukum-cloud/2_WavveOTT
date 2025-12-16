import React, { useEffect, useMemo, useState } from "react";
import "./scss/SearchOverlay.scss";
import { useSearchStore } from "../stores/useSearchStore";

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

  const trimmed = text.trim();
  const isTyping = trimmed.length > 0;

  // 오버레이 떠있을 때만 body 스크롤 잠금
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

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

  useEffect(() => {
    if (!isTyping) return;
    if (loading) return;

    // 검색이 끝났으면 1.5초 후 추천/자동완성으로 복귀
    if (hasSearched) {
      const t = window.setTimeout(() => setHasSearched(false), 1500);
      return () => window.clearTimeout(t);
    }
  }, [isTyping, loading, hasSearched]);

  return (
    <div className="search-popup" role="dialog" aria-modal="true">
      <div className="search-inner-wrap">
        <div className="close-bg" onClick={onClose} aria-label="닫기" />
        <div className="search-inner">
          <div className="keyboard-box">
            <form className="keyboard-top" name="search" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="장르, 제목, 배우로 검색해보세요."
                className="font-wave"
                id="search"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <button type="submit" className="img-box" aria-label="검색">
                <img src="/images/icons/icon-search.svg" alt="검색" />
              </button>
            </form>

            {/* 입력 중일 때 */}
            {isTyping && (
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
                            <button
                              type="button"
                              onClick={() => {
                                setText(r.label);
                                onAddTextTodo(r.label);
                              }}
                            >
                              <span className="badge">
                                {r.kind === "movie" && "영화"}
                                {r.kind === "collection" && "시리즈"}
                                {r.kind === "person" && "인물"}
                              </span>
                              <span className="word">{r.label}</span>
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
                          <button
                            type="button"
                            className="preview-item"
                            onClick={() => setText(t)}
                          >
                            {t}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
                <div className="recommend-box">
                  <p className="recommend-title">추천 검색어</p>
                  <div className="chips">
                    {trendingKeywords.slice(0, 8).map((k) => (
                      <button
                        type="button"
                        key={k}
                        className="chip"
                        onClick={() => setText(k)}
                      >
                        {k}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 입력 없을 때: 최근검색어 / 실시간 인기 */}
          {!isTyping && (
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
                        <button
                          type="button"
                          className="latest-text"
                          onClick={() => setText(todo.text)}
                        >
                          {todo.text}
                        </button>
                        <button
                          type="button"
                          onClick={() => onRemoveTodos(todo.id)}
                          aria-label="삭제"
                        >
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
                      <button type="button" onClick={() => setText(t)}>
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
  );
};

export default SearchOverlay;
