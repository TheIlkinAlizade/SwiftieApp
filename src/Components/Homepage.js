import { Container, InputGroup, FormControl, Button, Row, Card} from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import { supabase } from '../client';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setError, setMusicItems, addMusicItem, updateMusicItem, deleteMusicItem } from "../redux/musicSlice";
import Library from './Library';

const Homepage = ({token}) => {
    let navigate = useNavigate();
    const dispatch = useDispatch(); 
    const musicItems = useSelector((state) => state.music.musicItems);
    const loading = useSelector((state) => state.music.loading);

    useEffect(() => {
      const fetchMusicItems = async () => {
        dispatch(setLoading());
        try {
          const { data, error } = await supabase.from('music_items').select('*');
          if (error) throw error;
          dispatch(setMusicItems(data));
        } catch (error) {
          dispatch(setError(error.message));
        }
      };
      fetchMusicItems();
    }, [dispatch]);

    function handleLogout(){
        sessionStorage.removeItem('token');
        navigate('/login');
    }

    return (
        <div className='containerItems'>
            <Navbar></Navbar>
            <Library token={token}></Library>
        </div>
    );
}

export default Homepage;