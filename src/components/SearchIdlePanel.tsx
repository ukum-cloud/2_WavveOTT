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

  // ✅ 키보드 공통 props
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
  activeIndex,
  recentCount
}: Props) => {
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
            {todos.map((todo, idx) => (
              <li
                key={todo.id}
                id={`search-option-${idx}`}
                role="option"
                aria-selected={activeIndex === idx}
                className={activeIndex === idx ? "is-active" : ""}
              >
                <button
                  type="button"
                  className="latest-text"
                  onClick={() => onClickKeyword(todo.text)}
                >
                  {todo.text}
                </button>
                <button type="button" onClick={() => onRemoveTodo(todo.id)} aria-label="삭제">
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

        <ol className="popular-searches-list" id="search-listbox" role="listbox">
          {trendingKeywords.slice(0, 10).map((t, i) => {
            const idx = recentCount + i;
            return (
              <li key={t}
                id={`search-option-${idx}`}
                role="option"
                aria-selected={activeIndex === idx}
                className={activeIndex === idx ? "is-active" : ""}
              >
                <button type="button" onClick={() => onClickKeyword(t)}>
                  <span className="rank font-wave">{i + 1}</span>
                  <span className="word">{t}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
};

export default SearchIdlePanel;
