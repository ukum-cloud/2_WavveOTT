import React, { useState } from "react";
import type { PriceInfo, TicketData } from "../types/etc";
import { COALITION_TICKETS, DOUBLE_TICKETS, WAVE_TICKETS } from "../data/ticketData";
import { useNavigate } from "react-router-dom"; 
import "./scss/Ticket.scss";

type FlippedStates = Record<number, boolean>;

const Ticket: React.FC = () => {
  const navigate = useNavigate(); 
  const [flippedStates, setFlippedStates] = useState<FlippedStates>({});

  const handleFlip = (id: number): void => {
    setFlippedStates((prev) => ({ ...prev, [id]: true }));
  };

  const handleMouseLeave = (id: number): void => {
    if (flippedStates[id]) {
      setFlippedStates((prev) => ({ ...prev, [id]: false }));
    }
  };

  // 컴포넌트 최상위에서 데이터 전달 함수 정의
  const handleTicketClick = (ticketData: TicketData, selectedPrice: PriceInfo): void => {
    // Payment.tsx로 데이터 전달
    navigate('/payment', { 
        state: { 
            ticketData: ticketData,
            selectedPrice: selectedPrice // 클릭된 특정 가격 정보를 함께 전달
        } 
    });
  };

  const setupSwipe = (element: HTMLDivElement | null) => {
    if (!element) return;

    let startX = 0;
    let scrollLeft = 0;

    const onStart = (clientX: number) => {
      startX = clientX - element.offsetLeft;
      scrollLeft = element.scrollLeft;
    };

    const onMove = (clientX: number) => {
      const x = clientX - element.offsetLeft;
      element.scrollLeft = scrollLeft - (x - startX) * 2;
    };

    element.onmousedown = (e) => onStart(e.pageX);
    element.onmousemove = (e) => e.buttons && onMove(e.pageX);
    element.ontouchstart = (e) => onStart(e.touches[0].pageX);
    element.ontouchmove = (e) => onMove(e.touches[0].pageX);
  };

  const renderTicketCard = (ticket: TicketData) => {
    const isFlipped = flippedStates[ticket.id];

    return (
      <div
        key={ticket.id}
        className={`list ${isFlipped ? "flipped" : ""}`}
        onMouseLeave={() => ticket.hasFlip && handleMouseLeave(ticket.id)}
      >
        <div className="card-front">
          <div className={`front-top ${ticket.category === 'coalition' && ticket.badge ? 'jc' : ''}`}>
            {ticket.badge ? <span className="badge">{ticket.badge}</span> : <span></span>}
            {ticket.hasFlip && (
              <button
                className="btn-detail"
                onClick={(e) => {
                  e.stopPropagation();
                  handleFlip(ticket.id);
                }}
              >
                자세히 보기
              </button>
            )}
          </div>
          <div className="front-header">
            <h3>{ticket.title}</h3>
          </div>
          <div className="front-content">
            {ticket.prices.map((price, index) => (
              <div 
                key={index} 
                className="ticket-price"
                // 최상위에서 정의된 handleTicketClick 사용
                onClick={() => handleTicketClick(ticket, price)}
                style={{ cursor: 'pointer' }}
              >
                <p className="period">
                  <span className="month">{price.period}</span>
                  {price.discount && <span className="sale">{price.discount}%</span>}
                </p>
                <p className="coast-box">
                  <span className="text-coast">
                    {price.originalPrice && (
                      <del>{price.originalPrice.toLocaleString()}</del>
                    )}
                    <strong>{price.price.toLocaleString()}</strong>
                    <span>원</span>
                  </span>
                  {price.monthlyPrice && (
                    <span className="text-total">(월 {price.monthlyPrice.toLocaleString()}원)</span>
                  )}
                </p>
              </div>
            ))}
            {ticket.brands && (
              <div className="ticket-brand">
                {ticket.brands.wave && <span className="icon-wave">{ticket.brands.wave}</span>}
                {ticket.brands.tving && <span className="icon-tving">{ticket.brands.tving}</span>}
              </div>
            )}
            {ticket.category === 'coalition' && ticket.specs && (
              <div className="ticket-brand">
                {ticket.specs.map((spec, index) => (
                  <span key={index} className="pd-none">{spec.value}</span>
                ))}
              </div>
            )}
          </div>
        </div>
        {ticket.hasFlip && ticket.specs && (
          <div className="card-back">
            <ul>
              {ticket.specs.map((spec, index) => (
                <li key={index}>
                  <strong>{spec.label}</strong>
                  <span style={{ whiteSpace: 'pre-line' }}>{spec.value}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  return (
    <main className="ticket-wrap">
      <div className="inner">
        {/* 웨이브 이용권 섹션 */}
        <section>
          <h2>웨이브 이용권</h2>
          <div className="ticket-card-wrap">
            <div className="ticket-card-list" ref={setupSwipe}>
              {WAVE_TICKETS.map(ticket => renderTicketCard(ticket))}
            </div>
          </div>
        </section>

        {/* 더블 이용권 섹션 */}
        <section>
          <h2 className="withLogo">더블 이용권</h2>
          <div className="ticket-card-wrap">
            <div className="ticket-card-list" ref={setupSwipe}>
              {DOUBLE_TICKETS.map(ticket => renderTicketCard(ticket))}
            </div>
          </div>
        </section>

        {/* 제휴 이용권 섹션 */}
        <section>
          <h2>제휴 이용권</h2>
          <div className="ticket-card-wrap">
            <div className="ticket-card-list">
              {COALITION_TICKETS.map(ticket => renderTicketCard(ticket))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Ticket;