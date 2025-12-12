// pages/EventDetail.tsx
import { useParams, useNavigate } from "react-router-dom";
import "./scss/Event.scss";
import { eventData } from "../data/eventData";

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
    <main>
      <div className="inner">
        <section>
          <button onClick={() => navigate("/event")}>← 목록으로</button>
          <h2>Event detail</h2>
          <div className="event-detail">
            <button
              className="btn small primary"
              onClick={() => navigate("/event")}
            >
              ← 목록으로 돌아가기
            </button>
            <h3>{event.title}</h3>
            <p>{event.date}</p>
            <div className="img-box">
              <img src={event.imgUrl} alt={event.title} />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default EventDetail;
