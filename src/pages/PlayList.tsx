import "./scss/PlayList.scss";
const PlayList = () => {
  return (
    <main className="play-list-wrap">
      <div className="inner">
        <section className="card-list">
          <h2>시청 리스트</h2>
          <div>내용</div>
        </section>
        <div className="">inner 안에서만 보여지면 되는 컨텐츠</div>
      </div>
    </main>
  );
};

export default PlayList;
