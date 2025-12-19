// import React, { useEffect, useMemo, useRef, useState } from "react";
// import "./scss/SearchOverlay.scss";
// import { useNavigate } from "react-router-dom";
// import { useSearchStore } from "../stores/useSearchStore";
// import type { SearchKind } from "../types/searchtodo";
// import type { NavItem, NavSection } from "../types/searchNav";

// import SearchInputBar from "./SearchInputBar";
// import SearchTypingPanel from "./SearchTypingPanel";
// import SearchIdlePanel from "./SearchIdlePanel";

// interface Props {
//   onClose: () => void;
// }

// const SearchOverlay = ({ onClose }: Props) => {
//   const navigate = useNavigate();

//   const {
//     todos,
//     onAddTextTodo,
//     onRemoveTodos,
//     onRemoveAll,

//     results,
//     loading,
//     onFetchSearch,
//     onClearResults,

//     trendingKeywords,
//     onFetchTrendingKeywords,

//     fetchSearchAndGetFirst,
//   } = useSearchStore();

//   const [text, setText] = useState("");
//   const [nowDate, setNowDate] = useState("");
//   const [hasSearched, setHasSearched] = useState(false);

//   const [activeIndex, setActiveIndex] = useState(-1);

//   const inputRef = useRef<HTMLInputElement | null>(null);
//   const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);

//   const isTyping = text.trim().length > 0;

//   /** 배경 스크롤 막기 */
//   useEffect(() => {
//     const prev = document.body.style.overflow;
//     document.body.style.overflow = "hidden";
//     return () => {
//       document.body.style.overflow = prev;
//     };
//   }, []);

//   /** 트렌딩 키워드 최초 로드 (없을 때만) */
//   useEffect(() => {
//     if (!trendingKeywords.length) {
//       void onFetchTrendingKeywords();
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   /** 현재 시간 표시 */
//   useEffect(() => {
//     const update = () => {
//       const d = new Date();
//       const yyyy = d.getFullYear();
//       const mm = String(d.getMonth() + 1).padStart(2, "0");
//       const dd = String(d.getDate()).padStart(2, "0");
//       const hh = String(d.getHours()).padStart(2, "0");
//       const mi = String(d.getMinutes()).padStart(2, "0");
//       setNowDate(`${yyyy}.${mm}.${dd} ${hh}:${mi}`);
//     };
//     // update();
//     const t = window.setInterval(update, 1000 * 10);
//     return () => window.clearInterval(t);
//   }, []);

//   /** 자동완성 preview: 최근검색어 + 트렌딩 중 query 포함 (시작일치 우선) */
//   const previewList = useMemo(() => {
//     const q = text.trim().toLowerCase();
//     if (!q) return [];

//     const recent = todos.map((t) => t.text);
//     const pool = Array.from(new Set([...recent, ...trendingKeywords]));

//     const filtered = pool.filter((s) => s.toLowerCase().includes(q));

//     filtered.sort((a, b) => {
//       const A = a.toLowerCase();
//       const B = b.toLowerCase();
//       const aStarts = A.startsWith(q) ? 1 : 0;
//       const bStarts = B.startsWith(q) ? 1 : 0;
//       if (aStarts !== bStarts) return bStarts - aStarts;
//       if (A.length !== B.length) return A.length - B.length;
//       return A.localeCompare(B);
//     });

//     return filtered.slice(0, 10);
//   }, [text, todos, trendingKeywords]);

//   /** 키워드로 상세 이동: store의 첫 결과를 가져와 이동 */
//   const goDetailByKeyword = async (keyword: string) => {
//     const trimmed = keyword.trim();
//     if (!trimmed) return;

//     setText(trimmed);
//     onAddTextTodo(trimmed);

//     setHasSearched(true);

//     const first = await fetchSearchAndGetFirst(trimmed);
//     if (!first) return;

//     if (first.kind === "movie") navigate(`/moviedetail/movie/${first.id}`);
//     else navigate(`/contentsdetail/${first.kind}/${first.id}`);

