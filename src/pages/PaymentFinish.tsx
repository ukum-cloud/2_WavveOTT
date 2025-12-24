import "./scss/welcome.scss";
import "../style/common-button.scss";
import { Link } from "react-router-dom";

const PaymentFinish = () => {
  return (
    <main>
      <div className="Welcome">
        <p className="img-check">
          <img src="/images/bg-check.svg" alt="check" />
        </p>
        <div>
          <p className="text-welcome">결제가 완료되었습니다!</p>
          <p>
            <span>지금 바로 웨이브의 인기 프로그램과</span>
            영화를 무제한으로 시청해보세요!
          </p>
        </div>
        <p className="btn-box col-2">
          <Link to={"/home"} className="btn large secondary-line">
            홈으로
          </Link>
          <Link to={"/profile"} className="btn large primary">
            나의 이용권 확인하기
          </Link>
        </p>
      </div>
    </main>
  );
};

export default PaymentFinish;
