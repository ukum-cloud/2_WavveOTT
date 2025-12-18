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
import React, { useState } from "react";
// import { useSearchParams } from 'react-router-dom'
// import SearchInputBar from './SearchInputBar'
import { searchMulti } from "../api/tmdb";
import { useSearchStore } from "../stores/useSearchStore";
import { useNavigate } from "react-router-dom";

const SearchOverlay = () => {
  const navigate = useNavigate();
  //입력 상태 (UI 전용)
  const [keyword, setKeyword] = useState("");
  //검색 상태 & 액션 (Zustand)
  const { results, search } = useSearchStore();

  const onSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = keyword.trim();
    if (!trimmed) return;

    await search(trimmed);
  };

  const onClickResult = (item: any) => {
    //결과 클릭 시 상세 페이지 이동
    navigate(`/contentsdetail/${item.media_type}/${item.id}`);
  };

  return (
    <div className="search-popup">
      <div className="search-inner-wrap ">
        <div className="close-bg" aria-label="닫기"></div>
        {/* <SearchInputBar value={keyword}
          onChange={setKeyword} />
        2435345 */}
        <div className="search-inner">
          <form onSubmit={onSearch}>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="장르, 제목, 배우로 검색해보세요."
            />
            <button type="submit" onClick={onSearch}>
              검색
            </button>
          </form>

          <ul className="result-list">
            {/* {results.map((item) => (
              <li key={`${item.id}`}>
                {item.media_type === "movie" && `${item.title}`}
                {item.media_type === "tv" && `${item.name}`}
                {item.media_type === "person" && `${item.name}`}
              </li>
            ))} */}
            {results.map((item: any) => {
              const label =
                item.media_type === "movie" ? item.title : item.name;

              return (
                <li key={`${item.media_type}-${item.id}`}>
                  <button type="button" onClick={() => onClickResult(item)}>
                    <span className="badge">
                      {item.media_type === "movie" && "영화"}
                      {item.media_type === "tv" && "시리즈"}
                      {item.media_type === "person" && "인물"}
                    </span>
                    <span className="title">{label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SearchOverlay;
