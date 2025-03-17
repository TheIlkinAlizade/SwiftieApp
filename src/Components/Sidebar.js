import React, { useState, useEffect } from "react";
import { Container, Card, Row, Button } from "react-bootstrap";
import { supabase } from "../client";
import { Link } from "react-router-dom";

const Sidebar = ({ token }) => {
  const [favorites, setFavorites] = useState([]);
  
  useEffect(() => {
    if (!token || !token.user) return;

    async function fetchFavorites() {
      const { data, error } = await supabase
        .from("favorites")
        .select("album_id")
        .eq("user_id", token.user.user_metadata.sub);

      if (error) {
        console.error("Error fetching favorites:", error.message);
        return;
      }

      setFavorites(data);
    }

    fetchFavorites();
  }, [token]);

  return (
    <Container className="sidebar">
      <h2>{token?.user?.user_metadata?.full_name}!</h2>

      <h4>Your Favorite Albums</h4>
      <Row className="mx-2">
        {favorites.length > 0 ? (
          favorites.map((fav, index) => (
            <Card key={index} style={{ margin: "10px", padding: "10px", width: "100px" }}>
              <Card.Img variant="top" src={`https://via.placeholder.com/50?text=${fav.album_id}`} alt="Album" />
              <Card.Body>
                <Card.Title>Album {index + 1}</Card.Title>
              </Card.Body>
            </Card>
          ))
        ) : (
          <p>No favorites yet.</p>
        )}
      </Row>

      <Link to="/favorites">
        <Button variant="primary">View All Favorites</Button>
      </Link>
    </Container>
  );
};

export default Sidebar;
