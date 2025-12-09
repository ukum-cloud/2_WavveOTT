import "./scss/Login.scss";
import "../style/common-button.scss";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";
import { useState } from "react";

const Login = () => {
  const { onLogin } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onLogin(email, password);
      setEmail(""); //로그인 후 데이터 지우기
      setPassword(""); // 로그인 후 데이터 지우기
      navigate("/"); // 로그인 후 첫 화면으로 이동
    } catch (err) {
      console.log("로그인 안됨....");
    }
  };
  const navigate = useNavigate();
  return (
    <main>
      <div className="login">
        <h2>로그인</h2>
        <p>Wavve 계정으로 로그인</p>
        <form onSubmit={handleLogin}>
          <label className="input-text">
            <span className="label-text">이메일 주소 또는 아이디</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일을 입력하세요"
            />
          </label>
          <label className="input-text">
            <span className="label-text">비밀번호</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
            />
          </label>
          <div className="save-id">
            <label>
              <input type="checkbox" name="" /> 아이디저장
            </label>
            <p>
              입력하신 정보에 해당하는 계정을 찾을 수 없습니다. ID, PW를 확인해
              주세요.
              <br />
              비밀번호를 입력해주세요.
              <br />
              입력하신 정보에 해당하는 계정을 찾을 수 없습니다. ID, PW를 확인해
              주세요.
            </p>
          </div>
          <div>
            <button type="submit" className="btn middle primary wFull">
              로그인
            </button>
          </div>
        </form>
        <div className="btn-box">
          <ul className="division-list">
            <li>아이디 찾기</li>
            <li>비밀번호 재설정</li>
            <li>
              <Link to={"/signup"}>회원가입</Link>
            </li>
          </ul>
        </div>
        <div className="btn-box-other">
          <p>또는 다른 서비스 계정으로 로그인</p>
          <ul className="division-list">
            <li>
              <Link to={"/"}>카카오</Link>
            </li>
            <li>
              <Link to={"/"}>티</Link>
            </li>
            <li>
              <Link to={"/"}>네이버</Link>
            </li>
            <li>
              <Link to={"/"}>페이스북</Link>
            </li>
            <li>
              <Link to={"/"}>애플</Link>
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
};

export default Login;
