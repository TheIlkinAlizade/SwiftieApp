import React, { useEffect, useState } from 'react';
import { Container, Card, Row, Col, Button, ListGroup } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../client';
import Navbar from './Navbar';

const OrderConfirmation = ({ token }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [orderData, setOrderData] = useState(null);
  const [theme, setTheme] = useState('light');
  const [orderId] = useState(`ORD-${Math.floor(100000 + Math.random() * 900000)}`);
  const [currentDate] = useState(new Date().toLocaleDateString());

  useEffect(() => {
    // Get theme from localStorage
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);

    // Check if we have order data from location state
    if (location.state && location.state.orderTotal) {
      setOrderData(location.state);
    } else {
      // If no data was passed, redirect to home
      navigate('/');
    }
  }, [location, navigate]);

  // Function to handle downloading receipt
  const handleDownloadReceipt = () => {
    // In a real application, this would generate a PDF or similar
    alert('Receipt download would begin here. This feature would typically generate a PDF.');
  };

  // Function to navigate back to browse page
  const handleContinueShopping = () => {
    navigate('/home');
  };

  if (!orderData) {
    return null; // Don't render anything while we check for data
  }

  return (
    <div className='containerItems'>
    <Navbar></Navbar>
    <Container className={`order-confirmation ${theme}`} style={{ color:'black' }}>
      <Card className="">
        <Card.Body className="">
          <div className="text-center mb-4">
            <div className="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
              <i className="bx bx-check" style={{ fontSize: '40px' }}></i>
            </div>
            <h2>Order Confirmed!</h2>
            <p className="text-muted">Thank you for your purchase</p>
          </div>

          <Row className="justify-content-center mb-4">
            <Col md={8}>
              <Card className="bg-dark">
                <Card.Body className="p-4">
                  <Row className="mb-3">
                    <Col xs={6}>
                      <h6 className="text-muted">ORDER NUMBER</h6>
                      <p className="mb-0"><strong>{orderId}</strong></p>
                    </Col>
                    <Col xs={6} className="text-end">
                      <h6 className="text-muted">DATE</h6>
                      <p className="mb-0"><strong>{currentDate}</strong></p>
                    </Col>
                  </Row>
                  
                  <hr />
                  
                  <h5 className="mb-3">Order Summary</h5>
                  <ListGroup variant="flush" className="mb-3">
                    {orderData.items.map((item) => (
                      <ListGroup.Item key={item.id} className="bg-dark px-0 d-flex justify-content-between">
                        <div>
                          <strong>{item.name}</strong>
                          <p className="text-muted mb-0 small">{item.category}</p>
                        </div>
                        <span>${parseFloat(item.price).toFixed(2)}</span>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                  
                  <Row className="text-end">
                    <Col>
                      <p className="mb-1">
                        <span className="me-3">Subtotal:</span>
                        <span>${(orderData.orderTotal * 0.92).toFixed(2)}</span>
                      </p>
                      <p className="mb-1">
                        <span className="me-3">Tax:</span>
                        <span>${(orderData.orderTotal * 0.08 - 5.99).toFixed(2)}</span>
                      </p>
                      <p className="mb-1">
                        <span className="me-3">Shipping:</span>
                        <span>$5.99</span>
                      </p>
                      <p className="mb-0">
                        <span className="me-3"><strong>Total:</strong></span>
                        <strong>${orderData.orderTotal.toFixed(2)}</strong>
                      </p>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <div className="text-center mb-4">
            <h5>What happens next?</h5>
            <p className="text-muted">
              Your digital content is now available in your library. 
              You'll receive a confirmation email with access details shortly.
            </p>
          </div>
          
          <Row className="justify-content-center">
            <Col md={8} className="d-flex flex-column flex-md-row gap-2 justify-content-between">
              <Button variant="outline-primary" onClick={handleDownloadReceipt}>
                <i className="bx bx-download me-2"></i>
                Download Receipt
              </Button>
              <Button variant="primary" onClick={handleContinueShopping}>
                Continue Shopping
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
    </div>
  );
};

export default OrderConfirmation;