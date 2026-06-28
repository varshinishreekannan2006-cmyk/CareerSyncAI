function Skills() {
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
        Skills Development
      </h1>

      <p style={{ fontSize: "18px", lineHeight: "1.8" }}>
        Build the skills required for today's technology industry.
      </p>

      <ul style={{ fontSize: "18px", lineHeight: "2" }}>
        <li>HTML & CSS</li>
        <li>JavaScript</li>
        <li>React JS</li>
        <li>Node JS</li>
        <li>MongoDB</li>
        <li>Git & GitHub</li>
        <li>Problem Solving</li>
      </ul>
    </div>
  );
}

export default Skills;