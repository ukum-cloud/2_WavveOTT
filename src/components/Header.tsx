import { Link, useNavigate } from 'react-router-dom';
import './scss/Header.scss';
import { useAuthStore } from '../stores/useAuthStore';
import { useState } from 'react';
interface MenuItem {
  id: number;
  title: string;
  path: string;
}
const mainMenu: MenuItem[] = [
  { id: 1, title: '예능', path: '/' },
  { id: 2, title: '드라마', path: '/' },
  { id: 3, title: '영화', path: '/' },
  { id: 4, title: '해외 시리즈', path: '/' },
  { id: 5, title: '시사교양', path: '/' },
  { id: 6, title: '애니메이션', path: '/' },
  { id: 7, title: '키즈', path: '/' },
  { id: 8, title: 'Common', path: '/Common' },
];
const Header = () => {
  const { user, onLogout } = useAuthStore();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const handleLogout = async () => {
    await onLogout();
    navigate('/');
  };
  return (
    <header>
      <div className="inner">
        <div className="header-left">
          <h1 className="logo">
            <Link to={'/'}>
              <img src="/images/badges/badge-wavve-logo-white" alt="" />
            </Link>
          </h1>
          <ul className="main-menu">
            {mainMenu.map((menu) => (
              <li key={menu.id}>
                <Link className="font-wave" to={menu.path}>
                  {menu.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="header-right">
          <p className="search">
            <span>검색</span>
          </p>
          {!user ? (
            <p className="login">
              <Link className="font-wave" to={'/login'}>
                웨이브시작하기
              </Link>
            </p>
          ) : (
            <div className="user-info">
              <p className="user">J</p>
              <ul className="user-list">
                <li>
                  <Link to={'/profile'}>회원정보</Link>
                </li>
                <li>
                  <Link to={'/favorite'}>찜리스트</Link>
                </li>
                <li>
                  <Link to={'/playlist'}>시청리스트</Link>
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
      </div>
    </header>
  );
};

export default Header;
