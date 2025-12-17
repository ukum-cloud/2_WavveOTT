import "./scss/Signup.scss";
import "../style/common-button.scss";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";
import { useState, useMemo } from "react";
import EtcLogin from "../components/EtcLogin";

// 이메일 형식 검사를 위한 정규 표현식
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Signup = () => {
  const { onMember, onGoogleLogin, onKakaoLogin } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 이메일 필드에 입력이 있었는지 확인하는 상태 (오류 메시지 토글용)
  const [isEmailDirty, setIsEmailDirty] = useState(false);

  const navigate = useNavigate();

  // 이메일 유효성 검사
  const isEmailValid = useMemo(() => emailRegex.test(email), [email]);

  // 비밀번호 길이 검사 (6자 이상)
  const isPasswordValid = useMemo(() => password.length >= 6, [password]);

  // 최종 폼 유효성 검사: 이메일 유효 & 이메일 입력됨 & 비밀번호 6자 이상
  const isFormValid = isEmailValid && email.length > 0 && isPasswordValid;

  // 이메일 입력 핸들러
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);

    if (newEmail.length > 0) {
      setIsEmailDirty(true);
    }
  };

  // 비밀번호 입력 핸들러
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsEmailDirty(true); // 폼 제출 시 이메일 유효성 검사 결과를 표시

    // 최종 유효성 검사
    if (!isFormValid) {
      console.log("폼 유효성 검사 실패. 가입을 진행할 수 없습니다.");
      // 비밀번호가 6자 미만일 경우 추가 로그 출력 (선택 사항)
      if (!isPasswordValid) {
        console.log("비밀번호가 6자 미만입니다. 가입을 진행할 수 없습니다.");
      }
      return;
    }

    try {
      await onMember(email, password);
      setEmail("");
      setPassword("");
      navigate("/welcome");
    } catch (error: any) {
      console.log("경로이탈 또는 가입 실패 오류:", error);
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
      <div className="signup">
        <div>
          <h2>회원가입</h2>
          <p>이메일과 비밀번호만으로 간편하게 Wavve를 시작하세요!</p>
        </div>
        <form onSubmit={handleSignup}>
          {/* 이메일 입력 필드 */}
          <label className="input-text">
            <span className="label-text">이메일</span>
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="wavve@example.com"
            />

            {/* 이메일 안내 문구/오류 문구 토글 로직 */}
            {isEmailDirty && email.length > 0 && !isEmailValid ? (
              <p className="text-info error">이메일 형식이 아닙니다.</p>
            ) : (
              <p className="text-info">
                로그인, 비밀번호 찾기, 알림에 사용되니 정확한 이메일을 입력해
                주세요.
              </p>
            )}
          </label>

          {/* 비밀번호 입력 필드 */}
          <label className="input-text">
            <span className="label-text">비밀번호 설정</span>
            <input
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={handlePasswordChange}
            />
            <p className="text-info">
              영문, 숫자, 특수문자(~!@#$%^&*) 조합 8~15 자리
            </p>
          </label>

          <div className="btn-box">
            <button
              type="submit"
              className="btn large primary wFull"
              // 버튼 비활성화 조건: 이메일 유효성 + 비밀번호 길이 6자 이상 모두 만족
              disabled={!isFormValid}
            >
              <span className="font-wave">Wavve 가입하기</span>
            </button>
          </div>
        </form>
        <EtcLogin handleGoogle={handleGoogle} handleKakao={handleKakao} />
      </div>
    </main>
  );
};

export default Signup;
