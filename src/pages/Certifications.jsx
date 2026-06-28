function Certifications() {
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
        Certifications
      </h1>

      <p style={{ fontSize: "18px", lineHeight: "1.8" }}>
        Track your completed certifications and improve your profile.
      </p>

      <ul style={{ fontSize: "18px", lineHeight: "2" }}>
        <li>HTML Certification</li>
        <li>CSS Certification</li>
        <li>JavaScript Certification</li>
        <li>React Certification</li>
        <li>Python Certification</li>
      </ul>
    </div>
  );
}

export default Certifications;