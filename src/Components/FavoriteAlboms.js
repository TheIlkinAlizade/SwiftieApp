import React, { useState, useEffect } from "react";
import { supabase } from "../client";
import { Container, Card, Row, Button } from "react-bootstrap";

const CLIENT_ID = "1897d479bee342eea779fa4e8d15dbc6";
const CLIENT_SECRET = "24f4169858604c26b45b579fc2e926f4";

const FavoriteAlboms = ({ token }) => {
  const [favorites, setFavorites] = useState([]);
  const [accessToken, setAccessToken] = useState("");

  useEffect(() => {
    async function fetchFavorites() {
      if (!token || !token.user) return;

      const { data, error } = await supabase
        .from("favorites")
        .select("album_id")
        .eq("user_id", token.user.user_metadata.sub);

      if (error) {
        console.error("Error fetching favorites:", error.message);
        return;
      }

      // Fetch Spotify access token
      const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`,
      });

      const tokenData = await tokenResponse.json();
      if (!tokenResponse.ok) {
        console.error("Error fetching token:", tokenData);
        return;
      }

      const access_token_data = tokenData.access_token;
      setAccessToken(access_token_data);

      // Fetch album details **after** setting the token
      const albumDetails = await Promise.all(
        data.map(async (fav) => {
          const response = await fetch(`https://api.spotify.com/v1/albums/${fav.album_id}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          if (!response.ok) {
            console.error("Error fetching album:", response.status, response.statusText);
            return null;
          }

          return response.json();
        })
      );

      setFavorites(albumDetails.filter((album) => album !== null)); // Remove null responses
    }

    fetchFavorites();
  }, [token, accessToken]);

  async function removeFromFavorites(albumId) {
    if (!token) return;

    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("user_id", token.user.user_metadata.sub)
      .eq("album_id", albumId);

    if (error) {
      console.error("Error removing favorite:", error.message);
      return;
    }

    setFavorites((prev) => prev.filter((album) => album.id !== albumId));
  }

  return (
    <Container>
      <h2>{token?.user?.user_metadata?.full_name}'s Favorite Albums</h2>
      <Row className="mx-2 row row-cols-4">
        {favorites.map((album) => (
          <Card key={album.id} style={{ margin: "10px", padding: "10px" }}>
            <Card.Img variant="top" src={album.images[0]?.url} alt={album.name} />
            <Card.Body>
              <Card.Title>{album.name}</Card.Title>
              <Card.Text>{album.artists[0]?.name}</Card.Text>
              <Button variant="danger" onClick={() => removeFromFavorites(album.id)}>
                Remove
              </Button>
            </Card.Body>
          </Card>
        ))}
      </Row>
    </Container>
  );
};

export default FavoriteAlboms;
