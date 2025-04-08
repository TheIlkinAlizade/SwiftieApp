import React, { useState, useEffect } from "react";
import { supabase } from "../client";
import { Link, useNavigate } from "react-router-dom";

const CLIENT_ID = "5ed04eb65f1e4eb9bf0de8ec5418111f";
const CLIENT_SECRET = "d9785a1ad1e246edb7480e256469671c";

const Navbar = ({ token }) => {
  const [searchInput, setSearchInput] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark" || false);
  const navigate = useNavigate();

  // Fetch access token for Spotify API
  useEffect(() => {
    async function fetchAccessToken() {
      try {
        const res = await fetch('https://accounts.spotify.com/api/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: `grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`,
        });
        const data = await res.json();
        setAccessToken(data.access_token);
      } catch (error) {
        console.error("Error fetching Spotify access token:", error);
      }
    }
    fetchAccessToken();
  }, []);

  // Fetch user profile picture from supabase
  useEffect(() => {
    if (!token?.user) return;
    
    async function fetchProfile() {
      try {
        const { data, error } = await supabase
          .from("user_library")
          .select("profile_pic")
          .eq("id", token.user.id)
          .single();
        
        if (error) throw error;
        setProfilePic(data?.profile_pic);
      } catch (error) {
        console.error("Error fetching profile picture:", error.message);
      }
    }
    fetchProfile();
  }, [token]);

  // Toggle between light and dark mode
  const toggleTheme = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("theme", newDarkMode ? "dark" : "light");
    document.body.classList.toggle("light-theme", !newDarkMode);
  };

  // Initialize theme based on localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") === "dark";
    setDarkMode(savedTheme);
    document.body.classList.toggle("light-theme", !savedTheme);
  }, []);

  // Search functionality
  const search = (e) => {
    e.preventDefault();
    if (!searchInput) return;
    navigate(`/search?q=${encodeURIComponent(searchInput)}`);
  };

  // Handle logout
  const handleLogout = () => {
    sessionStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="navbar">
      <div className="links">
        <button>
          <Link to="/home">
            <i className="bx bx-home-alt"></i>
          </Link>
        </button>
        <button>
          <Link to="/favorites">
            <i className="bx bx-library"></i>
          </Link>
        </button>
        <form onSubmit={search}>
          <div className="search-bar">
            <input
              placeholder="Search For Artist, Track, or Album"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button type="submit" className="searchBtn">
              <i className="bx bx-search-alt-2"></i>
            </button>
          </div>
        </form>
      </div>

      <div className="links">
        <button>
          <Link to="/about">
            <i className="bx bx-info-circle"></i>
          </Link>
        </button>
        <button>
          <Link to="/faq">
            <i className="bx bx-question-mark"></i>
          </Link>
        </button>
        <button>
          <Link to="/cart">
            <i class='bx bx-cart-alt' ></i>
          </Link>
        </button>
        <button>
          <Link to="/wishlist">
            <i class='bx bx-list-ul' ></i>
          </Link>
        </button>
      </div>

      <div className="links links3">
        <button onClick={toggleTheme} className="theme-toggle" title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}>
          {darkMode ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          )}
        </button>
      </div>

      <div className="links links2">
        <button className="profile-btn" onClick={() => navigate('/userdetails')}>
          {profilePic ? (
            <img src={profilePic} alt="Profile" className="profile-pic" />
          ) : (
            <i className="bx bx-user-circle"></i>
          )}
        </button>
      </div>
    </div>
  );
};

export default Navbar;
