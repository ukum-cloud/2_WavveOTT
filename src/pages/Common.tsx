import "./scss/Common.scss";
const Common = () => {
  return (
    <main style={{ paddingTop: "90px" }}>
      <div className="">100% 다 쓰는 경우</div>
      <div className="inner">
        <ul className="common-btn-list">
          <li>
            <button className="btn xsmall primary">btn xsmall primary</button>
            <button className="btn xsmall secondary">
              btn xsmall secondary
            </button>
            <button className="btn xsmall secondary" disabled>
              btn xsmall disabled
            </button>
          </li>
          <li>
            <button className="btn small primary">btn small primary</button>
            <button className="btn small secondary">btn small secondary</button>
            <button className="btn small secondary" disabled>
              btn small disabled
            </button>
          </li>
          <li>
            <button className="btn default primary">btn default primary</button>
            <button className="btn default secondary">
              btn default secondary
            </button>
            <button className="btn default secondary" disabled>
              btn default disabled
            </button>
          </li>
          <li>
            <button className="btn large primary">btn large primary</button>
            <button className="btn large secondary">btn large secondary</button>
            <button className="btn large disabled" disabled>
              btn large disabled
            </button>
          </li>
          <li>
            <input type="text" value="" placeholder="SAMPLE" />
            <input type="text" disabled value="SAMPLE" />
          </li>
          <li>
            <input type="checkbox" />
            <input type="checkbox" checked />
          </li>
          <li>
            <input type="radio" name="a" />
            <input type="radio" name="a" checked />
          </li>
        </ul>
      </div>
      <div className="inner">
        <section className="card-list">
          <h2>제목입니다</h2>
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

export default Common;
