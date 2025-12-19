import { useParams, useNavigate } from "react-router-dom";
import { eventData } from "../data/eventData";
import "./scss/EventDetail.scss";

const EventDetail = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const event = eventData.find((e) => e.id === Number(eventId));

  if (!event) {
    return (
      <main>
        <div className="inner">
          <section>
            <h2>오류</h2>
            <p>존재하지 않는 이벤트입니다.</p>
            <button onClick={() => navigate("/event")}>
              ← 목록으로 돌아가기
            </button>
          </section>
        </div>
      </main>
    );
  }
  return (
    <main className="event-detail-wrap">
      <div className="inner">
        <section>
         
          {/* <h2>Event detail</h2> */}
          <div className="event-detail">
            <div className="event-detail-top">
              <div className="event-title-wrap">
                <h3>{event.title}</h3>
                <p>{event.date}</p>
              </div>
              <button
                className="btn default primary"
                onClick={() => navigate("/event")}
              >
                이벤트 목록
              </button>
            </div>
            <div className="img-box">
              <img src={event.imgUrl} alt={event.title} />
            </div>
            <button className="btn default primary" onClick={() => navigate("/event")}>이벤트 목록</button>
          </div>
          
        </section>
      </div>
    </main>
  );
};

export default EventDetail;
