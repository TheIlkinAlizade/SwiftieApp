import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
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

function App() {
  const [token, setToken] = useState(false);

  if(token){
    sessionStorage.setItem('token', JSON.stringify(token))
  }

  useEffect(() => {
    if(sessionStorage.getItem('token')){
      let data = JSON.parse(sessionStorage.getItem('token'));
      setToken(data);
    }

  }, [])
  console.log(token);

  return (
    <Provider store={store}>

    <Router>
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
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/home" element={<Homepage token={token} />} />
        <Route path="/musicshop" element={<MusicShop />} />
        <Route path="/userdetails" element={<UserDetailes token={token} />} />
        <Route path="/music/:id" element={<MusicDetails />} />
      </Routes>
      <Footer />
    </Router>
    </Provider>
  );
}

export default App;
