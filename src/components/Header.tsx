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

  // 키즈 캐릭터(ID: 4)가 선택되었는지 확인
  const isKidsMode = selectedCharId === 4;

  // 닉네임의 첫 글자 계산
  const userInitial = selectedCharNickname
    ? selectedCharNickname.charAt(0)
    : user
    ? "U"
    : "W";

  // ID에 따른 동적 클래스 이름 계산
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
            {/* 키즈 모드나 ChoiceChar 페이지에서는 로고 링크 비활성화 */}
            {!isChoiceCharPage && !isKidsMode ? (
              <Link to={"/"}>
                <img
                  src="/images/badge/badge-wavve-logo-white.svg"
                  alt="홈으로 이동"
                />
              </Link>
            ) : (
              <img
                src={
                  isChoiceCharPage
                    ? "/images/badge/badge-wavve-logo-blue.svg"
                    : "/images/badge/badge-wavve-logo-white.svg"
                }
                alt="로고"
              />
            )}
          </h1>

          {/* ChoiceChar 페이지에서는 메뉴 전체 숨김 */}
          {!isChoiceCharPage && (
            <ul className="main-menu">
              {/* 키즈 모드에서는 키즈 메뉴만, 다른 모드에서는 모든 메뉴 표시 */}
              {isKidsMode
                ? mainMenu
                    .filter((menu) => menu.path === "/kids")
                    .map((menu) => (
                      <li key={menu.id}>
                        <Link className="font-wave" to={menu.path}>
                          {menu.title}
                        </Link>
                      </li>
                    ))
                : mainMenu.map((menu) => (
                    <li key={menu.id}>
                      <Link className="font-wave" to={menu.path}>
                        {menu.title}
                      </Link>
                    </li>
                  ))}
            </ul>
          )}
        </div>

        {/* ChoiceChar 페이지에서만 header-right 전체 숨김 */}
        {!isChoiceCharPage && (
          <div className="header-right">
            {/* 키즈 모드에서는 검색 버튼만 숨김 */}
            {!isKidsMode && (
              <p className="search">
                <span>검색</span>
              </p>
            )}
            {!user ? (
              <p className="login">
                <Link className="font-wave" to={"/login"}>
                  웨이브시작하기
                </Link>
              </p>
            ) : (
              <div className="user-info">
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
                    <Link to={"/choice-char"}>프로필변경</Link>
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