//     onClose();
//   };

//   /** 결과로 상세 이동 */
//   const goDetailByResult = (label: string, kind: SearchKind, id: number) => {
//     setText(label);
//     onAddTextTodo(label);

//     if (kind === "movie") navigate(`/moviedetail/movie/${id}`);
//     else navigate(`/contentsdetail/${kind}/${id}`);

//     onClose();
//   };

//   /** submit(검색 버튼/Enter): store 검색 실행 */
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const q = text.trim();
//     if (!q) return;

//     onAddTextTodo(q);
//     setHasSearched(true);

//     await onFetchSearch(q);

//     // 검색 실행 후 리스트 진입 준비
//     setActiveIndex(-1);
//   };

//   /** 입력이 비면 idle로 돌아가면서 검색 상태 리셋 */
//   useEffect(() => {
//     if (!isTyping) {
//       setHasSearched(false);
//       setActiveIndex(-1);
//       onClearResults();
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [isTyping]);

//   /**
//    * 키보드 이동 대상(navItems) 만들기
//    * - typing + 검색 전: left=preview, right=빈배열(원하면 오른쪽 추천리스트 넣기)
//    * - typing + 검색 후: left=results, right=빈배열(원하면 오른쪽 관련콘텐츠/인물 리스트 넣기)
//    * - idle: left=recent, right=trending
//    */
//   const navItems: NavItem[] = useMemo(() => {
//     if (isTyping && hasSearched) {
//       if (loading) return [];
//       const left = results.map((r) => ({
//         type: "result" as const,
//         label: r.label,
//         kind: r.kind,
//         id: r.id,
//         section: "left" as const,
//       }));
//       const right = trendingKeywords.slice(0, 8).map((k) => ({
//         type: "keyword" as const,
//         label: k,
//         section: "right" as const,
//       }));
//       return [...left, ...right];
//     }

//     if (isTyping && !hasSearched) {
//       const left = previewList.map((k) => ({
//         type: "keyword" as const,
//         label: k,
//         section: "left" as const,
//       }));
//       const right = trendingKeywords.slice(0, 8).map((k) => ({
//         type: "keyword" as const,
//         label: k,
//         section: "right" as const,
//       }));
//       return [...left, ...right];
//     }

//     // idle...
//     const left = todos.map((t) => ({
//       type: "keyword" as const,
//       label: t.text,
//       section: "left" as const,
//     }));
//     const right = trendingKeywords.slice(0, 8).map((k) => ({
//       type: "keyword" as const,
//       label: k,
//       section: "right" as const,
//     }));
//     return [...left, ...right];
//   }, [
//     isTyping,
//     hasSearched,
//     loading,
//     results,
//     previewList,
//     todos,
//     trendingKeywords,
//   ]);

//   /** ===== 키보드 포커스 이동 유틸 ===== */
//   const focusToInput = () => {
//     setActiveIndex(-1);
//     requestAnimationFrame(() => inputRef.current?.focus());
//   };

//   const focusToList = (idx: number) => {
//     if (!navItems.length) return;
//     const next = Math.min(Math.max(idx, 0), navItems.length - 1);
//     setActiveIndex(next);
//     requestAnimationFrame(() => itemRefs.current[next]?.focus());
//   };

//   const setItemRef = (idx: number, el: HTMLButtonElement | null) => {
//     itemRefs.current[idx] = el;
//   };

//   /** navItems section 첫/마지막 인덱스 */
//   const firstIndexOf = (section: NavSection) =>
//     navItems.findIndex((x) => x.section === section);
//   const lastIndexOf = (section: NavSection) => {
//     for (let i = navItems.length - 1; i >= 0; i--) {
//       if (navItems[i].section === section) return i;
//     }
//     return -1;
//   };

//   const moveToSection = (section: NavSection) => {
//     const idx = firstIndexOf(section);
//     if (idx < 0) return;
//     setActiveIndex(idx);
//     requestAnimationFrame(() => itemRefs.current[idx]?.focus());
//   };

