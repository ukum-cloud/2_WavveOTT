import "./scss/Login.scss";
import "../style/common-button.scss";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";
import { useState, useEffect, useMemo } from "react"; 
import EtcLogin from "../components/EtcLogin";

// 이메일 형식 검사를 위한 정규 표현식
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Login = () => {
  const { onLogin, onGoogleLogin } = useAuthStore();
  const navigate = useNavigate();

  const [email, setEmail] = useState(
    () => localStorage.getItem("savedEmail") || ""
  );
  const [password, setPassword] = useState("");
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

  // 폼 제출 가능 여부 검사 (이메일 유효, 이메일/비밀번호 필드 모두 비어있지 않음)
  const isFormValid = isEmailValid && email.length > 0 && password.length > 0;
  
  
  // 이메일 입력 핸들러 수정
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    // 입력이 시작되면 Dirty 상태를 true로 설정
    if (newEmail.length > 0) {
      setIsEmailDirty(true);
    }
  };
  
  // 비밀번호 입력 핸들러 수정 (Dirty 상태를 사용하지 않으므로 기존 로직 유지)
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };
  
  // 아이디 저장 체크박스 변경 시
  const handleautoIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setautoId(checked);

    if (!checked) {
      localStorage.removeItem("savedEmail");
      setEmail("");
    }
  };

  // 자동 로그인 체크박스 변경 시
  const handleautoPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setautoPassword(checked);

    if (!checked) {
      localStorage.removeItem("autoLogin");
      localStorage.removeItem("savedPassword");
      setPassword("");
    }
  };

  // 페이지 로드 시 저장된 비밀번호 불러오기
  useEffect(() => {
    const savedPassword = localStorage.getItem("savedPassword");
    if (savedPassword && autoPassword) {
      setPassword(savedPassword);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 폼 제출 시 유효성 검사 결과를 확실하게 표시
    setIsEmailDirty(true); 

    if (!isFormValid) {
      console.log("폼 유효성 검사 실패. 로그인할 수 없습니다.");
      return;
    }
    
    try {
      await onLogin(email, password);

      // 아이디 저장
      if (autoId) {
        localStorage.setItem("savedEmail", email);
      } else {
        localStorage.removeItem("savedEmail");
      }

      // 자동 로그인 설정 (비밀번호 저장)
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
      console.log("로그인 안됨....");
    }
  };

  const handleGoogle = async () => {
    const success = await onGoogleLogin();

    if (success) {
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
              onChange={handleEmailChange}
              placeholder="이메일을 입력하세요"
            />
            
            {isEmailDirty && email.length > 0 && !isEmailValid ? (
                // 오류 문구
                <p className="text-info error">
                    이메일 형식이 아닙니다.
                </p>
            ) : (
                // 일반 안내 문구
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
              // 버튼 비활성화 조건에 이메일 및 비밀번호 유효성 추가
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
        <EtcLogin handleGoogle={handleGoogle} />
      </div>
    </main>
  );
};

export default Login;