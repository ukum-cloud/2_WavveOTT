import React from 'react';
import './scss/BottomMenu.scss';

import { Link } from 'react-router-dom';
interface MenuItem {
    id: number;
    title: string;
    imgUrl: string;
    path: string;
}

const bottomMenu: MenuItem[] = [
    { id: 1, title: 'home', imgUrl: './', path: '/' },
    { id: 2, title: 'watching', imgUrl: '', path: '/profile' },
    { id: 3, title: 'like', imgUrl: '', path: '/profile' },
];
const BottomMenu = () => {
    return (
        <div className="BottomMenu">
            <ul>
                {bottomMenu.map((menu) => (
                    <li key={menu.id}>
                        <Link to={menu.path}>
                            <img src={menu.imgUrl} alt={menu.title} />
                            <span>{menu.title}</span>
                        </Link>
                    </li>
                ))}
                <li>
                    <button>
                        <img src="" alt="" />
                        <span>menu</span>
                    </button>
                </li>
            </ul>
        </div>
    );
};

export default BottomMenu;
