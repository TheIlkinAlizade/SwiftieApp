import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import { supabase } from '../client';
import Navbar from './Navbar';

const MusicDetails = () => {
  const { id } = useParams(); // get music item id from the URL
  const [musicItem, setMusicItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMusicItem() {
      const { data, error } = await supabase
        .from('music_items')
        .select('*')
        .eq('id', id)
        .single(); // only one item

      if (error) {
        console.error('Error fetching music item:', error.message);
      } else {
        setMusicItem(data);
      }
      setLoading(false);
    }

    fetchMusicItem();
  }, [id]);

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
        <p>Loading music details...</p>
      </Container>
    );
  }

  if (!musicItem) {
    return (
      <Container className="text-center mt-5">
        <h3>Music item not found</h3>
        <Link to="/library">
          <Button variant="primary" className="mt-3">Back to Library</Button>
        </Link>
      </Container>
    );
  }

  return (
    <div className='containerItems'>
        <Navbar></Navbar>
        <Container className="mt-5">
        <Row>
            <Col md={8} className="mx-auto">
            <Card className="shadow-lg p-3">
                <Card.Body>
                <Card.Title className="display-5">{musicItem.name}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                    Category: {musicItem.category}
                </Card.Subtitle>
                <Card.Text className="mt-3">
                    <strong>Description:</strong> {musicItem.description}
                </Card.Text>
                <Card.Text>
                    <strong>Full Info:</strong> {musicItem.longdescription}
                </Card.Text>
                <Card.Text className="text-success fs-5">
                    <strong>Price:</strong> ${musicItem.price}
                </Card.Text>
                <Link to="/home">
                    <Button variant="secondary" className="mt-3">← Back</Button>
                </Link>
                </Card.Body>
            </Card>
            </Col>
        </Row>
        </Container>
    </div>
  );
};

export default MusicDetails;
