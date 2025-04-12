import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";


const languages = {
  az: {
    favtitle: "-nın sevimliləri",
    favAlboms: "Sevimli Albomlarım",
    favTracks: "Sevimli Mahnılarım",
  },
  en: {
    favtitle: "'s Favorites",
    favAlboms: "Favorite Albums",
    favTracks: "Favorite Tracks",
  }
};

const NavItem = ({ to, icon, label, isActive, collapsed }) => (
  <Link
    to={to}
    className="nav-item-link"
    style={{
      display: "flex",
      alignItems: "center",
      gap: collapsed ? "0" : "16px",
      padding: collapsed ? "16px 0" : "12px 24px",
      color: isActive ? "#fff" : "#b3b3b3",
      fontWeight: isActive ? "bold" : "normal",
      textDecoration: "none",
      borderRadius: "4px",
      transition: "all 0.2s ease",
      fontSize: "14px",
      backgroundColor: isActive ? "rgba(255,255,255,0.1)" : "transparent",
      justifyContent: collapsed ? "center" : "flex-start",
      position: "relative",
      margin: "4px 0",
    }}
  >
    <i className={`bx ${icon}`} style={{ fontSize: "24px" }}></i>
    {!collapsed && <span>{label}</span>}
    {collapsed && (
      <div
        className="nav-tooltip"
        style={{
          position: "absolute",
          left: "100%",
          top: "50%",
          transform: "translateY(-50%)",
          backgroundColor: "#282828",
          padding: "6px 12px",
          borderRadius: "4px",
          color: "#fff",
          fontSize: "12px",
          opacity: 0,
          visibility: "hidden",
          transition: "opacity 0.2s ease, visibility 0.2s ease",
          whiteSpace: "nowrap",
          zIndex: 1000,
          boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
          pointerEvents: "none",
          marginLeft: "10px",
        }}
      >
        {label}
      </div>
    )}
  </Link>
);

