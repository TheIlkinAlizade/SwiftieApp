import { Container, InputGroup, FormControl, Button, Row, Card} from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import { supabase } from '../client';
import { Link, useNavigate } from 'react-router-dom';

const DefaultPage = () => {

    return (
        <div>
            SwiftieAPP
        </div>
    );
}

export default DefaultPage;