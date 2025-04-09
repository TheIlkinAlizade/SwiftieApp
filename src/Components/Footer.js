import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="static-footer">
      <div className="footer-content">
        <div className="footer-logo">
          <h2>SwiftieApp</h2>
          <p>Music for everyone.</p>
        </div>
        
        <div className="footer-sections">
          <div className="footer-col">
            <h5>Company</h5>
            <p>About</p>
            <p>FAQ</p>
          </div>
          
          <div className="footer-col">
            <h5>Communities</h5>
            <p>For Artists</p>
            <p>Developers</p>
          </div>
          
          <div className="footer-col">
            <h5>Resources</h5>
            <p>Support</p>
            <p>Help Center</p>
          </div>
          
          <div className="footer-col">
            <h5>Connect</h5>
            <div className="social-icons">
              <span className="social-icon"><i className='bx bxl-instagram'></i></span>
              <span className="social-icon"><i className='bx bxl-twitter'></i></span>
              <span className="social-icon"><i className='bx bxl-facebook'></i></span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="footer-info">
          <span>Legal</span>
          <span>Privacy</span>
          <span>Cookies</span>
        </div>
        <p className="copyright">© {currentYear} SwiftieApp</p>
      </div>
    </footer>
  );
};

export default Footer;