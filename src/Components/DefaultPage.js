import { Container, InputGroup, FormControl, Button, Row, Card} from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import { supabase } from '../client';
import { Link, useNavigate } from 'react-router-dom';
import '../style.css';
const DefaultPage = () => {

    return (
        <>
        <div className='defaultPage'>
            <p><span>Swiftie</span><span>A</span><span>P</span><span>P</span></p>
            
            <Link className='btnlink' to='/register'><a>Join Us!</a></Link> 
            
        </div>
        </>
    );
}

export default DefaultPage;