import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { TicketData, PriceInfo } from '../types/etc';
import './scss/Payment.scss'

// Payment.tsx로 전달받는 location state의 타입 정의
interface LocationState {
    ticketData: TicketData;
    selectedPrice: PriceInfo;
}

const Payment: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // --- 데이터 안정성 및 추출 ---
    const state = location.state as LocationState | undefined;

    if (!state || !state.ticketData || !state.selectedPrice) {
        return (
            <div className="payment-wrap">
                <div className="inner">
                    <h2>결제 정보 확인</h2>
                    <p>선택된 이용권 정보가 유효하지 않습니다.</p>
                    <button onClick={() => navigate('/')}>이용권 페이지로 이동</button>
                </div>
            </div>
        );
    }

    const { ticketData, selectedPrice } = state;
    const { title, specs, category, brands } = ticketData;
    const { price, period } = selectedPrice;

    // 가격 포맷팅 함수
    const formatPrice = (p: number) => p.toLocaleString();

    // 날짜 계산 및 포맷팅 (YYYY.MM.DD)
    const today = new Date();
    const nextMonth = new Date(today);
    nextMonth.setMonth(today.getMonth() + 1);
    const formatDate = (date: Date) => {
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        }).replace(/\. /g, '.').replace(/\.$/, '');
    };

    const startDate = formatDate(today);
    const endDate = formatDate(nextMonth);
    const periodText = `${startDate}~${endDate} (${period})`;

    // 스펙 목록을 HTML 리스트 <li> 태그로 변환 (모든 카테고리 지원 및 요청 사항 반영)
    const renderSpecs = () => {
        if (!specs || specs.length === 0) {
            return <li>세부 정보 없음</li>;
        }

        const filteredSpecs: string[] = [];

        // 스펙 값을 필터링 및 포맷팅하는 헬퍼 함수
        const processValue = (value: string) => {
            if (!value || value.trim() === '-' || value.trim() === '') return null;

            // Rule: '동시 시청'이 포함된 항목은 제외
            if (value.includes('동시 시청') || value.includes('동시시청')) {
                return null;
            }

            // **[수정] Rule: '다운로드'가 포함된 항목은 제외**
            if (value.includes('다운로드')) {
                return null;
            }

            // Rule: 화질 (영어/숫자가 없으면 한국어 텍스트(예: '최고 화질')를 사용)
            if (value.includes('화질')) {
                const cleanedQuality = value.split('\n')[0].replace(/.*:/, '').trim();
                const qualityMatch = cleanedQuality.toUpperCase().match(/[A-Z0-9]+/g)?.join('');

                return qualityMatch || cleanedQuality; // FHD/HD 또는 '최고 화질' 반환
            }

            // Rule: 'TV 이용 가능' -> 'TV'
            if (value.includes('TV') && value.includes('이용 가능')) {
                return 'TV';
            }

            // 그 외 (디바이스 등)는 값 그대로 반환
            return value.trim();
        };

        // 스펙을 레이블과 값으로 매핑합니다.
        const specMap = specs.reduce((acc, spec) => {
            const key = spec.label || spec.value.split(':')[0].trim();
            acc[key] = spec.value;
            return acc;
        }, {} as Record<string, string>);


        if (category === 'coalition') {
            // 1. 제휴 이용권: 모든 value에 필터/포맷팅 로직 적용
            specs.forEach(spec => {
                const result = processValue(spec.value);
                if (result) filteredSpecs.push(result);
            });

        } else {
            // 2. Wave 및 Double 이용권: 특정 레이블에 필터/포맷팅 로직 적용

            // 모든 디바이스
            const device = specMap['시청 가능 디바이스'];
            if (device) {
                const result = processValue(device);
                if (result) filteredSpecs.push(result);
            }

            // 화질
            const quality = specMap['화질'];
            if (quality) {
                const result = processValue(quality);
                if (result) filteredSpecs.push(result);
            }

            // TV
            const tv = specMap['TV'];
            if (tv) {
                const result = processValue(tv);
                if (result) filteredSpecs.push(result);
            }
        }

        // 중복 제거 후 <li> 태그로 변환
        return Array.from(new Set(filteredSpecs)).map((value, index) => (
            <li key={index}>{value}</li>
        ));
    };

    // Double 이용권의 브랜드 상세 정보
    const renderBrandDetails = () => {
        if (category === 'double' && brands) {
            return (
                <div className="text-right">
                    <ul>
                        {brands.wave && <li className='icon-wave'>{brands.wave}</li>}
                        {brands.tving && <li className='icon-tving'>{brands.tving}</li>}
                    </ul>
                </div>
            );
        }
        return null;
    };

    return (
        <main className="payment-wrap">
            <div className="inner">
                <h2>Wavve 이용권 구매</h2>

                <section>
                    <h3>결제 내용</h3>
                    <div className="payment-detail">
                        <div className="payment-top">
                            <h4>{title}</h4>
                            <p>
                                <span className='text-price'>
                                    <span className='month'>{period}</span>
                                    <span className='num'>{formatPrice(price)}</span>
                                </span>
                                <span className='won'>원</span>
                            </p>
                        </div>
                        <div className="payment-bottom">
                            <div className="text-left">
                                <ul>
                                    {/* 이용권 스펙 정보를 리스트로 표시 */}
                                    {renderSpecs()}
                                </ul>
                                <p>
                                    <span>이용기간</span>
                                    <span className="period-date">{periodText}</span>
                                </p>
                            </div>

                            {/* 더블 이용권인 경우 브랜드 상세 정보를 표시 */}
                            {renderBrandDetails()}
                        </div>
                    </div>
                </section>

            </div>
        </main>
    );
};

export default Payment;