import React, { useState, useEffect } from "react";
import { supabase } from "../client";
import { Link, useNavigate } from "react-router-dom"; 
import Navbar from "./Navbar";
const UserDetailes = ({ token }) => {
  const navigate = useNavigate(); 
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");

  useEffect(() => {
    document.body.classList.toggle("light-theme", !darkMode);

    async function fetchUserData() {
      if (!token || !token.user) return;

      const { data, error } = await supabase
        .from("user")
        .select("username, Pp")
        .eq("user_id", token.user.id)
        .single();

      if (error) {
        console.error("Error fetching user data:", error.message);
        return;
      }

      setUsername(token?.user?.user_metadata?.full_name || "");
      setProfilePicture(data?.Pp || ""); 
    }

    fetchUserData();
  }, [token, darkMode]);

  const handleSaveChanges = async () => {
    if (!token || !token.user) return;

    const updates = { username, Pp: profilePicture };

    if (password) {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        console.error("Error updating password:", error.message);
        return;
      }
    }

    const { error } = await supabase
      .from("user_library")
      .update(updates)
      .eq("user_id", token.user.id);

    if (error) {
      console.error("Error updating user details:", error.message);
      return;
    }

    alert("Profile updated successfully!");
  };
  const handleLogout = () => {
    sessionStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className='containerItems'>
    <Navbar></Navbar>
    <div className='links links2'>
            <button className='logoutbtn' onClick={handleLogout}>
                <a>
                  <i class='bx bx-log-in-circle' ></i>
                </a>
            </button>
    </div>
    <div className={`user-detailes ${darkMode ? "dark" : "light"}`}>
        
      <h2>Profile Settings</h2>

      <div className="form-group">
        <label>Profile Picture URL:</label>
        <input
          type="text"
          placeholder="Enter image URL"
          value={profilePicture}
          onChange={(e) => setProfilePicture(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Username:</label>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
      </div>
      <div className="form-group">
        <label>New Password:</label>
        <input type="password" placeholder="Enter new password" onChange={(e) => setPassword(e.target.value)} />
      </div>
      <button onClick={handleSaveChanges} className="save-btn">Save Changes</button>
    </div>
    </div>
  );
};

export default UserDetailes;
