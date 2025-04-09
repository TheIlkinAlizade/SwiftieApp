
import React from 'react';
import './NotFound.css'; 

const NotFound = () => {
  return (
    <div className="container d-flex flex-column justify-content-center align-items-center min-vh-100 text-center fade-in bg-dark text-white">
      <div className="mb-4">
        <i className="bi bi-music-note-beamed icon spotify-green"></i>
      </div>
      <h1 className="display-4 fw-bold mb-2">404 - Lost in the Music</h1>
      <p className="lead mb-4">
        Looks like the page you're looking for doesn't exist. But hey, the beats never stop.
      </p>
      <a href="/home" className="btn btn-spotify px-4 py-2">
        Take Me Home
      </a>
    </div>
  );
};

export default NotFound;
