import React, { useState, useEffect } from "react";
import { supabase } from "../client";
import { useNavigate } from "react-router-dom"; 
import Navbar from "./Navbar";

const UserDetailes = ({ token }) => {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");

  useEffect(() => {
    document.body.classList.toggle("light-theme", !darkMode);

    async function fetchUserData() {
      if (!token || !token.user) return;

      const user = token.user;

      // Get auth metadata
      setDisplayName(user.user_metadata?.full_name || "");

      // Optionally, load extra info like profile picture from user_library
      const { data, error } = await supabase
        .from("user_library")
        .select("Pp")
        .eq("user_id", user.id)
        .single();

      if (error) {
        console.error("Error fetching profile picture:", error.message);
      } else {
        setProfilePicture(data?.Pp || "");
      }
    }

    fetchUserData();
  }, [token, darkMode]);

  const handleSaveChanges = async () => {
    if (!token || !token.user) return;
    const user = token.user;

    // 1. Update display name
    const { error: nameError } = await supabase.auth.updateUser({
      data: { full_name: displayName },
    });

    if (nameError) {
      console.error("Error updating name:", nameError.message);
      return;
    }

    // 2. Update password if entered
    if (password) {
      const { error: passError } = await supabase.auth.updateUser({ password });
      if (passError) {
        console.error("Error updating password:", passError.message);
        return;
      }
    }

    // 3. Update profile picture in your custom user_library table
    const { error: picError } = await supabase
      .from("user_library")
      .update({ Pp: profilePicture })
      .eq("user_id", user.id);

    if (picError) {
      console.error("Error updating profile picture:", picError.message);
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
      <Navbar />
      <div className='links links2'>
        <button className='logoutbtn' onClick={handleLogout}>
          <i className='bx bx-log-in-circle'></i>
        </button>
      </div>

      <div className={`user-detailes ${darkMode ? "dark" : "light"}`}>
        <h2>{displayName}'s Settings</h2>
        <div className="form-group">
          <label>Display Name:</label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>New Password:</label>
          <input
            type="password"
            placeholder="Enter new password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button onClick={handleSaveChanges} className="save-btn">Save Changes</button>
      </div>
    </div>
  );
};

export default UserDetailes;
