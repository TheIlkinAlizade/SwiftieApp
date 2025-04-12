import React, { useState, useEffect } from "react";
import './NotFound.css'; 
import Navbar from "./Navbar";

const languages = {
  az: {
    lostinmusic: "404 - Musiqi axtararkən itdin",
    lostdesc: "Axtardığınız səhifə tapılmadı. Ama yenidən yoxlamaqdan çəkinməyin.",
    gohome: "Qayıt",
  },
  en: {
    lostinmusic: "404 - Lost in the Music",
    lostdesc: "Looks like the page you're looking for doesn't exist. But hey, the beats never stop.",
    gohome: "Take Me Home",
  }
};

const NotFound = () => {
  const AzerbaijanLang = languages.az;  
  const EnglishLang = languages.en;
  const [language, setLanguage] = useState(() => sessionStorage.getItem('language') || 'AZ');
  const [currentLang, setCurrentLang] = useState(language === "AZ" ? AzerbaijanLang : EnglishLang);


  return (
    <div className="containerItems">
      <Navbar></Navbar>
    <div className="container d-flex flex-column justify-content-center align-items-center min-vh-100 text-center fade-in bg-dark text-white containerItems" >
      <div className="mb-4">
        <i className="bi bi-music-note-beamed icon spotify-green"></i>
      </div>
      <h1 className="display-4 fw-bold mb-2">{currentLang.lostinmusic}</h1>
      <p className="lead mb-4">
        {currentLang.lostinmusic}
      </p>
      <a href="/home" className="btn btn-spotify px-4 py-2">
        {currentLang.gohome}
      </a>
    </div>
    </div>
  );
};

export default NotFound;
