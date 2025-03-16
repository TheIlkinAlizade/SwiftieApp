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
        <div>
            Welcome back, {token.user.user_metadata.full_name}
            <button onClick={handleLogout}>LogOut</button>
            <Link to='/search'>Search</Link>
        </div>
    );
}

export default Homepage;