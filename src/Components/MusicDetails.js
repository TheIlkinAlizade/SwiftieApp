import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Spinner, Badge, ListGroup, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMusic, faArrowLeft, faTag, faInfoCircle, faDollarSign, faCalendarAlt, faHeart } from '@fortawesome/free-solid-svg-icons';
import { supabase } from '../client';
import Navbar from './Navbar';

const MusicDetails = () => {
  const { id } = useParams();
  const [musicItem, setMusicItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedItems, setRelatedItems] = useState([]);
  const [favorite, setFavorite] = useState(false);
  const [token, setToken] = useState(false);
  
  useEffect(() => {
    if(sessionStorage.getItem('token')){
      let data = JSON.parse(sessionStorage.getItem('token'));
      setToken(data);
    }

  }, [])

  useEffect(() => {
    async function fetchMusicItem() {
      try {
        const { data, error } = await supabase
          .from('music_items')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          throw error;
        }

        setMusicItem(data);
        
        // Fetch related items with the same category
        if (data) {
          const { data: related, error: relatedError } = await supabase
            .from('music_items')
            .select('id, name, category, price')
            .eq('category', data.category)
            .neq('id', id)
            .limit(3);
            
          if (!relatedError) {
            setRelatedItems(related);
          }
        }
      } catch (err) {
        console.error('Error fetching music item:', err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchMusicItem();
  }, [id]);

  async function toggleFavorite(musicId){
    if (!token) {
      alert('You need to be logged in to add items to your wishlist.');
      return;
    }
  
    const { error } = await supabase
      .from('user_wishlist')
      .insert([{ user_id: token.user.id, music_id: musicId }]);
  
    if (error) {
      console.error('Error adding music item to wishlist:', error.message);
    } else {
      alert('New Element in wishlist!');
    }
  };
  async function toggleCart(musicId){
    if (!token) {
      alert('You need to be logged in to add items to your wishlist.');
      return;
    }
  
    const { error } = await supabase
      .from('user_library')
      .insert([{ user_id: token.user.id, music_id: musicId }]);
  
    if (error) {
      console.error('Error adding music item to cart:', error.message);
    } else {
      alert('New Element in Cart!');
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#1c1c1c' }}>
        <Spinner animation="border" variant="light" size="lg" />
        <p style={{ marginTop: '20px', color: '#fff', fontWeight: 'bold' }}>Loading music details...</p>
      </div>
    );
  }

  if (error || !musicItem) {
    return (
      <Container style={{ textAlign: 'center', marginTop: '5rem' }}>
        <Alert variant="danger">
          <Alert.Heading>Item Not Found</Alert.Heading>
          <p>Sorry, we couldn't find the music item you're looking for.</p>
        </Alert>
        <Link to="/library">
          <Button variant="success" style={{ marginTop: '20px', fontSize: '18px' }}>
            <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
            Back to Library
          </Button>
        </Link>
      </Container>
    );
  }

  return (
    <div className='containerItems'>
      <Navbar />
      
      <Container style={{ paddingTop: '50px' }}>
        <Row>
          <Col lg={8} style={{ marginBottom: '30px' }}>
            <Card style={{ borderRadius: '10px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>
              <div style={{ backgroundColor: '#333', color: '#fff', padding: '20px' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                  <FontAwesomeIcon icon={faMusic} className="me-3" />
                  {musicItem.name}
                </h1>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                  <Badge style={{ padding: '10px 15px', fontSize: '14px' }} bg="secondary">
                    {musicItem.category}
                  </Badge>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '20px', fontWeight: 'bold' }}>
                      <FontAwesomeIcon icon={faDollarSign} />
                      {musicItem.price}
                    </span>
                  </div>
                </div>
              </div>
              
              <Card.Body style={{ padding: '20px' }}>
                <div style={{ marginBottom: '30px' }}>
                  <h4 style={{ borderBottom: '2px solid #ddd', paddingBottom: '10px', fontSize: '1.25rem' }}>
                    <FontAwesomeIcon icon={faInfoCircle} className="me-2 text-success" />
                    About This Item
                  </h4>
                  <p style={{ fontSize: '1.1rem', marginBottom: '20px' }}>{musicItem.description}</p>
                  <div style={{ backgroundColor: '#333', color: '#fff', padding: '15px', borderRadius: '5px' }}>
                    <h5 style={{ marginBottom: '20px' }}>Detailed Information</h5>
                    <p>{musicItem.longdescription}</p>
                  </div>
                </div>
                
                <ListGroup variant="flush" style={{ borderTop: '1px solid #ddd', marginBottom: '20px' }}>
                  {musicItem.artist && (
                    <ListGroup.Item style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong>Artist</strong>
                      <span>{musicItem.artist}</span>
                    </ListGroup.Item>
                  )}
                  {musicItem.releaseDate && (
                    <ListGroup.Item style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong>
                        <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
                        Released
                      </strong>
                      <span>{new Date(musicItem.releaseDate).toLocaleDateString()}</span>
                    </ListGroup.Item>
                  )}
                  {musicItem.genre && (
                    <ListGroup.Item style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong>Genre</strong>
                      <span>{musicItem.genre}</span>
                    </ListGroup.Item>
                  )}
                </ListGroup>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
                  <Link to="/home">
                    <Button variant="outline-light" style={{ padding: '12px 20px', fontSize: '16px' }}>
                      <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                      Back
                    </Button>
                  </Link>
                  
                  <div>
                    <Button 
                      variant={favorite ? "danger" : "outline-danger"} 
                      style={{ padding: '12px 20px', fontSize: '16px', marginRight: '10px' }}
                      onClick={toggleFavorite(id)}
                    >
                      <FontAwesomeIcon icon={faHeart} className="me-2" />
                      {favorite ? "Added to Favorites" : "Add to Favorites"}
                    </Button>
                    <Button variant="success" style={{ padding: '12px 20px', fontSize: '16px' }} onClick={toggleCart(id)}>
                      <FontAwesomeIcon icon={faTag} className="me-2" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={4}>
            <Card style={{ borderRadius: '10px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', marginBottom: '30px' }}>
              <Card.Header style={{ backgroundColor: '#333', color: '#fff' }}>
                <h4 style={{ marginBottom: '0' }}>Related Items</h4>
              </Card.Header>
              <ListGroup variant="flush">
                {relatedItems.length > 0 ? (
                  relatedItems.map(item => (
                    <ListGroup.Item key={item.id} style={{ padding: '15px' }}>
                      <Link to={`/music/${item.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <h6 style={{ marginBottom: '5px' }}>{item.name}</h6>
                            <Badge bg="secondary" style={{ fontSize: '14px' }}>{item.category}</Badge>
                          </div>
                          <span style={{ color: '#28a745', fontWeight: 'bold' }}>${item.price}</span>
                        </div>
                      </Link>
                    </ListGroup.Item>
                  ))
                ) : (
                  <ListGroup.Item style={{ textAlign: 'center', padding: '20px' }}>
                    No related items found
                  </ListGroup.Item>
                )}
              </ListGroup>
              <Card.Footer style={{ backgroundColor: '#f7f7f7', textAlign: 'center' }}>
                <Link to={`/category/${musicItem.category}`} style={{ textDecoration: 'none', color: '#007bff' }}>
                  <small>View all in {musicItem.category}</small>
                </Link>
              </Card.Footer>
            </Card>
            
            <Card style={{ borderRadius: '10px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
              <Card.Header style={{ backgroundColor: '#28a745', color: '#fff' }}>
                <h4 style={{ marginBottom: '0' }}>Purchase Options</h4>
              </Card.Header>
              <Card.Body>
                <div style={{ marginBottom: '20px' }}>
                  <h5 style={{ marginBottom: '15px' }}>Digital Download</h5>
                  <p style={{ marginBottom: '15px' }}>
                    <FontAwesomeIcon icon={faDollarSign} className="me-1" />
                    <strong>{musicItem.price}</strong> - Instant download
                  </p>
                  <Button variant="success" style={{ width: '100%' }}>Buy Digital</Button>
                </div>
                
                {musicItem.physicalPrice && (
                  <div style={{ marginBottom: '20px', borderTop: '1px solid #ddd', paddingTop: '20px' }}>
                    <h5 style={{ marginBottom: '15px' }}>Physical Copy</h5>
                    <p style={{ marginBottom: '15px' }}>
                      <FontAwesomeIcon icon={faDollarSign} className="me-1" />
                      <strong>{musicItem.physicalPrice}</strong> - Ships within 3-5 days
                    </p>
                    <Button variant="outline-success" style={{ width: '100%' }}>Order Physical</Button>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default MusicDetails;
