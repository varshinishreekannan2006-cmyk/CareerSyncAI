import SkillsChart from "../components/SkillsChart";



function Dashboard() {



  const history =

    JSON.parse(localStorage.getItem("resumeHistory")) || [];



  const totalResumes = history.length;



  const highestScore =

    history.length > 0

      ? Math.max(...history.map(item => item.score))

      : 0;



  const averageScore =

    history.length > 0

      ? Math.round(

          history.reduce((sum, item) => sum + item.score, 0) /

          history.length

        )

      : 0;



  const latestResume =

    history.length > 0

      ? history[history.length - 1].fileName

      : "No Resume";



  return (

    <div style={{ padding: "20px" }}>

      <h1>Career Dashboard</h1>



      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>



        <div className="card">

          <h3>Total Resumes</h3>

          <p>{totalResumes}</p>

        </div>



        <div className="card">

          <h3>Average Score</h3>

          <p>{averageScore}%</p>

        </div>



        <div className="card">

          <h3>Highest Score</h3>

          <p>{highestScore}%</p>

        </div>



        <div className="card">

          <h3>Latest Resume</h3>

          <p>{latestResume}</p>

        </div>



      </div>



      <h2>Skills Overview</h2>

      <SkillsChart />

    </div>

  );

}



export default Dashboard;