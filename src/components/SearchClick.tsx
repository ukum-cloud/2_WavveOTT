import React from 'react'

const SearchClick = () => {
  return (
    <div>
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

export default SearchClick