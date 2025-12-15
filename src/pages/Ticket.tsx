import React, { useState } from 'react';
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
  { id: 1, title: '베이직 이용권' },
  { id: 2, title: '스탠다드 이용권' },
  { id: 3, title: '프리미엄 이용권' },
  { id: 4, title: '패밀리 이용권' }
];

// 더블 이용권 데이터 (5개)
const DOUBLE_CARD_DATA: CardData[] = [
  { id: 5, title: '학생 이용권' },
  { id: 6, title: '비즈니스 이용권' },
  { id: 7, title: 'VIP 이용권' },
  { id: 8, title: '월간 이용권' },
  { id: 9, title: '연간 이용권' }
];

const Ticket: React.FC = () => {
  const [flippedStates, setFlippedStates] = useState<FlippedStates>({});

  const handleFlip = (id: number): void => {
    setFlippedStates(prev => ({ ...prev, [id]: true }));
  };

  const handleMouseLeave = (id: number): void => {
    if (flippedStates[id]) {
      setFlippedStates(prev => ({ ...prev, [id]: false }));
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

    element.addEventListener('mousedown', handleMouseDown);
    element.addEventListener('mouseleave', handleMouseLeave);
    element.addEventListener('mouseup', handleMouseUp);
    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('touchstart', handleTouchStart);
    element.addEventListener('touchmove', handleTouchMove);

    return () => {
      element.removeEventListener('mousedown', handleMouseDown);
      element.removeEventListener('mouseleave', handleMouseLeave);
      element.removeEventListener('mouseup', handleMouseUp);
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
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
                className={`list ${flippedStates[1] ? 'flipped' : ''}`}
                onMouseLeave={() => handleMouseLeave(1)}
              >
                <div className="card-front">
                  <button 
                    className='btn xsmall secondary-line'
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFlip(1);
                    }}
                  >
                    자세히 보기
                  </button>
                  <h3>{WAVE_CARD_DATA[0].title}</h3>

                </div>
                <div className="card-back">
                  <ul>
                    <li><strong>동시 시청</strong><span>2대</span></li>
                    <li><strong>시청 가능 디바이스</strong><span>모든 디바이스</span></li>
                    <li><strong>화질</strong><span>FHD 화질 </span></li>
                    <li><strong>TV</strong><span>이용 가능</span></li>
                    <li><strong>광고</strong><span>있음</span></li>
                    <li><strong>모바일 다운로드</strong><span>15회</span></li>
                    <li><strong>QVOD 및 타임머신 기능</strong><span>QVOD Only</span></li>
                    <li><strong>30만편 이상의 VOD</strong><span>이용 가능</span></li>
                    <li><strong>100여개 실시간 라이브 채널</strong><span>이용 가능</span></li>
                    <li><strong>9천여편의 영화</strong><span>이용 가능</span></li>
                  </ul>
                </div>
              </div>

              {/* 카드 2 */}
              <div
                className={`list ${flippedStates[2] ? 'flipped' : ''}`}
                onMouseLeave={() => handleMouseLeave(2)}
              >
                <div className="card-front">
                  <button 
                    className='btn xsmall secondary-line'
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFlip(2);
                    }}
                  >
                    자세히 보기
                  </button>
                  <h3>{WAVE_CARD_DATA[1].title}</h3>

                </div>
                <div className="card-back">
                  <ul>
                    <li><strong>동시 시청</strong><span>2대</span></li>
                    <li><strong>시청 가능 디바이스</strong><span>모든 디바이스</span></li>
                    <li><strong>화질</strong><span>FHD 화질 </span></li>
                    <li><strong>TV</strong><span>이용 가능</span></li>
                    <li><strong>광고</strong><span>있음</span></li>
                    <li><strong>모바일 다운로드</strong><span>15회</span></li>
                    <li><strong>QVOD 및 타임머신 기능</strong><span>QVOD Only</span></li>
                    <li><strong>30만편 이상의 VOD</strong><span>이용 가능</span></li>
                    <li><strong>100여개 실시간 라이브 채널</strong><span>이용 가능</span></li>
                    <li><strong>9천여편의 영화</strong><span>이용 가능</span></li>
                  </ul>
                </div>
              </div>

              {/* 카드 3 */}
              <div
                className={`list ${flippedStates[3] ? 'flipped' : ''}`}
                onMouseLeave={() => handleMouseLeave(3)}
              >
                <div className="card-front">
                  <button 
                    className='btn xsmall secondary-line'
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFlip(3);
                    }}
                  >
                    자세히 보기
                  </button>
                  <h3>{WAVE_CARD_DATA[2].title}</h3>

                </div>
                <div className="card-back">
                  <ul>
                    <li><strong>동시 시청</strong><span>2대</span></li>
                    <li><strong>시청 가능 디바이스</strong><span>모든 디바이스</span></li>
                    <li><strong>화질</strong><span>FHD 화질 </span></li>
                    <li><strong>TV</strong><span>이용 가능</span></li>
                    <li><strong>광고</strong><span>있음</span></li>
                    <li><strong>모바일 다운로드</strong><span>15회</span></li>
                    <li><strong>QVOD 및 타임머신 기능</strong><span>QVOD Only</span></li>
                    <li><strong>30만편 이상의 VOD</strong><span>이용 가능</span></li>
                    <li><strong>100여개 실시간 라이브 채널</strong><span>이용 가능</span></li>
                    <li><strong>9천여편의 영화</strong><span>이용 가능</span></li>
                  </ul>
                </div>
              </div>

              {/* 카드 4 */}
              <div
                className={`list ${flippedStates[4] ? 'flipped' : ''}`}
                onMouseLeave={() => handleMouseLeave(4)}
              >
                <div className="card-front">
                  <button 
                    className='btn xsmall secondary-line'
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFlip(4);
                    }}
                  >
                    자세히 보기
                  </button>
                  <h3>{WAVE_CARD_DATA[3].title}</h3>

                </div>
                <div className="card-back">
                  <ul>
                    <li><strong>동시 시청</strong><span>2대</span></li>
                    <li><strong>시청 가능 디바이스</strong><span>모든 디바이스</span></li>
                    <li><strong>화질</strong><span>FHD 화질 </span></li>
                    <li><strong>TV</strong><span>이용 가능</span></li>
                    <li><strong>광고</strong><span>있음</span></li>
                    <li><strong>모바일 다운로드</strong><span>15회</span></li>
                    <li><strong>QVOD 및 타임머신 기능</strong><span>QVOD Only</span></li>
                    <li><strong>30만편 이상의 VOD</strong><span>이용 가능</span></li>
                    <li><strong>100여개 실시간 라이브 채널</strong><span>이용 가능</span></li>
                    <li><strong>9천여편의 영화</strong><span>이용 가능</span></li>
                  </ul>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 더블 이용권 섹션 */}
        <section>
          <h2>더블 이용권</h2>
          <div className="ticket-card-wrap">
            <div className="ticket-card-list" ref={setupSwipe}>

              {/* 카드 5 */}
              <div
                className={`list ${flippedStates[5] ? 'flipped' : ''}`}
                onMouseLeave={() => handleMouseLeave(5)}
              >
                <div className="card-front">
                  <button 
                    className='btn xsmall secondary-line'
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFlip(5);
                    }}
                  >
                    자세히 보기
                  </button>
                  <h3>{DOUBLE_CARD_DATA[0].title}</h3>

                </div>
                <div className="card-back">
                  <ul>
                    <li><strong>동시 시청</strong><span>2대</span></li>
                    <li><strong>시청 가능 디바이스</strong><span>모든 디바이스</span></li>
                    <li><strong>화질</strong><span>FHD 화질 </span></li>
                    <li><strong>TV</strong><span>이용 가능</span></li>
                    <li><strong>광고</strong><span>있음</span></li>
                    <li><strong>모바일 다운로드</strong><span>15회</span></li>
                    <li><strong>QVOD 및 타임머신 기능</strong><span>QVOD Only</span></li>
                    <li><strong>30만편 이상의 VOD</strong><span>이용 가능</span></li>
                    <li><strong>100여개 실시간 라이브 채널</strong><span>이용 가능</span></li>
                    <li><strong>9천여편의 영화</strong><span>이용 가능</span></li>
                  </ul>
                </div>
              </div>

              {/* 카드 6 */}
              <div
                className={`list ${flippedStates[6] ? 'flipped' : ''}`}
                onMouseLeave={() => handleMouseLeave(6)}
              >
                <div className="card-front">
                  <button 
                    className='btn xsmall secondary-line'
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFlip(6);
                    }}
                  >
                    자세히 보기
                  </button>
                  <h3>{DOUBLE_CARD_DATA[1].title}</h3>

                </div>
                <div className="card-back">
                  <ul>
                    <li><strong>동시 시청</strong><span>2대</span></li>
                    <li><strong>시청 가능 디바이스</strong><span>모든 디바이스</span></li>
                    <li><strong>화질</strong><span>FHD 화질 </span></li>
                    <li><strong>TV</strong><span>이용 가능</span></li>
                    <li><strong>광고</strong><span>있음</span></li>
                    <li><strong>모바일 다운로드</strong><span>15회</span></li>
                    <li><strong>QVOD 및 타임머신 기능</strong><span>QVOD Only</span></li>
                    <li><strong>30만편 이상의 VOD</strong><span>이용 가능</span></li>
                    <li><strong>100여개 실시간 라이브 채널</strong><span>이용 가능</span></li>
                    <li><strong>9천여편의 영화</strong><span>이용 가능</span></li>
                  </ul>
                </div>
              </div>

              {/* 카드 7 */}
              <div
                className={`list ${flippedStates[7] ? 'flipped' : ''}`}
                onMouseLeave={() => handleMouseLeave(7)}
              >
                <div className="card-front">
                  <button 
                    className='btn xsmall secondary-line'
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFlip(7);
                    }}
                  >
                    자세히 보기
                  </button>
                  <h3>{DOUBLE_CARD_DATA[2].title}</h3>

                </div>
                <div className="card-back">
                  <ul>
                    <li><strong>동시 시청</strong><span>2대</span></li>
                    <li><strong>시청 가능 디바이스</strong><span>모든 디바이스</span></li>
                    <li><strong>화질</strong><span>FHD 화질 </span></li>
                    <li><strong>TV</strong><span>이용 가능</span></li>
                    <li><strong>광고</strong><span>있음</span></li>
                    <li><strong>모바일 다운로드</strong><span>15회</span></li>
                    <li><strong>QVOD 및 타임머신 기능</strong><span>QVOD Only</span></li>
                    <li><strong>30만편 이상의 VOD</strong><span>이용 가능</span></li>
                    <li><strong>100여개 실시간 라이브 채널</strong><span>이용 가능</span></li>
                    <li><strong>9천여편의 영화</strong><span>이용 가능</span></li>
                  </ul>
                </div>
              </div>

              {/* 카드 8 */}
              <div
                className={`list ${flippedStates[8] ? 'flipped' : ''}`}
                onMouseLeave={() => handleMouseLeave(8)}
              >
                <div className="card-front">
                  <button 
                    className='btn xsmall secondary-line'
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFlip(8);
                    }}
                  >
                    자세히 보기
                  </button>
                  <h3>{DOUBLE_CARD_DATA[3].title}</h3>

                </div>
                <div className="card-back">
                  <ul>
                    <li><strong>동시 시청</strong><span>2대</span></li>
                    <li><strong>시청 가능 디바이스</strong><span>모든 디바이스</span></li>
                    <li><strong>화질</strong><span>FHD 화질 </span></li>
                    <li><strong>TV</strong><span>이용 가능</span></li>
                    <li><strong>광고</strong><span>있음</span></li>
                    <li><strong>모바일 다운로드</strong><span>15회</span></li>
                    <li><strong>QVOD 및 타임머신 기능</strong><span>QVOD Only</span></li>
                    <li><strong>30만편 이상의 VOD</strong><span>이용 가능</span></li>
                    <li><strong>100여개 실시간 라이브 채널</strong><span>이용 가능</span></li>
                    <li><strong>9천여편의 영화</strong><span>이용 가능</span></li>
                  </ul>
                </div>
              </div>

              {/* 카드 9 */}
              <div
                className={`list ${flippedStates[9] ? 'flipped' : ''}`}
                onMouseLeave={() => handleMouseLeave(9)}
              >
                <div className="card-front">
                  <button 
                    className='btn xsmall secondary-line'
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFlip(9);
                    }}
                  >
                    자세히 보기
                  </button>
                  <h3>{DOUBLE_CARD_DATA[4].title}</h3>

                </div>
                <div className="card-back">
                  <ul>
                    <li><strong>동시 시청</strong><span>2대</span></li>
                    <li><strong>시청 가능 디바이스</strong><span>모든 디바이스</span></li>
                    <li><strong>화질</strong><span>FHD 화질 </span></li>
                    <li><strong>TV</strong><span>이용 가능</span></li>
                    <li><strong>광고</strong><span>있음</span></li>
                    <li><strong>모바일 다운로드</strong><span>15회</span></li>
                    <li><strong>QVOD 및 타임머신 기능</strong><span>QVOD Only</span></li>
                    <li><strong>30만편 이상의 VOD</strong><span>이용 가능</span></li>
                    <li><strong>100여개 실시간 라이브 채널</strong><span>이용 가능</span></li>
                    <li><strong>9천여편의 영화</strong><span>이용 가능</span></li>
                  </ul>
                </div>
              </div>

            </div>
          </div>
        </section>
        <section>
          <h2>제휴 이용권  (뒷면 없음)</h2>
          <div className="ticket-card-wrap">
            <div className="ticket-card-list" ref={setupSwipe}>
              <div className='list'>
                <div className='card-front'></div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
};

export default Ticket;