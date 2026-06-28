function JobRecommendations() {
  return (
    <div style={{
      maxWidth: "900px",
      margin: "50px auto",
      padding: "30px",
      background: "#fff",
      borderRadius: "15px",
      boxShadow: "0 0 15px rgba(0,0,0,0.1)"
    }}>
      <h1 style={{ textAlign: "center", color: "#2563eb" }}>
        Job Recommendations
      </h1>

      <ul style={{ fontSize: "18px", lineHeight: "2" }}>
        <li>Frontend Developer</li>
        <li>React Developer</li>
        <li>Full Stack Developer</li>
        <li>Software Engineer</li>
        <li>Web Developer</li>
      </ul>
    </div>
  );
}

export default JobRecommendations;