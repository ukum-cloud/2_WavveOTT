import "./scss/welcome.scss";
import "../style/common-button.scss";
import { Link } from "react-router-dom";


const Welcome = () => {

	return (
		<main>
			<div className="Welcome">
				<p className="img-check"><img src="/images/bg-check.svg" alt="" /></p>
				<div>
					<p className="text-welcome">
						<span>홍길동 님</span>
						웨이브 회원이 되신 걸 환영합니다!
					</p>
					<p>
						<span>지금 바로 이용권을 구독하고 오직 웨이브에서만	시청할 수 있는</span> 
						 영화를 무제한으로 시청해보세요!</p>
				</div>
				<button type="submit" className="btn large primary wFull">
					이용권 구독하기
				</button>
				<p className="link"><Link to='/choice-char'> 나중에 하기</Link></p>
			</div>
		</main>
	);
};

export default Welcome;