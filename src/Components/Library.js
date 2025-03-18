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
  return (
    <Container>
      <h3>Available Music Items</h3>
      <Row>
        {musicItems.length === 0 ? (
          <p>No music items found.</p>
        ) : (
          musicItems.map((item) => (
            <Col key={item.id} sm={12} md={6} lg={4}>
              <Card className="mb-4 card">
                <Card.Img variant="top" src={item.image_url} />
                <Card.Body>
                  <Card.Title>{item.name}</Card.Title>
                  <Card.Text>{item.description}</Card.Text>
                  <Card.Text>
                    <strong>Price:</strong> ${item.price}
                  </Card.Text>
                  <Button
                    variant="primary"
                    onClick={() => addMusicItemToLibrary(item.id)}
                    disabled={userLibrary.includes(item.id)}
                  >
                    {userLibrary.includes(item.id) ? 'Already in Library' : 'Add to Library'}
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>

      <h3>Your Music Library</h3>
      <Row>
        {userLibrary.length === 0 ? (
          <p>Your library is empty. Add some music items!</p>
        ) : (
          userLibrary.map((musicId) => {
            const musicItem = musicItems.find((item) => item.id === musicId);
            return (
              <Col key={musicId} sm={12} md={6} lg={4}>
                <Card className="mb-4">
                  <Card.Img variant="top" src={musicItem?.image_url} />
                  <Card.Body>
                    <Card.Title>{musicItem?.name}</Card.Title>
                    <Card.Text>{musicItem?.description}</Card.Text>
                    <Card.Text>
                      <strong>Price:</strong> ${musicItem?.price}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            );
          })
        )}
      </Row>
    </Container>
  );
};

export default Library;
