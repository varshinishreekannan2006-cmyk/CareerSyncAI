import { useEffect, useState } from "react";

function AnalysisHistory() {

  const [history, setHistory] = useState([]);

  useEffect(() => {
    const savedHistory = localStorage.getItem("resumeHistory");

    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  return (
    <div className="container mt-4">
      <h1>Analysis History</h1>

      {history.length === 0 ? (
        <p>No analysis history available yet.</p>
      ) : (
        <ul>
          {history.map((item, index) => (
            <li key={index}>
              <strong>{item.fileName}</strong>
              <br />
              Score: {item.score}%
              <br />
              Date: {item.date}
              <br /><br />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AnalysisHistory;