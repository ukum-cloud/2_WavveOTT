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

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/common" element={<Common />} />
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
