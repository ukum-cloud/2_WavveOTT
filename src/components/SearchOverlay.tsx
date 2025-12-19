import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import SearchInputBar from "./SearchInputBar";
import SearchTypingPanel from "./SearchTypingPanel";
import SearchIdlePanel from "./SearchIdlePanel";

import { useSearchStore } from "../stores/useSearchStore";
import type { MultiItem } from "../api/tmdb";
import type { Search } from "../types/searchtodo";
import "./scss/SearchOverlay.scss";

interface Props {
  onClose: () => void;
}

const DEBOUNCE_MS = 300;
const MIN_LEN = 2;

type Column = "left" | "right";

// 예시: 추천(오른쪽) 키워드 — 실제 프로젝트에선 API/상수/스토어로 교체 가능
const DEFAULT_RECOMMENDED = [
  "킹덤",
  "오징어 게임",
  "아이유",
  "해리포터",
  "마블",
  "유재석",
  "런닝맨",
  "스파이더맨",
];

// 예시: Idle(오른쪽 실시간 인기) 키워드 — 실제 프로젝트에선 API/스토어로 교체 가능
const DEFAULT_TRENDING = [
  "서울의 봄",
  "무빙",
  "비질란테",
  "범죄도시",
  "콘크리트 유토피아",
  "플레이어",
  "약한영웅",
  "스위트홈",
  "더 글로리",
  "런닝맨",
];

