import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WelcomePage from "./components/welcomePage";
import SignupPage from "./components/SignupPage";
import LoginPage from "./components/LoginPage";
import GenderPage from "./components/GenderPage";
import AgePage from "./components/AgePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/gender-page" element={<GenderPage />} />
        <Route path="/age-page" element={<AgePage />} />
      </Routes>
    </Router>
  );
}

export default App;