//   /** activeIndex 이동(순환) */
//   const moveActive = (delta: number) => {
//     if (!navItems.length) return;
//     setActiveIndex((prev) => {
//       const next = prev < 0 ? 0 : prev + delta;
//       const wrapped =
//         next < 0 ? navItems.length - 1 : next >= navItems.length ? 0 : next;
//       requestAnimationFrame(() => itemRefs.current[wrapped]?.focus());
//       return wrapped;
//     });
//   };

//   const activateItem = (idx: number) => {
//     const item = navItems[idx];
//     if (!item) return;

//     if (item.type === "keyword") {
//       void goDetailByKeyword(item.label);
//     } else {
//       goDetailByResult(item.label, item.kind, item.id);
//     }
//   };

//   /** input에서 Tab/방향키로 리스트 진입 */
//   const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (!navItems.length) return;

//     if (e.key === "Tab" || e.key === "ArrowDown") {
//       e.preventDefault();
//       const idx = firstIndexOf("left");
//       focusToList(idx >= 0 ? idx : 0);
//       return;
//     }

//     if (e.key === "ArrowUp") {
//       e.preventDefault();
//       const idx = lastIndexOf("left");
//       focusToList(idx >= 0 ? idx : navItems.length - 1);
//       return;
//     }
//   };

//   /** 리스트 버튼 공통 키다운(왼쪽/오른쪽 둘 다 적용) */
//   const onItemKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
//     if (e.key === "ArrowDown") {
//       e.preventDefault();
//       moveActive(1);
//     }
//     if (e.key === "ArrowUp") {
//       e.preventDefault();
//       moveActive(-1);
//     }
//     if (e.key === "Enter") {
//       e.preventDefault();
//       activateItem(safeActiveIndex);
//     }
//     if (e.key === "Escape") {
//       e.preventDefault();
//       focusToInput();
//     }

//     // 섹션 이동 (오른쪽도 키보드 적용 핵심)
//     if (e.key === "ArrowRight") {
//       e.preventDefault();
//       moveToSection("right");
//     }
//     if (e.key === "ArrowLeft") {
//       e.preventDefault();
//       moveToSection("left");
//     }

//     // Tab을 섹션 이동으로 쓰고 싶다면
//     if (e.key === "Tab") {
//       e.preventDefault();
//       if (e.shiftKey) moveToSection("left");
//       else moveToSection("right");
//     }
//   };

//   const safeActiveIndex =
//     navItems.length === 0
//       ? -1
//       : Math.min(Math.max(activeIndex, 0), navItems.length - 1);

//   const activeDescendantId =
//     safeActiveIndex >= 0 ? `nav-${safeActiveIndex}` : undefined;

//   // useEffect(() => {
//   // // navItems가 바뀌면 ref를 “현재 길이 기준”으로 정리
//   //   itemRefs.current = itemRefs.current.slice(0, navItems.length);

//   //   // activeIndex가 범위를 벗어나면 리셋
//   //   setActiveIndex((prev) => {
//   //     if (navItems.length === 0) return -1;
//   //     if (prev < 0) return -1;
//   //     if (prev > navItems.length - 1) return -1;
//   //     return prev;
//   //   });
//   // }, [navItems.length]);

//   return (
//     <div className="search-popup" role="dialog" aria-modal="true">
//       <div className="search-inner-wrap">
//         <div className="close-bg" onClick={onClose} aria-label="닫기" />
//         <div className="search-inner">
//           <div className="keyboard-box">
//             <div className="close-wrap">
//               <button
//                 className="close-btn-box"
//                 onClick={onClose}
//                 aria-label="닫기"
//               >
//                 <img src="/images/button/btn-close.svg" alt="닫기 버튼" />
//               </button>
//             </div>
//             <SearchInputBar
//               value={text}
//               onChange={setText}
//               onSubmit={handleSubmit}
//               inputRef={inputRef}
//               hasList={navItems.length > 0}
//               onMoveToList={(idx) => focusToList(idx)}
//               onKeyDown={handleInputKeyDown}
//               activeDescendantId={activeDescendantId}
//             />

