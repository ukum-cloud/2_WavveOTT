import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import "./scss/BendNotice.scss";
import type { NoticeType } from "../types/etc";
import { noticeData } from "../data/notice";

export const BendNotice = () => {
  const notices: NoticeType[] = noticeData;

  const [currentIndex, setCurrentIndex] = useState(0);

  // 다음 공지사항으로 이동
  // useCallback을 사용하여 notices.length가 변경될 때만 함수를 재생성합니다.
  const handleNext = useCallback(() => {
    if (notices.length === 0) return;
    setCurrentIndex((prevIndex) => (prevIndex + 1) % notices.length);
  }, [notices.length]); // notices.length를 의존성 배열에 추가

  // 이전 공지사항으로 이동
  // useCallback을 사용하여 notices.length가 변경될 때만 함수를 재생성합니다.
  const handlePrev = useCallback(() => {
    if (notices.length === 0) return;
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + notices.length) % notices.length
    );
  }, [notices.length]); // notices.length를 의존성 배열에 추가

  // 자동 롤링 인터벌
  useEffect(() => {
    // handleNext가 useCallback으로 메모이제이션되었으므로,
    // notices.length가 변경될 때만 useEffect가 다시 실행되어 인터벌이 재설정됩니다.
    if (notices.length > 1) {
      const intervalId = setInterval(handleNext, 3000);
      return () => clearInterval(intervalId);
    }
  }, [notices.length, handleNext]);

  // 데이터가 없으면 렌더링하지 않음
  if (!notices || notices.length === 0) {
    return null;
  }

  const currentNotice: NoticeType = notices[currentIndex];
  const noticePath = `/service-center/notice/${currentNotice.id}`;

  return (
    <div className="bend-notice-wrap">
      <div className="inner">
        <dl className="bend-notice">
          <dt>공지사항</dt>
          <dd className="title">
            <Link to={noticePath} key={currentIndex} className="rolling-link">
              {currentNotice.title}
            </Link>
          </dd>
          <dd>
            <button onClick={handlePrev}>
              <img src="/images/button/btn-prev.png" alt="이전" />
            </button>{" "}
            <button onClick={handleNext}>
              <img src="/images/button/btn-next.png" alt="다음" />
            </button>
          </dd>
        </dl>
      </div>
    </div>
  );
};
