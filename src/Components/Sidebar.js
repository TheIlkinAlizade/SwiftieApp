import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className='sidebar'>
      <div className='sidebar-links'>
        <Link to='/home' className='sidebar-link'>
          <i className='bx bx-home-alt'></i>
          <span>Home</span>
        </Link>
        <Link to='/favorites' className='sidebar-link'>
          <i className='bx bx-library'></i>
          <span>Favorites</span>
        </Link>
        <Link to='/faq' className='sidebar-link'>
          <i className='bx bx-question-mark'></i>
          <span>FAQ</span>
        </Link>
        <Link to='/about' className='sidebar-link'>
          <i className='bx bx-info-circle'></i>
          <span>About Us</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;