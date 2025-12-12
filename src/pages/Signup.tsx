import "./scss/Signup.scss";
import "../style/common-button.scss";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";
import { useState } from "react";
import EtcLogin from "../components/EtcLogin";

const Signup = () => {
  const { onMember, onGoogleLogin } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // 비밀번호가 6자 이상인지 확인
  const isPasswordValid = password.length >= 6;

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    // 버튼이 비활성화 상태(isPasswordValid가 false)일 때는 함수 실행을 막음
    if (!isPasswordValid) {
      console.log("비밀번호가 6자 미만입니다. 가입을 진행할 수 없습니다.");
      return;
    }

    try {
      await onMember(email, password);
      setEmail("");
      setPassword("");
      navigate("/welcome");
    } catch (error: any) {
      console.log("경로이탈");
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
      <div className="signup">
        <div>
          <h2>회원가입</h2>
          <p>이메일과 비밀번호만으로 간편하게 Wavve를 시작하세요!</p>
        </div>
        <form onSubmit={handleSignup}>
          <label className="input-text">
            <span className="label-text">이메일</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="wavve@example.com"
            />
            <p className="text-info">
              로그인, 비밀번호 찾기, 알림에 사용되니 정확한 이메일을 입력해
              주세요.
            </p>
          </label>

          <label className="input-text">
            <span className="label-text">비밀번호 설정</span>
            <input
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <p className="text-info">
              영문, 숫자, 특수문자(~!@#$%^&*) 조합 8~15 자리
            </p>
          </label>
          <div className="btn-box">
            <button
              type="submit"
              className="btn large primary wFull"
              disabled={!isPasswordValid}
            >
              <span className="font-wave">Wavve 가입하기</span>
            </button>
          </div>
        </form>
        <EtcLogin handleGoogle={handleGoogle} />
      </div>
    </main>
  );
};

export default Signup;
