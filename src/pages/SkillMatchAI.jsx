import "../styles/SkillMatchAI.css";
import { useState } from "react";

function SkillMatchAI() {
  const [role, setRole] = useState("");
  const [result, setResult] = useState("");

  const analyzeSkills = () => {
    if (role.toLowerCase() === "full stack developer") {
      setResult(`
Match Score: 70%

Missing Skills:
• React.js
• Node.js
• MongoDB
• Git & GitHub
      `);
    } else {
      setResult("Please enter Full Stack Developer");
    }
  };

  return (
    <div
  style={{
    maxWidth: "900px",
    margin: "50px auto",
    background: "#f3f4f6",
    padding: "40px",
    borderRadius: "15px",
    textAlign: "center"
  }}
>
      <h1>SkillMatch AI</h1>

      <input
        type="text"
        placeholder="Enter Target Role"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      />

      <button onClick={analyzeSkills}>
        Analyze
      </button>

      <pre>{result}</pre>
    </div>
  );
}

export default SkillMatchAI;