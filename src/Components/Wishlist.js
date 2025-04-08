import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Card, Col, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { supabase } from '../client';
import { Link } from 'react-router-dom';

const Wishlist = ({ token }) => {
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
        .from('user_wishlist')
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
      setUserLibrary((prev) => prev.filter((id) => id !== musicId));
    }
  }
  return (
    <>
      <h3>{token?.user?.user_metadata?.full_name}'s Wishlist:</h3>
      <div className='cards'>
        {userLibrary.length === 0 ? (
          <p>You don't have items in your Wishlist.</p>
        ) : (
          userLibrary.map((musicId) => {
            const musicItem = musicItems.find((item) => item.id === musicId);
            return (
              <div key={musicId} className='card'>
                  <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAhFBMVEX///8AAABLS0uGhoZCQkLU1NT7+/vo6Ojg4OBISEjy8vJtbW2Pj4/29vbt7e3m5ubExMSsrKygoKBWVlZkZGS5ubkbGxspKSmBgYEvLy+YmJjZ2dnPz89QUFCysrK9vb1bW1t2dnYWFhYNDQ09PT0sLCwZGRmdnZ01NTVycnIhISFhYWH0Dmd7AAAEOElEQVR4nO3diXaiMBiGYQFZRERQVARE6TJ1uf/7G6etM3O0Sn7CHwnney8gzXPKEmhPGAwQQgghhBBCCCGEEEIIIYQQQgihpzXNt4H17Ekw5UVxZa6Nc8NnT6XtnLzMkqPxL/PZM2ot3y1m1vzFuK4PQtfeBmNzeWPrg9CNytRc3aFpLXQmXpkdamiaCv2pPUuTtZBNN6FvR1kyOtaTNBT6RWyZtxfJHggdf7rNqremtE4LHc+O00TW1lFhHs3GQ7GrpGZCZ1LE2ea1RVp3hOE0ylIOWzeEi9OQzdYNYcrL64DQghBCCCGEEEIIIYQQQgghhBBCCCG83+t6nmV9Fe4Ta2uH56Hz/gmPSVDmoXMZ2u6T8HUTlLZzNXRPhPu5tSj8H4fWXrhO0jKfPhhaZ+E8iHP/+qC8SUvhcmSVRS3tO82E+3laFo+Oydu0ES5PVpy7E/rQOgiHVlxMRA/KmzotXI2qsgglh+6ocLWrYuL5dq/uCc10VoQNzrd7dUv4HrmtD90tIce/uUKoKAglglBREEoEoaIglAhCRUEoEYSKglAiCBUFoUQQKgpCiSBUFIQSQagoCCWCUFEQSgShoiCUCEJFQSgRhIqCUCIIFQWhRBAqCkKJIFQUhBJBqCgIJYJQURBK1F+hM/H9MHTdbW+EjldEi1mQVuPTbmOO3var1fLl31aFmgu9eFy3767OQs8S2VRy1PaUiTUXRhsBnsZCfyfm01a4FfXpKozFgU//+kMj4YIA1PJ36FGAWgpHJKGG90PCVUZToeB98NKGbe5i0YUuDWjsuKZ+L2cy+Vz5n5t6eX4gCyl3ij+N+Sz/5edFHKTj5DQ3z0v/X7fTIAjHRGHKx7q0tYa1H6cgCKnf8Pjgk30WJULTIAiJQCPiw51b7AWnwSgs+HgDdy48DXHhhCpsfzuKv0WEaYgLHSLwhQ9IWh7zHaU7Lh/pN0haHhOFMy5gSPsuB2HxSPy+Ts4lJN6XCYtH4v5nXEDaI5xhnMSHJp3fRsAlrIhCwuKRdrtoZ8upHyICSYtHsVXSV2zL7oIqpFzxbMK4bL9C6hOOsaCMLn4Vy7iAgwNVSFoeh6KjvnH5BgPxBel3Hml4weP02OLmb9eZVCFxfKEF01p2W8JHUYUr6g/I67/TOf95792WogrpbxqcoGZItvXoV9TzsGzwM/yPB19JDBhPwc+o19KGT6mFZf6wwD+eSm7fYPBBA0pc1UMvDtJkM3w/rvZvo1MVlB7r+XeJ9nDIeGNmy6cJGV+lsEW61Kh5K91ypMOUtqDpSoTv3VbPnmuzxJ+fXp891aYJv05he1XEnuA/vGyfPU+JhN428P7dhLtZrW+t7yH6lVfzviFovGd+d5o+eMixlCwgFVRkm9ub477S+wS8zvHsRZZWh/G5QxosHn4eBiGEEEIIIYQQQgghhBBCCCGEEGqh37lRQuj+lqM/AAAAAElFTkSuQmCC" />
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

export default Wishlist;