const Sidebar = ({sidebarCollapsed, setSidebarCollapsed }) => {
  const location = useLocation();
  const sidebarRef = useRef(null);
  const AzerbaijanLang = languages.az;  
  const EnglishLang = languages.en;
  const [language, setLanguage] = useState(() => sessionStorage.getItem('language') || 'AZ');
  const [currentLang, setCurrentLang] = useState(language === "AZ" ? AzerbaijanLang : EnglishLang);


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        window.innerWidth <= 768 && 
        !sidebarCollapsed &&
        sidebarRef.current && 
        !sidebarRef.current.contains(event.target)
      ) {
        setSidebarCollapsed(true);
        localStorage.setItem("sidebarCollapsed", "true");
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [sidebarCollapsed, setSidebarCollapsed]);

  const toggleSidebar = () => {
    const newState = !sidebarCollapsed;
    setSidebarCollapsed(newState);
    localStorage.setItem("sidebarCollapsed", newState);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <aside
      ref={sidebarRef}
      style={{
        width: sidebarCollapsed ? "70px" : "240px",
        backgroundColor: "#000",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        position: "fixed",
        left: 0,
        top: 0,
        zIndex: 1000,
        overflowY: "auto",
        overflowX: "hidden",
        transition: "width 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        boxShadow: "0 0 10px rgba(0,0,0,0.5)",
      }}
    >
      <div style={{ 
        padding: sidebarCollapsed ? "24px 10px 92px" : "24px 20px 12px",
        display: "flex",
        flexDirection: "column",
        height: "100%"
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: sidebarCollapsed ? "center" : "space-between",
          marginBottom: "30px",
          marginRight: "40"
        }}>
          {!sidebarCollapsed && (
            <Link to="/home" style={{ textDecoration: "none", color: "#fff" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <i
                  className="bx bxl-spotify"
                  style={{ fontSize: "36px", color: "#1db954" }}
                ></i>
                <span style={{ fontSize: "24px", fontWeight: "bold" }}>
                  SwiftieApp
                </span>
              </div>
            </Link>
          )}
          
          {sidebarCollapsed && (
            <Link to="/home" style={{ textDecoration: "none", color: "#fff" }}>
              <i
                className="bx bxl-spotify"
                style={{ fontSize: "32px", color: "#1db954" }}
              ></i>
            </Link>
          )}
          
          <button
  onClick={toggleSidebar}
  className="sidebar-toggle"
  style={{
    backgroundColor: "#2a2a2a",
    border: "none",
    color: "#e6e6e6",
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "10px",
    borderRadius: "12px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)",
    transition: "transform 0.2s ease, background-color 0.3s ease, box-shadow 0.3s ease",
    outline: "none",
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.backgroundColor = "#3b3b3b";
    e.currentTarget.style.transform = "scale(1.05)";
    e.currentTarget.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.2)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.backgroundColor = "#2a2a2a";
    e.currentTarget.style.transform = "scale(1)";
    e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.15)";
  }}
  onFocus={(e) => {
    e.currentTarget.style.outline = "2px solid #555";
  }}
  onBlur={(e) => {
    e.currentTarget.style.outline = "none";
  }}
  aria-label={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
>
  <i
    className={`bx ${sidebarCollapsed ? "bx-chevron-right" : "bx-chevron-left"}`}
    style={{ fontSize: "22px", transition: "transform 0.3s ease" }}
  ></i>
</button>

        </div>

        <nav style={{ marginBottom: "24px" }}>
          <NavItem
            to="/home"
            icon="bx-home-alt"
            label={language === "EN" ? "Home" : "Ana Səhifə"}
            isActive={isActive("/home")}
            collapsed={sidebarCollapsed}
          />
          <NavItem
            to="/search"
            icon="bx-search"
            label={language === "EN" ? "Search" : "Axtarış"}
            isActive={isActive("/search")}
            collapsed={sidebarCollapsed}
          />
          <NavItem
            to="/favorites"
            icon="bx-library"
            label={language === "EN" ? "Your Library" : "Kitabxana"}
            isActive={isActive("/favorites")}
            collapsed={sidebarCollapsed}
          />
        </nav>

        {/* Additional Pages with improved spacing */}
        <div style={{ marginBottom: "24px" }}>
          <NavItem
            to="/about"
            icon="bx-info-circle"
            label={language === "EN" ? "About" : "Haqqında"}
            isActive={isActive("/about")}
            collapsed={sidebarCollapsed}
          />
          <NavItem
            to="/faq"
            icon="bx-question-mark"
            label={language === "EN" ? "FAQ" : "Tez-tez soruşulan suallar"}
            isActive={isActive("/faq")}
            collapsed={sidebarCollapsed}
          />
          <NavItem
            to="/cart"
            icon="bx-cart-alt"
            label={language === "EN" ? "Cart" : "Səbət"}
            isActive={isActive("/cart")}
            collapsed={sidebarCollapsed}
          />
          <NavItem
            to="/wishlist"
            icon="bx-heart"
            label={language === "EN" ? "Wishlist" : "İstək siyahısı"}
            isActive={isActive("/wishlist")}
            collapsed={sidebarCollapsed}
          />
        </div>

        {/* Improved Playlists Section with hover effects */}
        {!sidebarCollapsed && (
          <div style={{ flex: 1 }}>
            <div style={{ borderTop: "1px solid #282828", paddingTop: "16px" }}>
              <div style={{ 
                fontSize: "11px", 
                color: "#b3b3b3", 
                padding: "4px 24px", 
                marginBottom: "8px",
                letterSpacing: "1px", 
                textTransform: "uppercase"
              }}>
                {language === "EN" ? "PLAYLISTS" : "PLEYLİSTLƏR"}
              </div>
              
              {/* Playlist items with hover effect */}
              <div 
                className="playlist-item" 
                style={{ 
                  fontSize: "13px", 
                  color: "#b3b3b3", 
                  padding: "8px 24px",
                  cursor: "pointer",
                  transition: "color 0.2s ease"
                }}
                onMouseEnter={(e) => e.target.style.color = "#fff"}
                onMouseLeave={(e) => e.target.style.color = "#b3b3b3"}
              >
                My Playlist #1
              </div>
              <div 
                className="playlist-item" 
                style={{ 
                  fontSize: "13px", 
                  color: "#b3b3b3", 
                  padding: "8px 24px",
                  cursor: "pointer",
                  transition: "color 0.2s ease"
                }}
                onMouseEnter={(e) => e.target.style.color = "#fff"}
                onMouseLeave={(e) => e.target.style.color = "#b3b3b3"}
              >
                Discover Weekly
              </div>
              <div 
                className="playlist-item" 
                style={{ 
                  fontSize: "13px", 
                  color: "#b3b3b3", 
                  padding: "8px 24px",
                  cursor: "pointer",
                  transition: "color 0.2s ease"
                }}
                onMouseEnter={(e) => e.target.style.color = "#fff"}
                onMouseLeave={(e) => e.target.style.color = "#b3b3b3"}
              >
                Release Radar
              </div>
            </div>
          </div>
        )}
        
        {/* Collapsed view of playlists - show a hint */}
        {sidebarCollapsed && (
          <div style={{ 
            marginTop: "auto", 
            display: "flex", 
            justifyContent: "center", 
            padding: "20px 0",
            position: "relative" 
          }}>
            <i 
              className="bx bx-list-ul playlist-icon" 
              style={{ 
                fontSize: "24px", 
                color: "#b3b3b3",
                cursor: "pointer",
                transition: "color 0.2s ease"
              }}
              onMouseEnter={(e) => e.target.style.color = "#fff"}
              onMouseLeave={(e) => e.target.style.color = "#b3b3b3"}
            ></i>
            <div
              className="nav-tooltip"
              style={{
                position: "absolute",
                left: "100%",
                top: "50%",
                transform: "translateY(-50%)",
                backgroundColor: "#282828",
                padding: "6px 12px",
                borderRadius: "4px",
                color: "#fff",
                fontSize: "12px",
                opacity: 0,
                visibility: "hidden",
                transition: "opacity 0.2s ease, visibility 0.2s ease",
                whiteSpace: "nowrap",
                zIndex: 1000,
                boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
                pointerEvents: "none",
                marginLeft: "10px",
              }}
            >
              Your Playlists
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;