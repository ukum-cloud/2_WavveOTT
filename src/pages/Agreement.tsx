import { useState } from 'react';
import './scss/Agreement.scss';
import AgreementService from '../components/AgreementService';
import AgreementPayment from '../components/AgreementPayment';
import AgreementPrivacy from '../components/AgreementPrivacy';
import AgreementWavveon from '../components/AgreementWavveon';

const Agreement = () => {
    const [activeMenu, setActiveMenu] = useState('service');
    return (
        <div className="agreement">
            <div className="agree-menu-wrap">
                <button
                    className={activeMenu === 'service' ? 'active' : 'agree-menu-btn'}
                    onClick={() => setActiveMenu('service')}
                >
                    서비스 이용약관
                </button>
                <button
                    className={activeMenu === 'payment' ? 'active' : 'agree-menu-btn'}
                    onClick={() => setActiveMenu('payment')}
                >
                    유료상품 이용약관
                </button>
                <button
                    className={activeMenu === 'privacy' ? 'active' : 'agree-menu-btn'}
                    onClick={() => setActiveMenu('privacy')}
                >
                    개인정보 처리방침
                </button>
                <button
                    className={activeMenu === 'wavveonPrivacy' ? 'active' : 'agree-menu-btn'}
                    onClick={() => setActiveMenu('wavveonPrivacy')}
                >
                    웨이브온 개인정보 처리방침
                </button>
            </div>
            <div className="agree-menu-line"></div>
            {/* 메뉴 */}
            <div className="detail-menu-content">
                {activeMenu === 'service' && <AgreementService />}
                {activeMenu === 'payment' && <AgreementPayment />}
                {activeMenu === 'privacy' && <AgreementPrivacy />}
                {activeMenu === 'wavveonPrivacy' && <AgreementWavveon />}
            </div>
        </div>
    );
};
export default Agreement;
