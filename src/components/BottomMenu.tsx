import './scss/BottomMenu.scss';

import { Link } from 'react-router-dom';
interface MenuItem {
    id: number;
    title: string;
    imgUrl: string;
    path?: string;
}

const bottomMenu: MenuItem[] = [
    {
        id: 1,
        title: 'category',
        imgUrl: '/images/icons/icon-category.svg',
    },
    {
        id: 2,
        title: 'credit',
        imgUrl: './images/icons/icon-credit.svg',
        path: '/ticket',
    },
    {
        id: 3,
        title: 'home',
        imgUrl: './images/icons/icon-home.svg',
        path: '/home',
    },
    {
        id: 4,
        title: 'heart',
        imgUrl: './images/icons/icon-heartList.svg',
        path: '/profile',
    },
    {
        id: 5,
        title: 'search',
        imgUrl: './images/icons/icon-search-bottom.svg',
    },
];

interface BottomMenuProps {
    onOpenCategory: () => void;
    onOpenSearch: () => void;
}
// const BottomMenu = () => {
//     return (
//         <div className="BottomMenu">
//             <ul>
//                 {bottomMenu.map((menu) => (
//                     <li key={menu.id}>
//                         <Link to={menu.path}>
//                             <img className="defaultimg" src={menu.imgUrl} alt={menu.title} />
//                             {/* <span>{menu.title}</span> */}
//                         </Link>
//                     </li>
//                 ))}
//                 {/* <li>
//                     <button>
//                         <img src="" alt="" />
//                         <span>menu</span>
//                     </button>
//                 </li> */}
//             </ul>
//         </div>
//     );
// };
const BottomMenu = ({ onOpenCategory, onOpenSearch }: BottomMenuProps) => {
    return (
        <div className="BottomMenu">
            <ul>
                {bottomMenu.map((menu) => (
                    <li key={menu.id}>
                        {menu.path ? (
                            // 페이지가 있는 경우: Link 사용
                            <Link to={menu.path}>
                                <img className="defaultimg" src={menu.imgUrl} alt={menu.title} />
                            </Link>
                        ) : (
                            // 페이지가 없는 경우: button 사용
                            <button
                                type="button"
                                onClick={menu.title === 'category' ? onOpenCategory : onOpenSearch}
                                className="menu-button"
                            >
                                <img className="defaultimg" src={menu.imgUrl} alt={menu.title} />
                            </button>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default BottomMenu;
