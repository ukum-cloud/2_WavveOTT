import { useState } from 'react';

import UserQnaDetail from '../components/UserQnaDetail';
import UserQnaList from '../components/UserQnaList';

import './scss/UserQna.scss';

const UserQna = () => {
    const [activeMenu, setActiveMenu] = useState('write');
    return (
        <div className="user-qna">
            <div className="qna-menu-wrap">
                <button
                    className={activeMenu === 'write' ? 'active' : 'qna-menu-btn'}
                    onClick={() => setActiveMenu('write')}
                >
                    1:1 문의하기
                </button>
                <button
                    className={activeMenu === 'list' ? 'active' : 'qna-menu-btn'}
                    onClick={() => setActiveMenu('list')}
                >
                    나의 문의 내역
                </button>
            </div>
            <div className="qna-menu-line"></div>
            {/* 메뉴 */}

            {activeMenu === 'write' && <UserQnaDetail />}
            {activeMenu === 'list' && <UserQnaList />}
        </div>
    );
};

export default UserQna;
