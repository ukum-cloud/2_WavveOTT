import { Link } from 'react-router-dom';
import './scss/SideMenu.scss';

const mainMenu = [
    { id: 1, title: '예능', path: '/entertainment' },
    { id: 2, title: '드라마', path: '/drama' },
    { id: 3, title: '영화', path: '/movie' },
    { id: 4, title: '해외 시리즈', path: '/overseasSeries' },
    { id: 5, title: '애니메이션', path: '/animation' },
    { id: 6, title: '키즈', path: '/kids' },
    { id: 7, title: 'MBC', path: '/mbc' },
    { id: 8, title: 'KBS', path: '/kbs' },
    { id: 9, title: 'JTBC', path: '/jtbc' },
    { id: 10, title: 'CJenm', path: '/cjenm' },
];

interface SideMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

const SideMenu = ({ isOpen, onClose }: SideMenuProps) => {
    return (
        <div className={`sidemenu-wrapper ${isOpen ? 'active' : ''}`}>
            {/* 배경 클릭 시 닫힘 */}
            <div className="side-menu-overlay" onClick={onClose} />

            <div className="side-menu-container">
                <div className="side-menu-header">
                    <h3>전체 카테고리</h3>
                    <button className="close-btn" onClick={onClose}>
                        <img src="/images/icons/icon-close.svg" alt="닫기" />
                    </button>
                </div>

                <ul className="side-menu-list">
                    {mainMenu.map((menu) => (
                        <li key={menu.id} onClick={onClose}>
                            <Link to={menu.path} className="menu-link">
                                {menu.title}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default SideMenu;
