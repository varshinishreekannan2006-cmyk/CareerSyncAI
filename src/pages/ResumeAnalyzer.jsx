import { jsPDF } from "jspdf";
import "./ResumeAnalyzer.css";
import { useState } from "react";
import axios from "axios";

import { Pie } from "react-chartjs-2";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

function ResumeAnalyzer() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [score, setScore] = useState(0);
  const [skills, setSkills] = useState([]);
  const [missingSkills, setMissingSkills] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

let atsTips = [];

if (score < 80) {
  atsTips.push("Add more industry-relevant skills.");
  atsTips.push("Include projects with technologies used.");
  atsTips.push("Use clear section headings.");
  atsTips.push("Add GitHub and LinkedIn links.");
}

let atsRating = "";

if (score >= 80) {
  atsRating = "ATS Friendly";
} else if (score >= 60) {
  atsRating = "Moderately ATS Friendly";
} else {
  atsRating = "Needs ATS Optimization";
}

let tips = [];

if (missingSkills.includes("node.js")) {
  tips.push("Learn Node.js for backend development.");
}

if (missingSkills.includes("mongodb")) {
  tips.push("Learn MongoDB for database management.");
}

if (missingSkills.includes("sql")) {
  tips.push("Practice SQL queries and database concepts.");
}

if (missingSkills.includes("python")) {
  tips.push("Learn Python for automation and problem solving.");
}

let interviewQuestions = [];

if (skills.includes("html")) {
  interviewQuestions.push("What is the difference between HTML and HTML5?");
}

if (skills.includes("css")) {
  interviewQuestions.push("What is Flexbox?");
}

if (skills.includes("javascript")) {
  interviewQuestions.push("What is the difference between var, let and const?");
}

if (skills.includes("react")) {
  interviewQuestions.push("What are React Hooks?");
}

let jobRole = "General Developer";

if (
  skills.includes("react") &&
  skills.includes("node.js") &&
  skills.includes("mongodb")
) {
  jobRole = "Full Stack Developer";
} else if (
  skills.includes("react") &&
  skills.includes("html") &&
  skills.includes("css")
) {
  jobRole = "Frontend Developer";
} else if (
  skills.includes("node.js") &&
  skills.includes("mongodb")
) {
  jobRole = "Backend Developer";
}

let jobs = [];

if (jobRole === "Frontend Developer") {
  jobs = [
    "React Developer",
    "Frontend Developer",
    "UI Developer"
  ];
} else if (jobRole === "Backend Developer") {
  jobs = [
    "Node.js Developer",
    "Backend Engineer",
    "API Developer"
  ];
} else if (jobRole === "Full Stack Developer") {
  jobs = [
    "Full Stack Developer",
    "MERN Stack Developer",
    "Software Engineer"
  ];
} else {
  jobs = [
    "Software Engineer",
    "IT Support Engineer",
    "Technical Trainee"
  ];
}

let salaryRange = "₹3 LPA - ₹5 LPA";

if (jobRole === "Frontend Developer") {
  salaryRange = "₹4 LPA - ₹8 LPA";
} else if (jobRole === "Backend Developer") {
  salaryRange = "₹5 LPA - ₹10 LPA";
} else if (jobRole === "Full Stack Developer") {
  salaryRange = "₹6 LPA - ₹12 LPA";
}

let level = "";

if (score >= 80) {
  level = "Excellent";
} else if (score >= 60) {
  level = "Good";
} else {
  level = "Needs Improvement";
}

let grade = "C";

if (score >= 80) {
  grade = "A";
} else if (score >= 60) {
  grade = "B";
}

