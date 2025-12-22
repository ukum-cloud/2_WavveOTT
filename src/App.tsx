import { Suspense, lazy, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import './App.css';

// 1. 공통 컴포넌트 및 로딩바
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollTop from './components/ScrollTop';
import { BendNotice } from './components/BendNotice';

// 2. Zustand Stores
import { useAuthStore } from './stores/useAuthStore';
import { usePickStore } from './stores/usePickStore';

// 3. 페이지 컴포넌트 Lazy Loading (첫 진입 속도 4초 이하 달성의 핵심)
const Intro = lazy(() => import('./pages/Intro'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const ChoiceChar = lazy(() => import('./pages/ChoiceChar'));
const Home = lazy(() => import('./pages/Home'));
const Common = lazy(() => import('./pages/Common'));
const Profile = lazy(() => import('./pages/Profile'));
const Entertainment = lazy(() => import('./pages/Entertainment'));
const Drama = lazy(() => import('./pages/Drama'));
const Movie = lazy(() => import('./pages/Movie'));
const OverseasSeries = lazy(() => import('./pages/OverseasSeries'));
const CurrentAffairs = lazy(() => import('./pages/CurrentAffairs'));
const Animation = lazy(() => import('./pages/Animation'));
const Kids = lazy(() => import('./pages/Kids'));
const Recap = lazy(() => import('./pages/Recap'));
const Mbc = lazy(() => import('./pages/Mbc'));
const Kbs = lazy(() => import('./pages/Kbs'));
const CJenm = lazy(() => import('./pages/Cjenm'));
const JTBC = lazy(() => import('./pages/Jtbc'));
const Welcome = lazy(() => import('./pages/Welcome'));
const ContentsDetail = lazy(() => import('./pages/ContentsDetail'));
const MovieDetail = lazy(() => import('./pages/MovieDetail'));
const MovieDetailEX = lazy(() => import('./pages/MovieDetailEX'));
const Player = lazy(() => import('./pages/Player'));
const Ticket = lazy(() => import('./pages/Ticket'));
const Payment = lazy(() => import('./pages/Payment'));
const PaymentFinish = lazy(() => import('./pages/PaymentFinish'));
const ServiceCenter = lazy(() => import('./pages/ServiceCenter'));
const Event = lazy(() => import('./pages/Event'));
const EventDetail = lazy(() => import('./pages/EventDetail'));
const EventGroup = lazy(() => import('./pages/EventGroup'));
const UserQna = lazy(() => import('./pages/UserQna'));
const Agreement = lazy(() => import('./pages/Agreement'));
const NoticeA = lazy(() => import('./pages/NoticeA'));
const NoticeAdetail = lazy(() => import('./pages/NoticeAdetail'));

function App() {
    const location = useLocation();
    const currentPath = location.pathname.toLowerCase();

    const user = useAuthStore((state) => state.user);
    const selectedCharId = useAuthStore((state) => state.selectedCharId);
    const onFetchPick = usePickStore((state) => state.onFetchPick);

    useEffect(() => {
        if (user && selectedCharId) {
            onFetchPick();
        }
    }, [user, selectedCharId, onFetchPick]);

    // [레이아웃 제어] 인트로, 로그인, 회원가입, 캐릭터 선택 페이지에서는 헤더/푸터를 숨김
    const hideLayoutPaths = ['/', '/login', '/signup', '/choice-char'];
    const isHideLayout = hideLayoutPaths.includes(currentPath);

    return (
        // Suspense를 최상단에 배치하여 Lazy 로딩되는 모든 페이지에 로딩바 적용
        <Suspense>
            {/* 상단 레이아웃 영역 */}
            {!isHideLayout && (
                <>
                    <ScrollTop />
                    <Header />
                </>
            )}

            <Routes>
                {/* 인증 및 초기 진입 프로세스 */}
                <Route path="/" element={<Intro />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/choice-char" element={<ChoiceChar />} />

                {/* 서비스 주요 페이지 */}
                <Route path="/home" element={<Home />} />
                <Route path="/entertainment" element={<Entertainment />} />
                <Route path="/drama" element={<Drama />} />
                <Route path="/movie" element={<Movie />} />
                <Route path="/overseasSeries" element={<OverseasSeries />} />
                <Route path="/currentAffairs" element={<CurrentAffairs />} />
                <Route path="/animation" element={<Animation />} />
                <Route path="/kids" element={<Kids />} />
                <Route path="/recap" element={<Recap />} />
                <Route path="/mbc" element={<Mbc />} />
                <Route path="/kbs" element={<Kbs />} />
                <Route path="/cjenm" element={<CJenm />}></Route>
                <Route path="/jtbc" element={<JTBC />}></Route>
                <Route path="/welcome" element={<Welcome />} />
                <Route path="/profile" element={<Profile />} />

                {/* 상세 및 미디어 플레이어 */}
                <Route path="/contentsdetail/:type/:id" element={<ContentsDetail />} />
                <Route path="/moviedetail/:type/:id" element={<MovieDetail />} />
                <Route path="/moviedetailEX/:type/:id" element={<MovieDetailEX />} />
                <Route path="/player/:videoKey" element={<Player />} />

                {/* 이용권 및 결제 */}
                <Route path="/ticket" element={<Ticket />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/payment-finish" element={<PaymentFinish />} />

                {/* 고객센터 (중첩 라우팅) */}
                <Route path="/service-center" element={<ServiceCenter />}>
                    <Route index element={<NoticeA />} />
                    <Route path="notice" element={<NoticeA />} />
                    <Route path="notice/:noticeId" element={<NoticeAdetail />} />
                    <Route path="userQna" element={<UserQna />} />
                    <Route path="agreement" element={<Agreement />} />
                </Route>

                {/* 이벤트 (중첩 라우팅) */}
                <Route path="/event-group" element={<EventGroup />}>
                    <Route index element={<Event />} />
                    <Route path="event" element={<Event />} />
                    <Route path="event/:eventId" element={<EventDetail />} />
                </Route>

                <Route path="/common" element={<Common />} />
            </Routes>

            {/* 하단 레이아웃 영역 */}
            {!isHideLayout && (
                <>
                    <BendNotice />
                    <Footer />
                </>
            )}
        </Suspense>
    );
}

export default App;
