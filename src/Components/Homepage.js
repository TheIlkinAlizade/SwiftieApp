import { Container, InputGroup, FormControl, Button, Row, Card} from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import { supabase } from '../client';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setError, setMusicItems, addMusicItem, updateMusicItem, deleteMusicItem } from "../redux/musicSlice";
    
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
            <div className='home'>
                <p className='userwelcome'>Welcome back, {token?.user?.user_metadata?.full_name}</p>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <div className="cards">
                    {musicItems.map((item) => (
                        <div key={item.id} className="card card2">
                            <img className='shopimg' src='data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwcHBwgHBw0HBwcHBw0HBwcHBw8IDQcNFREWFhURExMYHSggGBoxGxUfITEhJSkrLi4uFx8zODMsNygtLisBCgoKDQ0NDg0NDysZFRk3Ny03Ny0rKy0rKzctKzcrLSsrKy0rKysrKystLSsrKy0rKystKy0rKysrKysrKysrK//AABEIAOEA4QMBIgACEQEDEQH/xAAYAAEBAQEBAAAAAAAAAAAAAAACAQADBv/EABYQAQEBAAAAAAAAAAAAAAAAAAABEf/EABkBAQEBAQEBAAAAAAAAAAAAAAEAAgMHBv/EABYRAQEBAAAAAAAAAAAAAAAAAAABEf/aAAwDAQACEQMRAD8A9ozM8vfTMzMkzKqCKy4AmLi4uIamNi4uJaOMWNgGjjYeJiWjjYWNhOhiYeJiWihYiIsSEozMizMyTMzJMzMkysqDLjRcAbFxcWQM6mLi4uIamNhYuIaONhY2AaONhY2JaGNh4mE6GJh4mI6GIeJiOhiHRJFCQtIzMizMyTKhRBosaLAGhSNIUgZSQpGkKRM2pi4shYNZ0cXCxcGjRxsLFxDQxsPExLQxMdMTEdc7EsdMGw6dCxLDsGwtShYlh2DU0FSnRpIoVSlpGZkVixosDKwokKBmtIUjQpEza0hSNIUjLFqSFI0hSBnUxcKRcA0cbDxsQ0MbDxsS1zxLHTExHXOxLDsSwnXOwbHSwbC1KFg2HYNablCjTo1NQaNKpS0LKxKwokKBmrCiQoGasKJDgrFaQpGhSMsVpCkaQpAza0iyLIsgZ1MbCxcTOhjYeJiWhiWOmDYmtc7EsOwbC1KFg2HYNhagWBXSjWo3HOjTo0twKlKjS1ERWRKFBhRClCgw4GKsODDjLFWFEhxlirCkSFAxVkWRpCgYtTFxcXANHGwsTEtCxLDqUlzsGulClqBRp0aXSOdGnQrTUCjTo1p0gUaVGlqIzMmlhQYUTNOFBhQMU4UGHGWKUKDDjLFKFBhwOdWFEhRlmquNFTKISUIaNKjS1Ao06NaagUKdGl0gUKdCluBRp0K03BoU6NLcFlYlocCFEKcKDCjLFOFBhQMU4cCFGWKcOBCgc6cKDFjLNOKMVMqlbUoSUaVGlqDRpUKWoNGlQrTpBoU6FLcGhSo1puDRpUKW4zIxKwoMKJUocCFAxThxzhxmsU4cc4cZYpwoEKUMU4UCUpQwcraOtoGFraOtqWNUrWjaTGo1qNpaiUatGluDQpUa03Bo1aNadINGlRpaiMzItCgxYlThQIUDNOHHOHKKxTlKUIUrLFOU5XOUpQzYcpSucq6GMPV0NXUMLW0dTUsK0bU1LUcW0bWtG0tSNQtW0bS3Eo1aNajcShVo0txKNWpS1EZmRaLBhRIoUCFAzThShKsqZsdJSlc5SlZYsdJVlCVZQzjpKuhKugYetoauoYWto6mpYWpampqWLaNqWpaWsa0bWtG0tSNaNW0bS1IlGrRpbjUatGlpmRiWIVSKFAWBk4UoSrKAcpShKsqZsdJV1z0tGM4eroa2hnHTW0NbQsPW0NbUsLU0dbSsXUtTUtONY1qWpalpaka0bWtSpqNRq0SY1RkLTMzIszMkqwVQKEC6GTlWUF0DD1dDV1DD1dDV1DC1dDW0DD1NHW1LC1NTU0nC0dTU1HF1LU1NRxdG1tQlkZC0zMyLMzJMzMkzMySqKoFraKgFq6OtqGHraOtqGHraGroWFraOpqWFraOtpWLqamtqOLqaiIqjISzMyLMzJMzMkzMyTMzJM0ZkmVmQWMzALGZkmVmQZGZJmZkkasyKIzEtWZkWZmSZmZJmZkn/2Q==' />
                            <div className="details shop">
                                <p className="artist itemdesc">{item.name}</p>
                                <p className="artist">{item.description}</p>
                                <p className="artist">Price: ${item.price}</p>
                            </div>
                        </div>
                        // <button onClick={() => addAlbumToFavorites(album.id, album.name)} disabled={favoriteAlbumIds.includes(album.id)}>
                        //                   {favoriteAlbumIds.includes(album.id) ? <i className='bx bxs-heart'></i> : <i className='bx bx-heart' ></i>}
                        // </button>
                    ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Homepage;