import React from "react";
import type { NavItem } from "../types/searchNav";
import type { Search } from "../types/searchtodo";

interface Props {
  nowDate: string;
  todos: Search[];
  trendingKeywords: string[];

  onRemoveAll: () => void;
  onRemoveTodo: (id: number) => void;
  onClickKeyword: (keyword: string) => void;

  // 키보드 공통 props
  navItems: NavItem[];
  activeIndex: number;
  setActiveIndex: (n: number) => void;
  setItemRef: (idx: number, el: HTMLButtonElement | null) => void;
  onItemKeyDown: (e: React.KeyboardEvent<HTMLButtonElement>) => void;
  activateItem: (idx: number) => void;
  focusToInput: () => void;
}

const SearchIdlePanel = ({
  todos,
  trendingKeywords,
  nowDate,
  onRemoveAll,
  onRemoveTodo,
  onClickKeyword,
  navItems,
  activeIndex,
  setActiveIndex,
  setItemRef,
  onItemKeyDown,
  activateItem
}: Props) => {
  // navItems 기반으로 left/right를 전역 idx 유지한 채로 분리
  const leftEntries = navItems
    .map((item, idx) => ({ item, idx }))
    .filter((x) => x.item.section === "left");

  const rightEntries = navItems
    .map((item, idx) => ({ item, idx }))
    .filter((x) => x.item.section === "right");

  return (
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
          <ul className="latest-searches-list" role="listbox" id="search-listbox">
            {leftEntries.map(({item, idx}) => (
              <li
                key={`${item.type}-${item.label}-${idx}`}
                id={`nav-${idx}`}
                role="option"
                aria-selected={activeIndex === idx}
                className={activeIndex === idx ? "is-active" : ""}
              >
                <button
                  type="button"
                  className="latest-text"
                  ref={(el) => setItemRef(idx, el)}
                  onKeyDown={onItemKeyDown}
                  onMouseEnter={() => setActiveIndex(idx)}
                  onClick={() => activateItem(idx)}
                >
                  {item.label}
                </button>
                <button type="button" onClick={() => {
                    const hit = todos.find((t) => t.text === item.label);
                    if (hit) onRemoveTodo(hit.id);
                  }}
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

        <ol className="popular-searches-list" role="listbox" aria-label="실시간 인기 검색어 목록">
          {rightEntries.length > 0 ? (
            rightEntries.map(({ item, idx }, i) => (
              <li key={`${item.type}-${item.label}-${idx}`}
                id={`nav-${idx}`} // 통일(섹션 이동/aria)
                role="option"
                aria-selected={activeIndex === idx}
                className={activeIndex === idx ? "is-active" : ""}
              >
                <button type="button"
                  ref={(el) => setItemRef(idx, el)}
                  onKeyDown={onItemKeyDown}
                  onMouseEnter={() => setActiveIndex(idx)}
                  onClick={() => activateItem(idx)}
                >
                  <span className="rank font-wave">{i + 1}</span>
                  <span className="word">{item.label}</span>
                </button>
              </li>
            ))
          ) : (
            // fallback: navItems에 right가 없을 때 기존 trendingKeywords로 표시(키보드는 Tab만)
            trendingKeywords.slice(0, 10).map((t, i) => (
              <li key={t}>
                <button type="button" onClick={() => onClickKeyword(t)}>
                  <span className="rank font-wave">{i + 1}</span>
                  <span className="word">{t}</span>
                </button>
              </li>
          ))
        )}
        </ol>
      </div>
    </div>
  );
};

export default SearchIdlePanel;
