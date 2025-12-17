import React from 'react';
import { ADDENDUM_DATES } from '../types/PrivacyData';

const AgreementWavveon = () => {
    // 스클롤 이동
    const scrollTo = (id: string) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };
    return (
        <div>
            <h2>웨이브온 개인정보 처리방침</h2>
            <div className="policy-desc">
                <section className="intro-text">
                    <strong>서문</strong>
                    <p>
                        콘텐츠웨이브(주)(이하 “회사”)는 정보주체의 자유와 권리 보호를 위해
                        「개인정보 보호법」 및 관계 법령이 정한 바를 준수하여, 적법하게 개인정보를
                        처리하고 안전하게 관리하고 있습니다. 이에 「개인정보 보호법」 제30조에 따라
                        정보주체에게 개인정보의 처리와 보호에 관한 절차 및 기준을 안내하고, 이와
                        관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이
                        개인정보 처리 방침을 수립·공개합니다.
                    </p>
                </section>
                {/* 목차 */}
                <table className="table-contents">
                    <thead>
                        <tr>
                            <th colSpan={2}>목차</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td onClick={() => scrollTo('article-1')}>
                                제1조 개인정보의 처리 목적, 항목, 처리 및 보유기간
                            </td>
                            <td onClick={() => scrollTo('article-7')}>
                                제7조 가명정보 처리에 관한 사항
                            </td>
                        </tr>
                        <tr>
                            <td onClick={() => scrollTo('article-2')}>
                                제2조 개인정보의 파기 절차 및 방법에 관한 사항
                            </td>
                            <td onClick={() => scrollTo('article-8')}>
                                제8조 개인정보 자동 수집 장치의 설치·운영 및 거부
                            </td>
                        </tr>
                        <tr>
                            <td onClick={() => scrollTo('article-3')}>
                                제3조 개인정보의 제3자 제공에 관한 사항
                            </td>
                            <td onClick={() => scrollTo('article-9')}>
                                제9조 개인정보 보호책임자 및 고충처리 부서
                            </td>
                        </tr>
                        <tr>
                            <td onClick={() => scrollTo('article-4')}>
                                제4조 추가적인 이용·제공 발생 시 판단 기준
                            </td>
                            <td onClick={() => scrollTo('article-10')}>
                                제10조 권익침해에 대한 구제방법
                            </td>
                        </tr>
                        <tr>
                            <td onClick={() => scrollTo('article-5')}>
                                제5조 개인정보 처리업무의 위탁에 관한 사항
                            </td>
                            <td onClick={() => scrollTo('article-11')}>
                                제11조 개인정보 처리방침의 변경에 관한 사항
                            </td>
                        </tr>
                        <tr>
                            <td onClick={() => scrollTo('article-6')}>
                                제6조 개인정보 안전성 확보조치
                            </td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>

                <section id="article-1">
                    <span className="section-title">
                        제1조 개인정보의 처리 목적, 항목, 처리 및 보유기간
                    </span>
                    <p>
                        회사는 「개인정보 보호법」에 따라 서비스 제공을 위해 필요 최소한의 범위에서
                        다음의 목적으로 개인정보를 처리합니다.
                    </p>

                    <p>
                        <strong>[(필수) 개인정보의 처리 목적, 항목, 처리 및 보유기간]</strong>
                    </p>
                    <div className="table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th>법적근거</th>
                                    <th>구분</th>
                                    <th>목적</th>
                                    <th colSpan={2}>항목</th>
                                    <th>처리 및 보유기간</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td rowSpan={2}>「개인정보 보호법」 제15조제1항제4호</td>
                                    <td rowSpan={2}>사업자(법인) 등록 및 관리</td>
                                    <td>사업자(법인) 식별·인증</td>
                                    <td colSpan={2}>
                                        ID, 이름(대표자명), 주소, 비밀번호, 회원번호
                                    </td>
                                    <td rowSpan={2}>회원 탈퇴 후 3개월</td>
                                </tr>
                                <tr>
                                    <td>법인회원 관리자 관리</td>
                                    <td colSpan={2}>이름, 이메일주소, 연락처</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <p>
                        <strong>[(선택) 개인정보의 처리 목적, 항목, 처리 및 보유기간]</strong>
                    </p>
                    <div className="table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th>법적근거</th>
                                    <th>구분</th>
                                    <th>목적</th>
                                    <th colSpan={2}>항목</th>
                                    <th>처리 및 보유기간</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td rowSpan={5}>「개인정보 보호법」 제15조제1항제1호</td>
                                    <td>구매 및 결제</td>
                                    <td>이용권 구매, 결제 처리 및 서비스 제공</td>
                                    <td colSpan={2}>ID, 결제수단, 거래ID</td>
                                    <td>5년(전자상거래법 등)</td>
                                </tr>
                                <tr>
                                    <td rowSpan={4}>고객 문의</td>
                                    <td rowSpan={2}>이용 문의, 고충 상담, 결과 안내</td>
                                    <td>1:1문의</td>
                                    <td>이름, 이메일, 연락처</td>
                                    <td rowSpan={4}>3년(전자상거래법)</td>
                                </tr>
                                <tr>
                                    <td>고객센터</td>
                                    <td>이름, 이메일, 연락처, 발신번호</td>
                                </tr>
                                <tr>
                                    <td rowSpan={2}>환불 처리</td>
                                    <td>1:1문의</td>
                                    <td rowSpan={2}>이름, 이메일, 연락처, 계좌정보</td>
                                </tr>
                                <tr>
                                    <td>고객센터</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                <section id="article-2">
                    <span className="section-title">
                        제2조 개인정보의 파기 절차 및 방법에 관한 사항
                    </span>
                    <div className="table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th>구분</th>
                                    <th colSpan={2}>주요내용</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th>파기 절차</th>
                                    <td colSpan={2}>
                                        파기대상 선정 → 개인정보 책임자 검토 및 승인 → 파기
                                    </td>
                                </tr>
                                <tr>
                                    <th rowSpan={2}>파기 방법</th>
                                    <td>전자적 파일</td>
                                    <td>복구 불가능한 기술적 방법</td>
                                </tr>
                                <tr>
                                    <td>종이 문서</td>
                                    <td>분쇄 또는 소각</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                <section id="article-3">
                    <span className="section-title">제3조 개인정보의 제3자 제공에 관한 사항</span>
                    <p>
                        회사는 웨이브온 서비스를 제공함에 있어 법인회원의 개인정보를 제3자에게
                        제공하지 않습니다. 다만, 법률에 특별한 규정이 있거나 재난, 급박한 생명 위험
                        등의 긴급상황 시에는 예외로 합니다.
                    </p>
                </section>

                <section id="article-4">
                    <span className="section-title">
                        제4조 추가적인 이용·제공이 지속적으로 발생 시 판단 기준
                    </span>
                    <ul>
                        <li>당초 수집 목적과 관련성이 있는지 여부</li>
                        <li>수집 정황 또는 처리 관행에 따른 예측 가능성 여부</li>
                        <li>법인회원의 이익을 부당하게 침해하는지 여부</li>
                        <li>가명처리 또는 암호화 등 안전성 확보 조치 여부</li>
                    </ul>
                </section>

                <section id="article-5">
                    <span className="section-title">
                        제5조 개인정보 처리업무의 위탁에 관한 사항
                    </span>
                    <div className="table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th>수탁사</th>
                                    <th>위탁업무</th>
                                    <th>재수탁사</th>
                                    <th>재수탁업무</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>NICE평가정보(주)</td>
                                    <td>계좌유효확인</td>
                                    <td>해당없음</td>
                                    <td>해당없음</td>
                                </tr>
                                <tr>
                                    <td>페이레터 주식회사</td>
                                    <td>요금결제, 결제 시스템 개발</td>
                                    <td>바로가기</td>
                                    <td>결제관련 상담</td>
                                </tr>
                                <tr>
                                    <td>(주)유베이스</td>
                                    <td>고객상담, 품질관리</td>
                                    <td>바로가기</td>
                                    <td>시스템 유지보수</td>
                                </tr>
                                <tr>
                                    <td>SK텔레콤(주), GS네오텍 등</td>
                                    <td>클라우드 운영 지원</td>
                                    <td>해당없음</td>
                                    <td>해당없음</td>
                                </tr>
                                <tr>
                                    <td>님버스네트웍스</td>
                                    <td>VDI 솔루션 관리</td>
                                    <td>바로가기</td>
                                    <td>인프라 관리</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                <section id="article-6">
                    <span className="section-title">제6조 개인정보 안전성 확보조치</span>
                    <ul>
                        <li>
                            <strong>관리적 조치:</strong> 내부관리계획 수립, 개인정보보호 조직 운영,
                            정기 교육
                        </li>
                        <li>
                            <strong>기술적 조치:</strong> 접근권한 관리, 암호화, 악성코드 방역,
                            실시간 모니터링
                        </li>
                        <li>
                            <strong>물리적 조치:</strong> 보호구역 지정, 출입통제, 내화금고 운영
                        </li>
                    </ul>
                </section>

                <section id="article-7">
                    <span className="section-title">제7조 가명정보 처리에 관한 사항</span>
                    <p>
                        회사는 통계작성, 과학적 연구 등을 위하여 특정 개인을 알아볼 수 없도록
                        가명처리하여 활용합니다.
                    </p>
                    <div className="table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th>구분</th>
                                    <th>처리 목적</th>
                                    <th>처리 항목</th>
                                    <th>처리 기간</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>통계 분석 및 연구</td>
                                    <td>고객 이용 추이 분석, 개인화 서비스 연구</td>
                                    <td>회원번호, 성별, 생년월일, 시청/검색 이력</td>
                                    <td>Wavve 서비스 종료 시까지</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                <section id="article-8">
                    <span className="section-title">
                        제8조 개인정보 자동 수집 장치의 설치·운영 및 그 거부에 관한 사항
                    </span>
                    <p>
                        회사는 ‘쿠키(Cookie)’를 사용하여 맞춤화된 서비스를 제공합니다. 브라우저
                        설정을 통해 쿠키 수집을 거부할 수 있습니다.
                    </p>
                    <div className="table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th>구분</th>
                                    <th>브라우저</th>
                                    <th>거부방법</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td rowSpan={2}>웹브라우저</td>
                                    <td>Chrome</td>
                                    <td>
                                        설정 {'>'} 개인정보 및 보안 {'>'} 기록 삭제
                                    </td>
                                </tr>
                                <tr>
                                    <td>Safari</td>
                                    <td>환경설정 {'>'} 모든 쿠키 차단</td>
                                </tr>
                                <tr>
                                    <td>모바일</td>
                                    <td>삼성 인터넷 등</td>
                                    <td>설정 {'>'} 인터넷 사용 기록 삭제</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                <section id="article-9">
                    <span className="section-title">
                        제9조 개인정보 보호책임자 및 고충처리 부서
                    </span>
                    <div className="table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th>구분</th>
                                    <th>성명/부서</th>
                                    <th>연락처</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>보호책임자</td>
                                    <td>신홍식 (서비스그룹)</td>
                                    <td>1599-3709 / privacy@wavve.com</td>
                                </tr>
                                <tr>
                                    <td>담당자</td>
                                    <td>이상진 (CEM)</td>
                                    <td>1599-3709 / privacy@wavve.com</td>
                                </tr>
                                <tr>
                                    <td>고객센터</td>
                                    <td>콘텐츠웨이브 주식회사</td>
                                    <td>1599-3709 / privacy@wavve.com</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                <section id="article-10">
                    <span className="section-title">제10조 권익침해에 대한 구제방법</span>
                    <div className="table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th>기관명</th>
                                    <th>전화번호</th>
                                    <th>홈페이지</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>개인정보분쟁조정위원회</td>
                                    <td>1833-6972</td>
                                    <td>www.kopico.go.kr</td>
                                </tr>
                                <tr>
                                    <td>개인정보침해신고센터</td>
                                    <td>118</td>
                                    <td>privacy.kisa.or.kr</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                <section id="article-11">
                    <span className="section-title">
                        제11조 개인정보 처리방침의 변경에 관한 사항
                    </span>
                    <p>변경사항 발생 시 최소 7일 전에 공지사항을 통해 공지할 것입니다.</p>
                    <p>
                        본 개인정보 처리방침은 <strong>2025.02.25</strong>부터 적용됩니다.
                    </p>
                </section>

                <div className="addendum">
                    <p className="section-title">부칙</p>
                    <ul className="addendum-list">
                        {ADDENDUM_DATES.map((date, index) => (
                            <li key={index}>(시행일) 이 약관은 {date}부터 시행합니다.</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default AgreementWavveon;