//             {isTyping ? (
//               <SearchTypingPanel
//                 query={text}
//                 hasSearched={hasSearched}
//                 loading={loading}
//                 results={results}
//                 previewList={previewList}
//                 onClickKeyword={goDetailByKeyword}
//                 // 키보드 공통 props
//                 navItems={navItems}
//                 activeIndex={safeActiveIndex}
//                 setActiveIndex={setActiveIndex}
//                 setItemRef={setItemRef}
//                 onItemKeyDown={onItemKeyDown}
//                 activateItem={activateItem}
//                 trendingKeywords={trendingKeywords}
//               />
//             ) : (
//               <SearchIdlePanel
//                 nowDate={nowDate}
//                 todos={todos}
//                 trendingKeywords={trendingKeywords}
//                 onRemoveAll={onRemoveAll}
//                 onRemoveTodo={onRemoveTodos}
//                 onClickKeyword={goDetailByKeyword}
//                 // 키보드 공통 props
//                 navItems={navItems}
//                 activeIndex={safeActiveIndex}
//                 setActiveIndex={setActiveIndex}
//                 setItemRef={setItemRef}
//                 onItemKeyDown={onItemKeyDown}
//                 activateItem={activateItem}
//                 focusToInput={focusToInput}
//               />
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SearchOverlay;
// import React, { useEffect, useMemo, useRef, useState } from "react";
// import "./scss/SearchOverlay.scss";
// import { useNavigate } from "react-router-dom";

// import { useSearchStore } from "../stores/useSearchStore";
// import type { SearchKind } from "../types/searchtodo";
// import type { NavItem, NavSection } from "../types/searchNav";

// import SearchInputBar from "./SearchInputBar";
// import SearchTypingPanel from "./SearchTypingPanel";
// import SearchIdlePanel from "./SearchIdlePanel";

// interface Props {
//   onClose: () => void;
// }

// const SearchOverlay = ({ onClose }: Props) => {
//   const navigate = useNavigate();

//   const {
//     todos,
//     onAddTextTodo,
//     onRemoveTodos,
//     onRemoveAll,

//     results,
//     loading,
//     onFetchSearch,
//     onClearResults,

//     trendingKeywords,
//     onFetchTrendingKeywords,

//     fetchSearchAndGetFirst,
//   } = useSearchStore();

//   const [text, setText] = useState("");
//   const [nowDate, setNowDate] = useState("");
//   const [hasSearched, setHasSearched] = useState(false);
//   const [activeIndex, setActiveIndex] = useState(-1);

//   const inputRef = useRef<HTMLInputElement | null>(null);
//   const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);

//   const isTyping = text.trim().length > 0;

//   // 배경 스크롤 방지
//   useEffect(() => {
//     const prev = document.body.style.overflow;
//     document.body.style.overflow = "hidden";
//     return () => {
//       document.body.style.overflow = prev;
//     };
//   }, []);

//   // trending 최초 로드
//   useEffect(() => {
//     if (!trendingKeywords.length) void onFetchTrendingKeywords();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // 날짜 표시
//   useEffect(() => {
//     const update = () => {
//       const d = new Date();
//       const yyyy = d.getFullYear();
//       const mm = String(d.getMonth() + 1).padStart(2, "0");
//       const dd = String(d.getDate()).padStart(2, "0");
//       const hh = String(d.getHours()).padStart(2, "0");
//       const mi = String(d.getMinutes()).padStart(2, "0");
//       setNowDate(`${yyyy}.${mm}.${dd} ${hh}:${mi}`);
//     };
//     update();
//     const t = window.setInterval(update, 1000 * 10);
//     return () => window.clearInterval(t);
//   }, []);

