import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Modal, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../client';
import "./checkout.css"
import Navbar from './Navbar';

const Checkout = ({ token }) => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState('light');
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingCart, setSavingCart] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [cartName, setCartName] = useState('');
  const [alert, setAlert] = useState({ show: false, variant: '', message: '' });
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [orderProcessing, setOrderProcessing] = useState(false);
  const [subtotal, setSubtotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [shipping, setShipping] = useState(5.99);
  const [total, setTotal] = useState(0);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: ''
  });

  // Get theme from localStorage on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    fetchCartItems();
  }, [token]);

  // Calculate totals whenever cart items change
  useEffect(() => {
    if (cartItems.length > 0) {
      const itemSubtotal = cartItems.reduce((sum, item) => sum + parseFloat(item.price || 0), 0);
      setSubtotal(itemSubtotal);
      setTax(itemSubtotal * 0.08); // 8% tax rate
      setTotal(itemSubtotal + (itemSubtotal * 0.08) + shipping);
    } else {
      setSubtotal(0);
      setTax(0);
      setTotal(0);
    }
  }, [cartItems, shipping]);

  // Fetch user's cart items from Supabase
  const fetchCartItems = async () => {
    setLoading(true);
    
    if (!token || !token.user) {
      setLoading(false);
      setAlert({
        show: true,
        variant: 'warning',
        message: 'Please log in to view your cart'
      });
      return;
    }

    try {
      // First get the user's wishlist IDs
      const { data: wishlistData, error: wishlistError } = await supabase
        .from('user_library')
        .select('music_id')
        .eq('user_id', token.user.id);

      if (wishlistError) throw wishlistError;

      // Get the actual music items
      if (wishlistData && wishlistData.length > 0) {
        const musicIds = wishlistData.map(item => item.music_id);
        
        const { data: musicData, error: musicError } = await supabase
          .from('music_items')
          .select('*')
          .in('id', musicIds);
          
        if (musicError) throw musicError;
        setCartItems(musicData || []);
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error('Error fetching cart items:', error.message);
      setAlert({
        show: true,
        variant: 'danger',
        message: `Failed to load cart items: ${error.message}`
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Save cart for later
  const handleSaveCart = async () => {
    if (!cartName.trim()) {
      setAlert({
        show: true,
        variant: 'warning',
        message: 'Please enter a name for your saved cart'
      });
      return;
    }

    setSavingCart(true);
    try {
      const cartData = {
        user_id: token.user.id,
        name: cartName,
        items: cartItems.map(item => item.id),
        created_at: new Date()
      };

      const { error } = await supabase
        .from('saved_carts')
        .insert([cartData]);

      if (error) throw error;

      setAlert({
        show: true,
        variant: 'success',
        message: 'Cart saved successfully!'
      });
      setShowModal(false);
    } catch (error) {
      console.error('Error saving cart:', error.message);
      setAlert({
        show: true,
        variant: 'danger',
        message: `Failed to save cart: ${error.message}`
      });
    } finally {
      setSavingCart(false);
    }
  };

  // Process the order
  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    
    
    // Basic form validation
    const requiredFields = ['fullName', 'email', 'address', 'city', 'state', 'zipCode'];
    if (paymentMethod === 'credit') {
      requiredFields.push('cardNumber', 'cardName', 'expiry', 'cvv');
    }
    
    const emptyFields = requiredFields.filter(field => !formData[field]);
    if (emptyFields.length > 0) {
      setAlert({
        show: true,
        variant: 'warning',
        message: `Please fill in all required fields: ${emptyFields.join(', ')}`
      });
      return;
    }

    setOrderProcessing(true);
    
    try {
      // Create order in database
      const orderData = {
        user_id: token.user.id,
        items: cartItems.map(item => item.id).toString(),
        total_amount: total,
        shipping_address: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}`,
        payment_method: paymentMethod,
        status: 'processing',
        created_at: new Date()
      };

      const { error: orderError } = await supabase
        .from('orders')
        .insert([orderData]);

      if (orderError) throw orderError;

      // Clear cart after successful order
      for (const item of cartItems) {
        const { error } = await supabase
          .from('user_library')
          .delete()
          .eq('user_id', token.user.id)
          .eq('music_id', item.id);
          
        if (error) throw error;
      }

      // Show success message
      setAlert({
        show: true,
        variant: 'success',
        message: 'Order placed successfully! Redirecting to confirmation page...'
      });

      // Redirect to confirmation page after a short delay
      setTimeout(() => {
        navigate('/order-confirmation', { 
          state: { 
            orderTotal: total,
            items: cartItems
          } 
        });
      }, 2000);

    } catch (error) {
      console.error('Error processing order:', error.message);
      setAlert({
        show: true,
        variant: 'danger',
        message: `Failed to process order: ${error.message}`
      });
    } finally {
      setOrderProcessing(false);
    }
  };

  return (
  
    <div className='containerItems checkout'>
        <Navbar></Navbar>
   
    <Container className={`checkout-container ${theme}`} style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      <h2 className="mb-4">Checkout</h2>
      
      {alert.show && (
        <Alert 
          variant={alert.variant} 
          onClose={() => setAlert({ ...alert, show: false })} 
          dismissible
        >
          {alert.message}
        </Alert>
      )}

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : cartItems.length === 0 ? (
        <Card className="text-center p-4">
          <Card.Body>
            <Card.Title>Your cart is empty</Card.Title>
            <Card.Text>Add items to your cart before checking out.</Card.Text>
            <Button variant="primary" onClick={() => navigate('/browse')}>
              Browse Music
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <Row>
          <Col md={8}>
            <Card className="mb-4">
              <Card.Header>
                <h4>Order Summary</h4>
              </Card.Header>
              <Card.Body>
                {cartItems.map((item) => (
                  <Row key={item.id} className="mb-3 pb-3 border-bottom">
                    <Col xs={3} md={2}>
                      <div className="bg-light p-2 text-center rounded">
                        <i className="bx bx-music" style={{ fontSize: '24px' }}></i>
                      </div>
                    </Col>
                    <Col xs={6} md={7}>
                      <h5>{item.name}</h5>
                      <p className="text-muted mb-0">{item.category}</p>
                      <small>{item.description}</small>
                    </Col>
                    <Col xs={3} md={3} className="text-end">
                      <strong>${parseFloat(item.price).toFixed(2)}</strong>
                    </Col>
                  </Row>
                ))}
                
                <div className="d-grid gap-2 mt-3">
                  <Button 
                    variant="outline-secondary" 
                    size="sm"
                    onClick={() => setShowModal(true)}
                  >
                    <i className="bx bx-save me-2"></i>
                    Save Cart for Later
                  </Button>
                </div>
              </Card.Body>
            </Card>

            <Card>
              <Card.Header>
                <h4>Shipping & Payment</h4>
              </Card.Header>
              <Card.Body>
                <Form onSubmit={handleSubmitOrder}>
                  <h5 className="mb-3">Shipping Information</h5>
                  <Row className="mb-3">
                    <Col md={6}>
                      <Form.Group controlId="fullName">
                        <Form.Label>Full Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group controlId="email">
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3" controlId="address">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>

                  <Row className="mb-3">
                    <Col md={5}>
                      <Form.Group controlId="city">
                        <Form.Label>City</Form.Label>
                        <Form.Control
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group controlId="state">
                        <Form.Label>State</Form.Label>
                        <Form.Control
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group controlId="zipCode">
                        <Form.Label>Zip Code</Form.Label>
                        <Form.Control
                          type="text"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <hr className="my-4" />
                  
                  <h5 className="mb-3">Payment Method</h5>
                  <Form.Group className="mb-3">
                    <Form.Check
                      type="radio"
                      label="Credit Card"
                      name="paymentMethod"
                      id="credit"
                      checked={paymentMethod === 'credit'}
                      onChange={() => setPaymentMethod('credit')}
                    />
                    <Form.Check
                      type="radio"
                      label="PayPal"
                      name="paymentMethod"
                      id="paypal"
                      checked={paymentMethod === 'paypal'}
                      onChange={() => setPaymentMethod('paypal')}
                    />
                  </Form.Group>

                  {paymentMethod === 'credit' && (
                    <div>
                      <Row className="mb-3">
                        <Col md={6}>
                          <Form.Group controlId="cardNumber">
                            <Form.Label>Card Number</Form.Label>
                            <Form.Control
                              type="text"
                              name="cardNumber"
                              value={formData.cardNumber}
                              onChange={handleInputChange}
                              placeholder="XXXX XXXX XXXX XXXX"
                              required
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group controlId="cardName">
                            <Form.Label>Name on Card</Form.Label>
                            <Form.Control
                              type="text"
                              name="cardName"
                              value={formData.cardName}
                              onChange={handleInputChange}
                              required
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row className="mb-3">
                        <Col md={6}>
                          <Form.Group controlId="expiry">
                            <Form.Label>Expiration Date</Form.Label>
                            <Form.Control
                              type="text"
                              name="expiry"
                              value={formData.expiry}
                              onChange={handleInputChange}
                              placeholder="MM/YY"
                              required
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group controlId="cvv">
                            <Form.Label>CVV</Form.Label>
                            <Form.Control
                              type="text"
                              name="cvv"
                              value={formData.cvv}
                              onChange={handleInputChange}
                              placeholder="XXX"
                              required
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                    </div>
                  )}

                  {paymentMethod === 'paypal' && (
                    <div className="text-center p-3 bg-dark rounded">
                      <p>You will be redirected to PayPal to complete your payment after order submission.</p>
                    </div>
                  )}

                  <div className="d-grid gap-2 mt-4">
                    <Button 
                      variant="primary" 
                      type="submit"
                      disabled={orderProcessing}
                      className='btnPayMethod'
                    >
                      {orderProcessing ? (
                        <>
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            className="me-2"
                          />
                          Processing...
                        </>
                      ) : (
                        'Complete Order'
                      )}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="mb-4 sticky-top" style={{ top: '1rem' }}>
              <Card.Header>
                <h4>Order Total</h4>
              </Card.Header>
              <Card.Body>
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between">
                  <strong>Total</strong>
                  <strong>${total.toFixed(2)}</strong>
                </div>
              </Card.Body>
              <Card.Footer>
                <small className="text-muted">
                  Estimated delivery: 3-5 business days
                </small>
              </Card.Footer>
            </Card>

            <Card className="mb-4 sticky-top" style={{ top: '350px' }}>
              <Card.Body>
                <h5>Need Help?</h5>
                <p className="mb-2 small">Have questions or need assistance with your order?</p>
                <div className="d-grid gap-2">
                  <Button variant="outline-secondary" size="sm">
                    <i className="bx bx-support me-2"></i>
                    Contact Support
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Modal for Saving Cart */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Save Your Cart</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="cartName">
            <Form.Label>Cart Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="e.g., My Summer Playlist"
              value={cartName}
              onChange={(e) => setCartName(e.target.value)}
            />
          </Form.Group>
          <p className="text-muted small">
            Saving your cart will allow you to access these items later.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSaveCart}
            disabled={savingCart}
          >
            {savingCart ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Saving...
              </>
            ) : (
              'Save Cart'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
    </div>
  );
};

export default Checkout;