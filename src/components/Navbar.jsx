import "../styles/Navbar.css";
import { Link } from "react-router-dom";

function Navbar() {

  const token = localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    
    <nav>

      {!token && <Link to="/login">Login</Link>}

      <Link to="/">Home</Link>{" | "}
      <Link to="/about">About</Link>{" | "}
      <Link to="/skills">Skills</Link>{" | "}
      <Link to="/resume">Resume Analyzer</Link>{" | "}
      <Link to="/careergps">Career GPS</Link>
      <Link to="/skillmatch">SkillMatch AI</Link>
      <Link to="/profile">Profile</Link>
      <Link to="/interview">Interview Prep</Link>
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/jobs">Jobs</Link>
      <Link to="/history">Analysis History</Link>
      <Link to="/certifications">Certifications</Link>

      <span
  style={{
    position: "absolute",
    right: "140px",
    color: "black",
    fontWeight: "bold"
  }}
>
</span>

      <button
  onClick={logout}
  style={{
    position: "absolute",
    right: "20px",
    padding: "8px 16px",
    background: "#ef4444",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold"
  }}
>
  Logout
</button>
      
    </nav>
  );
}

export default Navbar;