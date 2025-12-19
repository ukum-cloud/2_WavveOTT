import React from "react";
import type { Search } from "../types/searchtodo";
import "./scss/SearchIdlePanel.scss";

interface Props {
  nowDate: string;

  // 왼쪽: 최근 검색어
  todos: Search[];
  onRemoveAll: () => void;
  onRemoveTodo: (id: number) => void;
  onSelectRecent: (text: string) => void;

  // 오른쪽: 인기/추천 검색어
  trendingKeywords: string[];
  onSelectTrending: (keyword: string) => void;

  // ✅ Overlay가 관리하는 전역 activeIndex(Idle에서도 쓰고 싶으면)
  activeIndex: number;
  setActiveIndex: (n: number) => void;

  // ✅ 인덱스 범위 계산용(최근/인기 개수)
  maxRecent: number; // 예: Math.min(todos.length, 10)
  maxTrending: number; // 예: Math.min(trendingKeywords.length, 10)
}

const SearchIdlePanel = ({
  nowDate,
  todos,
  onRemoveAll,
  onRemoveTodo,
  onSelectRecent,
  trendingKeywords,
  onSelectTrending,
  activeIndex,
  setActiveIndex,
  maxRecent,
  maxTrending,
}: Props) => {
  const recent = todos.slice(0, maxRecent);
  const trending = trendingKeywords.slice(0, maxTrending);

  const recentLen = recent.length;

  const isRecentActive = (idx: number) => activeIndex === idx;
  const isTrendingActive = (idx: number) => activeIndex === recentLen + idx;

  return (
    <div className="search-bottom">
      <div className="latest-searches-box bottom-search-box">
        {recent.length === 0 ? (
          <div className="todo-zeo">
            <div className="searches-title">
              <p className="title-left font-wave">최근 검색어</p>
            </div>
            <p className="empty-text">최근 검색 내역이 없습니다.</p>
          </div>
        ) : (
          <div className="todo-it">
            <div className="searches-title">
              <p className="title-left font-wave">최근 검색어</p>
              <button onClick={onRemoveAll} type="button">
                전체삭제
              </button>
            </div>

            <ul
              className="latest-searches-list"
              role="listbox"
              id="idle-left-listbox"
            >
              {recent.map((t, i) => (
                <li
                  key={t.id}
                  role="option"
                  aria-selected={isRecentActive(i)}
                  className={isRecentActive(i) ? "is-active" : ""}
                >
                  <button
                    type="button"
                    className="latest-text"
                    tabIndex={-1}
                    onMouseEnter={() => setActiveIndex(i)}
                    onClick={() => onSelectRecent(t.text)}
                  >
                    {t.text}
                  </button>

                  <button
                    type="button"
                    tabIndex={-1}
                    onMouseEnter={() => setActiveIndex(i)}
                    onClick={() => onRemoveTodo(t.id)}
                    aria-label="삭제"
                  >
                    <img
                      src="/images/icons/icon-search-remove.svg"
                      alt="검색 삭제"
                    />
                  </button>
                </li>
              ))}
            </ul>
          </div>
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

        <ol
          className="popular-searches-list"
          role="listbox"
          id="idle-right-listbox"
          aria-label="실시간 인기 검색어 목록"
        >
          {trending.length === 0 ? (
            <li>
              <p className="empty-text">표시할 인기 검색어가 없습니다.</p>
            </li>
          ) : (
            trending.map((k, i) => (
              <li
                key={k}
                role="option"
                aria-selected={isTrendingActive(i)}
                className={isTrendingActive(i) ? "is-active" : ""}
              >
                <button
                  type="button"
                  tabIndex={-1}
                  onMouseEnter={() => setActiveIndex(recentLen + i)}
                  onClick={() => onSelectTrending(k)}
                >
                  <span className="rank font-wave">{i + 1}</span>
                  <span className="word">{k}</span>
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
