import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './musicpage.css'; // Assuming you have all relevant CSS here
import Footer from './Footer';

const languages = {
  az: {
    home: "Ana səhifə",
  },
  en: {
    premiumBanner: "Get 3 months of Premium for free",
  }
};

const DefaultPage = () => {
  const [language, setLanguage] = useState(() => sessionStorage.getItem('language') || 'AZ');

  return (
    <>
    <div className='musicpage'>
      <div className="banner">
        <div className="navbar">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/faq">FAQ</Link></li>
          </ul>
          <div>
            <Link className="sign-href" to="/register">
              <button type="button"><span></span> Sign-Up </button>
            </Link>
            <Link className="sign-href" to="/login ">
              <button type="button"><span></span> Sign-In </button>
            </Link>
          </div>
        </div>

        <div className="content">
          <h1>Welcome To SwiftieApp</h1>
          <p>Here is Things you can Do</p>
        </div>
      </div>

      <div className="Musics" id="Musics">
        <h1>FEATURED MUSICS</h1>
        <div className="feautured_music_box">

          {[
            {
              title: "Sweater Weather",
              singer: "The Neighbourhood",
              duration: "4:00",
              img: "/img/Sweater.png"
            },
            {
              title: "Sevdalılar Beni Anlar",
              singer: "Ferdi Tayfur",
              duration: "4:15",
              img: "/img/SevdalilarBeniAnlar.png"
            },
            {
              title: "Ben",
              singer: "Barış Akarsu",
              duration: "3:54",
              img: "/img/BarisAkarsu.png"
            },
            {
              title: "Shake it off",
              singer: "Taylor Swift",
              duration: "3:39",
              img: "/img/TaylorSwift.png"
            },
            {
              title: "Viva La Vida",
              singer: "Coldplay",
              duration: "4:02",
              img: "/img/VivaLaVidaColdplay.png"
            },
            {
              title: "Arcade",
              singer: "Duncan Laurance",
              duration: "3:05",
              img: "/img/Arcade.png"
            },
            {
              title: "Eleanor Rigby",
              singer: "The Beatles",
              duration: "2:05",
              img: "/img/Eleanor.png"
            }
          ].map((music, index) => (
            <div className="featured_music_card" key={index}>
              <div className="featured_music_img">
                <img src={music.img} alt={music.title} />
              </div>
              <div className="featured_music_tag">
                <h2>{music.title}</h2>
                <div className="singer">{music.singer}</div>
                <p className="music_price">{music.duration}</p>
                <a href="#" className="f_btn">Listen now</a>
              </div>
            </div>
          ))}

        </div>
      </div>

      <div className="about" id="About">
        <h1 className="about-text">
          Listen to your favorite Musics, Get favorite musics, Share them <br /> Join us Today!
        </h1>
        <h1 className="about-text">
          We are using Spotify API. <br />Connect your account for better experience
        </h1>
        <div className="about-Join-btn">
          <Link to="/register">Sign Up!</Link>
        </div>
        <h1>Want to get more Information? <br /> Contact us</h1>
        <form className="more-form">
          <input type="email" id="more-email" placeholder="E-mail" required />
          <textarea id="more-message" placeholder="Your message..." required></textarea>
          <button>Submit</button>
        </form>
      </div>
      <Footer></Footer>
    </div>
    </>
  );
};

export default DefaultPage;
