import React from "react";
import type { MultiItem } from "../api/tmdb";
import "./scss/SearchTypingPanel.scss";

interface Props {
  query: string;
  loading: boolean;
  results: MultiItem[];
  // 오른쪽: 추천 검색어
  recommendedKeywords: string[];
  activeIndex: number;
  setActiveIndex: (n: number) => void;
  // 선택 액션
  onSelectResult: (item: MultiItem) => void;
  onSelectKeyword: (keyword: string) => void;
}

const SearchTypingPanel = ({
  query,
  loading,
  results,
  recommendedKeywords,
  activeIndex,
  setActiveIndex,
  onSelectResult,
  onSelectKeyword,
}: Props) => {
  // query 하이라이트
  const renderHighlighted = (label: string, q: string) => {
    const qq = q.trim();
    if (!qq) return <span className="txt">{label}</span>;
    const escaped = qq.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(escaped, "gi");

    const nodes: React.ReactNode[] = [];
    let lastIndex = 0;
    for (const match of label.matchAll(regex)) {
      const start = match.index ?? 0;
      const end = start + match[0].length;

      if (start > lastIndex)
        nodes.push(
          <span key={`r-${lastIndex}`} className="rest">
            {label.slice(lastIndex, start)}
          </span>
        );

      nodes.push(
        <span key={`h-${start}`} className="hit">
          {label.slice(start, end)}
        </span>
      );

      lastIndex = end;
    }

    if (lastIndex < label.length)
      nodes.push(
        <span key={`r-${lastIndex}`} className="rest">
          {label.slice(lastIndex)}
        </span>
      );

    return <span className="txt">{nodes}</span>;
  };

  const getLabel = (item: MultiItem) =>
    item.media_type === "movie" ? item.title ?? "" : item.name ?? "";

  const leftLen = results.length;
  const rightLen = Math.min(recommendedKeywords.length, 8);

  return (
    <div className="typing-panel">
      <div className={`tmdb-result ${loading ? "is-loading" : ""}`}>
        {loading && <p className="hint">검색 중...</p>}

        {!loading && results.length === 0 && (
          <p className="hint">검색 결과가 없습니다.</p>
        )}

        {!loading && results.length > 0 && (
          <ul
            className="result-list"
            role="listbox"
            id="search-left-listbox"
            aria-label="검색 목록"
          >
            {results.map((item, idx) => {
              const label = getLabel(item);
              const isActive = activeIndex === idx;

              return (
                <li
                  key={`${item.media_type}-${item.id}`}
                  id={`search-option-${idx}`}
                  role="option"
                  aria-selected={isActive}
                  className={isActive ? "is-active" : ""}
                >
                  <button
                    type="button"
                    className="preview-item"
                    tabIndex={-1}
                    onMouseEnter={() => setActiveIndex(idx)}
                    onClick={() => onSelectResult(item)}
                  >
                    {renderHighlighted(label, query)}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="recommend-box">
        <p className="recommend-title font-wave">추천 검색어</p>
        {rightLen === 0 ? (
          <p className="hint">추천 검색어가 없습니다.</p>
        ) : (
          <ul
            className="chips"
            role="listbox"
            id="search-right-listbox"
            aria-label="추천 검색어 목록"
          >
            {recommendedKeywords.slice(0, rightLen).map((k, i) => {
              const globalIdx = leftLen + i; // 오른쪽은 왼쪽 길이만큼 offset
              const isActive = activeIndex === globalIdx;

              return (
                <li
                  key={k}
                  role="option"
                  aria-selected={isActive}
                  className={isActive ? "is-active" : ""}
                >
                  <button
                    type="button"
                    className="chip"
                    tabIndex={-1}
                    onMouseEnter={() => setActiveIndex(globalIdx)}
                    onClick={() => onSelectKeyword(k)}
                  >
                    {k}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SearchTypingPanel;
