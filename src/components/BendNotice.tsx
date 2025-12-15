// Notice.tsx

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./scss/BendNotice.scss";
import type { NoticeType } from "../types/etc";
import { noticeData } from "../data/notice";

export const BendNotice = () => {
  const notices: NoticeType[] = noticeData;

  // 데이터가 없으면 렌더링하지 않음
  if (!notices || notices.length === 0) {
    return null;
  }

  const [currentIndex, setCurrentIndex] = useState(0);

  const currentNotice: NoticeType = notices[currentIndex];
  const noticePath = `/service-center/notice/${currentNotice.id}`;

  // 다음 공지사항으로 이동
  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % notices.length);
  };

  // 이전 공지사항으로 이동
  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + notices.length) % notices.length);
  };

  // 자동 롤링 인터벌
  useEffect(() => {
    if (notices.length > 1) {
      const intervalId = setInterval(handleNext, 3000);
      return () => clearInterval(intervalId);
    }
  }, [notices.length]);


  return (
    <div className="bend-notice-wrap">
      <div className="inner">
        <dl className="bend-notice">
          <dt>공지사항</dt>
          <dd className="title">
            <Link
              to={noticePath}
              key={currentIndex}
              className="rolling-link"
            >
              {currentNotice.title}
            </Link>
          </dd>
          <dd>
            <button onClick={handlePrev}><img src="/images/button/btn-prev.png" alt="이전" /></button>{" "}
            <button onClick={handleNext}><img src="/images/button/btn-next.png" alt="다음" /></button>
          </dd>
        </dl>
      </div>
    </div>
  );
};