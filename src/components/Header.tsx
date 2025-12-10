// Header.tsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./scss/Header.scss";
import { useAuthStore } from "../stores/useAuthStore";

interface MenuItem {
  id: number;
  title: string;
  path: string;
}

const mainMenu: MenuItem[] = [
  { id: 1, title: "예능", path: "/entertainment" },
  { id: 2, title: "드라마", path: "/drama" },
  { id: 3, title: "영화", path: "/movie" },
  { id: 4, title: "해외 시리즈", path: "/overseasSeries" },
  { id: 5, title: "시사교양", path: "/currentAffairs" },
  { id: 6, title: "애니메이션", path: "/animation" },
  { id: 7, title: "키즈", path: "/kids" },
  { id: 8, title: "Common", path: "/Common" },
];

const Header = () => {
  // 스토어에서 필요한 모든 상태 가져오기
  const { user, onLogout, selectedCharId, selectedCharNickname } =
    useAuthStore();

  const navigate = useNavigate();
  const location = useLocation();

  // 조건부 렌더링 (경로 확인)
  const isChoiceCharPage = location.pathname
    .toLowerCase()
    .includes("/choice-char");

  // 닉네임의 첫 글자 계산
  // 선택된 닉네임이 있으면 첫 글자를, 없으면 기본값 'W' 사용 (로그인된 상태 기준)
  const userInitial = selectedCharNickname
    ? selectedCharNickname.charAt(0)
    : user
    ? "U"
    : "W";

  // ID에 따른 동적 클래스 이름 계산 (예: char-1, char-2, ...)
  const charClass = selectedCharId ? `char-${selectedCharId}` : "char-1";

  const handleLogout = async () => {
    await onLogout();
    navigate("/");
  };

  return (
    <header>
      <div className="inner">
        <div className="header-left">
          <h1 className="logo">
            {/* ChoiceChar 페이지가 아닐 때만 Link를 렌더링 */}
            {!isChoiceCharPage ? (
              <Link to={"/"}>
                <img
                  src="/images/badge/badge-wavve-logo-white.svg"
                  alt="홈으로 이동"
                />
              </Link>
            ) : (
              // ChoiceChar 페이지일 때는 <Link> 없이 <img>만 렌더링
              <img src="/images/badge/badge-wavve-logo-white.svg" alt="로고" />
            )}
          </h1>

          {/* 조건: ChoiceChar 페이지가 아닐 때만 main-menu 렌더링 */}
          {!isChoiceCharPage && (
            <ul className="main-menu">
              {mainMenu.map((menu) => (
                <li key={menu.id}>
                  <Link className="font-wave" to={menu.path}>
                    {menu.title}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* 조건: ChoiceChar 페이지가 아닐 때만 header-right 렌더링 */}
        {!isChoiceCharPage && (
          <div className="header-right">
            <p className="search">
              <span>검색</span>
            </p>
            {!user ? (
              <p className="login">
                <Link className="font-wave" to={"/login"}>
                  웨이브시작하기
                </Link>
              </p>
            ) : (
              <div className="user-info">
                {/* 동적 클래스와 동적 첫 글자 적용 */}
                <p className={`user ${charClass}`}>{userInitial}</p>
                <ul className="user-list">
                  <li>
                    <Link to={"/profile"}>회원정보</Link>
                  </li>
                  <li>
                    <Link to={"/favorite"}>찜리스트</Link>
                  </li>
                  <li>
                    <Link to={"/playlist"}>시청리스트</Link>
                  </li>
                  <li>
                    <button onClick={handleLogout} className="btn sm primary">
                      로그아웃
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