//   // 입력 중 자동완성 preview (최근 + trending)
//   const previewList = useMemo(() => {
//     const q = text.trim().toLowerCase();
//     if (!q) return [];
//     const recent = todos.map((t) => t.text);
//     const pool = Array.from(new Set([...recent, ...trendingKeywords]));
//     const filtered = pool.filter((s) => s.toLowerCase().includes(q));

//     filtered.sort((a, b) => {
//       const A = a.toLowerCase();
//       const B = b.toLowerCase();
//       const aStarts = A.startsWith(q) ? 1 : 0;
//       const bStarts = B.startsWith(q) ? 1 : 0;
//       if (aStarts !== bStarts) return bStarts - aStarts;
//       return A.localeCompare(B);
//     });

//     return filtered.slice(0, 10);
//   }, [text, todos, trendingKeywords]);

//   const goDetail = (kind: SearchKind, id: number, label: string) => {
//     setText(label);
//     onAddTextTodo(label);
//     navigate(`/contentsdetail/${kind}/${id}`);
//     onClose();
//   };

//   const goDetailByKeyword = async (keyword: string) => {
//     const trimmed = keyword.trim();
//     if (!trimmed) return;

//     setText(trimmed);
//     onAddTextTodo(trimmed);
//     setHasSearched(true);

//     // 원하는 페이지 수(예: 3페이지)
//     const first = await fetchSearchAndGetFirst(trimmed, 3);
//     if (!first) return;

//     navigate(`/contentsdetail/${first.kind}/${first.id}`);
//     onClose();
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const q = text.trim();
//     if (!q) return;

//     onAddTextTodo(q);
//     setHasSearched(true);

//     // ✅ multi 페이지 수(원하는 만큼)
//     await onFetchSearch(q, 3);

//     setActiveIndex(-1);
//   };

//   // 입력 비면 idle 복귀
//   useEffect(() => {
//     if (!isTyping) {
//       setHasSearched(false);
//       setActiveIndex(-1);
//       onClearResults();
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [isTyping]);

//   // navItems 구성
//   const navItems: NavItem[] = useMemo(() => {
//     const right = trendingKeywords.slice(0, 8).map((k) => ({
//       type: "keyword" as const,
//       label: k,
//       section: "right" as const,
//     }));

//     if (isTyping && hasSearched) {
//       if (loading) return right;
//       const left = results.map((r) => ({
//         type: "result" as const,
//         label: r.label,
//         kind: r.kind,
//         id: r.id,
//         section: "left" as const,
//       }));
//       return [...left, ...right];
//     }

//     if (isTyping && !hasSearched) {
//       const left = previewList.map((k) => ({
//         type: "keyword" as const,
//         label: k,
//         section: "left" as const,
//       }));
//       return [...left, ...right];
//     }

//     const left = todos.map((t) => ({
//       type: "keyword" as const,
//       label: t.text,
//       section: "left" as const,
//     }));
//     return [...left, ...right];
//   }, [
//     isTyping,
//     hasSearched,
//     loading,
//     results,
//     previewList,
//     todos,
//     trendingKeywords,
//   ]);

//   // focus helpers
//   const setItemRef = (idx: number, el: HTMLButtonElement | null) => {
//     itemRefs.current[idx] = el;
//   };

//   const focusToInput = () => {
//     setActiveIndex(-1);
//     requestAnimationFrame(() => inputRef.current?.focus());
//   };

//   const focusToList = (idx: number) => {
//     if (!navItems.length) return;
//     const next = Math.min(Math.max(idx, 0), navItems.length - 1);
//     setActiveIndex(next);
//     requestAnimationFrame(() => itemRefs.current[next]?.focus());
//   };

//   const firstIndexOf = (section: NavSection) =>
//     navItems.findIndex((x) => x.section === section);
//   const lastIndexOf = (section: NavSection) => {
//     for (let i = navItems.length - 1; i >= 0; i--)
//       if (navItems[i].section === section) return i;
//     return -1;
//   };

