import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Card, Col, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { supabase } from '../client';
import { Link } from 'react-router-dom';
import Wishlist from './Wishlist';
import Navbar from './Navbar';

const Library = ({ token }) => {
  const [musicItems, setMusicItems] = useState([]); // Holds available music items
  const [userLibrary, setUserLibrary] = useState([]); // Holds user's library
  const [userWishlist, setUserWishlist] = useState([]); // Holds user's wishlist
  const [musicShopImages, setMusicShopImages] = useState([]);
  const [showFeaturePromo, setShowFeaturePromo] = useState(true);
  const [theme, setTheme] = useState('dark');
  const [displayMode, setDisplayMode] = useState('grid'); 
  
  useEffect(() => {
   
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
      document.body.classList.toggle("light-theme", savedTheme === "light");
    }

    const savedDisplayMode = localStorage.getItem('display-mode');
    if (savedDisplayMode) {
      setDisplayMode(savedDisplayMode);
    }
    
    // Set up theme change listener for when theme changes in other components
    const handleStorageChange = (e) => {
      if (e.key === 'display-mode') {
        setDisplayMode(e.newValue);
      }
      if (e.key === 'theme') {
        setTheme(e.newValue);
        document.body.classList.toggle("light-theme", e.newValue === "light");
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    // Initial load
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
    }
  
    // Listener for changes
    const handleStorageChange = (event) => {
      if (event.key === 'theme') {
        setTheme(event.newValue);
      }
    };
  
    window.addEventListener('storage', handleStorageChange);
  
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  
  
  // Update display mode in localStorage
  const toggleDisplayMode = () => {
    const newMode = displayMode === 'grid' ? 'list' : 'grid';
    localStorage.setItem('display-mode', newMode);
    setDisplayMode(newMode);
  };

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

  useEffect(() => {
    // Fetch user's wishlist
    async function fetchUserWishlist() {
      if (!token || !token.user) return;

      const { data, error } = await supabase
        .from('user_wishlist')
        .select('music_id')
        .eq('user_id', token.user.id);

      if (error) {
        console.error('Error fetching user wishlist:', error.message);
        return;
      }

      const musicIds = data.map((lib) => lib.music_id);
      setUserWishlist(musicIds); // Store user's music wishlist
    }

    fetchUserWishlist();
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
  
  async function removeMusicItemFromLibrary(musicId) {
    if (!token) {
      alert('You need to be logged in to remove items.');
      return;
    }
  
    const { error } = await supabase
      .from('user_library')
      .delete()
      .eq('user_id', token.user.id)
      .eq('music_id', musicId);
  
    if (error) {
      console.error('Error removing music item from library:', error.message);
    } else {
      setUserLibrary((prev) => prev.filter((id) => id !== musicId));
    }
  }
  
  async function addMusicItemToWishlist(musicId) {
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
      setUserWishlist((prev) => [...prev, musicId]);
    }
  }

  // Theme-based color system
  const themeColors = {
    dark: {
      primary: '#1DB954', // Spotify green
      secondary: '#535353',
      background: '#121212',
      surface: '#181818',
      surfaceHover: '#282828',
      divider: '#333333',
      textPrimary: '#FFFFFF',
      textSecondary: '#B3B3B3',
      gradientStart: '#450af5',
      gradientEnd: '#c4efd9'
    },
    light: {
      primary: '#1DB954', // Spotify green
      secondary: '#EFEFEF',
      background: '#FFFFFF',
      surface: '#F5F5F5',
      surfaceHover: '#EEEEEE',
      divider: '#E0E0E0',
      textPrimary: '#121212',
      textSecondary: '#696969',
      gradientStart: '#1ED760',
      gradientEnd: '#C4F0C5'
    }
  };
  
  const colors = themeColors[theme];

  // Dynamic styles based on theme
  const styles = {
    body: {
      backgroundColor: colors.background,
      color: colors.textPrimary,
      fontFamily: 'Circular, Helvetica, Arial, sans-serif',
      transition: 'background-color 0.3s ease, color 0.3s ease'
    },
    container: {
      backgroundColor: colors.background, 
      color: colors.textPrimary, 
      minHeight: '100vh',
      padding: '20px'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '24px',
      padding: '16px 0'
    },
    headerLeft: {
      display: 'flex',
      alignItems: 'center'
    },
    heading: {
      fontSize: '28px',
      fontWeight: '700',
      marginBottom: '0',
      color: colors.textPrimary
    },
    controls: {
      display: 'flex',
      gap: '12px'
    },
    filterButton: {
      backgroundColor: colors.surface,
      color: colors.textPrimary,
      border: `1px solid ${colors.divider}`,
      borderRadius: '500px',
      padding: '8px 16px',
      fontSize: '14px',
      fontWeight: '600'
    },
    cardsContainer: {
      display: displayMode === 'grid' 
        ? 'grid' 
        : 'flex',
      gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
      gap: '16px',
      marginBottom: '24px',
      flexDirection: displayMode === 'grid' ? undefined : 'column'
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: '8px',
      padding: '16px',
      transition: 'background-color 0.3s ease, transform 0.2s ease',
      cursor: 'pointer',
      border: 'none',
      marginBottom: displayMode === 'grid' ? '0' : '12px',
      display: displayMode === 'grid' ? 'block' : 'flex',
      position: 'relative'
    },
    cardHover: {
      backgroundColor: colors.surfaceHover,
      transform: 'translateY(-4px)'
    },
    imageContainer: {
      position: 'relative',
      paddingBottom: displayMode === 'grid' ? '100%' : '0', // Square aspect ratio for grid
      width: displayMode === 'grid' ? '100%' : '120px',
      height: displayMode === 'grid' ? 'auto' : '120px',
      overflow: 'hidden',
      borderRadius: '4px',
      marginBottom: displayMode === 'grid' ? '16px' : '0',
      marginRight: displayMode === 'grid' ? '0' : '16px',
      flexShrink: 0
    },
    image: {
      position: displayMode === 'grid' ? 'absolute' : 'static',
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    },
    contentContainer: {
      flex: '1'
    },
    playButton: {
      position: 'absolute',
      bottom: '10px',
      right: '10px',
      backgroundColor: colors.primary,
      borderRadius: '50%',
      width: '40px',
      height: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      opacity: '0',
      transition: 'opacity 0.3s ease, transform 0.2s ease',
      border: 'none',
      color: '#FFFFFF',
      transform: 'scale(0.9)'
    },
    itemTitle: {
      fontSize: '16px',
      fontWeight: '700',
      marginBottom: '4px',
      color: colors.textPrimary,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    },
    itemDescription: {
      fontSize: '14px',
      color: colors.textSecondary,
      marginBottom: '8px',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden'
    },
    price: {
      fontSize: '16px',
      fontWeight: '600',
      marginBottom: '12px',
      color: colors.primary
    },
    actionButton: {
      backgroundColor: 'transparent',
      color: colors.textPrimary,
      border: 'none',
      fontSize: '20px',
      padding: '8px',
      marginRight: '8px',
      borderRadius: '50%',
      transition: 'all 0.3s ease'
    },
    actionButtonActive: {
      color: colors.primary
    },
    premiumBanner: {
      background: `linear-gradient(135deg, ${colors.gradientStart}, ${colors.gradientEnd})`,
      color: theme === 'dark' ? '#FFFFFF' : '#121212',
      borderRadius: '8px',
      padding: '24px',
      marginBottom: '24px',
      position: 'relative',
      overflow: 'hidden'
    },
    advertisementBanner: {
      backgroundColor: colors.surface,
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '24px',
      border: `1px solid ${colors.divider}`
    },
    footerBanner: {
      backgroundColor: colors.primary,
      padding: '16px',
      marginTop: '24px',
      borderRadius: '8px',
      textAlign: 'center',
      color: '#FFFFFF'
    },
    sidePromo: {
      position: 'fixed',
      bottom: '30px',
      right: '30px',
      backgroundColor: colors.surface,
      borderRadius: '8px',
      padding: '16px',
      maxWidth: '300px',
      zIndex: 1000,
      boxShadow: theme === 'dark' 
        ? '0 4px 20px rgba(0, 0, 0, 0.5)' 
        : '0 4px 20px rgba(0, 0, 0, 0.1)',
      border: theme === 'light' ? `1px solid ${colors.divider}` : 'none'
    },
    closeButton: {
      position: 'absolute',
      top: '10px',
      right: '10px',
      background: 'transparent',
      border: 'none',
      color: theme === 'dark' ? '#FFFFFF' : '#121212',
      fontSize: '16px'
    },
    topBanner: {
      backgroundColor: colors.primary,
      padding: '10px 0',
      textAlign: 'center',
      color: '#FFFFFF',
      position: 'sticky',
      top: 0,
      zIndex: 100
    },
    buttonPrimary: {
      backgroundColor: colors.primary,
      borderRadius: '500px',
      color: '#FFFFFF',
      fontWeight: '700',
      border: 'none',
      padding: '12px 32px',
      textTransform: 'uppercase',
      letterSpacing: '1.5px',
      fontSize: '14px',
      transition: 'transform 0.3s ease, background-color 0.3s ease'
    },
    buttonSecondary: {
      backgroundColor: 'transparent',
      borderRadius: '500px',
      color: colors.textPrimary,
      fontWeight: '700',
      border: `1px solid ${colors.divider}`,
      padding: '12px 32px',
      textTransform: 'uppercase',
      letterSpacing: '1.5px',
      fontSize: '14px',
      transition: 'background-color 0.3s ease'
    },
    recommendationsHeading: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '16px',
      marginTop: '32px'
    },
    sectionHeader: {
      fontSize: '24px',
      fontWeight: '700',
      color: colors.textPrimary
    },
    viewAll: {
      fontSize: '14px',
      color: colors.textSecondary,
      textDecoration: 'none',
      fontWeight: '600'
    },
    filterChip: {
      backgroundColor: colors.surface,
      borderRadius: '500px',
      padding: '6px 12px',
      fontSize: '14px',
      fontWeight: '600',
      margin: '0 8px 8px 0',
      display: 'inline-block',
      cursor: 'pointer',
      border: `1px solid ${colors.divider}`,
      color: colors.textSecondary,
      transition: 'background-color 0.3s ease, color 0.3s ease'
    },
    filterChipActive: {
      backgroundColor: colors.primary,
      color: '#FFFFFF',
      borderColor: colors.primary
    },
    themeToggle: {
      backgroundColor: theme === 'dark' ? '#333333' : '#EFEFEF',
      border: 'none',
      borderRadius: '500px',
      padding: '8px 16px',
      color: colors.textPrimary,
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    displayToggle: {
      backgroundColor: theme === 'dark' ? '#333333' : '#EFEFEF',
      border: 'none',
      borderRadius: '500px',
      padding: '8px 16px',
      color: colors.textPrimary,
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    newsletterForm: {
      background: theme === 'dark' 
        ? 'linear-gradient(135deg, #121212, #1E1E1E)'
        : 'linear-gradient(135deg, #F8F8F8, #EFEFEF)', 
      borderRadius: '8px',
      padding: '24px',
      marginBottom: '24px',
      marginTop: '32px',
      border: theme === 'light' ? `1px solid ${colors.divider}` : 'none'
    },
    formInput: {
      backgroundColor: theme === 'dark' ? '#333333' : '#FFFFFF',
      border: theme === 'light' ? `1px solid ${colors.divider}` : 'none',
      padding: '12px 16px',
      borderRadius: '4px',
      color: colors.textPrimary,
      width: '100%'
    }
  };

  // Categories for filters
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

  return (
    <div className='containerItems'>
      <Navbar></Navbar>
      <div style={styles.body}>
        {/* Top Premium Banner */}
        <div style={styles.topBanner}>
          <Container>
            <div className="d-flex justify-content-between align-items-center">
              <span>Get 3 months of Premium for free</span>
              <Button style={styles.buttonSecondary} size="sm">Get Premium</Button>
            </div>
          </Container>
        </div>

        <Container style={styles.container}>
          {/* Header with controls */}
          <div style={styles.header}>
            <div style={styles.headerLeft}>
              <h3 style={styles.heading}>Music Shop</h3>
            </div>
            <div style={styles.controls}>
              
              <button style={styles.displayToggle} onClick={toggleDisplayMode}>
                {displayMode === 'grid' ? (
                  <><i className='bx bx-list-ul'></i> List View</>
                ) : (
                  <><i className='bx bx-grid-alt'></i> Grid View</>
                )}
              </button>
            </div>
          </div>

          {/* Featured Ad - Premium */}
          <div style={styles.premiumBanner}>
            <Row className="align-items-center">
              <Col md={8}>
                <h4 style={{fontWeight: 'bold', marginBottom: '12px', color: theme === 'dark' ? '#FFFFFF' : '#121212'}}>Premium Individual</h4>
                <p style={{marginBottom: '16px', color: theme === 'dark' ? '#FFFFFF' : '#121212'}}>Listen without limits on your phone, speaker, and other devices.</p>
                <Button style={{...styles.buttonPrimary, backgroundColor: '#000000'}}>TRY FREE FOR 1 MONTH</Button>
              </Col>
              <Col md={4} className="text-right">
              
              </Col>
            </Row>
          </div>

          {/* Category filter chips */}
          <div style={{marginBottom: '24px', marginTop: '16px'}}>
          <span 
            key="all"
            style={!activeCategory 
              ? {...styles.filterChip, ...styles.filterChipActive}
              : styles.filterChip
            }
            onClick={() => setActiveCategory("")}
          >
            All
          </span>
            {categories.map(category => (
              <span 
                key={category}
                style={category === activeCategory 
                  ? {...styles.filterChip, ...styles.filterChipActive}
                  : styles.filterChip
                }
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </span>
            ))}
          </div>

          {/* Advertisement Banner */}
          {showFeaturePromo && (
            <div style={styles.advertisementBanner}>
              <Row className="align-items-center">
                <Col md={9}>
                  <h5 style={{fontWeight: 'bold', color: colors.textPrimary}}>Featured Artists of the Month</h5>
                  <p style={{color: colors.textSecondary}}>Discover new releases from top artists</p>
                </Col>
                <Col md={3} className="text-end">
                  <Button 
                    style={styles.buttonSecondary} 
                    size="sm"
                  >Explore</Button>
                  <Button 
                    style={{...styles.closeButton, position: 'relative'}} 
                    onClick={() => setShowFeaturePromo(false)}
                  >✕</Button>
                </Col>
              </Row>
            </div>
          )}

          {/* Music items display with dynamic styling */}
          <div style={styles.cardsContainer}>
            {musicItems.length === 0 ? (
              <p>No music items found.</p>
            ) : (
              <>
                {musicItems.filter(item => !activeCategory || item.category === activeCategory).map((item, index) => (
                  <div 
                    key={item.id} 
                    style={styles.card} 
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = colors.surfaceHover;
                      e.currentTarget.querySelector('[data-play-button]').style.opacity = '1';
                      e.currentTarget.querySelector('[data-play-button]').style.transform = 'scale(1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = colors.surface;
                      e.currentTarget.querySelector('[data-play-button]').style.opacity = '0';
                      e.currentTarget.querySelector('[data-play-button]').style.transform = 'scale(0.9)';
                    }}
                  >
                    <div style={styles.imageContainer}>
                    <img 
                      src={categoryImages[item.category] || categoryImages["Other"]} 
                      style={styles.image}
                      alt={item.name}
                    />
                    <Link to={`/music/${item.id}`}>
                      <button style={styles.playButton} data-play-button>?</button>
                    </Link>
                    </div>
                    <div style={styles.contentContainer}>
                      <p style={styles.itemTitle}>{item.name}</p>
                      <p style={styles.itemDescription}>{item.description}</p>
                      <p style={styles.price}>${item.price}</p>
                      <div className="d-flex">
                        <button
                          style={userLibrary.includes(item.id) 
                            ? {...styles.actionButton, ...styles.actionButtonActive}
                            : styles.actionButton
                          }
                          onClick={() => addMusicItemToLibrary(item.id)}
                          disabled={userLibrary.includes(item.id)}
                        >
                          {userLibrary.includes(item.id) ? <i className='bx bxs-cart'></i> : <i className='bx bx-cart'></i>}
                        </button>
                        <button
                          style={userWishlist.includes(item.id) 
                            ? {...styles.actionButton, ...styles.actionButtonActive}
                            : styles.actionButton
                          }
                          onClick={() => addMusicItemToWishlist(item.id)}
                          disabled={userWishlist.includes(item.id)}
                        >
                          {userWishlist.includes(item.id) ? <i className='bx bx-list-check'></i> : <i className='bx bx-list-plus'></i>}
                        </button>
                      </div>  
                    </div>
                    
                    {/* Add sponsored tag to some items */}
                    {index === 1 && (
                      <div style={{
                        position: 'absolute', 
                        top: '10px', 
                        right: '10px', 
                        background: 'rgba(0,0,0,0.5)', 
                        padding: '2px 8px', 
                        borderRadius: '4px', 
                        fontSize: '10px',
                        color: '#FFFFFF'
                      }}>
                        SPONSORED
                      </div>
                    )}
                  </div>
                ))}
              </>
            )}
          </div>

          {/* "Made For You" Recommendation Banner */}
          <div style={styles.recommendationsHeading}>
            <h4 style={styles.sectionHeader}>Made For You</h4>
            <a href="#" style={styles.viewAll}>View All</a>
          </div>
          
          <div style={{
            ...styles.cardsContainer, 
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))'
          }}>
            {[1, 2, 3, 4].map((item) => (
              <div 
                key={`rec-${item}`} 
                style={styles.card}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.surfaceHover;
                  e.currentTarget.querySelector('[data-play-button]').style.opacity = '1';
                  e.currentTarget.querySelector('[data-play-button]').style.transform = 'scale(1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = colors.surface;
                  e.currentTarget.querySelector('[data-play-button]').style.opacity = '0';
                  e.currentTarget.querySelector('[data-play-button]').style.transform = 'scale(0.9)';
                }}
              >
                <div style={styles.imageContainer}>
                  <img 
                    src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwcHBwgHBw0HBw..." 
                    style={styles.image}
                    alt={`Recommendation ${item}`}
                  />
                  <button style={styles.playButton} data-play-button>▶</button>
                </div>
                <div style={displayMode === 'list' ? styles.contentContainer : undefined}>
                  <p style={styles.itemTitle}>Daily Mix {item}</p>
                  <p style={styles.itemDescription}>Based on your listening</p>
                </div>
              </div>
            ))}
          </div>

          {/* Newsletter signup form */}
          <div style={styles.newsletterForm}>
            <h4 style={{color: colors.textPrimary, fontWeight: 'bold', marginBottom: '16px'}}>Stay updated with new releases</h4>
            <Row className="align-items-center">
              <Col md={8}>
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  style={styles.formInput}
                />
              </Col>
              <Col md={4}>
                <Button style={styles.buttonPrimary} className="w-100">SUBSCRIBE</Button>
              </Col>
            </Row>
          </div>

          {/* Floating Side Advertisement */}
          <div style={styles.sidePromo}>
            <Button 
              style={styles.closeButton}
              onClick={() => document.querySelector('[style*="sidePromo"]').style.display = 'none'}
            >✕</Button>
            <h6 style={{color: colors.textPrimary, fontWeight: 'bold', marginBottom: '12px'}}>Try Premium</h6>
            <p style={{color: colors.textSecondary, fontSize: '14px', marginBottom: '16px'}}>No ads, offline listening, and unlimited skips.</p>
            <Button style={{...styles.buttonPrimary, width: '100%', padding: '8px'}}>GET 3 MONTHS FREE</Button>
          </div>

          {/* Footer Promotion Banner */}
          <div style={styles.footerBanner}>
            <h5 style={{color: '#FFFFFF', fontWeight: 'bold', marginBottom: '8px'}}>Download the app</h5>
            <p style={{color: '#FFFFFF', marginBottom: '16px'}}>Listen on the go. Available for all devices.</p>
            <div className="d-flex justify-content-center">
              <Button style={{...styles.buttonSecondary, marginRight: '16px', backgroundColor: '#FFFFFF', color: '#000000'}}>App Store</Button>
              <Button style={{...styles.buttonSecondary, backgroundColor: '#FFFFFF', color: '#000000'}}>Google Play</Button>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default Library;