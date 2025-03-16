import React, { useState, useEffect } from "react";
import { supabase } from "../client";
import { Container, Card, Row, Button } from "react-bootstrap";

const CLIENT_ID = "1897d479bee342eea779fa4e8d15dbc6";
const CLIENT_SECRET = "24f4169858604c26b45b579fc2e926f4";

const FavoriteMusics = ({ token }) => {
  const [favorites, setFavorites] = useState([]);
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    async function fetchAccessToken() {
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

      setAccessToken(tokenData.access_token);
    }

    if (!accessToken) {
      fetchAccessToken();
    }
  }, [accessToken]);

  useEffect(() => {
    async function fetchFavorites() {
      if (!token || !token.user || !accessToken) return;

      const { data, error } = await supabase
        .from("favorites")
        .select("music_id") // Use music_id instead of album_id
        .eq("user_id", token.user.user_metadata.sub);

      if (error) {
        console.error("Error fetching favorites:", error.message);
        return;
      }

      // Fetch track details only once
      const musicDetails = await Promise.all(
        data.map(async (fav) => {
          const response = await fetch(`https://api.spotify.com/v1/tracks/${fav.music_id}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          if (!response.ok) {
            console.error("Error fetching track:", response.status, response.statusText);
            return null;
          }

          return response.json();
        })
      );

      setFavorites(musicDetails.filter((track) => track !== null)); // Remove null responses
    }

    fetchFavorites();
  }, [token, accessToken]);

  async function removeFromFavorites(musicId) {
    if (!token) return;

    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("user_id", token.user.user_metadata.sub)
      .eq("music_id", musicId); // Use music_id instead of album_id

    if (error) {
      console.error("Error removing favorite:", error.message);
      return;
    }

    setFavorites((prev) => prev.filter((track) => track.id !== musicId)); // Use musicId here
  }

  return (
    <Container>
      <h2>{token?.user?.user_metadata?.full_name}'s Favorite Music</h2>
      <Row className="mx-2 row row-cols-4">
        {favorites.map((track) => (
          <Card key={track.id} style={{ margin: "10px", padding: "10px" }}>
            <Card.Img variant="top" src={track.album?.images[0]?.url} alt={track.name} />
            <Card.Body>
              <Card.Title>{track.name}</Card.Title>
              <Card.Text>{track.artists?.map((artist) => artist.name).join(", ")}</Card.Text>
              <Button variant="danger" onClick={() => removeFromFavorites(track.id)}>
                Remove
              </Button>
            </Card.Body>
          </Card>
        ))}
      </Row>
    </Container>
  );
};

export default FavoriteMusics;
