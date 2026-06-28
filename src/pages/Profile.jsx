import { useState } from "react";

function Profile() {
  const [name, setName] = useState("");
  const [college, setCollege] = useState("");
  const [skills, setSkills] = useState("");

  const saveProfile = () => {
  const profileData = {
    name,
    college,
    skills
  };

  localStorage.setItem(
    "studentProfile",
    JSON.stringify(profileData)
  );

  console.log(localStorage.getItem("studentProfile"));

  alert("Profile Saved Successfully!");
};
  return (
    <div
  style={{
    maxWidth: "800px",
    margin: "50px auto",
    background: "#f3f4f6",
    padding: "40px",
    borderRadius: "15px"
  }}
>
      <h1>Student Profile</h1>

      <input
        type="text"
        placeholder="Enter Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <br /><br />

      <input
        type="text"
        placeholder="Enter College"
        value={college}
        onChange={(e) => setCollege(e.target.value)}
      />

      <br /><br />

      <textarea
        placeholder="Enter Skills"
        value={skills}
        onChange={(e) => setSkills(e.target.value)}
      />

      <br /><br />

      <button onClick={saveProfile}>
        Save Profile
      </button>
    </div>
  );
}

export default Profile;