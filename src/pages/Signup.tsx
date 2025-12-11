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
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault(); //새로고침...
    try {
      await onMember(email, password);
      setEmail("");
      setPassword("");
      navigate("/choice-char");
    } catch (error: any) {
      console.log("경로이탈");
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
              {/* 5~50자의 이메일 형식으로 입력해주세요. */}
            </p>
          </label>

          <label className="input-text">
            <span className="label-text">비밀번호 설정</span>
            <input
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled
            />
            <p className="text-info">
              영문, 숫자, 특수문자(~!@#$%^&*) 조합 8~15 자리
              {/* 비밀번호는 8~20자 이내로 영문 대소문자, 숫자, 특수문자 중 3가지 이상 혼용하여 입력해 주세요.연속된 숫자 또는 4자 이상의 동일 문자는 비밀번호로 사용할 수 없습니다. */}
            </p>
          </label>
          <div className="btn-box">
            <button type="submit" className="btn middle grey wFull">
              Wavve 회원가입
            </button>
          </div>
        </form>
        <EtcLogin handleGoogle={handleGoogle} />
      </div>
    </main>
  );
};

export default Signup;
