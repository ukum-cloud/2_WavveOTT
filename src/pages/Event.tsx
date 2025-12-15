import { useNavigate } from "react-router-dom";
import "./scss/Event.scss";
import { eventData } from "../data/eventData";
import type { EventType } from "../types/etc";

const Event = () => {
  const navigate = useNavigate();
  return (
    <main className="event-wrap">
      <div className="inner">
        <section>
          <h2>Event</h2>
          <ul className="event-list">
            {eventData.map((e: EventType) => (
              <li key={e.id} onClick={() => navigate(`/event/${e.id}`)}>
                <div className="img-box">
                  <img src={e.imgThumb} alt={e.title} />
                </div>
                <div className="text-box">
                  <h3>{e.title}</h3>
                  <dl>
                    <dt>기간</dt>
                    <dd>{e.date}</dd>
                  </dl>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
};

export default Event;
