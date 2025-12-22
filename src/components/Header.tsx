import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './scss/Header.scss';
import { useAuthStore } from '../stores/useAuthStore';
import SearchOverlay from './SearchOverlay';

interface MenuItem {
    id: number;
    title: string;
    path: string;
}

const mainMenu: MenuItem[] = [
    { id: 1, title: '예능', path: '/entertainment' },
    { id: 2, title: '드라마', path: '/drama' },
    { id: 3, title: '영화', path: '/movie' },
    { id: 4, title: '해외 시리즈', path: '/overseasSeries' },
    { id: 5, title: '애니메이션', path: '/animation' },
    { id: 6, title: '키즈', path: '/kids' },
    // { id: 7, title: "COMMON", path: "/Common" },
];

const Header = () => {
    const { user, onLogout, selectedCharId, selectedCharNickname } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();
    const [searchOpen, setSearchOpen] = useState<boolean>(false);
    const [isScrolled, setIsScrolled] = useState(false);

    // 1. 숨김 처리가 필요한 모든 경로 정의
    const currentPath = location.pathname.toLowerCase();

    // 인트로(Root), 로그인, 회원가입, 프로필 선택 페이지 여부
    const isHidePage =
        currentPath === '/' ||
        currentPath.includes('/login') ||
        currentPath.includes('/signup') ||
        currentPath.includes('/choice-char');

    const isKidsMode = selectedCharId === 4;

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 90);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const userInitial = selectedCharNickname ? selectedCharNickname.charAt(0) : user ? 'U' : 'W';
    const charClass = selectedCharId ? `char-${selectedCharId}` : 'char-1';

    const handleLogout = async () => {
        await onLogout();
        navigate('/');
    };

    return (
        <>
            <header className={isScrolled ? 'active' : ''}>
                <div className="inner">
                    <div className="header-left">
                        <h1 className="logo">
                            {/* 인트로, 로그인, 회원가입, 프로필변경, 키즈모드일 때는 링크 없이 로고 이미지만 표시 */}
                            {!isHidePage && !isKidsMode ? (
                                <Link to={'/home'}>
                                    <img
                                        src={
                                            isScrolled
                                                ? '/images/badge/badge-wavve-logo-blue.svg'
                                                : '/images/badge/badge-wavve-logo-white.svg'
                                        }
                                        alt="홈으로 이동"
                                    />
                                </Link>
                            ) : (
                                <img
                                    src={
                                        // 인트로(/)나 프로필변경 등 특정 페이지에서는 스크롤 상관없이 특정 색상 로고를 고정하고 싶다면 여기서 조건부 처리 가능
                                        isScrolled || isHidePage
                                            ? '/images/badge/badge-wavve-logo-blue.svg'
                                            : '/images/badge/badge-wavve-logo-white.svg'
                                    }
                                    alt="로고"
                                />
                            )}
                        </h1>

                        {/* 특정 페이지가 아닐 때만 메인 메뉴 표시 */}
                        {!isHidePage && (
                            <ul className="main-menu">
                                {isKidsMode
                                    ? mainMenu
                                          .filter((m) => m.path === '/kids')
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

                    {/* 특정 페이지가 아닐 때만 우측 영역(검색, 유저정보) 표시 */}
                    {!isHidePage && (
                        <div className="header-right">
                            {!isKidsMode && (
                                <p
                                    className="search"
                                    onClick={() => setSearchOpen((prev) => !prev)}
                                >
                                    <span>검색</span>
                                </p>
                            )}
                            {!user ? (
                                <p className="login">
                                    <Link className="font-wave" to={'/login'}>
                                        웨이브 시작하기
                                    </Link>
                                </p>
                            ) : (
                                <div className="user-info">
                                    <p className={`user ${charClass}`}>{userInitial}</p>
                                    <ul className="user-list">
                                        <li>
                                            <Link to={'/profile'}>마이페이지</Link>
                                        </li>
                                        <li>
                                            <Link to={'/ticket'}>웨이브 이용권</Link>
                                        </li>
                                        <li>
                                            <Link to={'/service-center'}>고객센터</Link>
                                        </li>
                                        <li>
                                            <Link to={'/choice-char'}>프로필변경</Link>
                                        </li>
                                        <li>
                                            <button
                                                onClick={handleLogout}
                                                className="btn small secondary-line"
                                            >
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

            {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
        </>
    );
};

export default Header;
