import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Card, Col, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { supabase } from '../client';
import { Link } from 'react-router-dom';

const Library = ({ token }) => {
  const [musicItems, setMusicItems] = useState([]); // Holds available music items
  const [userLibrary, setUserLibrary] = useState([]); // Holds user's library
  const [favoriteTrackIds, setFavoriteTrackIds] = useState([]); // Holds favorite tracks

  useEffect(() => {
    async function fetchMusicItems() {
      const { data, error } = await supabase.from('music_items').select('*');
  
      if (error) {
        console.error('Error fetching music items:', error.message);
        return;
      }
  
      // Ensure each item's id is a string
      const formattedData = data.map((item) => ({
        ...item,
        id: String(item.id),
      }));
  
      setMusicItems(formattedData);
    }
  
    fetchMusicItems();
  }, []);

  useEffect(() => {
    // Fetch user's library
    async function fetchUserLibrary() {
      if (!token || !token.user) return;

      const { data, error } = await supabase
        .from('user_library')
        .select('music_id')
        .eq('user_id', token.user.id);

      if (error) {
        console.error('Error fetching user library:', error.message);
        return;
      }

      const musicIds = data.map((lib) => lib.music_id);
      setUserLibrary(musicIds); // Store user's music library
    }

    fetchUserLibrary();
  }, [token]);

  async function addMusicItemToLibrary(musicId) {
    if (!token) {
      alert('You need to be logged in to add items to your library.');
      return;
    }
  
  
    const { error } = await supabase
      .from('user_library')
      .insert([{ user_id: token.user.id, music_id: musicId }]);
  
    if (error) {
      console.error('Error adding music item to library:', error.message);
    } else {
      setUserLibrary((prev) => [...prev, musicId]);
    }
  }
  async function removeMusicItemFromLibrary(musicId) {
    if (!token) {
      alert('You need to be logged in to remove items.');
      return;
    }
  
    const { error } = await supabase
      .from('user_library')
      .delete()
      .eq('user_id', token.user.id)
      .eq('music_id', musicId);
  
    if (error) {
      console.error('Error removing music item from library:', error.message);
    } else {
      setUserLibrary((prev) => prev.filter((id) => id !== musicId));
    }
  }
  return (
    <>
      <h3>Music Shop</h3>
      <div className='cards'>
        {musicItems.length === 0 ? (
          <p>No music items found.</p>
        ) : (
          musicItems.map((item) => (
            <div key={item.id} className='card'>
                <img src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwcHBwgHBw0HBwcHBw0HBwcHBw8IDQcNFREWFhURExMYHSggGBoxGxUfITEhJSkrLi4uFx8zODMsNygtLisBCgoKDQ0NDg0NDysZFRk3Ny03Ny0rKy0rKzctKzcrLSsrKy0rKysrKystLSsrKy0rKystKy0rKysrKysrKysrK//AABEIAOEA4QMBIgACEQEDEQH/xAAYAAEBAQEBAAAAAAAAAAAAAAACAQADBv/EABYQAQEBAAAAAAAAAAAAAAAAAAABEf/EABkBAQEBAQEBAAAAAAAAAAAAAAEAAgMHBv/EABYRAQEBAAAAAAAAAAAAAAAAAAABEf/aAAwDAQACEQMRAD8A9ozM8vfTMzMkzKqCKy4AmLi4uIamNi4uJaOMWNgGjjYeJiWjjYWNhOhiYeJiWihYiIsSEozMizMyTMzJMzMkysqDLjRcAbFxcWQM6mLi4uIamNhYuIaONhY2AaONhY2JaGNh4mE6GJh4mI6GIeJiOhiHRJFCQtIzMizMyTKhRBosaLAGhSNIUgZSQpGkKRM2pi4shYNZ0cXCxcGjRxsLFxDQxsPExLQxMdMTEdc7EsdMGw6dCxLDsGwtShYlh2DU0FSnRpIoVSlpGZkVixosDKwokKBmtIUjQpEza0hSNIUjLFqSFI0hSBnUxcKRcA0cbDxsQ0MbDxsS1zxLHTExHXOxLDsSwnXOwbHSwbC1KFg2HYNablCjTo1NQaNKpS0LKxKwokKBmrCiQoGasKJDgrFaQpGhSMsVpCkaQpAza0iyLIsgZ1MbCxcTOhjYeJiWhiWOmDYmtc7EsOwbC1KFg2HYNhagWBXSjWo3HOjTo0twKlKjS1ERWRKFBhRClCgw4GKsODDjLFWFEhxlirCkSFAxVkWRpCgYtTFxcXANHGwsTEtCxLDqUlzsGulClqBRp0aXSOdGnQrTUCjTo1p0gUaVGlqIzMmlhQYUTNOFBhQMU4UGHGWKUKDDjLFKFBhwOdWFEhRlmquNFTKISUIaNKjS1Ao06NaagUKdGl0gUKdCluBRp0K03BoU6NLcFlYlocCFEKcKDCjLFOFBhQMU4cCFGWKcOBCgc6cKDFjLNOKMVMqlbUoSUaVGlqDRpUKWoNGlQrTpBoU6FLcGhSo1puDRpUKW4zIxKwoMKJUocCFAxThxzhxmsU4cc4cZYpwoEKUMU4UCUpQwcraOtoGFraOtqWNUrWjaTGo1qNpaiUatGluDQpUa03Bo1aNadINGlRpaiMzItCgxYlThQIUDNOHHOHKKxTlKUIUrLFOU5XOUpQzYcpSucq6GMPV0NXUMLW0dTUsK0bU1LUcW0bWtG0tSNQtW0bS3Eo1aNajcShVo0txKNWpS1EZmRaLBhRIoUCFAzThShKsqZsdJSlc5SlZYsdJVlCVZQzjpKuhKugYetoauoYWto6mpYWpampqWLaNqWpaWsa0bWtG0tSNaNW0bS1IlGrRpbjUatGlpmRiWIVSKFAWBk4UoSrKAcpShKsqZsdJV1z0tGM4eroa2hnHTW0NbQsPW0NbUsLU0dbSsXUtTUtONY1qWpalpaka0bWtSpqNRq0SY1RkLTMzIszMkqwVQKEC6GTlWUF0DD1dDV1DD1dDV1DC1dDW0DD1NHW1LC1NTU0nC0dTU1HF1LU1NRxdG1tQlkZC0zMyLMzJMzMkzMySqKoFraKgFq6OtqGHraOtqGHraGroWFraOpqWFraOtpWLqamtqOLqaiIqjISzMyLMzJMzMkzMyTMzJM0ZkmVmQWMzALGZkmVmQZGZJmZkkasyKIzEtWZkWZmSZmZJmZkn/2Q==" />
                <div className='details'>
                  <p>{item.name}</p>
                  <p>{item.description}</p>
                  <p>
                    <strong>Price:</strong> ${item.price}
                  </p>
                  <button
                    onClick={() => addMusicItemToLibrary(item.id)}
                    disabled={userLibrary.includes(item.id)}
                  >
                    {userLibrary.includes(item.id) ? <i class='bx bxs-cart' ></i> : <i class='bx bx-cart'></i>}
                  </button>
                </div>
            </div>
          ))
        )}
      </div>

      <h3>{token?.user?.user_metadata?.full_name}'s Cart:</h3>
      <div className='cards'>
        {userLibrary.length === 0 ? (
          <p>Your Cart is Empty!</p>
        ) : (
          userLibrary.map((musicId) => {
            const musicItem = musicItems.find((item) => item.id === musicId);
            return (
              <div key={musicId} className='card'>
                  <img src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwcHBwgHBw0HBwcHBw0HBwcHBw8IDQcNFREWFhURExMYHSggGBoxGxUfITEhJSkrLi4uFx8zODMsNygtLisBCgoKDQ0NDg0NDysZFRk3Ny03Ny0rKy0rKzctKzcrLSsrKy0rKysrKystLSsrKy0rKystKy0rKysrKysrKysrK//AABEIAOEA4QMBIgACEQEDEQH/xAAYAAEBAQEBAAAAAAAAAAAAAAACAQADBv/EABYQAQEBAAAAAAAAAAAAAAAAAAABEf/EABkBAQEBAQEBAAAAAAAAAAAAAAEAAgMHBv/EABYRAQEBAAAAAAAAAAAAAAAAAAABEf/aAAwDAQACEQMRAD8A9ozM8vfTMzMkzKqCKy4AmLi4uIamNi4uJaOMWNgGjjYeJiWjjYWNhOhiYeJiWihYiIsSEozMizMyTMzJMzMkysqDLjRcAbFxcWQM6mLi4uIamNhYuIaONhY2AaONhY2JaGNh4mE6GJh4mI6GIeJiOhiHRJFCQtIzMizMyTKhRBosaLAGhSNIUgZSQpGkKRM2pi4shYNZ0cXCxcGjRxsLFxDQxsPExLQxMdMTEdc7EsdMGw6dCxLDsGwtShYlh2DU0FSnRpIoVSlpGZkVixosDKwokKBmtIUjQpEza0hSNIUjLFqSFI0hSBnUxcKRcA0cbDxsQ0MbDxsS1zxLHTExHXOxLDsSwnXOwbHSwbC1KFg2HYNablCjTo1NQaNKpS0LKxKwokKBmrCiQoGasKJDgrFaQpGhSMsVpCkaQpAza0iyLIsgZ1MbCxcTOhjYeJiWhiWOmDYmtc7EsOwbC1KFg2HYNhagWBXSjWo3HOjTo0twKlKjS1ERWRKFBhRClCgw4GKsODDjLFWFEhxlirCkSFAxVkWRpCgYtTFxcXANHGwsTEtCxLDqUlzsGulClqBRp0aXSOdGnQrTUCjTo1p0gUaVGlqIzMmlhQYUTNOFBhQMU4UGHGWKUKDDjLFKFBhwOdWFEhRlmquNFTKISUIaNKjS1Ao06NaagUKdGl0gUKdCluBRp0K03BoU6NLcFlYlocCFEKcKDCjLFOFBhQMU4cCFGWKcOBCgc6cKDFjLNOKMVMqlbUoSUaVGlqDRpUKWoNGlQrTpBoU6FLcGhSo1puDRpUKW4zIxKwoMKJUocCFAxThxzhxmsU4cc4cZYpwoEKUMU4UCUpQwcraOtoGFraOtqWNUrWjaTGo1qNpaiUatGluDQpUa03Bo1aNadINGlRpaiMzItCgxYlThQIUDNOHHOHKKxTlKUIUrLFOU5XOUpQzYcpSucq6GMPV0NXUMLW0dTUsK0bU1LUcW0bWtG0tSNQtW0bS3Eo1aNajcShVo0txKNWpS1EZmRaLBhRIoUCFAzThShKsqZsdJSlc5SlZYsdJVlCVZQzjpKuhKugYetoauoYWto6mpYWpampqWLaNqWpaWsa0bWtG0tSNaNW0bS1IlGrRpbjUatGlpmRiWIVSKFAWBk4UoSrKAcpShKsqZsdJV1z0tGM4eroa2hnHTW0NbQsPW0NbUsLU0dbSsXUtTUtONY1qWpalpaka0bWtSpqNRq0SY1RkLTMzIszMkqwVQKEC6GTlWUF0DD1dDV1DD1dDV1DC1dDW0DD1NHW1LC1NTU0nC0dTU1HF1LU1NRxdG1tQlkZC0zMyLMzJMzMkzMySqKoFraKgFq6OtqGHraOtqGHraGroWFraOpqWFraOtpWLqamtqOLqaiIqjISzMyLMzJMzMkzMyTMzJM0ZkmVmQWMzALGZkmVmQZGZJmZkkasyKIzEtWZkWZmSZmZJmZkn/2Q==" />
                  <div className='details'>
                    <p>{musicItem?.name}</p>
                    <p>{musicItem?.description}</p>
                    <p>
                      <strong>Price:</strong> ${musicItem?.price}
                    </p>
                    <button
                    onClick={() => removeMusicItemFromLibrary(musicId)}
                    >
                    <i class='bx bx-x'></i>
                    </button>
                  </div>
              </div>
            );
          })
        )}
      </div>
    </>
  );
};

export default Library;
