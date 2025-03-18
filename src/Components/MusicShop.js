import React from 'react';
import { useSelector } from 'react-redux';
import { Card, Button } from 'react-bootstrap';

const MusicShop = () => {
  const musicItems = useSelector(state => state.music.musicItems);

  return (
    <div>
      <h1>Music Shop</h1>
      <div>
        {musicItems.map(item => (
          <Card key={item.id}>
            <Card.Body>
              <Card.Title>{item.name}</Card.Title>
              <Card.Text>{item.description}</Card.Text>
              <Card.Text>Price: ${item.price}</Card.Text>
              <Button>Add to Cart</Button>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MusicShop;
