import { Container, InputGroup, FormControl, Button, Row, Card} from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import { supabase } from '../client';
import { Link, useNavigate } from 'react-router-dom';

const Homepage = ({token}) => {
    let navigate = useNavigate();

    function handleLogout(){
        sessionStorage.removeItem('token');
        navigate('/login');
    }

    return (
        <div className='home'>
            <p className='userwelcome'>Welcome back, {token.user.user_metadata.full_name}</p>
            <Link to='/search'>Search</Link>
            <button className='logoutbtn' onClick={handleLogout}>LogOut</button>
        </div>
    );
}

export default Homepage;