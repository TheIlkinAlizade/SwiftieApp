import React, { useState, useRef, useEffect } from "react";
import { supabase } from "../client";
import { Link, useNavigate } from "react-router-dom";

const CLIENT_ID = "5ed04eb65f1e4eb9bf0de8ec5418111f";
const CLIENT_SECRET = "d9785a1ad1e246edb7480e256469671c";

const languages = {
  az: {
    searchPlaceHolder: "Müğənni, mahnı, albom axtar",
    myAcc: "Hesabım",
    logout: "Çıxış et"
  },
  en: {
    searchPlaceHolder: "Search For Artist, Track, or Album",
    myAcc: "My Account",
    logout: "Log out"
  }
};

const UserDropdown = ({ token, onLogout }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const AzerbaijanLang = languages.az;  
  const EnglishLang = languages.en;
  const [language, setLanguage] = useState(() => sessionStorage.getItem('language') || 'AZ');
  const [currentLang, setCurrentLang] = useState(language === "AZ" ? AzerbaijanLang : EnglishLang);
  const [username, setusername] = useState("");

  useEffect(() => {
    if(token?.user?.user_metadata?.full_name == " "){
      setusername(token?.user?.user_metadata?.full_name);
      console.log(token?.user?.user_metadata?.full_name);
      var user = token?.user?.user_metadata?.full_name;
      console.log(user);
      setusername(user);
      console.log(username);
      console.log(token);
    }
  });

  useEffect(() => {

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} style={{ position: "relative", display: "inline-block" }}>
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        style={{
          backgroundColor: "#333",
          border: "none",
          borderRadius: "20px",
          padding: "6px 12px",
          color: "#fff",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <span>{username === "" ? "User" : username}</span>
        <i className={`bx ${dropdownOpen ? "bx-chevron-up" : "bx-chevron-down"}`} />
      </button>

      {dropdownOpen && (
        <div
          style={{
            position: "absolute",
            right: 0,
            marginTop: "10px",
            backgroundColor: "#282828",
            borderRadius: "6px",
            boxShadow: "0 8px 16px rgba(0, 0, 0, 0.3)",
            width: "180px",
            zIndex: 1000,
          }}
        >
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            <li>
              <Link
                to="/userdetails"
                style={{
                  display: "block",
                  padding: "12px 16px",
                  textDecoration: "none",
                  color: "#fff",
                }}
              >
                {currentLang.myAcc}
              </Link>
            </li>
            <li style={{ borderTop: "1px solid #444" }}>
              <button
                onClick={onLogout}
                style={{
                  width: "50%",
                  padding: "12px 16px",
                  background: "none",
                  border: "none",
                  color: "#fff",
                  textAlign: "left",
                  cursor: "pointer",
                }}
              >
                {currentLang.logout}
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};


const Navbar = ({ token, sidebarCollapsed }) => {
  const [darkTheme, setDarkTheme] = useState(localStorage.getItem("theme") === "dark" || !localStorage.getItem("theme"));
  const [searchInput, setSearchInput] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [theme, setTheme] = useState('dark'); // Default theme
  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark" || false);
  const AzerbaijanLang = languages.az;  
  const EnglishLang = languages.en;
  const [language, setLanguage] = useState(() => sessionStorage.getItem('language') || 'AZ');
  const [currentLang, setCurrentLang] = useState(language === "AZ" ? AzerbaijanLang : EnglishLang);


  const navigate = useNavigate();

  useEffect(() => {
    // Apply theme to body
    document.body.style.backgroundColor = darkTheme ? "#121212" : "#ffffff";
    document.body.style.color = darkTheme ? "#fff" : "#191414";
    localStorage.setItem("theme", darkTheme ? "dark" : "light");
  }, [darkTheme]);



  const toggleTheme = () => {
    window.location.reload(); 
    setDarkTheme(!darkTheme);
    window.location.reload(); 
  };

  const toggleLanguage = () => {
    const newLang = language === "EN" ? "AZ" : "EN";
    setLanguage(newLang);
    localStorage.setItem("language", newLang);
    window.location.reload(); 

  };

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    navigate("/login");
  };
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

  const handleLangChange = (e) => {
    // sessionStorage.removeItem('token');
    const newLang = e.target.value;
    setLanguage(newLang);
    window.location.reload(); 
  };
  const checkLang = (lang) => {
    console.log(lang);
  };
  useEffect(() => {
    checkLang(language);
    sessionStorage.setItem('language', language);
  }, [language]);

  return (
    <nav style={{
      position: "fixed",
      top: 0,
      right: 0,
      height: "72px",
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      padding: "0 24px",
      backgroundColor: darkTheme ? "rgba(0,0,0,0.7)" : "rgba(255,255,255,0.7)",
      backdropFilter: "blur(10px)",
      zIndex: 900,
      boxShadow: "0 1px 0 rgba(0,0,0,0.1)",
      width: `calc(100% - ${sidebarCollapsed ? '10px' : '0px'})`,
      transition: "width 0.3s ease, background-color 0.3s ease"
    }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "16px"
      }}>
          <form onSubmit={search}>
            <div className="search-bar">
              <input
                placeholder={currentLang.searchPlaceHolder}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <button type="submit" className="searchBtn">
                <i className="bx bx-search-alt-2"></i>
              </button>
            </div>
          </form>
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="nav-btn"
          style={{
            backgroundColor: darkTheme ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
            border: "none",
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all 0.2s ease",
            color: darkTheme ? "#fff" : "#000",
          }}
        >
          <i className={`bx ${darkTheme ? "bx-sun" : "bx-moon"}`} style={{ fontSize: "18px" }}></i>
        </button>
        
      
        <button
          onClick={toggleLanguage}
          className="nav-btn"
          style={{
            backgroundColor: darkTheme ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
            border: "none",
            height: "32px",
            borderRadius: "16px",
            padding: "0 12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all 0.2s ease",
            color: darkTheme ? "#fff" : "#000",
            fontWeight: "bold",
            fontSize: "14px",
          }}
        >
          {language === "EN" ? "EN" : "AZ"}
        </button>
          {/* <select name="language" value={language} onChange={(e) => handleLangChange(e)}>
            <option value="AZ">AZ</option>
            <option value="EN">EN</option>
          </select> */}
        
        <UserDropdown 
          token={token}
          onLogout={handleLogout}
        />
      </div>
    </nav>
  );
};

export default Navbar;