import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./scss/Profile.scss";
import { useAuthStore } from "../stores/useAuthStore";
import UserPickList from "../components/UserPickList";
import UserWatchList from "../components/UserWatchList";

const Profile = () => {
  const {
    user,
    selectedCharId,
    selectedCharNickname,
    updateNickname,
    isInitializing,
  } = useAuthStore();
  const navigate = useNavigate();

  // 1. 에러 해결: useEffect 대신 초기값에 직접 할당
  const [nickname, setNickname] = useState(selectedCharNickname || "");

  // 2. 로그인 및 캐릭터 선택 체크 로직 (이 로직은 외부 시스템 이동이므로 유지)
  useEffect(() => {
    if (!isInitializing) {
      if (!user) {
        navigate("/login");
      } else if (!selectedCharId) {
        navigate("/choice-char");
      }
    }
  }, [user, selectedCharId, isInitializing, navigate]);

  // 3. 닉네임 동기화 useEffect 삭제됨 (이 부분이 에러의 원인이었음)

  if (isInitializing || !user || !selectedCharId) {
    return <div className="loading">로딩 중...</div>;
  }

  const charId = selectedCharId || 1;
  const charClass = `img-box char-${charId}`;

  const handleSave = () => {
    if (nickname.trim() === "") {
      alert("닉네임을 입력해주세요.");
      setNickname(selectedCharNickname || "");
      return;
    }

    if (nickname !== selectedCharNickname) {
      updateNickname(nickname);
    }
  };

  return (
    <main className="profile-wrap">
      <div className="inner">
        <section className="my-box">
          <div className="my-profile-wrap">
            <div className={charClass}></div>
            <div className="text-name">
              {/* key={selectedCharNickname}을 사용하면 
                스토어의 닉네임이 바뀔 때마다 input이 새로 그려지며 
                defaultValue가 자동으로 갱신됩니다. 
              */}
              <input
                key={selectedCharNickname}
                type="text"
                defaultValue={selectedCharNickname || ""}
                onChange={(e) => setNickname(e.target.value)}
                onBlur={handleSave}
                onKeyDown={(e) => e.key === "Enter" && handleSave()}
              />
            </div>
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
          <h2>{selectedCharNickname}님 시청 내역</h2>
          <UserWatchList />
        </section>

        <section className="card-list">
          <h2>찜 리스트</h2>
          <UserPickList />
        </section>
      </div>
    </main>
  );
};

export default Profile;