//   const safeActiveIndex =
//     navItems.length === 0
//       ? -1
//       : Math.min(Math.max(activeIndex, 0), navItems.length - 1);

//   const activateItem = (idx: number) => {
//     const item = navItems[idx];
//     if (!item) return;
//     if (item.type === "keyword") void goDetailByKeyword(item.label);
//     else goDetail(item.kind, item.id, item.label);
//   };

//   const moveToSection = (section: NavSection) => {
//     const idx = firstIndexOf(section);
//     if (idx >= 0) focusToList(idx);
//   };

//   const moveActive = (delta: number) => {
//     if (!navItems.length) return;
//     setActiveIndex((prev) => {
//       const next = prev < 0 ? 0 : prev + delta;
//       const wrapped =
//         next < 0 ? navItems.length - 1 : next >= navItems.length ? 0 : next;
//       requestAnimationFrame(() => itemRefs.current[wrapped]?.focus());
//       return wrapped;
//     });
//   };

//   // input keydown (리스트 진입)
//   const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (!navItems.length) return;

//     if (e.key === "Tab" || e.key === "ArrowDown") {
//       e.preventDefault();
//       const idx = firstIndexOf("left");
//       focusToList(idx >= 0 ? idx : 0);
//       return;
//     }

//     if (e.key === "ArrowUp") {
//       e.preventDefault();
//       const idx = lastIndexOf("left");
//       focusToList(idx >= 0 ? idx : navItems.length - 1);
//       return;
//     }
//   };

//   // item keydown
//   const onItemKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
//     if (e.key === "ArrowDown") {
//       e.preventDefault();
//       moveActive(1);
//       return;
//     }
//     if (e.key === "ArrowUp") {
//       e.preventDefault();
//       moveActive(-1);
//       return;
//     }
//     if (e.key === "Enter") {
//       e.preventDefault();
//       activateItem(safeActiveIndex);
//       return;
//     }
//     if (e.key === "Escape") {
//       e.preventDefault();
//       focusToInput();
//       return;
//     }
//     if (e.key === "ArrowRight") {
//       e.preventDefault();
//       moveToSection("right");
//       return;
//     }
//     if (e.key === "ArrowLeft") {
//       e.preventDefault();
//       moveToSection("left");
//       return;
//     }
//     if (e.key === "Tab") {
//       e.preventDefault();
//       if (e.shiftKey) moveToSection("left");
//       else moveToSection("right");
//     }
//   };

//   const activeDescendantId =
//     safeActiveIndex >= 0 ? `nav-${safeActiveIndex}` : undefined;

//   return (
//     <div className="search-popup" role="dialog" aria-modal="true">
//       <div className="search-inner-wrap">
//         <div className="close-bg" onClick={onClose} aria-label="닫기" />
//         <div className="search-inner">
//           <div className="keyboard-box">
//             <div className="close-wrap">
//               <button
//                 className="close-btn-box"
//                 onClick={onClose}
//                 aria-label="닫기"
//               >
//                 <img src="/images/button/btn-close.svg" alt="닫기 버튼" />
//               </button>
//             </div>

//             <SearchInputBar
//               value={text}
//               onChange={setText}
//               onSubmit={handleSubmit}
//               inputRef={inputRef}
//               hasList={navItems.length > 0}
//               onMoveToList={(idx) => focusToList(idx)}
//               onKeyDown={handleInputKeyDown}
//               activeDescendantId={activeDescendantId}
//             />

