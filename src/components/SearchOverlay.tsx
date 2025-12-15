import React, { useEffect, useMemo, useState } from 'react'
import "./scss/SearchOverlay.scss";
import { useSearchStore } from '../stores/useSearchStore';

interface Props{
  onClose: () => void;
}

const recommendKeywords = [
  "지금 우리는",
  "지금 사랑하는 사람과 살고 있습니까",
  "지금 만나러",
  "지금부터",
  "지금 한가할깡?",
  "지금부터 스트리밍을 시작",
  "청춘은 바로 지금",
  "해결사님은 지금",
];

const SearchOverlay = ({ onClose }: Props) => {
  const [text, setText] = useState("");
  const [nowDate, setNowDate] = useState<string>("");
  const {todos, onAddTextTodo, onRemoveTodos, onRemoveAll} = useSearchStore();


  const trimmed = text.trim();
  const isTyping = trimmed.length > 0;

  const previewList = useMemo(() => {
    if (!isTyping) return [];
    // 일단 “추천키워드”에서 자동완성처럼 보이게 (나중에 TMDB 결과로 교체 가능)
    return recommendKeywords
      .filter((k) => k.includes(trimmed))
      .slice(0, 10);
  }, [isTyping, trimmed]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trimmed) return;
    onAddTextTodo(trimmed);
    setText("");
  }

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

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

    update(); // 최초 1회
    const timer = setInterval(update, 60000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className='search-popup' role="dialog" aria-modal="true">
      <div className="search-inner-wrap">
        <div className="close-bg" onClick={onClose} aria-label="닫기"></div>
        
        <div className="search-inner">
          <div className="keyboard-box">
            <form className="keyboard-top" name="search" onSubmit={handleSubmit}>
              <input
                type="text" placeholder='장르, 제목, 배우로 검색해보세요.'
                className='font-wave' id="search" value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <button type="submit" className="img-box" aria-label="검색">
                <img src="/images/icons/icon-search.svg" alt="검색" />
              </button>
            </form>
            {/* 입력중일 때만 자동완성(왼쪽 리스트) + 추천칩(오른쪽) */}
            {isTyping && (
              <div className="typing-panel">
                <ul className="preview-list">
                  {previewList.map((t) => (
                    <li key={t}>
                      <button
                        type="button"
                        onClick={() => setText(t)}
                        className="preview-item"
                      >
                        {t}
                      </button>
                    </li>
                  ))}
                </ul>

                <div className="recommend-box">
                  <p className="recommend-title">추천 검색어</p>
                  <div className="chips">
                    {recommendKeywords.slice(0, 8).map((k) => (
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

          {/* ✅ 기본 화면(입력 없을 때): 최근검색어/실시간 인기 */}
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
                          <img
                            src="/images/icons/icon-search-remove.svg"
                            alt=""
                          />
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
                  {recommendKeywords.slice(0, 10).map((t, i) => (
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
  )
}

export default SearchOverlay