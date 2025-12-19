import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./scss/SearchOverlay.scss";

import SearchInputBar from "./SearchInputBar";
import SearchIdlePanel from "./SearchIdlePanel";
import SearchTypingPanel from "./SearchTypingPanel";
import { useSearchStore } from "../stores/useSearchStore";
import type { SearchResultItem } from "../types/searchtodo";

interface Props {
  onClose: () => void;
}

const MIN_LEN = 2;
const DEBOUNCE_MS = 250;

const SearchOverlay = ({ onClose }: Props) => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [text, setText] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);

  const {
    todos,
    onAddTextTodo,
    onRemoveTodos,
    onRemoveAll,

    results,
    loading,
    onFetchSearch,
    onClearResults,

    trendingKeywords,
    onFetchTrendingKeywords,

    fetchSearchAndGetFirst,
    recommendedKeywords,
    onFetchRecommendedKeywords,
  } = useSearchStore();

  // 오버레이 열릴 때
  useEffect(() => {
    inputRef.current?.focus();
    void onFetchTrendingKeywords();
    void onFetchRecommendedKeywords();
  }, [onFetchTrendingKeywords, onFetchRecommendedKeywords]);

  const trimmed = text.trim();
  const showIdle = trimmed.length === 0;

  const nowDate = useMemo(() => {
    const d = new Date();

    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");

    const hh = String(d.getHours()).padStart(2, "0");
    const min = String(d.getMinutes()).padStart(2, "0");

    return `${yyyy}.${mm}.${dd} ${hh}:${min}`;
  }, []);

  const visibleResults = useMemo(() => results.slice(0, 10), [results]);

  // 디바운스 검색(typing할 때만)
  useEffect(() => {
    if (showIdle) return;

    if (trimmed.length < MIN_LEN) {
      onClearResults();
      return;
    }

    const t = window.setTimeout(() => {
      void onFetchSearch(trimmed, 3);
    }, DEBOUNCE_MS);

    return () => window.clearTimeout(t);
  }, [trimmed, showIdle, onFetchSearch, onClearResults]);

  const goDetail = (item: SearchResultItem) => {
    if (item.kind === "movie") {
      navigate(`/moviedetail/movie/${item.id}`);
    } else {
      navigate(`/contentsdetail/${item.kind}/${item.id}`);
    }
    onClose();
  };

  useEffect(() => {
    inputRef.current?.focus();
    void onFetchTrendingKeywords(); // ✅ 실시간 인기 검색어 가져오기
  }, [onFetchTrendingKeywords]);

  const goFirstByKeyword = async (keyword: string) => {
    const q = keyword.trim();
    if (q.length < MIN_LEN) return;

    // ✅ 검색 확정 시점: 최근검색어 저장
    onAddTextTodo(q);

    const first = await fetchSearchAndGetFirst(q, 3);
    if (!first) return;

    goDetail(first);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1) typing 결과에서 선택된 게 있으면 그걸로 이동
    if (!showIdle && activeIndex >= 0 && activeIndex < visibleResults.length) {
      onAddTextTodo(trimmed);
      goDetail(visibleResults[activeIndex]);
      return;
    }

    // 2) 아니면 “첫 결과”로 이동
    await goFirstByKeyword(trimmed);
  };

  const clamp = (n: number, min: number, max: number) =>
    Math.max(min, Math.min(max, n));

  const getCounts = () => {
    if (showIdle) {
      const leftLen = Math.min(todos.length, 10);
      const rightLen = Math.min(trendingKeywords.length, 10);
      return { leftLen, rightLen };
    } else {
      const leftLen = visibleResults.length; // 이미 slice(0, 10) 했다면 최대 10
      const rightLen = Math.min(recommendedKeywords.length, 8);
      return { leftLen, rightLen };
    }
  };

  const moveToLeft = (leftLen: number) => {
    if (leftLen <= 0) return;
    setActiveIndex((prev) => {
      // 이미 왼쪽이면 유지(범위만 보정), 아니면 0으로
      if (prev >= 0 && prev < leftLen) return clamp(prev, 0, leftLen - 1);
      return 0;
    });
  };

  const moveToRight = (leftLen: number, rightLen: number) => {
    if (rightLen <= 0) return;
    setActiveIndex((prev) => {
      // 이미 오른쪽이면 유지(범위만 보정), 아니면 오른쪽 첫 칸으로
      const start = leftLen;
      const end = leftLen + rightLen - 1;
      if (prev >= start && prev <= end) return clamp(prev, start, end);
      return start;
    });
  };

  const moveUpDown = (dir: 1 | -1, leftLen: number, rightLen: number) => {
    const total = leftLen + rightLen;
    if (total <= 0) return;

    setActiveIndex((prev) => {
      // 아직 리스트 진입 전이면: ↓는 왼쪽 0, ↑는 왼쪽 마지막(있으면) / 없으면 오른쪽 마지막
      if (prev < 0) {
        if (dir === 1) return leftLen > 0 ? 0 : rightLen > 0 ? leftLen : -1;
        // dir === -1
        if (leftLen > 0) return leftLen - 1;
        if (rightLen > 0) return leftLen + rightLen - 1;
        return -1;
      }

      // 현재가 왼쪽 영역이면 왼쪽 안에서 순환
      if (prev < leftLen) {
        if (leftLen <= 0) return prev;
        const next = (prev + dir + leftLen) % leftLen;
        return next;
      }

      // 현재가 오른쪽 영역이면 오른쪽 안에서 순환
      const start = leftLen;
      if (rightLen <= 0) return prev;

      const local = prev - start;
      const nextLocal = (local + dir + rightLen) % rightLen;
      return start + nextLocal;
    });
  };

  const fireActive = async (leftLen: number) => {
    if (activeIndex < 0) return;

    // Idle: 왼쪽=recent, 오른쪽=trending
    if (showIdle) {
      if (activeIndex < leftLen) {
        const item = todos.slice(0, 10)[activeIndex];
        if (!item) return;
        setText(item.text);
        await goFirstByKeyword(item.text);
        return;
      } else {
        const idx = activeIndex - leftLen;
        const kw = trendingKeywords.slice(0, 10)[idx];
        if (!kw) return;
        setText(kw);
        await goFirstByKeyword(kw);
        return;
      }
    }

    // Typing: 왼쪽=results, 오른쪽=recommended
    if (activeIndex < leftLen) {
      const item = visibleResults[activeIndex];
      if (!item) return;
      onAddTextTodo(trimmed);
      goDetail(item);
      return;
    } else {
      const idx = activeIndex - leftLen;
      const kw = recommendedKeywords.slice(0, 8)[idx];
      if (!kw) return;
      setText(kw);
      await goFirstByKeyword(kw);
      return;
    }
  };

  const onKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    const { leftLen, rightLen } = getCounts();

    // 닫기
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
      return;
    }

    // 리스트 진입: Tab / ArrowDown
    // (SearchInputBar에서도 notInListYet일 때 onMoveToList(0)을 해주지만,
    //  여기서도 안전하게 한 번 더 처리해도 OK)
    if ((e.key === "Tab" || e.key === "ArrowDown") && activeIndex < 0) {
      if (leftLen + rightLen > 0) {
        e.preventDefault();
        moveToLeft(leftLen);
        return;
      }
    }

    if (e.key === "Tab" && activeIndex >= 0) {
      e.preventDefault();
      return;
    }

    // 왼쪽/오른쪽 이동
    if (e.key === "ArrowRight") {
      if (activeIndex >= 0) {
        e.preventDefault();
        moveToRight(leftLen, rightLen);
        return;
      }
    }

    if (e.key === "ArrowLeft") {
      if (activeIndex >= 0) {
        e.preventDefault();
        moveToLeft(leftLen);
        return;
      }
    }

    // 위/아래(현재 영역 안에서 순환)
    if (e.key === "ArrowDown") {
      if (leftLen + rightLen > 0) {
        e.preventDefault();
        moveUpDown(1, leftLen, rightLen);
        return;
      }
    }

    if (e.key === "ArrowUp") {
      if (leftLen + rightLen > 0) {
        e.preventDefault();
        moveUpDown(-1, leftLen, rightLen);
        return;
      }
    }

    // Enter: activeIndex 항목 실행
    if (e.key === "Enter") {
      if (activeIndex >= 0) {
        e.preventDefault();
        await fireActive(leftLen);
        return;
      }
      // activeIndex가 -1이면 기존 onSubmit 흐름(첫 결과 이동)로
    }
  };

  return (
    <div
      className="search-popup"
      role="dialog"
      aria-modal="true"
      aria-label="검색"
    >
      <div className="search-inner-wrap">
        <div className="close-bg">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            aria-label="검색창 닫기"
          >
            <img src="/images/button/btn-close.svg" alt="" />
          </button>
        </div>

        <div className="search-inner">
          <SearchInputBar
            value={text}
            onChange={(next) => {
              setText(next);
              setActiveIndex(-1);
              if (next.trim().length === 0) onClearResults();
            }}
            onSubmit={onSubmit}
            inputRef={inputRef}
            onMoveToList={(idx) => setActiveIndex(idx)}
            hasList={
              !showIdle
                ? visibleResults.length > 0
                : todos.length + trendingKeywords.length > 0
            }
            onKeyDown={onKeyDown}
            activeDescendantId={
              activeIndex < 0
                ? undefined
                : showIdle
                ? `idle-option-${activeIndex}`
                : `search-option-${activeIndex}`
            }
            activeIndex={activeIndex}
          />

          {showIdle ? (
            <SearchIdlePanel
              nowDate={nowDate}
              todos={todos}
              onRemoveAll={onRemoveAll}
              onRemoveTodo={onRemoveTodos}
              onSelectRecent={(keyword) => {
                setText(keyword);
                void goFirstByKeyword(keyword);
                inputRef.current?.focus();
              }}
              trendingKeywords={trendingKeywords}
              onSelectTrending={(keyword) => {
                setText(keyword);
                void goFirstByKeyword(keyword);
                inputRef.current?.focus();
              }}
              activeIndex={activeIndex}
              setActiveIndex={setActiveIndex}
              maxRecent={10}
              maxTrending={10}
            />
          ) : (
            <SearchTypingPanel
              query={text}
              loading={loading}
              results={visibleResults}
              recommendedKeywords={recommendedKeywords}
              activeIndex={activeIndex}
              setActiveIndex={setActiveIndex}
              onSelectResult={(item) => {
                onAddTextTodo(trimmed);
                goDetail(item);
              }}
              onSelectKeyword={(k) => {
                setText(k);
                void goFirstByKeyword(k);
                inputRef.current?.focus();
              }}
            />
          )}

          <div className="search-footer">
            <button
              type="button"
              onClick={() => {
                setText("");
                setActiveIndex(-1);
                onClearResults();
                inputRef.current?.focus();
              }}
            >
              검색 초기화
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchOverlay;