//             {isTyping ? (
//               <SearchTypingPanel
//                 query={text}
//                 hasSearched={hasSearched}
//                 loading={loading}
//                 results={results}
//                 previewList={previewList}
//                 onClickKeyword={goDetailByKeyword}
//                 navItems={navItems}
//                 activeIndex={safeActiveIndex}
//                 setActiveIndex={setActiveIndex}
//                 setItemRef={setItemRef}
//                 onItemKeyDown={onItemKeyDown}
//                 activateItem={activateItem}
//                 trendingKeywords={trendingKeywords}
//               />
//             ) : (
//               <SearchIdlePanel
//                 nowDate={nowDate}
//                 todos={todos}
//                 trendingKeywords={trendingKeywords}
//                 onRemoveAll={onRemoveAll}
//                 onRemoveTodo={onRemoveTodos}
//                 onClickKeyword={goDetailByKeyword}
//                 navItems={navItems}
//                 activeIndex={safeActiveIndex}
//                 setActiveIndex={setActiveIndex}
//                 setItemRef={setItemRef}
//                 onItemKeyDown={onItemKeyDown}
//                 activateItem={activateItem}
//                 focusToInput={focusToInput}
//               />
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SearchOverlay;
//store/useSearchStore
//components/SearchOverlay
import React, { useEffect, useMemo, useRef, useState } from "react";
// import { useSearchParams } from 'react-router-dom'
// import SearchInputBar from './SearchInputBar'
// import { searchMulti } from "../api/tmdb";
import { useSearchStore } from "../stores/useSearchStore";
import { useNavigate } from "react-router-dom";

type MultiItem = {
  id: number;
  media_type: "movie" | "tv" | "person" | string;
  title?: string;
  name?: string;
  popularity?: number;
};

interface Props {
  onClose: () => void;
}

