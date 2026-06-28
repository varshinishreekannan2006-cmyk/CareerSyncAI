function About() {
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
        About CareerSync AI
      </h1>

      <p
        style={{
          fontSize: "18px",
          lineHeight: "1.8"
        }}
      >
        CareerSync AI is an intelligent career guidance platform designed for
        students and fresh graduates. It helps users analyze resumes, identify
        missing skills, receive career roadmaps, practice interviews, track
        certifications, and discover suitable job opportunities.
      </p>

      <h2 style={{ marginTop: "30px" }}>
        Features
      </h2>

      <ul style={{ fontSize: "18px", lineHeight: "2" }}>
        <li>Resume Analyzer</li>
        <li>Career GPS Roadmap</li>
        <li>SkillMatch AI</li>
        <li>Interview Preparation</li>
        <li>Student Profile Management</li>
        <li>Job Recommendations</li>
        <li>Certification Tracking</li>
        <li>Analysis History</li>
      </ul>

      <h2 style={{ marginTop: "30px" }}>
        Purpose
      </h2>

      <p
        style={{
          fontSize: "18px",
          lineHeight: "1.8"
        }}
      >
        The goal of CareerSync AI is to bridge the gap between student skills
        and industry requirements by providing personalized career guidance and
        skill development recommendations.
      </p>
    </div>
  );
}

export default About;