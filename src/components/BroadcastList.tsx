import { Link } from 'react-router-dom';
import './scss/BroadcastList.scss';

interface LogoBtn {
    id: number;
    name: string;
    image: string;
    url: string;
}

const broadcastBtns: LogoBtn[] = [
    {
        id: 1,
        name: '연말결산',
        image: '/images/badge/badge-2025-logo.svg',
        url: '/recap',
    },
    {
        id: 2,
        name: 'mbc',
        image: '/images/badge/badge-mbc-logo.svg',
        url: '/mbc',
    },
    {
        id: 3,
        name: 'kbs',
        image: '/images/badge/badge-kbs-logo.svg',
        url: '/kbs',
    },
    {
        id: 4,
        name: 'jtbc',
        image: '/images/badge/badge-jtbc-logo.svg',
        url: '/jtbc',
    },
    {
        id: 5,
        name: 'cjenm',
        image: '/images/badge/badge-cjenm-logo.svg',
        url: '/cjenm',
    },
    {
        id: 6,
        name: '키즈',
        image: '/images/badge/badge-키즈-logo.svg',
        url: '/kids',
    },
];

const BroadcastList = () => {
    return (
        <div className="broadcast-list">
            {broadcastBtns.map((b) => (
                <div className="broadcast-box" key={b.id}>
                    <Link to={b.url}>
                        <img src={b.image} alt={b.name} />
                    </Link>
                </div>
            ))}
        </div>
    );
};

export default BroadcastList;
