import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div style={{
      width: "220px",
      height: "100vh",
      background: "#1f2937",
      color: "white",
      padding: "20px"
    }}>
      <h2>CareerSync AI</h2>

      <p><Link to="/dashboard">Dashboard</Link></p>
      <p><Link to="/resume">Resume Analyzer</Link></p>
      <p><Link to="/skills">Skill Match</Link></p>
      <p><Link to="/careergps">Career GPS</Link></p>
      <p><Link to="/jobs">Jobs</Link></p>
      <p><Link to="/interview">Interview Prep</Link></p>
      <p><Link to="/profile">Profile</Link></p>
    </div>
  );
}

export default Sidebar;