const SearchOverlay = ({ onClose }: Props) => {
  const navigate = useNavigate();

  const [keyword, setKeyword] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const [column, setColumn] = useState<Column>("left");

  const [todos, setTodos] = useState<Search[]>([]);
  //검색 상태 & 액션 (Zustand)
  const { results, search, loading, error, hasSearched, clear } =
    useSearchStore();

  const inputRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const nowDate = useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(
      2,
      "0"
    )}.${String(d.getDate()).padStart(2, "0")}`;
  }, []);

  const recommendedKeywords = useMemo(() => DEFAULT_RECOMMENDED, []);
  const trendingKeywords = useMemo(() => DEFAULT_TRENDING, []);

  // typing(검색 중) 패널에서 보여줄 결과(상위 N개)
  const visibleResults = useMemo(() => results.slice(0, 10), [results]);
  const rightKeywords = useMemo(
    () => recommendedKeywords.slice(0, 8),
    [recommendedKeywords]
  );

  // Idle 패널에서 보여줄 항목(상위 N개)
  const recentMax = 10;
  const trendingMax = 10;

  const idleRecent = useMemo(() => todos.slice(0, recentMax), [todos]);
  const idleTrending = useMemo(
    () => trendingKeywords.slice(0, trendingMax),
    [trendingKeywords]
  );

  // 패널 분기
  const trimmed = keyword.trim();
  const showIdlePanel = trimmed.length === 0;
  const showTypingPanel = trimmed.length > 0;

  // --- (A) aria 연결: combobox는 "typing 결과 listbox"를 기준으로 연결(기존 구조 유지)
  const leftLenForAria = visibleResults.length;
  const leftOptionId = (idx: number) => `search-option-${idx}`;

  const activeDescendantId =
    showTypingPanel && activeIndex >= 0 && activeIndex < leftLenForAria
      ? leftOptionId(activeIndex)
      : undefined;

  const handleChangeKeyword = (next: string) => {
    setKeyword(next);

    // 키워드가 바뀌는 그 순간에 파생 상태를 함께 초기화
    setColumn("left");
    setActiveIndex(-1);

    // 입력을 다 지웠을 때 Idle로 돌리기(기존 effect 대신 여기서 처리)
    if (next.trim().length === 0 && hasSearched) {
      clear();
    }
  };

  // --- (B) 디바운스 자동검색
  useEffect(() => {
    const q = keyword.trim();
    if (q.length < MIN_LEN) return;

    const timer = window.setTimeout(() => {
      search(q, 3);
    }, DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [keyword, search]);

  const lengths = useMemo(() => {
    if (showIdlePanel) {
      return { left: idleRecent.length, right: idleTrending.length };
    }
    return { left: visibleResults.length, right: rightKeywords.length };
  }, [
    showIdlePanel,
    idleRecent.length,
    idleTrending.length,
    visibleResults.length,
    rightKeywords.length,
  ]);

  const totalLen = lengths.left + lengths.right;

  const addRecent = (text: string) => {
    const t = text.trim();
    if (!t) return;
    setTodos((prev) => {
      const withoutDup = prev.filter((x) => x.text !== t);
      return [{ id: Date.now(), text: t }, ...withoutDup].slice(0, 20);
    });
  };

  const onRemoveAll = () => setTodos([]);
  const onRemoveTodo = (id: number) =>
    setTodos((prev) => prev.filter((x) => x.id !== id));

  const getRowFromIndex = (idx: number, col: Column) => {
    if (idx < 0) return 0;

    if (col === "left") {
      const max = Math.max(0, lengths.left - 1);
      return Math.min(idx, max);
    }

    const max = Math.max(0, lengths.right - 1);
    return Math.min(Math.max(0, idx - lengths.left), max);
  };

  const toIndex = (col: Column, row: number) => {
    if (col === "left") return row;
    return lengths.left + row;
  };

  const moveVertical = (delta: number) => {
    const max = column === "left" ? lengths.left : lengths.right;
    if (max === 0) return;

    const row = getRowFromIndex(activeIndex, column);
    const nextRow = (row + delta + max) % max;
    setActiveIndex(toIndex(column, nextRow));
  };

  const switchColumn = (next: Column) => {
    if (next === column) return;

    const max = next === "left" ? lengths.left : lengths.right;
    if (max === 0) return; // 옮길 컬럼에 항목이 없으면 이동 X

    const row = getRowFromIndex(activeIndex, column);
    const clampedRow = Math.min(row, max - 1);

    setColumn(next);
    setActiveIndex(toIndex(next, clampedRow));
  };

  const selectActive = async () => {
    if (totalLen === 0 || activeIndex < 0) return;

    // 1) Idle: left=recent, right=trending
    if (showIdlePanel) {
      if (activeIndex < lengths.left) {
        const text = idleRecent[activeIndex]?.text;
        if (!text) return;

        setKeyword(text);
        addRecent(text);
        // Idle/Typing에서 Enter로 선택 → 상세 이동
        await goFirstResultByKeyword(text);
        return;
      }

      const k = idleTrending[activeIndex - lengths.left];
      if (!k) return;

      setKeyword(k);
      addRecent(k);
      await goFirstResultByKeyword(k); // ✅ Enter/검색이면 상세로 이동
      return;
    }

    // 2) Typing: left=results, right=recommended
    if (activeIndex < lengths.left) {
      const item = visibleResults[activeIndex];
      if (!item) return;
      goDetail(item); // ✅ 검색 결과 선택 → 상세 이동
      return;
    }

    const k = rightKeywords[activeIndex - lengths.left];
    if (!k) return;

    setKeyword(k);
    addRecent(k);
    await goFirstResultByKeyword(k); // ✅ 추천 키워드 선택 → 첫 결과로 상세 이동
  };

  const onMoveToList = (index: number) => {
    if (totalLen === 0) return;

    const max = column === "left" ? lengths.left : lengths.right;
    if (max === 0) return;

    if (index === 9999) {
      setActiveIndex(toIndex(column, max - 1));
      return;
    }
    setActiveIndex(toIndex(column, 0));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const q = keyword.trim();
    if (q.length < MIN_LEN) return;

    // ✅ 선택이 있으면 선택 우선
    if (activeIndex >= 0 && totalLen > 0) {
      await selectActive();
      return;
    }

    // ✅ 선택이 없으면: 최근검색어에 저장 후 이동
    addRecent(q);
    await goFirstResultByKeyword(q);
  };

  // --- (J) input key handler (포커스는 input 유지)
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
      return;
    }

    // 이동 대상 없으면 종료
    if (totalLen === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      moveVertical(+1);
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      moveVertical(-1);
      return;
    }

    if (e.key === "ArrowRight") {
      e.preventDefault();
      switchColumn("right");
      return;
    }

    if (e.key === "ArrowLeft") {
      e.preventDefault();
      switchColumn("left");
      return;
    }

    if (e.key === "Tab") {
      e.preventDefault();
      if (e.shiftKey) switchColumn("left");
      else switchColumn("right");
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();

      if (activeIndex >= 0 && totalLen > 0) {
        void selectActive(); // await 써도 되고 void로 fire-and-forget도 OK
        return;
      }

      void goFirstResultByKeyword(keyword);
      return;
    }

    if (e.key === "Home") {
      e.preventDefault();
      const max = column === "left" ? lengths.left : lengths.right;
      if (max > 0) setActiveIndex(toIndex(column, 0));
      return;
    }

    if (e.key === "End") {
      e.preventDefault();
      const max = column === "left" ? lengths.left : lengths.right;
      if (max > 0) setActiveIndex(toIndex(column, max - 1));
      return;
    }
  };

  const goDetail = (item: MultiItem) => {
    const type = item.media_type;
    const id = item.id;

    if (type === "movie") {
      navigate(`/moviedetail/${type}/${id}`);
    } else {
      navigate(`/contentsdetail/${type}/${id}`);
    }

    onClose();
  };

  const goFirstResultByKeyword = async (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;

    // ✅ 최근 검색어 저장
    addRecent(trimmed);

    const { results: latest } = useSearchStore.getState();
    if (latest.length === 0) {
      await search(trimmed, 3);
    }

    const { results: refreshed } = useSearchStore.getState();
    const first = refreshed[0];
    if (!first) return;

    goDetail(first);
  };

  return (
    <div
      className="search-popup"
      role="dialog"
      aria-modal="true"
      aria-label="검색"
    >
      <div className="search-inner-wrap ">
        <div className="close-bg" aria-label="검색창 닫기">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          >
            <img src="/images/button/btn-close.svg" alt="검색창 닫기 버튼" />
          </button>
        </div>

        <div className="search-inner">
          <SearchInputBar
            value={keyword}
            onChange={handleChangeKeyword}
            onSubmit={onSubmit}
            inputRef={inputRef}
            onMoveToList={onMoveToList}
            hasList={totalLen > 0}
            onKeyDown={onKeyDown}
            activeDescendantId={activeDescendantId}
            activeIndex={activeIndex}
          />

          {/* 상태 분기 UI */}
          <div className="search-body">
            {showIdlePanel && (
              <SearchIdlePanel
                nowDate={nowDate}
                todos={todos}
                trendingKeywords={trendingKeywords}
                onRemoveAll={onRemoveAll}
                onRemoveTodo={onRemoveTodo}
                onSelectRecent={(text) => {
                  setKeyword(text);
                  addRecent(text);
                  search(text, 3);
                  inputRef.current?.focus();
                }}
                onSelectTrending={(k) => {
                  setKeyword(k);
                  addRecent(k);
                  search(k, 3);
                  inputRef.current?.focus();
                }}
                activeIndex={activeIndex}
                setActiveIndex={setActiveIndex}
                maxRecent={recentMax}
                maxTrending={trendingMax}
              />
            )}

            {showTypingPanel && !loading && error && (
              <div className="error-panel" role="alert">
                <p>오류가 발생했습니다.</p>
                <p className="error-msg">{error}</p>
                <div className="error-actions">
                  <button
                    type="button"
                    onClick={() => search(keyword.trim(), 3)}
                  >
                    다시 시도
                  </button>
                  <button type="button" onClick={clear}>
                    초기화
                  </button>
                </div>
              </div>
            )}

            {/* typing panel: 결과/로딩/추천 */}
            {showTypingPanel && !error && (
              <SearchTypingPanel
                query={keyword}
                loading={loading}
                results={visibleResults}
                recommendedKeywords={rightKeywords}
                activeIndex={activeIndex}
                setActiveIndex={setActiveIndex}
                onSelectResult={(item) => {
                  addRecent(keyword);
                  goDetail(item);
                }}
                onSelectKeyword={(k) => {
                  setKeyword(k);
                  addRecent(k);
                  search(k, 3);
                  inputRef.current?.focus();
                }}
              />
            )}
          </div>
          <div className="search-footer">
            <button
              type="button"
              onClick={() => {
                clear();
                setKeyword("");
                setActiveIndex(-1);
                setColumn("left");
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
