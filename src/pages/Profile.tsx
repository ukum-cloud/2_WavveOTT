import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./scss/Profile.scss";
import { useAuthStore } from "../stores/useAuthStore";
import UserPickList from "../components/UserPickList";
import UserWatchList from "../components/UserWatchList";
import { usePickStore } from "../stores/usePickStore";
import EmptyList from "../components/EmptyList";

const Profile = () => {
  const {
    user,
    selectedCharId,
    selectedCharNickname,
    updateNickname,
    isInitializing,
    myTicket, // 저장된 이용권 가져오기
  } = useAuthStore();
  const navigate = useNavigate();
  const { pickList } = usePickStore();

  const [nickname, setNickname] = useState(selectedCharNickname || "");
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
    const trimmedNickname = nickname.trim();
    if (trimmedNickname === "") {
      alert("닉네임을 입력해주세요.");
      setNickname(selectedCharNickname || "");
      setIsEditing(false);
      return;
    }
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
                <p className="nickname-modify">
                  <input
                    autoFocus
                    type="text"
                    placeholder="10자 이내 가능"
                    defaultValue={selectedCharNickname || ""}
                    onChange={(e) => setNickname(e.target.value)}
                    onBlur={handleSave}
                    onKeyDown={(e) => e.key === "Enter" && handleSave()}
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
              {myTicket ? (
                <>
                  <p className="ticket-title">{myTicket.title}</p>
                  <p className="ticket-price">
                    <span className="month">{myTicket.period}</span>
                    <span className="text-coast">
                      <strong>{myTicket.price.toLocaleString()}</strong>
                      <span>원</span>
                    </span>
                  </p>
                </>
              ) : (
                <>
                  <p className="ticket-title">사용 중인 이용권이 없습니다.</p>
                  <p className="ticket-price">지금 바로 웨이브를 즐겨보세요!</p>
                </>
              )}
            </div>
            <div className="btn-box">
              <Link className="btn default primary wFull" to={"/ticket"}>
                {myTicket ? "이용권 변경하기" : "이용권 보러가기"}
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
          {pickList.length === 0 ? (
            <EmptyList title="찜 리스트가 없어요" />
          ) : (
            <UserPickList />
          )}
        </section>
      </div>
    </main>
  );
};

export default Profile;
