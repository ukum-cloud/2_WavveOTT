import React, { useEffect, useState } from 'react'
import "./scss/SearchOverlay.scss";
import { useSearchStore } from '../stores/useSearchStore';

interface Props{
  onClose: () => void;
}

const SearchOverlay = ({ onClose }: Props) => {
  const [text, setText] = useState("");
  const {todos, onAddTextTodo, onRemoveTodos, onRemoveAll} = useSearchStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddTextTodo(text);
    setText("");
  }

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [])

  return (
    <div className='search-popup'>
      <div className="search-inner-wrap">
        <div className="close-bg" onClick={onClose}></div>
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
            <ul className="search-preview">
              <li className='write-text'>
                <ul></ul>
              </li>
              <li className="hashtag"></li>
            </ul>
          </div>

          <div className="search-bottom">
            <div className="latest-searches-box bottom-search-box">
              <div className="searches-title">
                <p className="title-left font-wave">최근 검색어</p>
                <button onClick={onRemoveAll}>전체삭제</button>
              </div>
              <ul className="latest-searches-list">
                {todos.map((todo) => (
                  <li key={todo.id}>
                    <span>{todo.text}</span>
                    <button onClick={() => onRemoveTodos(todo.id)}>
                      <img src="/images/icons/icon-search-remove.svg" alt="삭제" />
                    </button>
                  </li>
                ))}
              </ul> 
            </div>

            <div className="popular-searches-box bottom-search-box">
              <div className="searches-title">
                <p className="title-left font-wave">실시간 인기 검색어</p>
                <div className="date-box">
                  <p className="now-date"></p>
                  <p>기준</p>
                </div>
              </div>
              <ul className="popular-searches-list">
                {/* <li>
                  <button>
                    <span className="rank"></span>
                  </button>
                </li> */}
              </ul>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  )
}

export default SearchOverlay