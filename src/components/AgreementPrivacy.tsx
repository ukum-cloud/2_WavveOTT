import React from "react";
import { ADD_DATES } from "../types/PrivacyData";

const AgreementPrivacy: React.FC = () => {
  // 스크롤 이동 함수
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div>
      <h3>개인정보 처리방침</h3>
      <div className="policy-desc">
        <section className="intro-text">
          <strong>서문</strong>
          <p>
            콘텐츠웨이브(주)(이하 “회사”)는 정보주체의 자유와 권리 보호를 위해 「개인정보 보호법」
            및 관계 법령이 정한 바를 준수하여, 적법하게 개인정보를 처리하고 안전하게 관리하고
            있습니다.
          </p>
        </section>

        {/* 목차 영역 */}
        <table className="table-contents">
          <thead>
            <tr>
              <th colSpan={2}>목차</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td onClick={() => scrollTo("terms-article-1")}>
                제1조 개인정보의 처리 목적, 항목, 처리 및 보유기간
              </td>
              <td onClick={() => scrollTo("terms-article-8")}>제8조 개인정보 안전성 확보조치</td>
            </tr>
            <tr>
              <td onClick={() => scrollTo("terms-article-2")}>
                제2조 개인정보의 파기 절차 및 방법에 관한 사항
              </td>
              <td onClick={() => scrollTo("terms-article-9")}>
                제9조 개인정보 자동 수집 장치의 설치·운영 및 그 거부에 관한 사항
              </td>
            </tr>
            <tr>
              <td onClick={() => scrollTo("terms-article-3")}>
                제3조 개인정보의 제3자 제공에 관한 사항
              </td>
              <td onClick={() => scrollTo("terms-article-10")}>
                제10조 이용자 권리·의무 및 행사 방법
              </td>
            </tr>
            <tr>
              <td onClick={() => scrollTo("terms-article-4")}>
                제4조 추가적인 이용·제공이 지속적으로 발생 시 판단 기준
              </td>
              <td onClick={() => scrollTo("terms-article-11")}>
                제11조 개인정보 보호책임자 및 고충처리 부서
              </td>
            </tr>
            <tr>
              <td onClick={() => scrollTo("terms-article-5")}>
                제5조 개인정보 처리업무의 위탁에 관한 사항
              </td>
              <td onClick={() => scrollTo("terms-article-12")}>제12조 권익침해에 대한 구제방법</td>
            </tr>
            <tr>
              <td onClick={() => scrollTo("terms-article-6")}>
                제6조 개인정보의 국외 수집 및 이전에 관한 사항
              </td>
              <td onClick={() => scrollTo("terms-article-13")}>
                제13조 개인정보 처리방침의 변경에 관한 사항
              </td>
            </tr>
            <tr>
              <td onClick={() => scrollTo("terms-article-7")}>제7조 가명정보 처리에 관한 사항</td>
              <td>
                <br />
              </td>
            </tr>
          </tbody>
        </table>

        {/* 제1조 */}
        <section id="terms-article-1">
          <span className="section-title">제1조 개인정보의 처리 목적, 항목, 처리 및 보유기간</span>
          <p>
            회사는 「개인정보 보호법」에 따라 서비스 제공을 위해 필요 최소한의 범위에서 다음의
            목적으로 개인정보를 처리합니다.
          </p>

          <div className="table-subtitle">
            [(필수) 개인정보의 처리 목적, 항목, 처리 및 보유기간]
          </div>
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
                  <td rowSpan={1}>개인정보 보호법 제15조 1항 4호</td>
                  <td rowSpan={6}>회원등록 및 식별</td>
                  <td rowSpan={6}>
                    · 가입의사 확인
                    <br />· 회원 식별·인증
                  </td>
                  <td>홈페이지/앱</td>
                  <td>ID(이메일), 이름(닉네임), 비밀번호, 회원번호</td>
                  <td rowSpan={7}>회원 탈퇴 후 3개월</td>
                </tr>
                <tr>
                  <td rowSpan={5}>각 SNS 사업자 동의 제공</td>
                  <td>[SNS] 카카오</td>
                  <td>ID(연동코드), 이름, 이메일, 회원번호</td>
                </tr>
                <tr>
                  <td>[SNS] T아이디</td>
                  <td>ID, 이름, 성별, 휴대폰, 이메일, 회원번호</td>
                </tr>
                <tr>
                  <td>[SNS] 네이버</td>
                  <td>ID, 이름, 성별, 이메일, 회원번호</td>
                </tr>
                <tr>
                  <td>[SNS] 페이스북</td>
                  <td>ID, 이름, 이메일, 회원번호</td>
                </tr>
                <tr>
                  <td>[SNS] 애플</td>
                  <td>ID, 이름(닉네임), 이메일, 회원번호</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
        {/* 제2조 */}
        <section id="terms-article-2">
          <span className="section-title">제2조 개인정보의 파기 절차 및 방법에 관한 사항</span>
          <p>
            회사는 개인정보의 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는
            지체없이 해당 개인정보를 파기합니다.
          </p>
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
                  <td colSpan={2}>파기대상 개인정보 선정 → 개인정보책임자 검토 및 승인 → 파기</td>
                </tr>
                <tr>
                  <th rowSpan={2}>파기 방법</th>
                  <td>전자 파일</td>
                  <td>복구 또는 재생 불가능한 기술적 방법</td>
                </tr>
                <tr>
                  <td>종이 문서</td>
                  <td>분쇄 또는 소각처리</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
        {/* 제3조 */}
        <section id="terms-article-3">
          <span className="section-title">제3조 개인정보의 제3자 제공에 관한 사항</span>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>제공받는 자</th>
                  <th>제공목적</th>
                  <th>제공항목</th>
                  <th>보유 및 이용기간</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    SK텔레콤㈜, SK브로드밴드㈜, 드림어스컴퍼니(주), 케이티, ㈜KT 스카이라이프,
                    ㈜엔에이치엔벅스
                  </td>
                  <td>결합상품 이용 및 요금 정산</td>
                  <td>회원번호(암호화), ID, 거래ID, 결제정보, 시청정보</td>
                  <td rowSpan={2}>회원 탈퇴 또는 동의 철회 시까지</td>
                </tr>
                <tr>
                  <td>(주) 티빙</td>
                  <td>제휴 상품 서비스 가입 및 제공, 이용 분석, 개인화 서비스 제공 등</td>
                  <td>제휴연동식별값, 회원번호, ID, 이름, 이메일, 성별 등</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
        {/* 제4조 */}
        <section id="terms-article-4">
          <span className="section-title">
            제4조 추가적인 이용·제공이 지속적으로 발생 시 판단 기준
          </span>
          <ul>
            <li>당초 수집 목적과 관련성이 있는지 여부</li>
            <li>개인정보 수집 정황에 따른 예측 가능성 여부</li>
            <li>회원의 이익을 부당하게 침해하는지 여부</li>
            <li>가명처리 또는 암호화 등 안전성 확보 조치 여부</li>
          </ul>
        </section>
        {/* 제5조 */}
        <section id="terms-article-5">
          <span className="section-title">제5조 개인정보 처리업무의 위탁에 관한 사항</span>
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
                  <td>SCI평가정보㈜, NICE평가정보㈜</td>
                  <td>본인확인, 계좌유효확인</td>
                  <td>해당없음</td>
                  <td>해당없음</td>
                </tr>
                <tr>
                  <td>페이레터 주식회사</td>
                  <td>요금결제, 결제 시스템 개발</td>
                  <td>페이레터 파트너사</td>
                  <td>결제관련상담</td>
                </tr>
                <tr>
                  <td>SK텔레콤㈜, ㈜유베이스</td>
                  <td>고객상담, 서비스품질관리</td>
                  <td>협력사</td>
                  <td>시스템 유지보수</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
        {/* 제6조 */}
        <section id="terms-article-6">
          <span className="section-title">제6조 개인정보의 국외 수집 및 이전에 관한 사항</span>
          <p>
            회사는 원활한 개인정보 업무처리를 위하여 다음과 같이 회원의 개인정보를 국외로 이전하고
            있습니다.
          </p>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>법적근거</th>
                  <th>개인정보항목</th>
                  <th>이전국가</th>
                  <th>이전받는자</th>
                  <th>이용목적</th>
                  <th>보유 및 이용기간</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td rowSpan={3}>
                    「개인정보보호법」
                    <br />
                    제28조의8제1항제3호
                  </td>
                  <td>회원번호</td>
                  <td>미국</td>
                  <td>원시그널(OneSignal, Inc.)</td>
                  <td>맞춤형 정보 추천, PUSH 발송</td>
                  <td>탈퇴 후 3개월</td>
                </tr>
                <tr>
                  <td>광고식별자, 이용기록</td>
                  <td>이스라엘, 벨기에 등</td>
                  <td>앱스플라이어(AppsFlyer Ltd.)</td>
                  <td>SNS 광고게시</td>
                  <td>탈퇴 시까지</td>
                </tr>
                <tr>
                  <td>닉네임, 휴대폰, 이메일 등</td>
                  <td>미국</td>
                  <td>브레이즈(braze. Inc.)</td>
                  <td>맞춤형 광고 및 안내 발송</td>
                  <td>탈퇴 후 3개월</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 제7조 */}
        <section id="terms-article-7">
          <span className="section-title">제7조 가명정보 처리에 관한 사항</span>
          <p>
            회사는 통계작성, 과학적 연구 등을 위하여 특정 개인을 알아볼 수 없도록 가명처리하여
            활용합니다.
          </p>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>처리 목적</th>
                  <th>처리 항목</th>
                  <th>처리 기간</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>이용 추이 및 형태 분석, 개인화 서비스 연구</td>
                  <td>회원번호, 성별, 생년월일, 시청/검색 이력</td>
                  <td>Wavve 서비스 종료 시까지</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 제8조 */}
        <section id="terms-article-8">
          <span className="section-title">제8조 개인정보 안전성 확보조치</span>
          <ul>
            <li>
              <strong>관리적 조치:</strong> 내부관리계획 수립·시행, 정기적 직원 교육
            </li>
            <li>
              <strong>기술적 조치:</strong> 접근권한 관리, 개인정보 암호화, 보안프로그램 설치
            </li>
            <li>
              <strong>물리적 조치:</strong> 보호구역 지정, 출입통제 시스템 운영
            </li>
          </ul>
        </section>

        {/* 제9조 */}
        <section id="terms-article-9">
          <span className="section-title">
            제9조 개인정보 자동 수집 장치의 설치·운영 및 그 거부에 관한 사항
          </span>
          <p>
            회사는 서비스 이용과정에서 회원에게 최적화된 편의를 제공하기 위해 ‘쿠키(Cookie)’를
            사용합니다.
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
                  <td rowSpan={2}>웹 브라우저</td>
                  <td>Chrome</td>
                  <td>
                    설정 {">"} 개인정보 및 보안 {">"} 인터넷 사용 기록 삭제
                  </td>
                </tr>
                <tr>
                  <td>Safari</td>
                  <td>환경설정 {">"} 크로스 사이트 추적 방지 및 모든 쿠키 차단</td>
                </tr>
                <tr>
                  <td>모바일 앱</td>
                  <td>Android / iOS</td>
                  <td>
                    단말기 설정 {">"} 개인정보 보호 {">"} 광고 추적 제한
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
        {/* 제10조 */}
        <section id="terms-article-10">
          <span className="section-title">제10조 이용자 권리·의무 및 행사 방법</span>
          <p>
            이용자는 언제든지 등록되어 있는 자신의 개인정보를 열람하거나 수정할 수 있으며,
            가입해지를 요청할 수 있습니다.
          </p>
          <ul>
            <li>열람/정정: 마이페이지 {">"} 회원정보 수정</li>
            <li>탈퇴/삭제: 마이페이지 {">"} 회원탈퇴</li>
          </ul>
          <div className="table-wrapper">
            <table>
              <tbody>
                <tr>
                  <th rowSpan={2}>고충처리 부서</th>
                  <td>전화번호</td>
                  <td>1599-3709</td>
                </tr>
                <tr>
                  <td>이메일</td>
                  <td>privacy@wavve.com</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
        {/* 제11조 */}
        <section id="terms-article-11">
          <span className="section-title">제11조 개인정보 보호책임자</span>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>구분</th>
                  <th>성명</th>
                  <th>소속</th>
                  <th>연락처</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>보호책임자</td>
                  <td>신홍식</td>
                  <td>서비스그룹</td>
                  <td>1599-3709 / privacy@wavve.com</td>
                </tr>
                <tr>
                  <td>담당자</td>
                  <td>이상진</td>
                  <td>CEM</td>
                  <td>1599-3709 / privacy@wavve.com</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 제12조 */}
        <section id="terms-article-12">
          <span className="section-title">제12조 권익침해에 대한 구제방법</span>
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
                <tr>
                  <td>대검찰청 사이버수사과</td>
                  <td>1301</td>
                  <td>www.spo.go.kr</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
        {/* 제13조 */}
        <section id="terms-article-13">
          <span className="section-title">제13조 개인정보 처리방침의 변경에 관한 사항</span>
          <p>
            법령 개정이나 서비스 개선 및 변경 등으로 인해 개인정보 처리방침이 변경되는 경우, 변경
            사항을 사전에 공지사항을 통해 안내드리겠습니다.
          </p>
          <p>
            본 개인정보 처리방침은 <strong>2025년 6월 16일</strong>부터 적용합니다.
          </p>
        </section>

        {/* 부칙 */}
        <div className="addendum">
          <p className="section-title">부칙</p>
          <ul className="addendum-list">
            {ADD_DATES.map((date, index) => (
              <li key={index}>(시행일) 이 약관은 {date}부터 시행합니다.</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AgreementPrivacy;
