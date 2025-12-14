import { Route, Routes } from "react-router-dom";
import "./App.css";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { BendNotice} from "./components/BendNotice";
import Home from "./pages/Home";

import Common from "./pages/Common";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Favorite from "./pages/Favorite";
import PlayList from "./pages/PlayList";
import Entertainment from "./pages/Entertainment";
import Drama from "./pages/Drama";
import Movie from "./pages/Movie";
import OverseasSeries from "./pages/OverseasSeries";
import CurrentAffairs from "./pages/CurrentAffairs";
import Animation from "./pages/Animation";
import Kids from "./pages/Kids";
import ChoiceChar from "./pages/ChoiceChar";
import Welcome from "./pages/Welcome";
import Ticket from "./pages/Ticket";
import Event from "./pages/Event";
import ServiceCenter from "./pages/ServiceCenter";
import EventDetail from "./pages/EventDetail";
import UserQna from "./pages/UserQna";
import Agreement from "./pages/Agreement";
import NoticeA from "./pages/NoticeA";
import NoticeAdetail from "./pages/NoticeAdetail";

function App() {
  return (
    <>
      <Header />
      <Routes>
        {/*  */}
        <Route path="/" element={<Home />} />
        {/* 예능, 드라마, 영화, 해외시리즈, 시사교양,애니메이션, 키즈 */}
        <Route path="/entertainment" element={<Entertainment />} />
        <Route path="/drama" element={<Drama />} />
        <Route path="/movie" element={<Movie />} />
        <Route path="/overseasSeries" element={<OverseasSeries />} />
        <Route path="/currentAffairs" element={<CurrentAffairs />} />
        <Route path="/animation" element={<Animation />} />
        <Route path="/kids" element={<Kids />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/choice-char" element={<ChoiceChar />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/favorite" element={<Favorite />} />
        <Route path="/playlist" element={<PlayList />} />
        <Route path="/ticket" element={<Ticket />} />
        <Route path="/service-center" element={<ServiceCenter />}>
          <Route index element={<NoticeA />} />
          <Route path="notice" element={<NoticeA />} />
          <Route path="notice/:noticeId" element={<NoticeAdetail />} />
          <Route path="userQna" element={<UserQna />} />
          <Route path="agreement" element={<Agreement />} />
        </Route>
        <Route path="/event" element={<Event />} /> // 이벤트 목록 페이지
        <Route path="/event/:eventId" element={<EventDetail />} />
        <Route path="/common" element={<Common />} />
      </Routes>
      <BendNotice />
      <Footer />
    </>
  );
}

export default App;
