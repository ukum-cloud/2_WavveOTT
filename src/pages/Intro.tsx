import { Link } from "react-router-dom";
import "./scss/Intro.scss";
const Intro = () => {
  return (
    <div className="intro-wrap">
      <section className="intro1"></section>
      <section className="intro2">
        <p className="text-intro2">
          <img src="/images/text-intro-why.svg" alt="왜 웨이브인가요?" />
        </p>
      </section>
      <section className="intro3">
        <p className="text-intro3">
          <img src="/images/text-intro-only.png" alt="오직 웨이브에서만" />
        </p>
      </section>
      <section className="intro4">
        <p className="text-intro4">
          <img
            src="/images/text-intro-now.svg"
            alt="지금 웨이브에서 시작해보세요"
          />
        </p>
        <div className="btn-box">
          <Link className="btn default primary" to={"/login"}>
            웨이브 시작하기
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Intro;
