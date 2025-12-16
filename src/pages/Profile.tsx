import { Link } from "react-router-dom";
import "./scss/Profile.scss";
import { useAuthStore } from "../stores/useAuthStore";
const Profile = () => {
  const { selectedCharId, selectedCharNickname } = useAuthStore();
  // 기본값 설정 (선택된 캐릭터가 없을 경우)
  const charId = selectedCharId || 1; // 기본값
  const charNickname = selectedCharNickname || "선택 안됨"; // 기본 닉네임
  // 동적 클래스 이름 생성
  const charClass = `img-box char-${charId}`;

  return (
    <main className="profile-wrap">
      <div className="inner">
        <section className="my-box">
          <div className="my-profile-wrap">
            <div className={charClass}></div>
            <div className="text-name">{charNickname}</div>
            <div className="">
              <Link to={"/choice-char"} className="btn small secondary-line">
                프로필 변경
              </Link>
            </div>
          </div>
          <div className="my-ticket-wrap">
            <div className="text-ticket">
              <p className="badge-text-type">이용권</p>
              <p className="ticket-title">프리미엄</p>
              <p className="ticket-price">
                <span className="month">12개월</span>
                <span className="text-coast">
                  <strong>139,000</strong>
                  <span>원</span>
                </span>
              </p>
            </div>
            <div className="btn-box">
              <Link className="btn default primary wFull" to={"/ticket"}>
                이용권 보러가기
              </Link>
            </div>
          </div>
        </section>
        <section className="card-list">
          <h2>시청 내역</h2>
          <div>내용</div>
        </section>
        <section className="card-list">
          <h2>찜 리스트</h2>
          <div>내용</div>
        </section>
      </div>
    </main>
  );
};

export default Profile;
