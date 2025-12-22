import './scss/BottomMenu.scss';

import { Link } from 'react-router-dom';
interface MenuItem {
    id: number;
    title: string;
    imgUrl: string;
    hoverimg: string;
    path: string;
}

const bottomMenu: MenuItem[] = [
    {
        id: 1,
        title: 'category',
        imgUrl: '/images/icons/icon-category-default.svg',
        hoverimg: '/images/icons/icon-category-hover.svg',
        path: '/category',
    },
    {
        id: 2,
        title: 'credit',
        imgUrl: './images/icons/icon-credit-default.svg',
        hoverimg: '/images/icons/icon-credit-hover.svg',
        path: '/ticket',
    },
    {
        id: 3,
        title: 'home',
        imgUrl: './images/icons/icon-home-default.svg',
        hoverimg: '/images/icons/icon-home-hover.svg',
        path: '/home',
    },
    {
        id: 4,
        title: 'heart',
        imgUrl: './images/icons/icon-heartList-default.svg',
        hoverimg: '/images/icons/icon-heartList-hover.svg',
        path: '/profile',
    },
    {
        id: 5,
        title: 'search',
        imgUrl: './images/icons/icon-search-default.svg',
        hoverimg: '/images/icons/icon-search-hover.svg',
        path: '/search',
    },
];
const BottomMenu = () => {
    return (
        <div className="BottomMenu">
            <ul>
                {bottomMenu.map((menu) => (
                    <li key={menu.id}>
                        <Link to={menu.path}>
                            <img className="defaultimg" src={menu.imgUrl} alt={menu.title} />
                            {/* <span>{menu.title}</span> */}
                            <img className="hoverimg" src={menu.hoverimg} alt={menu.title} />
                        </Link>
                    </li>
                ))}
                {/* <li>
                    <button>
                        <img src="" alt="" />
                        <span>menu</span>
                    </button>
                </li> */}
            </ul>
        </div>
    );
};

export default BottomMenu;
