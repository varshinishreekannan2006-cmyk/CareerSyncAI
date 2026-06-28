import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Home from "./pages/Home";
import About from "./pages/About";
import Skills from "./pages/Skills";
import Navbar from "./components/Navbar";
import ResumeAnalyzer from "./pages/ResumeAnalyzer";
import CareerGPS from "./pages/CareerGPS";
import SkillMatchAI from "./pages/SkillMatchAI";
import Profile from "./pages/Profile";
import InterviewPrep from "./pages/InterviewPrep";
import Dashboard from "./pages/Dashboard";
import JobRecommendations from "./pages/JobRecommendations";
import AnalysisHistory from "./pages/AnalysisHistory";
import Certifications from "./pages/Certifications";

function App() {

  const isLoggedIn = localStorage.getItem("user");

if (!isLoggedIn) {
  return <Login />;
}
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>

  return (
    <BrowserRouter>
    
    <h1 className="main-title">CareerSync AI</h1>

      <Navbar />

      <Routes>

        <Route path="/login" element={<Login />} />
        <Route path="/" element={isLoggedIn ? <Home /> : <Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/resume" element={<ResumeAnalyzer />} />
        <Route path="/careergps" element={<CareerGPS />} />
        <Route path="/skillmatch" element={<SkillMatchAI />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/interview" element={<InterviewPrep />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/jobs" element={<JobRecommendations />} />
        <Route path="/history" element={<AnalysisHistory />} />
        <Route path="/certifications" element={<Certifications />} />
      </Routes>

    </BrowserRouter>
  );
}

export default App;