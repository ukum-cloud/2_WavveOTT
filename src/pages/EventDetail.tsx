import { useParams, useNavigate } from "react-router-dom";
import { eventData } from "../data/eventData";
import "./scss/EventDetail.scss";

const EventDetail = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const event = eventData.find((e) => e.id === Number(eventId));

  if (!event) {
    return (
      <>
        <p>존재하지 않는 이벤트입니다.</p>
        <button
          className="btn defaul primary"
          onClick={() => navigate("/event")}
        >
          ← 목록으로 돌아가기
        </button>
      </>
    );
  }
  return (
    <>
      <button onClick={() => navigate("/event")}>← 목록으로</button>
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
    </>
  );
};

export default EventDetail;
