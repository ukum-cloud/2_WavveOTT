import { Route, Routes } from "react-router-dom";
import "./App.css";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { Notice } from "./components/Notice";
import Home from "./pages/Home";
import Common from "./pages/scss/Common";
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

        <Route path="/common" element={<Common />} />

        <Route path="/choice-char" element={<ChoiceChar />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/favorite" element={<Favorite />} />
        <Route path="/playlist" element={<PlayList />} />
      </Routes>
      <Notice />
      <Footer />
    </>
  );
}

export default App;
