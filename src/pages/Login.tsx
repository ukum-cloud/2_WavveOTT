import "./scss/Login.scss";
import "../style/common-button.scss";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <main>
      <div className="login">
        <h2>로그인</h2>
        <p>Wavve 계정으로 로그인</p>
        <form action="">
          <label className="input-text">
            <span className="label-text">이메일 주소 또는 아이디</span>
            <input type="text" />
          </label>
          <label className="input-text">
            <span className="label-text">비밀번호</span>
            <input type="password" />
          </label>
          <div className="save-id">
            <label>
              <input type="checkbox" name="" /> 아이디저장
            </label>
          </div>
        </form>
        <div className="btn-box">
          <button type="submit" className="btn middle primary wFull">로그인</button>
          <ul className="division-list">
            <li>아이디 찾기</li>
            <li>비밀번호 재설정</li>
            <li><Link to={'/signup'}>회원가입</Link></li>
          </ul>
        </div>
        <div className="btn-box-other">
          <p>또는 다른 서비스 계정으로 로그인</p>
          <ul className="division-list">
            <li><Link to={'/'}>카카오</Link></li>
            <li><Link to={'/'}>티</Link></li>
            <li><Link to={'/'}>네이버</Link></li>
            <li><Link to={'/'}>페이스북</Link></li>
            <li><Link to={'/'}>애플</Link></li>
          </ul>
        </div>
      </div>
    </main>
  );
};

export default Login;