const currentDate = new Date().toLocaleDateString();

  const handleFileChange = (event) => {
  if (event.target.files.length > 0) {
    setFile(event.target.files[0]);
    setFileName(event.target.files[0].name);
  }
};
  const analyzeResume = async () => {

  alert("Button Clicked");

  try {
    setLoading(true);

    if (!file) {
  alert("Please select a PDF file first");
  return;
}

const formData = new FormData();
formData.append("resume", file);

console.log(file);

    console.log("Sending request...");

    console.log("FILE:", file);
    console.log("FORMDATA CREATED");

    const response = await axios.post(
  "http://localhost:5000/api/resume/analyze",
  formData
);

console.log(response.data);

console.log("Response received");
console.log(response.data);

    setScore(response.data.score);
    setSkills(response.data.detectedSkills);
    setMissingSkills(response.data.missingSkills);

    const newHistory = {
  fileName,
  score: response.data.score,
  date: new Date().toLocaleString()
};

const updatedHistory = [...history, newHistory];

setHistory(updatedHistory);

localStorage.setItem(
  "resumeHistory",
  JSON.stringify(updatedHistory)
);

    setLoading(false);

  } catch (error) {
  setLoading(false);

  console.log("FULL ERROR:");
  console.log(error);

  if (error.response) {
    console.log("SERVER RESPONSE:");
    console.log(error.response.data);

      const serverMsg =
        (error.response.data && error.response.data.message) ||
        (typeof error.response.data === 'string' && error.response.data) ||
        JSON.stringify(error.response.data);
      alert("Error: " + (serverMsg || error.message));
  } else {
    alert(error.message);
  }
}
};

const downloadReport = () => {
  const doc = new jsPDF();

  doc.text("CareerSync AI Resume Report", 20, 20);
  doc.text(`Resume Score: ${score}%`, 20, 40);
  doc.text(`Resume Strength: ${level}`, 20, 50);
  doc.text(`Recommended Role: ${jobRole}`, 20, 60);

  doc.text("Detected Skills:", 20, 80);
  doc.text(skills.join(", "), 20, 90);

  doc.text("Missing Skills:", 20, 110);
  doc.text(missingSkills.join(", "), 20, 120);

  doc.save("Resume_Report.pdf");
};

const chartData = {
  labels: ["Detected Skills", "Missing Skills"],
  datasets: [
    {
      data: [skills.length, missingSkills.length],
      backgroundColor: [
        "#4CAF50",
        "#FF5252"
      ]
    }
  ]
};

const predictedScore = Math.min(
  100,
  score + missingSkills.length * 5
);

const learningPriority = [...missingSkills];

