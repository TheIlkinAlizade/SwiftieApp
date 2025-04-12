import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { Navigate } from 'react-router-dom';

import { Container, InputGroup, FormControl, Button, Row, Card} from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { supabase } from './client';

import SearchAlbum from './Components/SearchAlbum';
import SignUp from './Components/SignUp';
import Login from './Components/Login';
import Homepage from './Components/Homepage';
import DefaultPage from './Components/DefaultPage';
import Favorites from './Components/Favorites';
import Search from './Components/Search';
import store from './redux/store';
import AdminPanel from './Components/AdminPanel';
import MusicShop from './Components/MusicShop';
import { Provider } from 'react-redux';
import Footer from './Components/Footer';
import UserDetailes from './Components/UserDetailes';
import FAQPage from './Components/FAQPage';
import AboutUsPage from './Components/AboutUsPage';
import WishlistPage from './Components/WishlistPage';
import CartPage from './Components/CartPage';
import MusicDetails from './Components/MusicDetails';
import Checkout from './Components/Checkout';
import NotFound from './Components/NotFound'
import OrderConfirmation from './Components/OrderConfirmation';
import Sidebar from './Components/Sidebar';
import Navbar from './Components/Navbar';
import SavedCarts from './Components/SavedCarts';

function App() {
  const [token, setToken] = useState(false);
  const [language, setLanguage] = useState(localStorage.getItem("language") || "en");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(localStorage.getItem("sidebarCollapsed") === "true");

  useEffect(() => {
    // Global styles
    document.body.style.margin = 0;
    document.body.style.padding = 0;
    document.body.classList.add("spotify-theme");
    document.body.style.fontFamily = "Circular, Helvetica, Arial, sans-serif";
    
    // Add hover effects via CSS
    const style = document.createElement("style");
    style.textContent = `
      .nav-item-link:hover {
        color: #fff !important;
      }
      .nav-item-link:hover .nav-tooltip {
        opacity: 1 !important;
        visibility: visible !important;
      }
      .sidebar-toggle:hover {
        color: #fff !important;
        transform: scale(1.1);
      }
      .user-button:hover {
        background: rgba(255,255,255,0.15) !important;
      }
      .dropdown-menu a:hover, .dropdown-menu button:hover {
        background-color: rgba(255,255,255,0.1) !important;
      }
      .nav-btn:hover {
        background-color: rgba(255,255,255,0.2) !important;
        transform: scale(1.05);
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.body.classList.remove("spotify-theme");
      document.head.removeChild(style);
    };
  }, []);

  if(token){
    sessionStorage.setItem('token', JSON.stringify(token))
  }

  useEffect(() => {
    if(sessionStorage.getItem('token')){
      let data = JSON.parse(sessionStorage.getItem('token'));
      setToken(data);
    }

  }, [])

  
  return (
    
    <Provider store={store}>
      <Router>
        <Sidebar 
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
        />
        <Navbar 
          token={token}
          language={language}
        />
        <Routes>
        <Route path='/register' element={<SignUp />} />
        <Route path='/login' element={<Login setToken={setToken} />} />
        <Route path='/search' element={<Search token={token} />} />
        <Route path='/favorites' element={<Favorites token={token} />} />
        <Route path='/about' element={<AboutUsPage  />} />
        <Route path='/faq' element={<FAQPage  />} />
        <Route path='/cart' element={<CartPage token={token}  />} />
        <Route path='/wishlist' element={<WishlistPage token={token}  />} />
        {token ? <Route path='/home' element={<Homepage token={token} />} /> : <Route path='/*' element={<DefaultPage />} />}
        {token ? <Route path='/browse' element={<Homepage token={token} />} /> : <Route path='/*' element={<DefaultPage />} />}
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/home" element={<Homepage token={token} />} />
        <Route path="/musicshop" element={<MusicShop />} />
        <Route path="/userdetails" element={<UserDetailes token={token} />} />
        <Route path="/music/:id" element={<MusicDetails />} />
        <Route path="/saved-carts" element={<SavedCarts token={token} />} />
        <Route 
              path="/checkout" 
              element={token ? <Checkout token={token} /> : <Navigate to="/login" />} 
            />
        <Route path="*" element={<NotFound />} />
        <Route 
              path="/order-confirmation" 
              element={token ? <OrderConfirmation token={token} /> : <Navigate to="/login" />} 
            />
      </Routes>
      <Footer />    
    </Router>
    </Provider>
  );
}

export default App;
