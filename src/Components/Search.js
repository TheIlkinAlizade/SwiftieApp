import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, InputGroup, FormControl, Button, Row, Card, Col } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { supabase } from '../client';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';


const CLIENT_ID = "5ed04eb65f1e4eb9bf0de8ec5418111f";
const CLIENT_SECRET = "d9785a1ad1e246edb7480e256469671c";

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
  const location = useLocation();  // Get location from the router
  const query = new URLSearchParams(location.search).get('q'); // Extract search query from URL
  
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
    if (query, accessToken) {
      console.log("FOUND");
      setSearchInput(query); // Set search input based on URL query
      searchWithInput(query); // Perform search when component mounts with query parameter
    }
  }, [query, accessToken]);
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

  async function search(e) {
    e.preventDefault();
    
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
  async function searchWithInput(searchText) {
    if (!searchText) return;

    console.log("Searching for " + searchText);
    const searchParams = {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${accessToken}` },
    };

    try {
      const artistResponse = await fetch(`https://api.spotify.com/v1/search?q=${searchText}&type=artist`, searchParams);
      const artistData = await artistResponse.json();
      const filteredArtists = artistData.artists.items.filter(artist =>
        artist.name.toLowerCase().includes(searchText.toLowerCase())
      );
      setArtists(filteredArtists);

      const trackResponse = await fetch(`https://api.spotify.com/v1/search?q=${searchText}&type=track`, searchParams);
      const trackData = await trackResponse.json();
      setTracks(trackData.tracks.items);
      const albumResponse = await fetch(`https://api.spotify.com/v1/search?q=${searchText}&type=album`, searchParams);
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
      // alert(`Added ${trackName} to favorites!`);
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
      // alert(`Added ${albumName} to favorites!`);
      setFavoriteAlbumIds((prev) => [...prev, albumId]);
    }
  }

  return (
    <div className='containerItems'>
      <div className='navbar'>
        <div className='links'>
          <button>
            <Link to='/home'>
              <i class='bx bx-home-alt' ></i>
            </Link>
          </button>
          <button>
            <Link to='/favorites'>
              <i class='bx bx-library' ></i>
            </Link>
          </button>
        </div>
        <form>
          <div className='search-bar'>
            <input
              placeholder='Search For Artist, Track, or Album'
              onKeyPress={event => {
                if (event.key === "Enter") {
                  search(event);  // Pass the event object here
                }
              }}
              onChange={event => setSearchInput(event.target.value)}
              />
            <button onClick={search}><i className='bx bx-search-alt-2' ></i></button>
          </div>
        </form>
      </div>


      {/* Artists Section */}
      <h3>Artists</h3>
      <div className='cards'>
        {artists.length === 0 ? (
          <p>No artists found. Try another search!</p>
        ) : (
          artists.slice(0, displayedArtists).map((artist) => (
            <div key={artist.id} className='card'>
                <img src={artist.images[0]?.url} />
                <div className='details'>
                  <p className='artist'>{artist.name}</p>
                </div>
            </div>
          ))
        )}
      </div>
      {artists.length > displayedArtists && (
        <div className='loadmorefield'>
          <button className='loadMore' onClick={() => setDisplayedArtists(displayedArtists + 4)}>
            Add More Artists
          </button>
        </div>
      )}

      {/* Tracks Section */}
      <h3>Tracks</h3>
      <div className='cards'>
        {tracks.length === 0 ? (
          <p>No tracks found. Try another search!</p>
        ) : (
          tracks.slice(0, displayedTracks).map((track) => (
            <div key={track.id} className='card'>
                <img src={track.album.images[0]?.url} />
                <div className='details'>
                  <p className='artist'>{track.name}</p>
                  <p>{track.artists[0].name}</p>
                  <button
                    onClick={() => addTrackToFavorites(track.id, track.name)}
                    disabled={favoriteTrackIds.includes(track.id)}
                  >
                    {favoriteTrackIds.includes(track.id) ? <i className='bx bxs-heart'></i> : <i className='bx bx-heart' ></i>}
                  </button>
                </div>
            </div>
          ))
        )}
      </div>
      {tracks.length > displayedTracks && (
        <div className='loadmorefield'>
          <button className='loadMore' onClick={() => setDisplayedTracks(displayedTracks + 4)}>
            Add More Tracks
          </button>
        </div>
      )}

      {/* Albums Section */}
      <h3>Albums</h3>
      <div className='cards'>
        {albums.length === 0 ? (
          <p>No albums found. Try another search!</p>
        ) : (
          albums.slice(0, displayedAlbums).map((album) => (
            <div key={album.id} className='card albom'>
                <img src={album.images[0]?.url} />
                <div className='details'>
                  <p>{album.name}</p>
                  <button
                    variant="success"
                    onClick={() => addAlbumToFavorites(album.id, album.name)}
                    disabled={favoriteAlbumIds.includes(album.id)}
                  >
                    {favoriteAlbumIds.includes(album.id) ? <i className='bx bxs-heart'></i> : <i className='bx bx-heart' ></i>}
                  </button>
                </div>
            </div>
          ))
        )}
      </div>
      {albums.length > displayedAlbums && (
        <div className='loadmorefield'>
          <button className='loadMore' onClick={() => setDisplayedAlbums(displayedAlbums + 4)}>
            Add More Albums
          </button>
        </div>
      )}
    </div>
  );
};

export default Search;
