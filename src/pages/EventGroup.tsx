import { NavLink, Outlet, useLocation } from "react-router-dom";
import "./scss/Event.scss";

const EventGroup = () => {
  const location = useLocation();

  return (
    <main className="event-group-wrap">
      <div className="inner">
        <section>
          <h2>EVENT</h2>
          <div>
            <ul className="event-list-tab">
              <li>
                <NavLink
                  to="."
                  end
                  className={({ isActive }) =>
                    // 1. 현재 경로가 기본(.)이거나
                    // 2. 경로에 'event-winner'가 포함되어 있지 않으면서 상세 페이지인 경우 활성화
                    isActive ||
                    (location.pathname.includes("/event") &&
                      !location.pathname.includes("event-winner"))
                      ? "active"
                      : ""
                  }
                >
                  진행중인 이벤트
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="event-winner"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  당첨자 발표
                </NavLink>
              </li>
            </ul>
            <Outlet />
          </div>
        </section>
      </div>
    </main>
  );
};

export default EventGroup;
