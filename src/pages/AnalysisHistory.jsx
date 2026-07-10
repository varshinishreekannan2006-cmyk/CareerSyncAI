import { useEffect, useState } from "react";
import axios from "axios";

function AnalysisHistory() {
  const [history, setHistory] = useState([]);

  const clearHistory = async () => {
  try {
    const token = localStorage.getItem("token");

    await axios.delete(
      "http://localhost:5000/api/history",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setHistory([]);

    alert("History deleted successfully");
  } catch (err) {
    console.log(err);
    alert("Failed to delete history");
  }
};

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");

        console.log("Token:", token);

        const res = await axios.get(
          "http://localhost:5000/api/history",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log(res.data);

        setHistory(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div style={{ padding: "30px" }}>
      <h1>Analysis History</h1>

      <button
  onClick={clearHistory}
  style={{
    padding: "10px 20px",
    background: "red",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginBottom: "20px",
  }}
>
  🗑 Clear History
</button>

      {history.map((item) => (
        <div
          key={item._id}
          style={{
            border: "1px solid gray",
            margin: "20px",
            padding: "20px",
            borderRadius: "10px",
          }}
        >
          <h3>{item.fileName}</h3>

          <p>Score: {item.score}%</p>

          <p>
            <b>Detected Skills:</b>{" "}
            {item.detectedSkills.join(", ")}
          </p>

          <p>
            <b>Missing Skills:</b>{" "}
            {item.missingSkills.join(", ")}
          </p>

          <p>{new Date(item.analyzedAt).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}

export default AnalysisHistory;