import { Link } from "react-router-dom";
import "./scss/Footer.scss";
const Footer = () => {
  return (
    <footer>
      <div className="inner">
        <div className="chatbotNtopBtn">
          <p className="chatbot">
            <span className="hidden">chatbot</span>
          </p>
          <p className="goToTop">
            <span className="hidden">go to top</span>
          </p>
        </div>
        <div className="footer-item">
          <div className="footer-left">
            <div className="left-top">
              <p className="font-russo">이용약관</p>
              <p className="font-russo">개인정보처리방침</p>
              <p className="font-russo">서비스 소개</p>
              <p className="font-russo">
                <Link to="/event">이벤트</Link>
              </p>
            </div>
            <div className="left-bottom">
              <p>콘텐츠웨이브 주식회사 | 대표이사 서장호</p>
              <p>
                사업자등록번호 220-88-38020호스팅서비스제공자 : 마이크로소프트
                유한회사, 구글클라우드코리아 유한회사, 아마존웹서비시즈코리아
                유한회사
              </p>
              <p>
                통신판매업 신고번호 : 제 2021-서울영등포-0585호 | 통신판매업
                정보 공개 :
                https://www.ftc.go.kr/bizCommPop.do?wrkr_no=2208838020
              </p>
              <p>
                서울특별시 영등포구 여의나루로 60 포스트타워 15층 | 전자우편주소
                : helpdesk@wavve.com
              </p>
            </div>
          </div>
          <div className="footer-right">
            <div className="right-item">
              <p className="item-title font-wave">고객센터</p>
              <p className="item-phone">1599-3709</p>
              <p className="work-hour">
                평일 09:00~17:00 / 점심시간 12:00~13:00 <br />
                주말 및 공휴일 휴무
              </p>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-logo">
            <img
              src="/images/badge/badge-wavve-logo-gray.svg"
              alt="footer logo"
            />
          </div>
          <div className="app-icon-box">
            <Link to={`https://www.youtube.com/@wavve`}>
              <p>
                <img src="/images/icons/icon-youtube.svg" alt="Youtube Icon" />
              </p>
            </Link>
            <Link
              to={`https://www.instagram.com/accounts/login/?next=%2Fwavve.official%2F&source=omni_redirect`}
            >
              <p>
                <img src="/images/icons/icon-Insta.svg" alt="Insta Icon" />
              </p>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
