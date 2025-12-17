import "./scss/Login.scss";
import "../style/common-button.scss";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";
import { useState, useMemo } from "react"; // ✅ useEffect 제거
import EtcLogin from "../components/EtcLogin";

// 이메일 형식 검사를 위한 정규 표현식
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Login = () => {
  const { onLogin, onGoogleLogin, onKakaoLogin } = useAuthStore();
  const navigate = useNavigate();

  const [email, setEmail] = useState(
    () => localStorage.getItem("savedEmail") || ""
  );

  // ✅ [수정 1] 비밀번호 초기값을 useState에서 처리
  const [password, setPassword] = useState(() => {
    const auto = localStorage.getItem("autoLogin") === "true";
    if (!auto) return "";
    return localStorage.getItem("savedPassword") ?? "";
  });

  const [autoId, setautoId] = useState(
    () => !!localStorage.getItem("savedEmail")
  );
  const [autoPassword, setautoPassword] = useState(
    () => !!localStorage.getItem("autoLogin")
  );

  //  유효성 검사 상태 추가
  const [isEmailDirty, setIsEmailDirty] = useState(false);

  // 이메일 유효성 검사 (useMemo)
  const isEmailValid = useMemo(() => emailRegex.test(email), [email]);

  // 폼 제출 가능 여부 검사
  const isFormValid = isEmailValid && email.length > 0 && password.length > 0;

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    if (newEmail.length > 0) {
      setIsEmailDirty(true);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleautoIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setautoId(checked);

    if (!checked) {
      localStorage.removeItem("savedEmail");
      setEmail("");
    }
  };

  const handleautoPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setautoPassword(checked);

    if (!checked) {
      localStorage.removeItem("autoLogin");
      localStorage.removeItem("savedPassword");
      setPassword("");
    }
  };

  // ❌ [수정 2] useEffect 완전히 제거
  // useEffect(() => {
  //   const savedPassword = localStorage.getItem("savedPassword");
  //   if (savedPassword && autoPassword) {
  //     setPassword(savedPassword);
  //   }
  // }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsEmailDirty(true);

    if (!isFormValid) {
      console.log("폼 유효성 검사 실패. 로그인할 수 없습니다.");
      return;
    }

    try {
      await onLogin(email, password);

      if (autoId) {
        localStorage.setItem("savedEmail", email);
      } else {
        localStorage.removeItem("savedEmail");
      }

      if (autoPassword) {
        localStorage.setItem("autoLogin", "true");
        localStorage.setItem("savedPassword", password);
      } else {
        localStorage.removeItem("autoLogin");
        localStorage.removeItem("savedPassword");
      }

      setPassword("");
      navigate("/choice-char");
    } catch (err) {
      console.log("로그인 안됨....", err);
    }
  };

  const handleGoogle = async () => {
    const success = await onGoogleLogin();
    if (success) {
      navigate("/choice-char");
    }
  };

  const handleKakao = async () => {
    await onKakaoLogin(navigate);
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
              onChange={handleEmailChange}
              placeholder="이메일을 입력하세요"
            />
            {isEmailDirty && email.length > 0 && !isEmailValid ? (
              <p className="text-info error">이메일 형식이 아닙니다.</p>
            ) : (
              <p className="text-info">
                로그인, 비밀번호 찾기, 알림에 사용되니 정확한 이메일을 입력해
                주세요.
              </p>
            )}
          </label>

          <label className="input-text">
            <span className="label-text">비밀번호</span>
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="비밀번호를 입력하세요"
            />
          </label>

          <div className="save-id">
            <label>
              <input
                type="checkbox"
                checked={autoId}
                onChange={handleautoIdChange}
              />{" "}
              아이디 저장
            </label>
            <label>
              <input
                type="checkbox"
                checked={autoPassword}
                onChange={handleautoPasswordChange}
              />{" "}
              자동로그인
            </label>
          </div>

          <div>
            <button
              type="submit"
              className="btn large primary wFull"
              disabled={!isFormValid}
            >
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

        <EtcLogin handleGoogle={handleGoogle} handleKakao={handleKakao} />
      </div>
    </main>
  );
};

export default Login;
