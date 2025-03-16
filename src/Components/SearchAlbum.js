import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, InputGroup, FormControl, Button, Row, Card } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { supabase } from '../client';

const CLIENT_ID = "1897d479bee342eea779fa4e8d15dbc6";
const CLIENT_SECRET = "24f4169858604c26b45b579fc2e926f4";

const SearchAlbum = ({ token }) => {  // Use token instead of user
  const [searchInput, setSearchInput] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [albums, setAlbums] = useState([]);
  const [favoriteAlbumIds, setFavoriteAlbumIds] = useState([]);

  // Fetch Spotify access token
  useEffect(() => {
    async function fetchAccessToken() {
      const res = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`,
      });
      const data = await res.json();
      setAccessToken(data.access_token);
    }

    fetchAccessToken();
  }, []);

  // Fetch user's favorite albums from the database
  useEffect(() => {
    async function fetchFavorites() {
      if (!token || !token.user) return;

      const { data, error } = await supabase
        .from("favorites")
        .select("album_id")
        .eq("user_id", token.user.id);  // Use token.user.id

      if (error) {
        console.error("Error fetching favorites:", error.message);
        return;
      }

      setFavoriteAlbumIds(data.map((fav) => fav.album_id));
    }

    fetchFavorites();
  }, [token]);

  // Search for albums by artist name
  async function search() {
    if (!searchInput) return;

    console.log("Searching for " + searchInput);
    const searchParams = {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${accessToken}` },
    };

    try {
      // Get Artist ID
      const artistResponse = await fetch(`https://api.spotify.com/v1/search?q=${searchInput}&type=artist`, searchParams);
      const artistData = await artistResponse.json();
      const artistID = artistData.artists.items[0]?.id;

      if (!artistID) {
        console.error("Artist not found");
        return;
      }

      // Get albums by artist
      const albumsResponse = await fetch(`https://api.spotify.com/v1/artists/${artistID}/albums?include_groups=album&market=US&limit=50`, searchParams);
      const albumsData = await albumsResponse.json();

      setAlbums(albumsData.items);
    } catch (error) {
      console.error("Error fetching data from Spotify:", error);
    }
  }

  // Add album to favorites
  async function addToFavorites(albumId, albumName) {
    if (!token) {
      alert("You need to be logged in to add favorites.");
      return;
    }

    const { error } = await supabase
      .from('favorites')
      .insert([
        {
          user_id: token.user.id,  // Use token.user.id
          album_id: albumId,
        }
      ]);

    if (error) {
      console.error("Error adding favorite:", error.message);
    } else {
      alert(`Added ${albumName} to favorites!`);
      setFavoriteAlbumIds((prev) => [...prev, albumId]); // Update the local state to show the updated list
    }
  }

  // Remove album from favorites
  async function removeFromFavorites(albumId) {
    if (!token) return;

    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', token.user.id)  // Use token.user.id
      .eq('album_id', albumId);

    if (error) {
      console.error("Error removing favorite:", error.message);
    } else {
      setFavoriteAlbumIds((prev) => prev.filter((id) => id !== albumId));  // Update local state
    }
  }

  return (
    <Container>
      <InputGroup className='mb-3' size='lg'>
        <FormControl
          placeholder='Search For Artist'
          onKeyPress={event => event.key === "Enter" && search()}
          onChange={event => setSearchInput(event.target.value)}
        />
        <Button onClick={search}>Search</Button>
      </InputGroup>

      <Row className='mx-2 row row-cols-4'>
        {albums.length === 0 ? (
          <p>No albums found. Try another artist!</p>
        ) : (
          albums.map((album) => (
            <Card key={album.id} style={{ margin: '10px', padding: '10px' }}>
              <Card.Img src={album.images[0]?.url} />
              <Card.Body>
                <Card.Title>{album.name}</Card.Title>
                {favoriteAlbumIds.includes(album.id) ? (
                  <Button variant="danger" onClick={() => removeFromFavorites(album.id)}>
                    Remove from Favorites
                  </Button>
                ) : (
                  <Button variant="success" onClick={() => addToFavorites(album.id, album.name)}>
                    Add to Favorites
                  </Button>
                )}
              </Card.Body>
            </Card>
          ))
        )}
      </Row>
    </Container>
  );
};

export default SearchAlbum;
