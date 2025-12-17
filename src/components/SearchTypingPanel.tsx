import React from "react";
import type { NavItem } from "../types/searchNav";
import type { SearchResultItem } from "../types/searchtodo";

interface Props {
  query: string;
  hasSearched: boolean;
  loading: boolean;
  results: SearchResultItem[];
  previewList: string[];

  onClickKeyword: (keyword: string) => void;

  // 키보드 공통 props (누락되어 있었음)
  navItems: NavItem[];
  activeIndex: number;
  setActiveIndex: (n: number) => void;
  setItemRef: (idx: number, el: HTMLButtonElement | null) => void;
  onItemKeyDown: (e: React.KeyboardEvent<HTMLButtonElement>) => void;
  activateItem: (idx: number) => void;

  trendingKeywords: string[];
}

const SearchTypingPanel = ({
  query,
  hasSearched,
  loading,
  results,
  previewList,
  onClickKeyword,
  navItems,
  activeIndex,
  setActiveIndex,
  setItemRef,
  onItemKeyDown,
  activateItem,
  trendingKeywords
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
        <span key="rest-tail" className="rest">
          {label.slice(lastIndex)}
        </span>
      );
    }

    return <span className="txt">{nodes}</span>;
  };

  const trimmed = query.trim();

  /**
   * 전역 navItems에서 left/right만 골라서 "전역 idx" 유지한 채로 렌더
   * - 여기서 idx는 navItems의 인덱스(전역 인덱스)입니다.
   * - 반드시 이 idx를 id/ref/activeIndex/activateItem에 사용해야 포커스가 안 꼬입니다.
   */
  const leftEntries = navItems.map((item, idx) => ({item, idx})).filter(x => x.item.section === "left");
  const rightEntries = navItems.map((item, idx) => ({item, idx})).filter(x => x.item.section === "right");


  /**
   * 왼쪽 클릭:
   * - keyword면 기존 onClickKeyword로도 가능하지만
   * - 키보드/전역 정책 통일을 위해 activateItem(idx)로 통일하는 걸 추천
   */
  const handleClickAny = (globalIdx: number) => {
    activateItem(globalIdx);
  };

  return (
    <div className="typing-panel">
      {hasSearched ? (
        <div className={`tmdb-result ${loading ? "is-loading" : "auto-hide"}`}>
          {loading && <p className="hint">검색 중...</p>}

          {!loading && leftEntries.length === 0 && <p className="hint">검색 결과가 없습니다.</p>}

          {!loading && leftEntries.length > 0 && (
            <ul className="result-list" role="listbox" id="search-listbox" aria-label="검색 목록">
              {leftEntries.map(({item, idx}) => (
                <li
                  key={`${item.type}-${item.label}-${idx}`}
                  id={`nav-${idx}`}
                  role="option"
                  aria-selected={activeIndex === idx}
                  className={activeIndex === idx ? "is-active" : ""}
                >
                  <button type="button"
                    ref={(el) => setItemRef(idx, el)}
                    onKeyDown={onItemKeyDown}
                    onMouseEnter={() => setActiveIndex(idx)}
                    onClick={() => handleClickAny(idx)}
                  >
                    <span className="word">{renderHighlighted(item.label, trimmed)}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
          {/* 검색 후인데 leftEntries가 비어있다면(혹시 navItems 구성 문제) */}
          {!loading && results.length > 0 && leftEntries.length === 0 && (
            <p className="hint">
              (표시할 항목이 없습니다) <br />
              SearchOverlay의 navItems(left)가 results와 일치하는지 확인하세요.
            </p>
          )}
        </div>
      ) : (
        <ul className="preview-list" id="search-listbox" role="listbox" aria-label="자동완성 목록">
          {leftEntries.length === 0 ? (
            // 기존 previewList가 남아있을 수 있으니 fallback 표시
            previewList.map((t) => (
              <li key={t}>
                <button onClick={() => onClickKeyword(t)}>
                  {renderHighlighted(t, trimmed)}
                </button>
              </li>
            ))
          ) : (
            leftEntries.map(({ item, idx }) => (
              <li
                key={`${item.type}-${item.label}-${idx}`}
                id={`nav-${idx}`}
                role="option"
                aria-selected={activeIndex === idx}
                className={activeIndex === idx ? "is-active" : ""}
              >
                <button
                  type="button"
                  className="preview-item"
                  ref={(el) => setItemRef(idx, el)}
                  onKeyDown={onItemKeyDown}
                  onMouseEnter={() => setActiveIndex(idx)}
                  onClick={() => handleClickAny(idx)}
                >
                  {renderHighlighted(item.label, trimmed)}
                </button>
              </li>
            ))
          )}
        </ul>
      )}

      <div className="recommend-box">
        <p className="recommend-title font-wave">추천 검색어</p>
        {/* 오른쪽도 “키보드 대상”이 되려면 rightEntries가 있어야 합니다.
          rightEntries가 비어 있으면(=navItems에 right가 없으면), 기존 chips UI를 fallback으로 보여줍니다. */}
        {rightEntries.length > 0 ? (
          <ul className="chips" role="listbox" aria-label="추천 검색어 목록">
            {rightEntries.map(({ item, idx }) => (
              <li
                key={`${item.type}-${item.label}-${idx}`}
                id={`nav-${idx}`} // 전역 idx 그대로!
                role="option"
                aria-selected={activeIndex === idx}
                className={activeIndex === idx ? "is-active" : ""}
              >
                <button
                  type="button"
                  className="chip"
                  ref={(el) => setItemRef(idx, el)}
                  onKeyDown={onItemKeyDown}
                  onMouseEnter={() => setActiveIndex(idx)}
                  onClick={() => handleClickAny(idx)}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          // fallback: 기존 chips 유지(Tab/Enter만 동작)
          <div className="chips">
            {trendingKeywords.slice(0, 8).map((k) => (
              <button type="button" key={k} className="chip" onClick={() => onClickKeyword(k)}>
                {k}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchTypingPanel;
