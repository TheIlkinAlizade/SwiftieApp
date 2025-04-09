import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.music.cartItems || []);
  const [theme, setTheme] = useState('dark'); 
  
  // Get theme from local storage on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);
  
  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price || 0), 0).toFixed(2);
  };
  
  const handleConfirmPurchase = () => {
    // You can add actual purchasing logic here
    alert('Purchase Confirmed!');
    navigate('/thank-you'); // Or redirect somewhere else
  };
  
  return (
    <div className='containerItems'>
    <Navbar></Navbar>
    <div className={`spotify-checkout-page ${theme}-theme`}>
  
      <div className="spotify-checkout-container">
        <div className="spotify-checkout-header">
          <h2>Checkout</h2>
          <div className="checkout-divider"></div>
        </div>
        
        <div className="spotify-checkout-content">
          <div className="spotify-cart-items">
            <h3>Your Cart ({cartItems.length})</h3>
            
            {cartItems.length === 0 ? (
              <div className="empty-cart-message">
                <i className='bx bx-cart-alt'></i>
                <p>Your cart is empty.</p>
                <button 
                  className="spotify-browse-button"
                  onClick={() => navigate('/catalog')}
                >
                  Browse Music
                </button>
              </div>
            ) : (
              <div className="cart-items-list">
                {cartItems.map((item, index) => (
                  <div className="cart-item" key={index}>
                    <div className="cart-item-image">
                      <img 
                        src={item.imageUrl || "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAhFBMVEX///8AAABLS0uGhoZCQkLU1NT7+/vo6Ojg4OBISEjy8vJtbW2Pj4/29vbt7e3m5ubExMSsrKygoKBWVlZkZGS5ubkbGxspKSmBgYEvLy+YmJjZ2dnPz89QUFCysrK9vb1bW1t2dnYWFhYNDQ09PT0sLCwZGRmdnZ01NTVycnIhISFhYWH0Dmd7"} 
                        alt={item.title}
                      />
                    </div>
                    <div className="cart-item-details">
                      <h4>{item.title}</h4>
                      <p className="item-artist">{item.artist || "Unknown Artist"}</p>
                      <p className="item-category">{item.category || "Music"}</p>
                    </div>
                    <div className="cart-item-price">
                      ${item.price}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="checkout-summary">
            <div className="summary-header">
              <h3>Summary</h3>
            </div>
            
            <div className="summary-details">
              <div className="summary-row">
                <span>Original Price</span>
                <span>${calculateTotal()}</span>
              </div>
              
              {parseFloat(calculateTotal()) > 0 && (
                <>
                  <div className="summary-row discount">
                    <span>Discount</span>
                    <span>$0.00</span>
                  </div>
                  
                  <div className="summary-divider"></div>
                  
                  <div className="summary-row total">
                    <span>Total</span>
                    <span>${calculateTotal()}</span>
                  </div>
                </>
              )}
              
              <div className="payment-button-container">
                <button
                  className="spotify-payment-button"
                  onClick={handleConfirmPurchase}
                  disabled={cartItems.length === 0}
                >
                  Complete Purchase
                </button>
              </div>
              
              <div className="payment-info">
                <div className="payment-methods">
                  <i className='bx bxl-visa'></i>
                  <i className='bx bxl-mastercard'></i>
                  <i className='bx bxl-paypal'></i>
                </div>
                <p>All transactions are secure and encrypted.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default CheckoutPage;