import React, { useState } from "react";
import "./scss/Ticket.scss";

// 카드 데이터 타입 정의 (제목과 ID만)
interface CardData {
  id: number;
  title: string;
}

// FlippedStates 타입 정의
type FlippedStates = Record<number, boolean>;

// 웨이브 이용권 데이터 (4개)
const WAVE_CARD_DATA: CardData[] = [
  { id: 1, title: "광고형 스탠다드" },
  { id: 2, title: "베이직" },
  { id: 3, title: "스탠다드" },
  { id: 4, title: "프리미엄" },
];

// 더블 이용권 데이터 (5개)
const DOUBLE_CARD_DATA: CardData[] = [
  { id: 5, title: "더블 광고형 스탠다드" },
  { id: 6, title: "더블 슬림" },
  { id: 7, title: "더블 베이직" },
  { id: 8, title: "더블 광고형 스탠다드" },
  { id: 9, title: "더블 프리미엄" },
];

//  데이터 (3개)
const COALITION_CARD_DATA: CardData[] = [
  { id: 1, title: "베이직 X FLO 무제한" },
  { id: 2, title: "베이직 X 나라사랑카드" },
  { id: 2, title: "베이직 X Bugs 듣기" },
];

const Ticket: React.FC = () => {
  const [flippedStates, setFlippedStates] = useState<FlippedStates>({});

  const handleFlip = (id: number): void => {
    setFlippedStates((prev) => ({ ...prev, [id]: true }));
  };

  const handleMouseLeave = (id: number): void => {
    if (flippedStates[id]) {
      setFlippedStates((prev) => ({ ...prev, [id]: false }));
    }
  };

  // 스와이프 기능을 위한 함수
  const setupSwipe = (element: HTMLDivElement | null) => {
    if (!element) return;

    let startX = 0;
    let scrollLeft = 0;
    let isDown = false;

    const handleMouseDown = (e: MouseEvent) => {
      isDown = true;
      startX = e.pageX - element.offsetLeft;
      scrollLeft = element.scrollLeft;
    };

    const handleMouseLeave = () => {
      isDown = false;
    };

    const handleMouseUp = () => {
      isDown = false;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - element.offsetLeft;
      const walk = (x - startX) * 2;
      element.scrollLeft = scrollLeft - walk;
    };

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].pageX - element.offsetLeft;
      scrollLeft = element.scrollLeft;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const x = e.touches[0].pageX - element.offsetLeft;
      const walk = (x - startX) * 2;
      element.scrollLeft = scrollLeft - walk;
    };

    element.addEventListener("mousedown", handleMouseDown);
    element.addEventListener("mouseleave", handleMouseLeave);
    element.addEventListener("mouseup", handleMouseUp);
    element.addEventListener("mousemove", handleMouseMove);
    element.addEventListener("touchstart", handleTouchStart);
    element.addEventListener("touchmove", handleTouchMove);

    return () => {
      element.removeEventListener("mousedown", handleMouseDown);
      element.removeEventListener("mouseleave", handleMouseLeave);
      element.removeEventListener("mouseup", handleMouseUp);
      element.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("touchstart", handleTouchStart);
      element.removeEventListener("touchmove", handleTouchMove);
    };
  };

  return (
    <main className="ticket-wrap">
      <div className="inner">
        {/* 웨이브 이용권 섹션 */}
        <section>
          <h2>웨이브 이용권</h2>
          <div className="ticket-card-wrap">
            <div className="ticket-card-list" ref={setupSwipe}>
              {/* 카드 1 */}
              <div
                className={`list ${flippedStates[1] ? "flipped" : ""}`}
                onMouseLeave={() => handleMouseLeave(1)}
              >
                <div className="card-front">
                  <div className="front-top">
                    <span></span>
                    <button
                      className="btn-detail"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFlip(1);
                      }}
                    >
                      자세히 보기
                    </button>
                  </div>
                  <div className="front-header">
                    <h3>{WAVE_CARD_DATA[0].title}</h3>
                  </div>
                  <div className="front-content">
                    <div className="ticket-price">
                      <p className="period">
                        <span className="month">1개월</span>
                      </p>
                      <p className="coast-box">
                        <span className="text-coast">
                          <strong>5,500</strong>
                          <span>원</span>
                        </span>
                        <span className="text-total">(월 6,583원)</span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="card-back">
                  <ul>
                    <li>
                      <strong>동시 시청</strong>
                      <span>2대</span>
                    </li>
                    <li>
                      <strong>시청 가능 디바이스</strong>
                      <span>모든 디바이스</span>
                    </li>
                    <li>
                      <strong>화질</strong>
                      <span>FHD 화질 </span>
                    </li>
                    <li>
                      <strong>TV</strong>
                      <span>이용 가능</span>
                    </li>
                    <li>
                      <strong>광고</strong>
                      <span>있음</span>
                    </li>
                    <li>
                      <strong>모바일 다운로드</strong>
                      <span>15회</span>
                    </li>
                    <li>
                      <strong>QVOD 및 타임머신 기능</strong>
                      <span>QVOD Only</span>
                    </li>
                    <li>
                      <strong>30만편 이상의 VOD</strong>
                      <span>이용 가능</span>
                    </li>
                    <li>
                      <strong>100여개 실시간 라이브 채널</strong>
                      <span>이용 가능</span>
                    </li>
                    <li>
                      <strong>9천여편의 영화</strong>
                      <span>이용 가능</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* 카드 2 */}
              <div
                className={`list ${flippedStates[2] ? "flipped" : ""}`}
                onMouseLeave={() => handleMouseLeave(2)}
              >
                <div className="card-front">
                  <div className="front-top">
                    <span></span>
                    <button
                      className="btn-detail"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFlip(2);
                      }}
                    >
                      자세히 보기
                    </button>
                  </div>
                  <div className="front-header">
                    <h3>{WAVE_CARD_DATA[1].title}</h3>
                  </div>
                  <div className="front-content">
                    <div className="ticket-price">
                      <p className="period">
                        <span className="month">1개월</span>
                      </p>
                      <p className="coast-box">
                        <span className="text-coast">
                          <strong>7,900</strong>
                          <span>원</span>
                        </span>
                      </p>
                    </div>
                    <div className="ticket-price">
                      <p className="period">
                        <span className="month">12개월</span>
                        <span className="sale">16%</span>
                      </p>
                      <p className="coast-box">
                        <span className="text-coast">
                          <strong>79,000</strong>
                          <span>원</span>
                        </span>
                        <span className="text-total">(월 6,583원)</span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="card-back">
                  <ul>
                    <li>
                      <strong>동시 시청</strong>
                      <span>1대</span>
                    </li>
                    <li>
                      <strong>시청 가능 디바이스</strong>
                      <span>모든 디바이스</span>
                    </li>
                    <li>
                      <strong>화질</strong>
                      <span>HD 화질 </span>
                    </li>
                    <li>
                      <strong>TV</strong>
                      <span>-</span>
                    </li>
                    <li>
                      <strong>광고</strong>
                      <span>-</span>
                    </li>
                    <li>
                      <strong>모바일 다운로드</strong>
                      <span>무제한</span>
                    </li>
                    <li>
                      <strong>QVOD 및 타임머신 기능</strong>
                      <span>이용 가능</span>
                    </li>
                    <li>
                      <strong>30만편 이상의 VOD</strong>
                      <span>이용 가능</span>
                    </li>
                    <li>
                      <strong>100여개 실시간 라이브 채널</strong>
                      <span>이용 가능</span>
                    </li>
                    <li>
                      <strong>9천여편의 영화</strong>
                      <span>이용 가능</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* 카드 3 */}
              <div
                className={`list ${flippedStates[3] ? "flipped" : ""}`}
                onMouseLeave={() => handleMouseLeave(3)}
              >
                <div className="card-front">
                  <div className="front-top">
                    <span className="badge">추천</span>
                    <button
                      className="btn-detail"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFlip(3);
                      }}
                    >
                      자세히 보기
                    </button>
                  </div>
                  <div className="front-header">
                    <h3>{WAVE_CARD_DATA[2].title}</h3>
                  </div>
                  <div className="front-content">
                    <div className="ticket-price">
                      <p className="period">
                        <span className="month">1개월</span>
                      </p>
                      <p className="coast-box">
                        <span className="text-coast">
                          <strong>10,900</strong>
                          <span>원</span>
                        </span>
                      </p>
                    </div>
                    <div className="ticket-price">
                      <p className="period">
                        <span className="month">12개월</span>
                        <span className="sale">16%</span>
                      </p>
                      <p className="coast-box">
                        <span className="text-coast">
                          <strong>109,000</strong>
                          <span>원</span>
                        </span>
                        <span className="text-total">(월 9,083원)</span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="card-back">
                  <ul>
                    <li>
                      <strong>동시 시청</strong>
                      <span>2대</span>
                    </li>
                    <li>
                      <strong>시청 가능 디바이스</strong>
                      <span>모든 디바이스</span>
                    </li>
                    <li>
                      <strong>화질</strong>
                      <span>FHD 화질 </span>
                    </li>
                    <li>
                      <strong>TV</strong>
                      <span>이용 가능</span>
                    </li>
                    <li>
                      <strong>광고</strong>
                      <span>-</span>
                    </li>
                    <li>
                      <strong>모바일 다운로드</strong>
                      <span>무제한</span>
                    </li>
                    <li>
                      <strong>QVOD 및 타임머신 기능</strong>
                      <span>이용 가능</span>
                    </li>
                    <li>
                      <strong>30만편 이상의 VOD</strong>
                      <span>이용 가능</span>
                    </li>
                    <li>
                      <strong>100여개 실시간 라이브 채널</strong>
                      <span>이용 가능</span>
                    </li>
                    <li>
                      <strong>9천여편의 영화</strong>
                      <span>이용 가능</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* 카드 4 */}
              <div
                className={`list ${flippedStates[4] ? "flipped" : ""}`}
                onMouseLeave={() => handleMouseLeave(4)}
              >
                <div className="card-front">
                  <div className="front-top">
                    <span></span>
                    <button
                      className="btn-detail"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFlip(4);
                      }}
                    >
                      자세히 보기
                    </button>
                  </div>
                  <div className="front-header">
                    <h3>{WAVE_CARD_DATA[3].title}</h3>
                  </div>
                  <div className="front-content">
                    <div className="ticket-price">
                      <p className="period">
                        <span className="month">1개월</span>
                      </p>
                      <p className="coast-box">
                        <span className="text-coast">
                          <strong>13,900</strong>
                          <span>원</span>
                        </span>
                      </p>
                    </div>
                    <div className="ticket-price">
                      <p className="period">
                        <span className="month">12개월</span>
                        <span className="sale">16%</span>
                      </p>
                      <p className="coast-box">
                        <span className="text-coast">
                          <strong>139,000</strong>
                          <span>원</span>
                        </span>
                        <span className="text-total">(월 11,583원)</span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="card-back">
                  <ul>
                    <li>
                      <strong>동시 시청</strong>
                      <span>4대</span>
                    </li>
                    <li>
                      <strong>시청 가능 디바이스</strong>
                      <span>모든 디바이스</span>
                    </li>
                    <li>
                      <strong>화질</strong>
                      <span>최고 화질 </span>
                    </li>
                    <li>
                      <strong>TV</strong>
                      <span>이용 가능</span>
                    </li>
                    <li>
                      <strong>광고</strong>
                      <span>-</span>
                    </li>
                    <li>
                      <strong>모바일 다운로드</strong>
                      <span>무제한</span>
                    </li>
                    <li>
                      <strong>QVOD 및 타임머신 기능</strong>
                      <span>이용 가능</span>
                    </li>
                    <li>
                      <strong>30만편 이상의 VOD</strong>
                      <span>이용 가능</span>
                    </li>
                    <li>
                      <strong>100여개 실시간 라이브 채널</strong>
                      <span>이용 가능</span>
                    </li>
                    <li>
                      <strong>9천여편의 영화</strong>
                      <span>이용 가능</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 더블 이용권 섹션 */}
        <section>
          <h2 className="withLogo">더블 이용권</h2>
          <div className="ticket-card-wrap">
            <div className="ticket-card-list" ref={setupSwipe}>
              {/* 카드 5 */}
              <div
                className={`list ${flippedStates[5] ? "flipped" : ""}`}
                onMouseLeave={() => handleMouseLeave(5)}
              >
                <div className="card-front">
                  <div className="front-top">
                    <span className="badge">추천</span>
                    <button
                      className="btn-detail"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFlip(5);
                      }}
                    >
                      자세히 보기
                    </button>
                  </div>
                  <div className="front-header">
                    <h3>{DOUBLE_CARD_DATA[0].title}</h3>
                  </div>
                  <div className="front-content">
                    <div className="ticket-price">
                      <p className="period">
                        <span className="month">1개월</span>
                      </p>
                      <p className="coast-box">
                        <span className="text-coast">
                          <strong>7,000</strong>
                          <span>원</span>
                        </span>
                      </p>
                    </div>
                    <div className="ticket-brand">
                      <span className="icon-wave">광고형 스탠다드</span>
                      <span className="icon-tving">광고형 스탠다드</span>
                    </div>
                  </div>
                </div>
                <div className="card-back">
                  <ul>
                    <li>
                      <strong>동시 시청</strong>
                      <span>2대</span>
                    </li>
                    <li>
                      <strong>시청 가능 디바이스</strong>
                      <span>모든 디바이스</span>
                    </li>
                    <li>
                      <strong>화질</strong>
                      <span>
                        웨이브:FHD 화질
                        <br />
                        티빙:고화질
                      </span>
                    </li>
                    <li>
                      <strong>TV</strong>
                      <span>이용 가능</span>
                    </li>
                    <li>
                      <strong>광고</strong>
                      <span>있음</span>
                    </li>
                    <li>
                      <strong>모바일 다운로드</strong>
                      <span>15회</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* 카드 6 */}
              <div
                className={`list ${flippedStates[6] ? "flipped" : ""}`}
                onMouseLeave={() => handleMouseLeave(6)}
              >
                <div className="card-front">
                  <div className="front-top">
                    <span></span>
                    <button
                      className="btn-detail"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFlip(6);
                      }}
                    >
                      자세히 보기
                    </button>
                  </div>

                  <div className="front-header">
                    <h3>{DOUBLE_CARD_DATA[1].title}</h3>
                  </div>
                  <div className="front-content">
                    <div className="ticket-price">
                      <p className="period">
                        <span className="month">1개월</span>
                      </p>
                      <p className="coast-box">
                        <span className="text-coast">
                          <strong>9,500</strong>
                          <span>원</span>
                        </span>
                      </p>
                    </div>
                    <div className="ticket-brand">
                      <span className="icon-wave">베이직</span>
                      <span className="icon-tving">광고형 스탠다드</span>
                    </div>
                  </div>
                </div>
                <div className="card-back">
                  <ul>
                    <li>
                      <strong>동시 시청</strong>
                      <span>웨이브 - 1대 / 티빙 - 2대</span>
                    </li>
                    <li>
                      <strong>시청 가능 디바이스</strong>
                      <span>모든 디바이스</span>
                    </li>
                    <li>
                      <strong>화질</strong>
                      <span>
                        웨이브: HD 화질
                        <br />
                        티빙: 고화질{" "}
                      </span>
                    </li>
                    <li>
                      <strong>TV</strong>
                      <span>티빙 Only</span>
                    </li>
                    <li>
                      <strong>광고</strong>
                      <span>있음</span>
                    </li>
                    <li>
                      <strong>모바일 다운로드</strong>
                      <span>
                        웨이브 - 무제한
                        <br />
                        티빙 - 15회
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* 카드 7 */}
              <div
                className={`list ${flippedStates[7] ? "flipped" : ""}`}
                onMouseLeave={() => handleMouseLeave(7)}
              >
                <div className="card-front">
                  <div className="front-top">
                    <span className="badge">추천</span>
                    <button
                      className="btn-detail"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFlip(7);
                      }}
                    >
                      자세히 보기
                    </button>
                  </div>
                  <div className="front-header">
                    <h3>{DOUBLE_CARD_DATA[2].title}</h3>
                  </div>
                  <div className="front-content">
                    <div className="ticket-price">
                      <p className="period">
                        <span className="month">1개월</span>
                      </p>
                      <p className="coast-box">
                        <span className="text-coast">
                          <strong>13,500</strong>
                          <span>원</span>
                        </span>
                      </p>
                    </div>
                    <div className="ticket-brand">
                      <span className="icon-wave">베이직</span>
                      <span className="icon-tving">베이직</span>
                    </div>
                  </div>
                </div>
                <div className="card-back">
                  <ul>
                    <li>
                      <strong>동시 시청</strong>
                      <span>1대</span>
                    </li>
                    <li>
                      <strong>시청 가능 디바이스</strong>
                      <span>모든 디바이스</span>
                    </li>
                    <li>
                      <strong>화질</strong>
                      <span>
                        웨이브: HD 화질
                        <br />
                        티빙: 일반화질
                      </span>
                    </li>
                    <li>
                      <strong>TV</strong>
                      <span>티빙 Only</span>
                    </li>
                    <li>
                      <strong>광고</strong>
                      <span>있음</span>
                    </li>
                    <li>
                      <strong>모바일 다운로드</strong>
                      <span>
                        웨이브 - 무제한
                        <br />
                        티빙 - 200회
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* 카드 8 */}
              <div
                className={`list ${flippedStates[8] ? "flipped" : ""}`}
                onMouseLeave={() => handleMouseLeave(8)}
              >
                <div className="card-front">
                  <div className="front-top">
                    <span></span>
                    <button
                      className="btn-detail"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFlip(8);
                      }}
                    >
                      자세히 보기
                    </button>
                  </div>
                  <div className="front-header">
                    <h3>{DOUBLE_CARD_DATA[3].title}</h3>
                  </div>
                  <div className="front-content">
                    <div className="ticket-price">
                      <p className="period">
                        <span className="month">1개월</span>
                      </p>
                      <p className="coast-box">
                        <span className="text-coast">
                          <strong>15,000</strong>
                          <span>원</span>
                        </span>
                      </p>
                    </div>
                    <div className="ticket-brand">
                      <span className="icon-wave">스탠다드</span>
                      <span className="icon-tving">스탠다드</span>
                    </div>
                  </div>
                </div>
                <div className="card-back">
                  <ul>
                    <li>
                      <strong>동시 시청</strong>
                      <span>2대</span>
                    </li>
                    <li>
                      <strong>시청 가능 디바이스</strong>
                      <span>모든 디바이스</span>
                    </li>
                    <li>
                      <strong>화질</strong>
                      <span>
                        웨이브: FHD 화질
                        <br />
                        티빙: 고화질
                      </span>
                    </li>
                    <li>
                      <strong>TV</strong>
                      <span>이용 가능</span>
                    </li>
                    <li>
                      <strong>광고</strong>
                      <span>있음</span>
                    </li>
                    <li>
                      <strong>모바일 다운로드</strong>
                      <span>
                        웨이브 - 무제한
                        <br />
                        티빙 - 300회
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* 카드 9 */}
              <div
                className={`list ${flippedStates[9] ? "flipped" : ""}`}
                onMouseLeave={() => handleMouseLeave(9)}
              >
                <div className="card-front">
                  <div className="front-top">
                    <span></span>
                    <button
                      className="btn-detail"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFlip(9);
                      }}
                    >
                      자세히 보기
                    </button>
                  </div>
                  <div className="front-header">
                    <h3>{DOUBLE_CARD_DATA[4].title}</h3>
                  </div>
                  <div className="front-content">
                    <div className="ticket-price">
                      <p className="period">
                        <span className="month">1개월</span>
                      </p>
                      <p className="coast-box">
                        <span className="text-coast">
                          <strong>19,500</strong>
                          <span>원</span>
                        </span>
                      </p>
                    </div>
                    <div className="ticket-brand">
                      <span className="icon-wave">스탠다드</span>
                      <span className="icon-tving">스탠다드</span>
                    </div>
                  </div>
                </div>
                <div className="card-back">
                  <ul>
                    <li>
                      <strong>동시 시청</strong>
                      <span>2대</span>
                    </li>
                    <li>
                      <strong>시청 가능 디바이스</strong>
                      <span>모든 디바이스</span>
                    </li>
                    <li>
                      <strong>화질</strong>
                      <span>
                        웨이브: 최고화질
                        <br />
                        티빙: 고화질(4K 일부)
                      </span>
                    </li>
                    <li>
                      <strong>TV</strong>
                      <span>이용 가능</span>
                    </li>
                    <li>
                      <strong>광고</strong>
                      <span>있음</span>
                    </li>
                    <li>
                      <strong>모바일 다운로드</strong>
                      <span>
                        웨이브 - 무제한
                        <br />
                        티빙 - 400회
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section>
          <h2>제휴 이용권</h2>
          <div className="ticket-card-wrap">
            <div className="ticket-card-list">
              <div className="list">
                {/* 1 */}
                <div className="card-front">
                  <div className="front-top jc">
                    <span className="badge">추천</span>
                  </div>
                  <div className="front-header">
                    <h3>{COALITION_CARD_DATA[0].title}</h3>
                  </div>
                  <div className="front-content">
                    <div className="ticket-price">
                      <p className="period">
                        <span className="month">1개월</span>
                      </p>
                      <p className="coast-box">
                        <span className="text-coast">
                          <strong>13,750</strong>
                          <span>원</span>
                        </span>
                      </p>
                    </div>
                    <div className="ticket-brand">
                      <span className="pd-none">동시시청 1대</span>
                      <span className="pd-none">HD화질</span>
                      <span className="pd-none">무제한 다운로드</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="list">
                {/* 2 */}
                <div className="card-front">
                  <div className="front-top"></div>
                  <div className="front-header">
                    <h3>{COALITION_CARD_DATA[1].title}</h3>
                  </div>
                  <div className="front-content">
                    <div className="ticket-price">
                      <p className="period">
                        <span className="month">1개월</span>
                      </p>
                      <p className="coast-box">
                        <span className="text-coast">
                          <del>7,900</del>
                          <strong>6,700</strong>
                          <span>원</span>
                        </span>
                        <span className="text-total">(월 6,583원)</span>
                      </p>
                    </div>
                    <div className="ticket-brand">
                      <span className="pd-none">동시시청 1대</span>
                      <span className="pd-none">
                        모든 디바이스 (TV 시청 제한)
                      </span>
                      <span className="pd-none">HD화질</span>
                      <span className="pd-none">무제한 다운로드</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="list">
                {/* 3 */}
                <div className="card-front">
                  <div className="front-top"></div>
                  <div className="front-header">
                    <h3>{COALITION_CARD_DATA[2].title}</h3>
                  </div>
                  <div className="front-content">
                    <div className="ticket-price">
                      <p className="period">
                        <span className="month">1개월</span>
                      </p>
                      <p className="coast-box">
                        <span className="text-coast">
                          <strong>13,750</strong>
                          <span>원</span>
                        </span>
                      </p>
                    </div>
                    <div className="ticket-brand">
                      <span className="pd-none">동시시청 1대</span>
                      <span className="pd-none">
                        모든 디바이스 (TV 시청 제한)
                      </span>
                      <span className="pd-none">HD화질</span>
                      <span className="pd-none">무제한 다운로드</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Ticket;
