import "./scss/Favorite.scss";
const Favorite = () => {
  return (
    <main className="favorite-wrap">
      <div className="inner">
        <section className="card-list">
          <h2>찜리스트</h2>
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

export default Favorite;
