import React, { useState, useEffect } from "react";
import { supabase } from "../client";
import { Container, Card, Row, Button } from "react-bootstrap";

const CLIENT_ID = "1897d479bee342eea779fa4e8d15dbc6";
const CLIENT_SECRET = "24f4169858604c26b45b579fc2e926f4";

const Favorites = ({ token }) => {
  const [favorites, setFavorites] = useState({ albums: [], tracks: [] });
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

      // Fetch favorite albums
      const { data: albumData, error: albumError } = await supabase
        .from("favorites")
        .select("album_id")
        .eq("user_id", token.user.user_metadata.sub);

      if (albumError) {
        console.error("Error fetching favorite albums:", albumError.message);
        return;
      }

      const albumDetails = await Promise.all(
        albumData.map(async (fav) => {
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

      // Fetch favorite tracks
      const { data: trackData, error: trackError } = await supabase
        .from("favorites")
        .select("music_id")
        .eq("user_id", token.user.user_metadata.sub);

      if (trackError) {
        console.error("Error fetching favorite tracks:", trackError.message);
        return;
      }

      const trackDetails = await Promise.all(
        trackData.map(async (fav) => {
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

      setFavorites({
        albums: albumDetails.filter((album) => album !== null),
        tracks: trackDetails.filter((track) => track !== null),
      });
    }

    fetchFavorites();
  }, [token, accessToken]);

  async function removeFromFavorites(id, type) {
    if (!token) return;

    const column = type === "album" ? "album_id" : "music_id";

    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("user_id", token.user.user_metadata.sub)
      .eq(column, id);

    if (error) {
      console.error(`Error removing favorite ${type}:`, error.message);
      return;
    }

    setFavorites((prev) => ({
      albums: prev.albums.filter((album) => album.id !== id),
      tracks: prev.tracks.filter((track) => track.id !== id),
    }));
  }

  return (
    <Container>
      <h2>{token?.user?.user_metadata?.full_name}'s Favorites</h2>

      <h3>Favorite Albums</h3>
      <Row className="mx-2 row row-cols-4">
        {favorites.albums.map((album) => (
          <Card key={album.id} style={{ margin: "10px", padding: "10px" }}>
            <Card.Img variant="top" src={album.images[0]?.url} alt={album.name} />
            <Card.Body>
              <Card.Title>{album.name}</Card.Title>
              <Card.Text>{album.artists[0]?.name}</Card.Text>
              <Button variant="danger" onClick={() => removeFromFavorites(album.id, "album")}>
                Remove
              </Button>
            </Card.Body>
          </Card>
        ))}
      </Row>

      <h3>Favorite Tracks</h3>
      <Row className="mx-2 row row-cols-4">
        {favorites.tracks.map((track) => (
          <Card key={track.id} style={{ margin: "10px", padding: "10px" }}>
            <Card.Img variant="top" src={track.album?.images[0]?.url} alt={track.name} />
            <Card.Body>
              <Card.Title>{track.name}</Card.Title>
              <Card.Text>{track.artists?.map((artist) => artist.name).join(", ")}</Card.Text>
              <Button variant="danger" onClick={() => removeFromFavorites(track.id, "track")}>
                Remove
              </Button>
            </Card.Body>
          </Card>
        ))}
      </Row>
    </Container>
  );
};

export default Favorites;
