import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { TicketData, PriceInfo } from "../types/etc";
import "./scss/Payment.scss";
import { useAuthStore } from "../stores/useAuthStore";

interface LocationState {
  ticketData: TicketData;
  selectedPrice: PriceInfo;
}

const Payment: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setMyTicket } = useAuthStore();

  const [paymentMethod, setPaymentMethod] = useState<"quick" | "etc">("quick");
  const [activeIndex, setActiveIndex] = useState<number | null>(0);
  const [agreements, setAgreements] = useState({
    autoPay: false,
    termWtoT: false,
    termTtoW: false,
  });

  const state = location.state as LocationState | undefined;

  if (!state || !state.ticketData || !state.selectedPrice) {
    return (
      <div className="payment-wrap">
        <div className="inner">
          <h2>결제 정보 확인</h2>
          <p>선택된 이용권 정보가 유효하지 않습니다.</p>
          <button onClick={() => navigate("/home")}>
            이용권 페이지로 이동
          </button>
        </div>
      </div>
    );
  }

  const { ticketData, selectedPrice } = state;
  const { title, specs, category, brands } = ticketData;
  const { price, period } = selectedPrice;

  const paymentMethods = [
    "신용카드",
    "휴대폰",
    "N-Pay",
    "카카오 페이",
    "페이코",
  ];
  const formatPrice = (p: number) => p.toLocaleString();

  const today = new Date();
  const nextMonth = new Date(today);
  nextMonth.setMonth(today.getMonth() + 1);

  const formatDate = (date: Date) => {
    return date
      .toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
      .replace(/\. /g, ".")
      .replace(/\.$/, "");
  };

  const periodText = `${formatDate(today)}~${formatDate(
    nextMonth
  )} (${period})`;
  const isAllChecked = Object.values(agreements).every((val) => val);

  const handleAllAgree = (checked: boolean) => {
    setAgreements({ autoPay: checked, termWtoT: checked, termTtoW: checked });
  };

  const handleIndividualAgree = (name: keyof typeof agreements) => {
    setAgreements((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const renderSpecs = () => {
    if (!specs || specs.length === 0) return <li>세부 정보 없음</li>;
    const filteredSpecs: string[] = [];
    const processValue = (value: string) => {
      if (!value || value.trim() === "-" || value.trim() === "") return null;
      if (
        value.includes("동시 시청") ||
        value.includes("동시시청") ||
        value.includes("다운로드")
      )
        return null;
      if (value.includes("화질")) {
        const cleanedQuality = value.split("\n")[0].replace(/.*:/, "").trim();
        return (
          cleanedQuality
            .toUpperCase()
            .match(/[A-Z0-9]+/g)
            ?.join("") || cleanedQuality
        );
      }
      if (value.includes("TV") && value.includes("이용 가능")) return "TV";
      return value.trim();
    };

    const specMap = specs.reduce((acc, spec) => {
      const key = spec.label || spec.value.split(":")[0].trim();
      acc[key] = spec.value;
      return acc;
    }, {} as Record<string, string>);

    if (category === "coalition") {
      specs.forEach((spec) => {
        const result = processValue(spec.value);
        if (result) filteredSpecs.push(result);
      });
    } else {
      ["시청 가능 디바이스", "화질", "TV"].forEach((label) => {
        const result = processValue(specMap[label]);
        if (result) filteredSpecs.push(result);
      });
    }
    return Array.from(new Set(filteredSpecs)).map((value, index) => (
      <li key={index}>{value}</li>
    ));
  };

  return (
    <main className="payment-wrap">
      <div className="inner">
        <h2>Wavve 이용권 구매</h2>
        <section className="pay-ticket-wrap">
          <h3>결제 내용</h3>
          <div className="payment-detail">
            <div className="payment-top">
              <h4>{title}</h4>
              <p>
                <span className="text-price">
                  <span className="month">{period}</span>
                  <span className="num">{formatPrice(price)}</span>
                </span>
                <span className="won">원</span>
              </p>
            </div>
            <div className="payment-bottom">
              <div className="text-left">
                <ul>{renderSpecs()}</ul>
                <p>
                  <span>이용기간</span>
                  <span className="period-date">{periodText}</span>
                </p>
              </div>
              {category === "double" && brands && (
                <div className="text-right">
                  <ul>
                    {brands.wave && (
                      <li className="icon-wave">{brands.wave}</li>
                    )}
                    {brands.tving && (
                      <li className="icon-tving">{brands.tving}</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="pay-method-section">
          <h3>결제수단 선택</h3>
          <div
            className={`pay-wrap ${paymentMethod === "quick" ? "active" : ""}`}
          >
            <div className="header" onClick={() => setPaymentMethod("quick")}>
              <label>
                <input
                  type="radio"
                  name="payMethod"
                  checked={paymentMethod === "quick"}
                  readOnly
                />{" "}
                빠른결제
              </label>
            </div>
            <div className="item quick-box">
              <div className="card-wrap">
                <div className="btn-left">
                  <img src="/images/button/btn-prev-34.svg" alt="이전" />
                </div>
                <div className="add-card">
                  <span>
                    <img src="/images/button/btn-plus-24.svg" alt="추가" />
                  </span>
                  <p>카드등록</p>
                </div>
                <div className="btn-right">
                  <img src="/images/button/btn-next-34.svg" alt="다음" />
                </div>
              </div>
              <p className="text-box">
                빠른결제를 등록하시면 모든 디바이스에서 4자리 숫자만으로
                간편결제가 가능합니다.
              </p>
            </div>
          </div>

          <div
            className={`pay-wrap ${paymentMethod === "etc" ? "active" : ""}`}
          >
            <div className="header" onClick={() => setPaymentMethod("etc")}>
              <label>
                <input
                  type="radio"
                  name="payMethod"
                  checked={paymentMethod === "etc"}
                  readOnly
                />{" "}
                다른 결제 수단
              </label>
            </div>
            <div className="item etc-box">
              <ul className="card-list">
                {paymentMethods.map((method, index) => (
                  <li
                    key={index}
                    className={activeIndex === index ? "active" : ""}
                    onClick={() => setActiveIndex(index)}
                    style={{ cursor: "pointer" }}
                  >
                    <span>{method}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="agree-wrap">
            <p className="all-agree">
              <label>
                <input
                  type="checkbox"
                  checked={isAllChecked}
                  onChange={(e) => handleAllAgree(e.target.checked)}
                />{" "}
                약관에 모두 동의합니다.
              </label>
            </p>
            <div className="sub-agrees">
              <p>
                <label>
                  <input
                    type="checkbox"
                    checked={agreements.autoPay}
                    onChange={() => handleIndividualAgree("autoPay")}
                  />{" "}
                  매월 자동 결제에 동의합니다. (필수)
                </label>
              </p>
              <p>
                <label>
                  <input
                    type="checkbox"
                    checked={agreements.termWtoT}
                    onChange={() => handleIndividualAgree("termWtoT")}
                  />{" "}
                  개인정보 제3자 정보 제공 동의 (Wavve → TVING) (필수)
                </label>
              </p>
              <p>
                <label>
                  <input
                    type="checkbox"
                    checked={agreements.termTtoW}
                    onChange={() => handleIndividualAgree("termTtoW")}
                  />{" "}
                  개인정보 제3자 정보 제공 동의 (TVING → Wavve) (필수)
                </label>
              </p>
            </div>
          </div>
        </section>

        <div className="btn-box">
          <button
            className="btn default secondary-line"
            onClick={() => navigate(-1)}
          >
            취소
          </button>
          <button
            className="btn default primary"
            disabled={!isAllChecked}
            onClick={() => {
              if (isAllChecked) {
                setMyTicket({ title, period, price }); // 스토어 저장
                navigate("/payment-finish"); // 페이지 이동
              }
            }}
          >
            다음
          </button>
        </div>

        <div className="desc-wrap">
          <ul className="desc-list">
            <li>Wavve 서비스는 저작권 문제로 해외에서 시청하실 수 없습니다.</li>
            <li>
              일부 콘텐츠는 저작권자의 요청에 따라 LIVE 및 VOD 서비스가 제공되지
              않을 수 있습니다.
            </li>
            <li>자동결제 해지는 이용기간 중 언제든지 가능합니다.</li>
            <li>
              이용권 구매 후 7일이 경과하거나 사용한 경우 환불이 어려울 수
              있습니다.
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
};

export default Payment;
