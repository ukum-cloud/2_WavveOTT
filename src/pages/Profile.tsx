import "./scss/Profile.scss";
const Profile = () => {
  return (
    <main className="profile-wrap">
      <div className="inner">
        <section className="card-list">
          <h2>회원정보</h2>
          <div>내용</div>
        </section>
        <section className="card-list">
          <h2>제목입니다</h2>
          <div>내용</div>
        </section>
        <div className="">inner 안에서만 보여지면 되는 컨텐츠</div>
      </div>
    </main>
  );
};

export default Profile;
