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

  const [nickname, setNickname] = useState(selectedCharNickname || "");
  // 수정 모드 상태 추가 (true면 input 노출, false면 텍스트 노출)
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!isInitializing) {
      if (!user) {
        navigate("/login");
      } else if (!selectedCharId) {
        navigate("/choice-char");
      }
    }
  }, [user, selectedCharId, isInitializing, navigate]);

  if (isInitializing || !user || !selectedCharId) {
    return <div className="loading">로딩 중...</div>;
  }

  const charId = selectedCharId || 1;
  const charClass = `img-box char-${charId}`;

  const handleSave = async () => {
    // 공백 제외 체크
    const trimmedNickname = nickname.trim();

    if (trimmedNickname === "") {
      alert("닉네임을 입력해주세요.");
      setNickname(selectedCharNickname || "");
      setIsEditing(false);
      return;
    }

    // 10자 초과 체크
    if (trimmedNickname.length > 10) {
      alert("닉네임은 최대 10자까지만 가능합니다.");
      setNickname(selectedCharNickname || "");
      setIsEditing(false);
      return;
    }

    if (trimmedNickname !== selectedCharNickname) {
      await updateNickname(trimmedNickname);
    }

    setIsEditing(false);
  };

  return (
    <main className="profile-wrap">
      <div className="inner">
        <section className="my-box">
          <div className="my-profile-wrap">
            <div className={charClass}></div>
            <div className="text-name">
              {/* 일반 모드: 닉네임 텍스트 표시 */}
              {!isEditing ? (
                <p className="nickname">
                  <span>{selectedCharNickname}</span>
                  <span>
                    <button onClick={() => setIsEditing(true)}>
                      <img
                        src="/images/button/btn-modify.svg"
                        alt="닉네임수정"
                      />
                    </button>
                  </span>
                </p>
              ) : (
                /* 수정 모드: 인풋 창 표시 */
                <p className="nickname-modify">
                  <input
                    autoFocus // 클릭 시 바로 포커스
                    type="text"
                    placeholder="10자 이내 가능"
                    defaultValue={selectedCharNickname || ""}
                    onChange={(e) => setNickname(e.target.value)}
                    onBlur={handleSave} // 포커스 잃으면 저장
                    onKeyDown={(e) => e.key === "Enter" && handleSave()} // 엔터 치면 저장
                  />
                  <button onClick={handleSave}>
                    <img src="/images/button/btn-modify.svg" alt="닉네임수정" />
                  </button>
                </p>
              )}
            </div>
            <div>
              <Link to={"/choice-char"} className="btn small secondary-line">
                프로필 전환
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