const totalSkills = skills.length + missingSkills.length;


  return (
    <div
  className="container"
  style={{
    width: "85%",
    maxWidth: "1600px",
    margin: "0 auto",
    padding: "40px"
  }}
>
      <h1
  style={{
    textAlign: "center",
    fontSize: "56px",
    fontWeight: "700",
    color: "#052364",
    marginBottom: "40px"
  }}
>
Resume Analyzer
</h1>

      <div
  style={{
    display: "flex",
    justifyContent: "center",
    marginBottom: "35px"
  }}
  >
  <input
    type="file"
    accept=".pdf,.doc,.docx"
    onChange={handleFileChange}
    style={{
      fontSize: "18px",
      padding: "10px"
    }}
  />
</div>

      <div
  style={{
    display: "flex",
    justifyContent: "center",
    marginBottom: "45px"
  }}
>
  <button
  onClick={analyzeResume}
  style={{
    background: "#2563eb",
    color: "#fff",
    padding: "15px 40px",
    border: "none",
    borderRadius: "20px",
    fontSize: "18px",
    fontWeight: "bold",
    cursor: "pointer",
    justifyContent: "flux-start"
  }}
>
  {loading ? "Analyzing..." : "Analyze Resume"}
</button>
</div>

      {fileName && (
        <div
  className="card p-4 mt-4 shadow"
  style={{
    width: "100%",
    background: "#ffffff",
    borderRadius: "20px",
    padding: "45px",
    boxShadow: "0 8px 30px rgba(0,0,0,.10)"
}}
>
          
          <h3 style={{ fontSize: "28px", color: "#1e3a8a", marginTop: "25px" }}>
  Uploaded Resume
</h3>

<p
  style={{
    fontSize: "18px",
    background: "#f3f4f6",
    padding: "12px",
    borderRadius: "8px"
  }}
>
  {fileName}
</p>

          <h3
  style={{
    fontSize: "28px",
    fontWeight: "bold",
    color: "#000"
  }}
>
  ATS Rating
</h3>

<p
  style={{
    fontSize: "20px",
    lineHeight: "2",
    color: "#000"
  }}
>
  {atsRating}
</p>

          <h3
  style={{
    fontSize: "28px",
    fontWeight: "bold",
    color: "#000"
  }}
>
  Recommended Job Role
</h3>

<p
  style={{
    fontSize: "20px",
    lineHeight: "2",
    color: "#000"
  }}
>
  {jobRole}
</p>

          <h3
  style={{
    fontSize: "28px",
    fontWeight: "bold",
    color: "#000"
  }}
>
  Expected Salary Range
</h3>

<p
  style={{
    fontSize: "20px",
    lineHeight: "2",
    color: "#000"
  }}
>
  {salaryRange}
</p>

          <h3
  style={{
    fontSize: "28px",
    fontWeight: "bold",
    color: "#000"
  }}
>
  Resume Strength
</h3>

<p
  style={{
    fontSize: "20px",
    lineHeight: "2",
    color: "#000"
  }}
>
  {level}
</p>

          <h3
  style={{
    fontSize: "28px",
    fontWeight: "bold",
    color: "#000"
  }}
>
  Resume Grade
</h3>

<p
  style={{
    fontSize: "20px",
    lineHeight: "2",
    color: "#000"
  }}
>
  {grade}
</p>

          <h3
  style={{
    fontSize: "28px",
    fontWeight: "bold",
    color: "#000"
  }}
>
  Analysis Data
</h3>

<p
  style={{
    fontSize: "20px",
    lineHeight: "2",
    color: "#000"
  }}
>
  {currentDate}
</p>

          <h3
  style={{
    fontSize: "28px",
    fontWeight: "bold",
    color: "#000"
  }}
>
  Future Potential Score
</h3>
<p
  style={{
    fontSize: "20px",
    lineHeight: "2",
    color: "#000"
  }}
>
  Current Score: {score}%
</p>
<p
  style={{
    fontSize: "20px",
    lineHeight: "2",
    color: "#000"
  }}
>
  Predicted Score After Learning Missing Skills:
            {predictedScore}%
</p>
 <h3
  style={{
    fontSize: "28px",
    fontWeight: "bold",
    color: "#000"
  }}
>
  Resume Score
</h3>         
          <p
            className="score"
            style={{
              fontSize: "40px",
              fontWeight: "bold",
              color: "#000"
            }}
          >
            {score}%
          </p>

          <div className="progress">
            <div
              className="progress-bar"
              role="progressbar"
              style={{ width: `${score}%` }}
            >
              {score}%
            </div>
          </div>
          <h3
  style={{
    fontSize: "28px",
    fontWeight: "bold",
    color: "#000"
  }}
>
  Resume Completion
</h3>
<p
  style={{
    fontSize: "20px",
    lineHeight: "2",
    color: "#000"
  }}
>
  {score}% Complete
</p>
          <div className="progress">
            <div
              className="progress-bar bg-success"
              role="progressbar"
              style={{ width: `${score}%` }}
            >
              {score}% Complete
            </div>
          </div>

          <h3
  style={{
    fontSize: "28px",
    fontWeight: "bold",
    color: "#000"
  }}
>
  Skills Analysis Chart
</h3>
          <div
            style={{
              width: "300px",
              margin: "20px auto"
            }}
          >
            <Pie data={chartData} />
          </div>

          <h3
  style={{
    fontSize: "28px",
    fontWeight: "bold",
    color: "#000"
  }}
>
  Detected Skills
</h3>
          <ul>
  {skills.map((skill, index) => (
    <li
      key={index}
      style={{ fontSize: "20px", lineHeight: "2", color: "#000" }}
    >
      {skill}
    </li>
  ))}
</ul>

          <h3
  style={{
    fontSize: "28px",
    fontWeight: "bold",
    color: "#000"
  }}
>
  Missing Skills
</h3>
          <ul>
  {missingSkills.map((skill, index) => (
    <li
      key={index}
      style={{ fontSize: "20px", lineHeight: "2", color: "#000" }}
    >
      {skill}
    </li>
  ))}
</ul>

          <h3
  style={{
    fontSize: "28px",
    fontWeight: "bold",
    color: "#000"
  }}
>
  Career Roadmap
</h3>

          <ul>
  {missingSkills.map((skill, index) => (
    <li
      key={index}
      style={{ fontSize: "20px", lineHeight: "2", color: "#000" }}
    >
      Learn {skill}
    </li>
  ))}
</ul>

          <h3
  style={{
    fontSize: "28px",
    fontWeight: "bold",
    color: "#000"
  }}
>
  Learning Priority
</h3>
          <ol>
  {learningPriority.map((skill, index) => (
    <li
      key={index}
      style={{ fontSize: "20px", lineHeight: "2", color: "#000" }}
    >
      {skill}
    </li>
  ))}
</ol>

          <h3
  style={{
    fontSize: "28px",
    fontWeight: "bold",
    color: "#000"
  }}
>
  Resume Improvement Tips
</h3>

          <ul>
  {tips.map((tip, index) => (
    <li key={index} style={{ fontSize: "20px", color: "#000", lineHeight: "2" }}>
      {tip}
    </li>
  ))}
</ul>

          <h3
  style={{
    fontSize: "28px",
    fontWeight: "bold",
    color: "#000"
  }}
>
  ATS Improvement Tips
</h3>

          <ul>
  {atsTips.map((tip, index) => (
    <li key={index} style={{ fontSize: "20px", color: "#000", lineHeight: "2" }}>
      {tip}
    </li>
  ))}
</ul>

          <h3
  style={{
    fontSize: "28px",
    fontWeight: "bold",
    color: "#000"
  }}
>
  Skills Statistics
</h3>
<p
  style={{
    fontSize: "20px",
    lineHeight: "2",
    color: "#000"
  }}
>
  Detected Skills: {skills.length} <br></br>
  Missing Skills: {missingSkills.length} <br></br>
  Total Skills Checked: {totalSkills}
</p>

          <h3
  style={{
    fontSize: "28px",
    fontWeight: "bold",
    color: "#000"
  }}
>
  Resume Tips
</h3>
          <ul>
  <li style={{ fontSize: "20px", color: "#000", lineHeight: "2" }}>Add LinkedIn profile</li>
  <li style={{ fontSize: "20px", color: "#000", lineHeight: "2" }}>Add GitHub projects</li>
  <li style={{ fontSize: "20px", color: "#000", lineHeight: "2" }}>Add internships</li>
  <li style={{ fontSize: "20px", color: "#000", lineHeight: "2" }}>Add certifications</li>
</ul>

          <h3
  style={{
    fontSize: "28px",
    fontWeight: "bold",
    color: "#000"
  }}
>
  Interview Questions
</h3>
          <ul>
  {interviewQuestions.map((question, index) => (
    <li key={index} style={{ fontSize: "20px", color: "#000", lineHeight: "2" }}>
      {question}
    </li>
  ))}
</ul>

          <h3
  style={{
    fontSize: "28px",
    fontWeight: "bold",
    color: "#000"
  }}
>
  Job Suggestions
</h3>
          <ul>
  {jobs.map((job, index) => (
    <li key={index} style={{ fontSize: "20px", color: "#000", lineHeight: "2" }}>
      {job}
    </li>
  ))}
</ul>

          <h3
  style={{
    fontSize: "28px",
    fontWeight: "bold",
    color: "#000"
  }}
>
  Recommendation
</h3>
<p
  style={{
    fontSize: "20px",
    lineHeight: "2",
    color: "#000"
  }}
>
  Learn {missingSkills.slice(0, 3).join(", ")} to improve your placement opportunities.
</p>
          <button
            className="btn btn-success"
            onClick={downloadReport}
          >
            Download PDF Report
          </button>

          <br /><br />
        </div>
      )}
    </div>
  );
}

export default ResumeAnalyzer;