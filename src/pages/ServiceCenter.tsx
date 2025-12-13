import { NavLink, Outlet } from "react-router-dom";
import "./scss/ServiceCenter.scss";
const ServiceCenter = () => {
  return (
    <main className="service-center-wrap">
      <div className="inner">
        <section>
          <h2>고객센터</h2>
          <div>
            <ul className="service-list">
              <li>
                <NavLink to="." end className={({ isActive }) =>
                  (isActive || window.location.pathname.includes('/service-center/notice'))
                    ? 'active'
                    : ''}>
                  공지사항
                </NavLink>
              </li>
              <li>
                <NavLink to="userQna" className={({ isActive }) => isActive ? 'active' : ''}>
                  1:1 문의
                </NavLink>
              </li>
              <li>
                <NavLink to="agreement" className={({ isActive }) => isActive ? 'active' : ''}>
                  이용약관
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

export default ServiceCenter;
