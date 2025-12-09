import "./scss/Signup.scss";
import "../style/common-button.scss";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";
import { useState } from "react";

const Signup = () => {
  const { onMember } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault(); //새로고침...
    try {
      await onMember(email, password);
      setEmail("");
      setPassword("");
      navigate("/");
    } catch (error: any) {
      console.log("경로이탈");
    }
  };
  return (
    <main>
      <div className="signup">
        <p className="title">
          <span>이메일과 비밀번호만으로</span>
          Wavve를 즐길 수 있어요!
        </p>
        <form onSubmit={handleSignup}>
          <label className="input-text">
            <span className="label-text">이메일</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="wavve@example.com"
            />
          </label>
          <p className="text-info">
            로그인, 비밀번호 찾기, 알림에 사용되니 정확한 이메일을 입력해
            주세요.
            {/* 5~50자의 이메일 형식으로 입력해주세요. */}
          </p>
          <label className="input-text">
            <span className="label-text">비밀번호 설정</span>
            <input
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <p className="text-info">
            비밀번호는 8~20자 이내로 영문 대소문자, 숫자, 특수문자 중 3가지 이상
            혼용하여 입력해 주세요.
            {/* 비밀번호는 8~20자 이내로 영문 대소문자, 숫자, 특수문자 중 3가지 이상 혼용하여 입력해 주세요.연속된 숫자 또는 4자 이상의 동일 문자는 비밀번호로 사용할 수 없습니다. */}
          </p>
          <div className="btn-box">
            <button type="submit" className="btn middle grey wFull">
              Wavve 회원가입
            </button>
          </div>
        </form>

        <div className="btn-box-other">
          <div>또는 다른 서비스 계정으로 로그인</div>
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
          <p className="text-info-dot">
            SNS계정으로 간편하게 가입하여 서비스를 이용하실 수 있습니다. 기존
            POOQ 계정 또는 Wavve 계정과는 연동되지 않으니 이용에 참고하세요.
          </p>
        </div>
      </div>
    </main>
  );
};

export default Signup;
