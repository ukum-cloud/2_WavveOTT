import "./scss/Login.scss";
import "../style/common-button.scss";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";
import { useState } from "react";
import EtcLogin from "../components/EtcLogin";

const Login = () => {
  const { onLogin, onGoogleLogin } = useAuthStore();
  const navigate = useNavigate();

  const [email, setEmail] = useState(
    () => localStorage.getItem("savedEmail") || ""
  );
  const [password, setPassword] = useState("");
  const [rememberId, setRememberId] = useState(
    () => !!localStorage.getItem("savedEmail")
  );

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onLogin(email, password);
      // 체크박스 상태에 따라 아이디 저장/삭제
      if (rememberId) {
        localStorage.setItem("savedEmail", email);
      } else {
        localStorage.removeItem("savedEmail");
      }

      setPassword(""); // 비밀번호만 비우기 (아이디는 저장할 수 있으니까 남겨도 됨)
      navigate("/choice-char"); // 로그인 후 첫 화면으로 이동
    } catch (err) {
      console.log("로그인 안됨....");
    }
  };
  const handleGoogle = async () => {
    const success = await onGoogleLogin(); // 로그인 액션 실행 및 결과 대기

    if (success) {
      // 성공했을 때만 페이지 이동 실행
      navigate("/choice-char");
    }
  };

  return (
    <main>
      <div className="login">
        <div>
          <h2>로그인</h2>
          <p>Wavve 계정으로 로그인</p>
        </div>

        <form onSubmit={handleLogin}>
          <label className="input-text">
            <span className="label-text">이메일</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일을 입력하세요"
            />
            <p className="text-info">
              로그인, 비밀번호 찾기, 알림에 사용되니 정확한 이메일을 입력해
              주세요.
              {/* 5~50자의 이메일 형식으로 입력해주세요. */}
            </p>
            <p>
              {/* 입력하신 정보에 해당하는 계정을 찾을 수 없습니다. ID, PW를 확인해
              주세요.
              <br />
              비밀번호를 입력해주세요.
              <br />
              입력하신 정보에 해당하는 계정을 찾을 수 없습니다. ID, PW를 확인해
              주세요. */}
            </p>
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
              {/* 체크박스 상태 연결 */}
              <input
                type="checkbox"
                checked={rememberId}
                onChange={(e) => setRememberId(e.target.checked)}
              />{" "}
              아이디저장
            </label>
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
        <EtcLogin handleGoogle={handleGoogle} />
      </div>
    </main>
  );
};

export default Login;
