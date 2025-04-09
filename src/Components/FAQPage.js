import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Accordion, Container, FormControl, InputGroup, Card, Button, Form, Row, Col, Badge, Alert } from 'react-bootstrap';
import Navbar from './Navbar';

const SpotifyFAQ = () => {

  const [theme, setTheme] = useState('light');
  
  useEffect(() => {
  
    const savedTheme = localStorage.getItem('spotifyTheme') || 'light';
    setTheme(savedTheme);
    
 
    document.body.className = savedTheme === 'dark' ? 'bg-dark' : 'bg-light';
    
   
    const handleStorageChange = () => {
      const updatedTheme = localStorage.getItem('spotifyTheme') || 'light';
      setTheme(updatedTheme);
      document.body.className = updatedTheme === 'dark' ? 'bg-dark' : 'bg-light';
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);


  const [searchTerm, setSearchTerm] = useState('');
  const [filteredFaq, setFilteredFaq] = useState([]);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    issue: '',
    description: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState(false);
  const [errorFields, setErrorFields] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);


  const faqCategories = [
    {
      category: "Account & Subscription",
      icon: "bi-person-circle",
      items: [
        {
          question: "How do I change my subscription plan?",
          answer: "Go to your Account page on the Spotify website. Under 'Your Plan', you'll find options to update or change your current subscription."
        },
        {
          question: "How do I recover my password?",
          answer: "On the login screen, click 'Forgot your password?' and follow the instructions to reset it. You'll receive an email with a link to create a new password."
        },
        {
          question: "Can I merge two Spotify accounts?",
          answer: "Unfortunately, Spotify doesn't support merging accounts. You'll need to manually transfer your playlists from one account to another."
        }
      ]
    },
    {
      category: "Music & Playlists",
      icon: "bi-music-note-beamed",
      items: [
        {
          question: "How do I create a playlist?",
          answer: "To create a playlist, click the '+' button in the left sidebar. You can then add songs by searching for them and clicking the '⋯' menu to select 'Add to playlist'."
        },
        {
          question: "Can I download music for offline listening?",
          answer: "Yes, Premium subscribers can download music for offline listening. Just tap the download icon on an album or playlist to save it to your device."
        },
        {
          question: "How can I discover new music on Spotify?",
          answer: "Spotify offers several discovery features including Discover Weekly, Release Radar, Daily Mixes, and Radio stations based on songs or artists you like."
        }
      ]
    },
    {
      category: "Technical & Devices",
      icon: "bi-gear",
      items: [
        {
          question: "How do I connect Spotify to my devices?",
          answer: "Spotify Connect allows you to play music on different devices. Click the device icon at the bottom of the player to see available devices and select one to stream to."
        },
        {
          question: "What sound quality does Spotify offer?",
          answer: "Spotify Free offers up to 160 kbps streaming. Premium subscribers get up to 320 kbps. Spotify HiFi offers lossless audio quality for Premium subscribers."
        },
        {
          question: "Why is my music stopping or skipping?",
          answer: "This could be due to internet connection issues, low device storage, or conflicts with other apps. Try closing other apps, checking your connection, or reinstalling Spotify."
        }
      ]
    }
  ];

  // Flatten FAQ items for search
  const allFaqItems = faqCategories.flatMap(category =>
    category.items.map(item => ({...item, category: category.category, icon: category.icon}))
  );

  // Update filtered FAQ when search term changes
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredFaq([]);
    } else {
      const filtered = allFaqItems.filter(item =>
        item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredFaq(filtered);
    }
  }, [searchTerm]);

  // Form validation
  const validateForm = () => {
    const errors = [];
    
    if (!contactForm.name.trim()) errors.push('name');
    if (!contactForm.email.trim()) errors.push('email');
    if (contactForm.email && !/^\S+@\S+\.\S+$/.test(contactForm.email)) errors.push('email-format');
    if (!contactForm.description.trim()) errors.push('description');
    
    setErrorFields(errors);
    return errors.length === 0;
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field if it exists
    if (errorFields.includes(name)) {
      setErrorFields(errorFields.filter(field => field !== name));
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Form validation
    if (!validateForm()) {
      setFormError(true);
      return;
    }
    
    // Simulated form submission
    console.log("Form submitted:", contactForm);
    setFormSubmitted(true);
    setFormError(false);
    
    // Reset form after submission
    setTimeout(() => {
      setContactForm({
        name: '',
        email: '',
        issue: '',
        description: ''
      });
      setFormSubmitted(false);
      setErrorFields([]);
    }, 5000);
  };

  // Styling constants
  const spotifyGreen = "#1DB954";
  const spotifyBlack = "#191414";
  
  // Theme-dependent styles
  const isDark = theme === 'dark';
  const bgColor = isDark ? spotifyBlack : 'white';
  const textColor = isDark ? 'white' : spotifyBlack;
  const cardBg = isDark ? '#212121' : 'white';
  const inputBg = isDark ? '#333' : 'white';
  const inputTextColor = isDark ? '#f0f0f0' : '#333';
  const borderColor = isDark ? '#444' : '#e0e0e0';
  const secondaryBg = isDark ? '#2a2a2a' : '#f8f9fa';

  return (
   
    <div className={isDark ? 'bg-dark text-white' : 'bg-light text-dark'} style={{ fontFamily: 'Gotham, "Helvetica Neue", Helvetica, Arial, sans-serif' }}>
     <div className='containerItems'>
     <Navbar></Navbar>
      
      {/* Hero Section with Wave */}
      <div className="position-relative mb-5" style={{ 
        background: isDark 
          ? `linear-gradient(145deg, #000000 0%, #2D2D2D 100%)` 
          : `linear-gradient(145deg, ${spotifyBlack} 0%, #2D46B9 100%)`, 
        color: 'white', 
        overflow: 'hidden' 
      }}>
        <Container className="py-5 position-relative" style={{ zIndex: 2 }}>
          <div className="text-center py-4">
            <h1 className="display-4 fw-bold mb-3">How can we help you?</h1>
            <p className="lead mb-4">Find answers to your questions or contact our support team</p>
            
            {/* Search Bar */}
            <div className="mx-auto" style={{ maxWidth: '700px' }}>
              <InputGroup className="mb-3 shadow">
                <InputGroup.Text style={{ background: inputBg, color: inputTextColor, borderColor }}>
                  <i className="bi bi-search"></i>
                </InputGroup.Text>
                <FormControl
                  placeholder="Search for answers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="py-3 border-0"
                  style={{ 
                    fontSize: '1.1rem',
                    background: inputBg,
                    color: inputTextColor
                  }}
                />
                {searchTerm && (
                  <Button
                    variant={isDark ? "dark" : "light"}
                    className="border-0"
                    onClick={() => setSearchTerm('')}
                    style={{ borderColor }}
                  >
                    <i className="bi bi-x-lg"></i>
                  </Button>
                )}
              </InputGroup>
            </div>
          </div>
        </Container>
        
        {/* Wave Shape */}
        <div className="position-absolute bottom-0 left-0 w-100" style={{ height: '70px', overflow: 'hidden' }}>
          <svg viewBox="0 0 500 150" preserveAspectRatio="none" style={{ height: '100%', width: '100%' }}>
            <path d="M0.00,49.98 C150.00,150.00 349.20,-50.00 500.00,49.98 L500.00,150.00 L0.00,150.00 Z" style={{ stroke: 'none', fill: isDark ? '#212121' : '#f8f9fa' }}></path>
          </svg>
        </div>
      </div>

      <Container className="py-3">
        {/* Search Results */}
        {searchTerm && (
          <Card className="mb-5 shadow-sm border-0 rounded-lg overflow-hidden" style={{ background: cardBg, color: textColor, borderColor }}>
            <Card.Header style={{ background: isDark ? '#2a2a2a' : 'white', borderColor, color: textColor }} className="py-3">
              <h5 className="mb-0">
                <i className="bi bi-search me-2" style={{ color: spotifyGreen }}></i>
                Search Results
              </h5>
            </Card.Header>
            <Card.Body className="p-0">
              {filteredFaq.length > 0 ? (
                <Accordion flush>
                  {filteredFaq.map((item, idx) => (
                    <Accordion.Item 
                      key={idx} 
                      eventKey={`search-${idx}`}
                      style={{ background: cardBg, borderColor }}
                    >
                      <Accordion.Header className="py-3" style={{ color: textColor }}>
                        <div className="d-flex align-items-center w-100">
                          <i className={`bi ${item.icon} me-3`} style={{ color: spotifyGreen }}></i>
                          <span>{item.question}</span>
                          <Badge bg={isDark ? "dark" : "light"} text={isDark ? "light" : "dark"} className="ms-auto" style={{ fontSize: "0.7em" }}>
                            {item.category}
                          </Badge>
                        </div>
                      </Accordion.Header>
                      <Accordion.Body 
                        className="py-4 px-4"
                        style={{ background: isDark ? '#2a2a2a' : '#f8f9fa', color: textColor }}
                      >
                        {item.answer}
                      </Accordion.Body>
                    </Accordion.Item>
                  ))}
                </Accordion>
              ) : (
                <div className="text-center py-5" style={{ color: textColor }}>
                  <i className="bi bi-question-circle" style={{ fontSize: '2.5rem', color: isDark ? '#555' : '#ddd' }}></i>
                  <p className="mt-3 mb-0">No results found. Try a different search term.</p>
                </div>
              )}
            </Card.Body>
          </Card>
        )}

        {/* Category Navigation */}
        <div className="text-center mb-4">
          <h2 className="mb-4" style={{ color: textColor }}>Browse by category</h2>
          <Row className="g-3 justify-content-center">
            {faqCategories.map((category, idx) => (
              <Col key={idx} xs={12} md={4}>
                <Card 
                  className="h-100 border-0 shadow-sm hover-lift" 
                  style={{ 
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease',
                    background: cardBg,
                    color: textColor,
                    borderColor
                  }}
                  onClick={() => setActiveCategory(activeCategory === idx ? null : idx)}
                >
                  <Card.Body className="d-flex flex-column align-items-center py-4">
                    <div 
                      className="rounded-circle mb-3 d-flex align-items-center justify-content-center"
                      style={{ 
                        width: '80px', 
                        height: '80px', 
                        background: `linear-gradient(45deg, ${spotifyGreen} 0%, #17a649 100%)`,
                        color: 'white'
                      }}
                    >
                      <i className={`bi ${category.icon}`} style={{ fontSize: '2rem' }}></i>
                    </div>
                    <h4>{category.category}</h4>
                    <p className={`${isDark ? 'text-light-50' : 'text-muted'} mt-2 mb-0`} style={{ opacity: 0.7 }}>
                      {category.items.length} questions
                    </p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* FAQ Categories */}
        {faqCategories.map((category, catIdx) => (
          <div 
            key={catIdx} 
            className={`mb-5 ${activeCategory === catIdx || activeCategory === null ? '' : 'd-none'}`}
          >
            {activeCategory === catIdx && (
              <div className="d-flex align-items-center mb-3">
                <Button 
                  variant="link" 
                  className="p-0 text-decoration-none" 
                  onClick={() => setActiveCategory(null)}
                  style={{ color: spotifyGreen }}
                >
                  <i className="bi bi-arrow-left me-2"></i> Back to all categories
                </Button>
              </div>
            )}
            
            <Card className="border-0 shadow-sm overflow-hidden" style={{ background: cardBg, borderColor }}>
              <Card.Header className="d-flex align-items-center py-3" style={{ background: spotifyBlack, color: 'white' }}>
                <i className={`bi ${category.icon} me-3`} style={{ color: spotifyGreen }}></i>
                <h4 className="mb-0">{category.category}</h4>
              </Card.Header>
              <Card.Body className="p-0">
                <Accordion flush>
                  {category.items.map((item, itemIdx) => (
                    <Accordion.Item 
                      key={itemIdx} 
                      eventKey={`${catIdx}-${itemIdx}`}
                      style={{ background: cardBg, borderColor }}
                    >
                      <Accordion.Header className="py-3 px-3" style={{ color: textColor }}>
                        <div className="d-flex w-100 align-items-center">
                          <span className="fw-semibold">{item.question}</span>
                          <span className="ms-auto">
                            <i className="bi bi-plus-lg"></i>
                          </span>
                        </div>
                      </Accordion.Header>
                      <Accordion.Body 
                        className="py-4 px-4" 
                        style={{ background: secondaryBg, color: textColor }}
                      >
                        {item.answer}
                      </Accordion.Body>
                    </Accordion.Item>
                  ))}
                </Accordion>
              </Card.Body>
            </Card>
          </div>
        ))}

        {/* Contact Form */}
        <div className="my-5 py-3">
          <Card className="border-0 shadow overflow-hidden" style={{ background: cardBg, borderColor }}>
            <div className="position-relative">
              <Card.Header className="py-4 border-0" style={{ 
                background: `linear-gradient(45deg, ${spotifyGreen} 0%, #17a649 100%)`, 
                color: 'white',
                borderRadius: 0
              }}>
                <h3 className="mb-0">
                  <i className="bi bi-chat-dots me-3"></i>
                  Still need help?
                </h3>
              </Card.Header>
              <div className="position-absolute end-0 bottom-0 d-none d-md-block" style={{ opacity: 0.2 }}>
                <i className="bi bi-headphones" style={{ fontSize: '6rem', color: 'white' }}></i>
              </div>
            </div>
            
            <Card.Body className="p-4" style={{ color: textColor }}>
              {formSubmitted ? (
                <Alert variant="success" className="d-flex align-items-center mb-0" style={{ background: isDark ? '#0d392c' : null, color: isDark ? '#a3e9c9' : null, borderColor: isDark ? '#176148' : null }}>
                  <i className="bi bi-check-circle-fill me-3" style={{ fontSize: '2rem' }}></i>
                  <div>
                    <h4 className="alert-heading mb-2">Thank you for contacting us!</h4>
                    <p className="mb-0">We've received your request and will get back to you shortly.</p>
                  </div>
                </Alert>
              ) : (
                <Form onSubmit={handleSubmit} noValidate>
                  {formError && (
                    <Alert variant="danger" className="d-flex align-items-center">
                      <i className="bi bi-exclamation-circle me-2"></i>
                      <span>Please correct the highlighted fields below.</span>
                    </Alert>
                  )}
                  
                  <Row className="g-4">
                    <Col md={6} xs={12}>
                      <Form.Group controlId="formName">
                        <Form.Label className="fw-semibold mb-2">
                          Name*
                          {errorFields.includes('name') && (
                            <span className="text-danger ms-2">
                              <i className="bi bi-exclamation-circle-fill"></i> Required
                            </span>
                          )}
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          value={contactForm.name}
                          onChange={handleInputChange}
                          required
                          className={`py-3 px-4 rounded-pill shadow-sm ${errorFields.includes('name') ? 'border-danger' : ''}`}
                          placeholder="Enter your full name"
                          style={{ 
                            fontSize: '1rem',
                            background: inputBg,
                            color: inputTextColor,
                            borderColor: errorFields.includes('name') ? 'red' : borderColor
                          }}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6} xs={12}>
                      <Form.Group controlId="formEmail">
                        <Form.Label className="fw-semibold mb-2">
                          Email*
                          {(errorFields.includes('email') || errorFields.includes('email-format')) && (
                            <span className="text-danger ms-2">
                              <i className="bi bi-exclamation-circle-fill"></i> 
                              {errorFields.includes('email-format') ? ' Invalid format' : ' Required'}
                            </span>
                          )}
                        </Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={contactForm.email}
                          onChange={handleInputChange}
                          required
                          className={`py-3 px-4 rounded-pill shadow-sm ${errorFields.includes('email') || errorFields.includes('email-format') ? 'border-danger' : ''}`}
                          placeholder="Enter your email address"
                          style={{ 
                            fontSize: '1rem',
                            background: inputBg,
                            color: inputTextColor,
                            borderColor: errorFields.includes('email') || errorFields.includes('email-format') ? 'red' : borderColor
                          }}
                        />
                      </Form.Group>
                    </Col>
                    <Col xs={12}>
                      <Form.Group controlId="formIssue">
                        <Form.Label className="fw-semibold mb-2">Issue Type</Form.Label>
                        <Form.Select
                          name="issue"
                          value={contactForm.issue}
                          onChange={handleInputChange}
                          className="py-3 px-4 rounded-pill shadow-sm"
                          style={{ 
                            fontSize: '1rem',
                            background: inputBg,
                            color: inputTextColor,
                            borderColor 
                          }}
                        >
                          <option value="">Select an issue type</option>
                          <option value="account">Account Issues</option>
                          <option value="billing">Billing Problems</option>
                          <option value="technical">Technical Support</option>
                          <option value="content">Content Questions</option>
                          <option value="other">Other</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col xs={12}>
                      <Form.Group controlId="formDescription">
                        <Form.Label className="fw-semibold mb-2">
                          Description*
                          {errorFields.includes('description') && (
                            <span className="text-danger ms-2">
                              <i className="bi bi-exclamation-circle-fill"></i> Required
                            </span>
                          )}
                        </Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={4}
                          name="description"
                          value={contactForm.description}
                          onChange={handleInputChange}
                          required
                          className={`py-3 px-4 rounded-3 shadow-sm ${errorFields.includes('description') ? 'border-danger' : ''}`}
                          placeholder="Describe your issue in detail"
                          style={{ 
                            fontSize: '1rem',
                            background: inputBg,
                            color: inputTextColor,
                            borderColor: errorFields.includes('description') ? 'red' : borderColor
                          }}
                        />
                      </Form.Group>
                    </Col>
                    <Col xs={12} className="text-end">
                      <Button
                        type="submit"
                        variant="success"
                        className="py-3 px-5 rounded-pill fw-semibold faqsubmitbtn"
                        style={{
                          backgroundColor: spotifyGreen,
                          border: 'none',
                          transition: 'all 0.2s',
                        }}
                      >
                        <i className="bi bi-send me-2"></i>
                        Submit Request
                      </Button>
                    </Col>
                  </Row>
                </Form>
              )}
            </Card.Body>
          </Card>
        </div>
      </Container>

      {/* Footer Banner */}
      <div className="py-4 text-center bg-dark text-white mt-5">
        <Container>
          <h4 className="mb-3">Ready to enjoy the Spotify experience?</h4>
          <Button 
            variant="success"
            className="rounded-pill px-5 py-2 fw-semibold me-2"
            style={{ backgroundColor: spotifyGreen, border: 'none' }}
          >
            Get Premium
          </Button>
          <Button 
            variant="outline-light"
            className="rounded-pill px-5 py-2 fw-semibold"
          >
            Download App
          </Button>
        </Container>
      </div>

      {/* Toggle Theme Button */}
      <div className="position-fixed bottom-0 end-0 m-4">
        <Button
          variant={isDark ? "light" : "dark"}
          className="rounded-circle p-2 shadow"
          style={{ width: '50px', height: '50px' }}
          onClick={() => {
            const newTheme = theme === 'dark' ? 'light' : 'dark';
            setTheme(newTheme);
            localStorage.setItem('spotifyTheme', newTheme);
          }}
        >
          <i className={`bi ${isDark ? 'bi-sun' : 'bi-moon'}`}></i>
        </Button>
      </div>
      
      {/* Add Bootstrap Icons */}
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.8.1/font/bootstrap-icons.css" />
      
      {/* Add custom styles */}
      <style jsx>{`
        .hover-lift:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
        }
        
        /* Custom form validation styles */
        .form-control:focus {
          border-color: ${spotifyGreen};
          box-shadow: 0 0 0 0.25rem rgba(29, 185, 84, 0.25);
        }
        
        /* Accordion custom styles for theme support */
        .accordion-button:not(.collapsed) {
          background-color: ${isDark ? '#333' : '#e7f8ef'};
          color: ${isDark ? '#fff' : '#191414'};
        }
        
        .accordion-button {
          background-color: ${isDark ? '#212121' : '#fff'};
          color: ${isDark ? '#fff' : '#191414'};
        }
        
        .accordion-button:focus {
          border-color: ${spotifyGreen};
          box-shadow: 0 0 0 0.25rem rgba(29, 185, 84, 0.25);
        }
      `}</style>
    </div>
    </div>
  );
}

export default SpotifyFAQ;