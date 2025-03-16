import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, InputGroup, FormControl, Button, Row, Card, Col } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { supabase } from '../client';

const CLIENT_ID = "1897d479bee342eea779fa4e8d15dbc6";
const CLIENT_SECRET = "24f4169858604c26b45b579fc2e926f4";

const Search = ({ token }) => {
  const [searchInput, setSearchInput] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [artists, setArtists] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [favoriteTrackIds, setFavoriteTrackIds] = useState([]);
  const [favoriteAlbumIds, setFavoriteAlbumIds] = useState([]);
  const [displayedArtists, setDisplayedArtists] = useState(4);
  const [displayedTracks, setDisplayedTracks] = useState(4);
  const [displayedAlbums, setDisplayedAlbums] = useState(4);

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

  useEffect(() => {
    async function fetchFavorites() {
      if (!token || !token.user) return;

      const { data, error } = await supabase
        .from("favorites")
        .select("album_id, music_id") // Use music_id instead of track_id
        .eq("user_id", token.user.id);

      if (error) {
        console.error("Error fetching favorites:", error.message);
        return;
      }

      const albumIds = data.map((fav) => fav.album_id);
      const musicIds = data.map((fav) => fav.music_id); // Use music_id instead of track_id
      setFavoriteAlbumIds(albumIds);
      setFavoriteTrackIds(musicIds); // Store music_ids instead of track_ids
    }

    fetchFavorites();
  }, [token]);

  async function search() {
    if (!searchInput) return;

    console.log("Searching for " + searchInput);
    const searchParams = {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${accessToken}` },
    };

    try {
      const artistResponse = await fetch(`https://api.spotify.com/v1/search?q=${searchInput}&type=artist`, searchParams);
      const artistData = await artistResponse.json();
      const filteredArtists = artistData.artists.items.filter(artist =>
        artist.name.toLowerCase().includes(searchInput.toLowerCase())
      );
      setArtists(filteredArtists);

      const trackResponse = await fetch(`https://api.spotify.com/v1/search?q=${searchInput}&type=track`, searchParams);
      const trackData = await trackResponse.json();
      setTracks(trackData.tracks.items);
      const albumResponse = await fetch(`https://api.spotify.com/v1/search?q=${searchInput}&type=album`, searchParams);
      const albumData = await albumResponse.json();
      setAlbums(albumData.albums.items);
    } catch (error) {
      console.error("Error fetching data from Spotify:", error);
    }
  }

  async function addTrackToFavorites(trackId, trackName) {
    if (!token) {
      alert("You need to be logged in to add favorites.");
      return;
    }

    const { error } = await supabase
      .from('favorites')
      .insert([{ user_id: token.user.id, music_id: trackId }]); // Use music_id instead of track_id

    if (error) {
      console.error("Error adding favorite track:", error.message);
    } else {
      alert(`Added ${trackName} to favorites!`);
      setFavoriteTrackIds((prev) => [...prev, trackId]);
    }
  }

  async function addAlbumToFavorites(albumId, albumName) {
    if (!token) {
      alert("You need to be logged in to add favorites.");
      return;
    }

    const { error } = await supabase
      .from('favorites')
      .insert([{ user_id: token.user.id, album_id: albumId }]);

    if (error) {
      console.error("Error adding favorite album:", error.message);
    } else {
      alert(`Added ${albumName} to favorites!`);
      setFavoriteAlbumIds((prev) => [...prev, albumId]);
    }
  }

  return (
    <Container>
      <InputGroup className='mb-3' size='lg'>
        <FormControl
          placeholder='Search For Artist, Track, or Album'
          onKeyPress={event => event.key === "Enter" && search()}
          onChange={event => setSearchInput(event.target.value)}
        />
        <Button onClick={search}>Search</Button>
      </InputGroup>

      {/* Artists Section */}
      <Row className='mx-2'>
        <h3>Artists</h3>
        {artists.length === 0 ? (
          <p>No artists found. Try another search!</p>
        ) : (
          artists.slice(0, displayedArtists).map((artist) => (
            <Col key={artist.id} xs={12} sm={6} md={4} lg={3}>
              <Card style={{ margin: '10px', padding: '10px' }}>
                <Card.Img src={artist.images[0]?.url} />
                <Card.Body>
                  <Card.Title>{artist.name}</Card.Title>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>
      {artists.length > displayedArtists && (
        <Button onClick={() => setDisplayedArtists(displayedArtists + 4)}>
          Add More Artists
        </Button>
      )}

      {/* Tracks Section */}
      <Row className='mx-2'>
        <h3>Tracks</h3>
        {tracks.length === 0 ? (
          <p>No tracks found. Try another search!</p>
        ) : (
          tracks.slice(0, displayedTracks).map((track) => (
            <Col key={track.id} xs={12} sm={6} md={4} lg={3}>
              <Card style={{ margin: '10px', padding: '10px' }}>
                <Card.Img src={track.album.images[0]?.url} />
                <Card.Body>
                  <Card.Title>{track.name}</Card.Title>
                  <Button
                    variant="success"
                    onClick={() => addTrackToFavorites(track.id, track.name)}
                    disabled={favoriteTrackIds.includes(track.id)}
                  >
                    {favoriteTrackIds.includes(track.id) ? 'Added to Favorites' : 'Add to Favorites'}
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>
      {tracks.length > displayedTracks && (
        <Button onClick={() => setDisplayedTracks(displayedTracks + 4)}>
          Add More Tracks
        </Button>
      )}

      {/* Albums Section */}
      <Row className='mx-2'>
        <h3>Albums</h3>
        {albums.length === 0 ? (
          <p>No albums found. Try another search!</p>
        ) : (
          albums.slice(0, displayedAlbums).map((album) => (
            <Col key={album.id} xs={12} sm={6} md={4} lg={3}>
              <Card style={{ margin: '10px', padding: '10px' }}>
                <Card.Img src={album.images[0]?.url} />
                <Card.Body>
                  <Card.Title>{album.name}</Card.Title>
                  <Button
                    variant="success"
                    onClick={() => addAlbumToFavorites(album.id, album.name)}
                    disabled={favoriteAlbumIds.includes(album.id)}
                  >
                    {favoriteAlbumIds.includes(album.id) ? 'Added to Favorites' : 'Add to Favorites'}
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>
      {albums.length > displayedAlbums && (
        <Button onClick={() => setDisplayedAlbums(displayedAlbums + 4)}>
          Add More Albums
        </Button>
      )}
    </Container>
  );
};

export default Search;
