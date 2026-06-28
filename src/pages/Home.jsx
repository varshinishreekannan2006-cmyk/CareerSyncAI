function Home() {
  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "50px auto",
        padding: "30px",
        background: "#ffffff",
        borderRadius: "15px",
        boxShadow: "0 0 15px rgba(0,0,0,0.1)"
      }}
    >
      <h1
        style={{
          textAlign: "center",
          color: "#2563eb",
          marginBottom: "20px"
        }}
      >
        Welcome to CareerSync AI
      </h1>

      <p
        style={{
          fontSize: "18px",
          lineHeight: "1.8",
          textAlign: "center"
        }}
      >
        Your AI-powered career companion for resume analysis,
        skill development, interview preparation, career guidance,
        and job recommendations.
      </p>

      <h2 style={{ marginTop: "30px" }}>
        What You Can Do
      </h2>

      <ul style={{ fontSize: "18px", lineHeight: "2" }}>
        <li>Analyze your Resume</li>
        <li>Identify Missing Skills</li>
        <li>Get Career Roadmaps</li>
        <li>Prepare for Interviews</li>
        <li>Track Certifications</li>
        <li>Manage Student Profile</li>
        <li>View Job Recommendations</li>
        <li>Check Analysis History</li>
      </ul>

      <h2 style={{ marginTop: "30px" }}>
        Start Your Career Journey
      </h2>

      <p
        style={{
          fontSize: "18px",
          lineHeight: "1.8"
        }}
      >
        CareerSync AI helps students understand their strengths,
        improve their skills, and prepare for future career
        opportunities through intelligent recommendations.
      </p>
    </div>
  );
}

export default Home;