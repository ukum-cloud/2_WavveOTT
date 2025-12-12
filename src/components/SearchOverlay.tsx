import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useMovieStore } from '../stores/useMovieStore';

type Movie = {
  id: number;
  title?: string;
  name?: string; // TV쪽 데이터 섞이면 name이 올 수도 있어서 대비
  overview?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
};

interface SearchIcon{
  isOpen: boolean;
  onClose: () => void;
}

const popularKeywords = [
  "액션",
  "로맨스",
  "스릴러",
  "코미디",
  "애니메이션",
  "드라마",
  "공포",
  "SF",
  "판타지",
];

const SearchOverlay = ({isOpen, onClose}: SearchIcon) => {
  const navigate = useNavigate();
  const {movies, onFetchPopular} = useMovieStore();
  const [keyword, setKeyword] = useState<Movie[]>([]);
  const {openPopup, setOpenPopup} = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  
  useEffect(() => {
    if(isOpen){
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [isOpen]);

  useEffect(() => {
    if(!movies || movies.length === 0){
      onFetchPopular?.();
    }
  }, [movies, onFetchPopular]);
  

  if (!isOpen) return null;

  return (
    <div className='pull-fit' onClick={onClose}>
      <div className="search-inner-wrap">
        <div className="search-inner">
          <div className="keyboard-box">
            <div className="keyboard-top">
              <input type="text" placeholder='장르, 제목, 배우로 검색해보세요.' />
              <p className="img-box">
                <img src="/images/icons/icon-search.svg" alt="검색" />
              </p>
            </div>
          </div>

          <div className="search-down">
            <div className="latest-searches-box">
              <div className="searches-title">
                <p className="title-left">최근 검색어</p>
                <button>전체삭제</button>
              </div>
              <ul className="latest-searches-list"></ul> 
            </div>
            <div className="popular-searches-box">
              <div className="searches-title">
                <p className="title-left">실시간 인기 검색어</p>
                <div className="date-box">
                  <p className="now-date"></p>
                  <p>기준</p>
                </div>
              </div>
              <ul className="popular-searches-list"></ul> 
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchOverlay