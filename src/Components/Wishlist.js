import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Card, Col, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { supabase } from '../client';
import { Link } from 'react-router-dom';

const Wishlist = ({ token }) => {
  const [musicItems, setMusicItems] = useState([]); // Holds available music items
  const [userLibrary, setUserLibrary] = useState([]); // Holds user's library
  const [userWishlist, setUserWishlist] = useState([]); // Holds user's library
  const [favoriteTrackIds, setFavoriteTrackIds] = useState([]); // Holds favorite tracks

  const categories = ['Rock', 'Pop', 'Jazz', 'Hip Hop', 'Classical', 'Electronic'];
  const categoryImages = {
    Pop: "https://media.istockphoto.com/id/1289702539/vector/vector-glowing-poster-pop-music-blue-neon-alphabet-letters-and-numbers-set.jpg?s=612x612&w=0&k=20&c=lCnHXPIiX3vH5IHdPnZnwoFUS4b1MSdsSdjGdA-2Jtw=",
    Rock: "https://media.istockphoto.com/id/1130481330/vector/rocknroll-or-heavy-metal-hand-sign-engraved-style-hand-and-multicolored-abstract-elements.jpg?s=612x612&w=0&k=20&c=rTNcY8I4M0-fyiw7LtHx8c-VogvHnxw4C7My6StNdxk=",
    Jazz: "https://media.istockphoto.com/id/1764638592/vector/colorful-figures-silhouettes-a-group-of-three-jazz-musicians-singer-saxophone-double-bass.jpg?s=612x612&w=0&k=20&c=Ybr2Wg6fbKTIQeRhzV1-uiCS5ZYuPjd6KUPjxL7TDC0=",
    "Hip-Hop": "https://media.istockphoto.com/id/1222812945/vector/colorful-print-in-style-of-graffiti-with-a-text-hip-hop-music-vector-illustration-drawn-by.jpg?s=612x612&w=0&k=20&c=fo2jQSXlz7qTsoTthlbEY3hHA-J1VDdVOUSbeJIay18=",
    Electronic: "https://media.istockphoto.com/id/1187583378/vector/modern-gradient-electronic-music-template-design-poster.jpg?s=612x612&w=0&k=20&c=GlXYvJirs7q4w2PFtpyQfh9l39g3f-Z8MaAmbMJWX5M=",
    Classical: "https://media.istockphoto.com/id/1156012700/photo/symphonic-string-orchestra-performing-on-stage.jpg?s=612x612&w=0&k=20&c=f6RrB-wdIM8xMvXKd4NWWCG8N33W1SJenSl-tW-xKPM=",
    Other: "https://media.istockphoto.com/id/1302638340/vector/line-music-festival-icons.jpg?s=612x612&w=0&k=20&c=PLtPyfjb6XaZ8N5yKA--kF__rAHzI8Wweqbo9HTbyc0=",
  };

  const [activeCategory, setActiveCategory] = useState('');

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
    async function fetchUserWishlist() {
      if (!token || !token.user) return;

      const { data, error } = await supabase
        .from('user_wishlist')
        .select('music_id')
        .eq('user_id', token.user.id);

      if (error) {
        console.error('Error fetching user library:', error.message);
        return;
      }

      const musicIds = data.map((lib) => lib.music_id);
      setUserWishlist(musicIds); // Store user's music library
    }

    fetchUserWishlist();
  }, [token]);
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

  async function removeMusicItemFromLibrary(musicId) {
    if (!token) {
      alert('You need to be logged in to remove items.');
      return;
    }

    const { error } = await supabase
      .from('user_wishlist')
      .delete()
      .eq('user_id', token.user.id)
      .eq('music_id', musicId);

    if (error) {
      console.error('Error removing music item from library:', error.message);
    } else {
      setUserWishlist((prev) => prev.filter((id) => id !== musicId));
    }
  }

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
    }
    if (error) {
      console.error('Error adding music item to wishlist:', error.message);
    } else {
      setUserLibrary((prev) => [...prev, musicId]);
    }
    
  }

  return (
    <>
      <h3>{token?.user?.user_metadata?.full_name}'s Wishlist:</h3>
      <div className='cards'>
        {userLibrary.length === 0 ? (
          <p>You don't have items in your Wishlist.</p>
        ) : (
          userWishlist.map((musicId) => {
            const musicItem = musicItems.find((item) => item.id === musicId);
            const categoryImage = categoryImages[musicItem?.category] || categoryImages['Other']; // Use category image
            return (
              <div key={musicId} className='card'>
                <img src={categoryImage} alt={`${musicItem?.category} category`} />
                <div className='details'>
                  <p>{musicItem?.name}</p>
                  <p>{musicItem?.description}</p>
                  <p>
                    <strong>Price:</strong> ${musicItem?.price}
                  </p>
                  <button
                    onClick={() => addMusicItemToLibrary(musicId)}
                    className='addtocart'
                  >
                    {userLibrary.includes(musicId) ? <i className='bx bxs-cart'></i> : <i className='bx bx-cart'></i>}
                  </button>
                  <button onClick={() => removeMusicItemFromLibrary(musicId)}>
                    <i className='bx bx-x'></i>
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

export default Wishlist;