const SearchOverlay = ({ onClose }: Props) => {
  const navigate = useNavigate();

  //입력 상태 (UI 전용)
  const [keyword, setKeyword] = useState("");

  // 키보드 네비게이션 상태
  const [activeIndex, setActiveIndex] = useState(-1);

  //검색 상태 & 액션 (Zustand)
  const { results, search, loading, error, hasSearched, clear } =
    useSearchStore();

  const inputRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // 결과 라벨(표시용) 만들기
  const getLabel = (item: MultiItem) => {
    if (item.media_type === "movie") return item.title ?? "";
    return item.name ?? "";
  };

  const getBadge = (type: string) => {
    if (type === "movie") return "영화";
    if (type === "tv") return "시리즈";
    if (type === "person") return "인물";
    return type;
  };

  // (선택) 결과를 최대 N개만 보여주고 싶으면 여기서 slice
  const visibleResults = useMemo(() => results.slice(0, 10), [results]);

  // 검색 실행(Enter 또는 버튼)
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await search(keyword, 3); // 최대 3페이지 (원하면 2~5로 조절)
  };

  // 화면 분기 플래그
  const showIdle = !hasSearched;
  const showLoading = hasSearched && loading;
  const showError = hasSearched && !loading && !!error;
  const showEmpty = hasSearched && !loading && !error && results.length === 0;
  const showResults = hasSearched && !loading && !error && results.length > 0;

  // listbox/option id (aria-activedescendant용)
  const listboxId = "search-listbox";
  const optionId = (idx: number) => `search-option-${idx}`;
  const activeDescendantId =
    showResults && activeIndex >= 0 ? optionId(activeIndex) : undefined;

  // const onSearch = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   search(keyword, 3);

  //   const trimmed = keyword.trim();
  //   if (!trimmed) return;

  //   await search(trimmed);
  // };

  const onClickResult = (item: MultiItem) => {
    if (item.media_type === "movie") {
      navigate(`/moviedetail/movie/${item.id}`);
    } else {
      navigate(`/contentsdetail/${item.media_type}/${item.id}`);
    }
    onClose();
  };

  // 결과가 새로 갱신되면(새 검색) 첫 항목을 활성화
  useEffect(() => {
    if (showResults) {
      setActiveIndex(visibleResults.length > 0 ? 0 : -1);
    } else {
      setActiveIndex(-1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showResults, visibleResults.length]);

  // 입력이 비면 검색 상태 초기화 + activeIndex 초기화
  useEffect(() => {
    if (keyword.trim().length === 0 && hasSearched) {
      clear();
      setActiveIndex(-1);
    }
  }, [keyword, hasSearched, clear]);

  // 키보드 네비게이션
  const moveActive = (delta: number) => {
    const len = visibleResults.length;
    if (!showResults || len === 0) return;

    setActiveIndex((prev) => {
      const base = prev < 0 ? 0 : prev;
      const next = (base + delta + len) % len; // 위/아래 순환
      return next;
    });
  };

  const selectActive = () => {
    if (!showResults) return;
    if (activeIndex < 0 || activeIndex >= visibleResults.length) return;
    onClickResult(visibleResults[activeIndex] as any);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // 닫기
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
      return;
    }

    if (!showResults || visibleResults.length === 0) {
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault(); // 커서 이동 방지
      moveActive(+1);
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      moveActive(-1);
      return;
    }

    if (e.key === "Tab") {
      e.preventDefault();
      if (e.shiftKey) moveActive(-1);
      else moveActive(+1);
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();

      if (activeIndex < 0 && visibleResults.length > 0) {
        setActiveIndex(0);
        onClickResult(visibleResults[0] as any);
        return;
      }

      selectActive();
      return;
    }
  };

  return (
    <div
      className="search-popup"
      role="dialog"
      aria-modal="true"
      aria-label="검색"
    >
      <div className="search-inner-wrap ">
        {/* <div className="close-bg" aria-label="닫기"></div> */}
        {/* 배경 클릭 닫기 */}
        <button
          type="button"
          className="close-bg"
          aria-label="닫기"
          onClick={onClose}
        />
        {/* <SearchInputBar value={keyword}
          onChange={setKeyword} />
        2435345 */}
        <div className="search-inner">
          {/* 🔍 입력 */}
          <form className="keyboard-top" onSubmit={onSubmit} role="search">
            <input
              ref={inputRef}
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="장르, 제목, 배우로 검색해보세요."
              role="combobox"
              aria-autocomplete="list"
              aria-expanded={showResults}
              aria-controls={listboxId}
              aria-activedescendant={activeDescendantId}
            />
            <button type="submit" aria-label="검색">
              검색
            </button>
          </form>

          {/* 상태 분기 UI */}
          <div className="search-body">
            {/* 1) 검색 전(Idle) */}
            {showIdle && (
              <div className="idle-panel">
                <p className="hint">검색어를 입력하면 결과가 표시됩니다.</p>
                <p className="sub-hint">예: “킹덤”, “아이유”, “해리포터”</p>
              </div>
            )}

            {/* 2) 로딩 */}
            {showLoading && (
              <div className="loading-panel" role="status" aria-live="polite">
                <p>검색 중...</p>
              </div>
            )}

            {/* 3) 에러 */}
            {showError && (
              <div className="error-panel" role="alert">
                <p>오류가 발생했습니다.</p>
                <p className="error-msg">{error}</p>

                <div className="error-actions">
                  <button type="button" onClick={() => search(keyword, 3)}>
                    다시 시도
                  </button>
                  <button type="button" onClick={clear}>
                    초기화
                  </button>
                </div>
              </div>
            )}

            {showEmpty && (
              <div className="empty-panel">
                <p>검색 결과가 없습니다.</p>
                <p className="sub-hint">다른 키워드로 검색해보세요.</p>
              </div>
            )}

            {/* 5) 결과 리스트 */}
            {showResults && (
              <ul className="result-list" id={listboxId} role="listbox">
                {visibleResults.map((item: any, idx: number) => {
                  const label = getLabel(item);
                  const isActive = idx === activeIndex;

                  return (
                    <li
                      key={`${item.media_type}-${item.id}`}
                      id={optionId(idx)}
                      role="option"
                      aria-selected={isActive}
                    >
                      <button
                        type="button"
                        className={`preview-item ${
                          isActive ? "is-active" : ""
                        }`}
                        onClick={() => onClickResult(item)}
                        // 버튼 자체는 포커스 안 옮기고, input이 계속 포커스 유지하는 설계
                        tabIndex={-1}
                      >
                        <span className="badge">
                          {getBadge(item.media_type)}
                        </span>
                        <span className="title">{label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchOverlay;
