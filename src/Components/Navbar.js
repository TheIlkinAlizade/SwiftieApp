import React, { useState, useEffect } from "react";
import { supabase } from "../client";
import { Link, useNavigate } from "react-router-dom";  // Use useNavigate

const CLIENT_ID = "1897d479bee342eea779fa4e8d15dbc6";
const CLIENT_SECRET = "24f4169858604c26b45b579fc2e926f4";

const Navbar = ({ token }) => {
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
  const navigate = useNavigate(); // Initialize useNavigate

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

  async function search(e) {
    e.preventDefault();
    
    if (!searchInput) return;

    console.log("Searching for " + searchInput);

    // Navigate to the search page with query as a URL parameter
    navigate(`/search?q=${searchInput}`);
  }

  return (
    <div className='navbar'>
        <div className='links'>
            <button>
                <Link to='/home'>
                    <i className='bx bx-home-alt' ></i>
                </Link>
            </button>
            <button>
                <Link to='/favorites'>
                    <i className='bx bx-library' ></i>
                </Link>
            </button>
        </div>
        <form>
            <div className='search-bar'>
                <input
                    placeholder='Search For Artist, Track, or Album'
                    onKeyPress={event => {
                        if (event.key === "Enter") {
                            search(event);  // Trigger search when Enter is pressed
                        }
                    }}
                    onChange={event => setSearchInput(event.target.value)}
                />
                <button onClick={search}><i className='bx bx-search-alt-2' ></i></button>
            </div>
        </form>
    </div>
  );
};

export default Navbar;
