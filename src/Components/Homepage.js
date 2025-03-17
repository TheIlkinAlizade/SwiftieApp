import { Container, InputGroup, FormControl, Button, Row, Card} from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import { supabase } from '../client';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const Homepage = ({token}) => {
    let navigate = useNavigate();

    function handleLogout(){
        sessionStorage.removeItem('token');
        navigate('/login');
    }

    return (
        <div className='containerItems'>
            <Navbar></Navbar>
            <div className='home'>
                <p className='userwelcome'>Welcome back, {token.user.user_metadata.full_name}</p>
                <Link to='/search'>Search</Link>
                <Link to='/favorites'>Favorites</Link>
                <button className='logoutbtn' onClick={handleLogout}>LogOut</button>
            </div>
        </div>
    );
}

export default Homepage;