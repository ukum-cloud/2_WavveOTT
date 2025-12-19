import { useNavigate } from "react-router-dom";
import { eventData } from "../data/eventData";
import type { EventType } from "../types/etc";
import "./scss/Event.scss";

const Event = () => {
  const navigate = useNavigate();
  return (
    <ul className="event-list">
      {eventData.map((e: EventType) => (
        <li key={e.id} onClick={() => navigate(`event/${e.id}`)}>
          <div className="img-box">
            <img src={e.imgThumb} alt={e.title} />
          </div>
          <div className="text-box">
            <h3>{e.title}</h3>
            <dl>
              <dt>기간기간</dt>
              <dd>{e.date}</dd>
            </dl>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default Event;
