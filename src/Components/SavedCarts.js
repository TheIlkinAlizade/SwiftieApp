import React, { useState, useEffect } from 'react';
import { Alert } from 'react-bootstrap';
import { supabase } from '../client';
import Navbar from './Navbar';

const SavedCarts = ({ token }) => {
  const [savedCarts, setSavedCarts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token || !token.user) {
      setError('User is not authenticated');
      setLoading(false);
      return;
    }

    const fetchSavedCarts = async () => {
      try {
        const { data, error } = await supabase
          .from('saved_carts')
          .select('id, name, created_at, items')
          .eq('user_id', token.user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        // For each saved cart, fetch details of each item
        const fetchedCarts = await Promise.all(
          data.map(async (cart) => {
            // Fetch details for each item in the cart
            const itemDetails = await Promise.all(
              cart.items.map(async (itemId) => {
                const { data: itemData, error: itemError } = await supabase
                  .from('music_items')
                  .select('id, name, price, category')
                  .eq('id', itemId)
                  .single();

                if (itemError) {
                  console.error('Error fetching item details:', itemError.message);
                  return null; // Handle error for individual item
                }

                return itemData;
              })
            );

            // Return the cart with the item details
            return { ...cart, items: itemDetails.filter((item) => item !== null) };
          })
        );

        setSavedCarts(fetchedCarts);
        console.log(fetchedCarts);
      } catch (error) {
        console.error('Error fetching saved carts:', error.message);
        setError(`Failed to fetch saved carts: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedCarts();
  }, [token]);

  if (loading) return <div className="loadingText">Loading saved carts...</div>;

  return (
    <div className='containerItems'>
        <Navbar></Navbar>
        <div className="savedContainer">
        <h2 className="savedCartsHeader">Your Saved Carts</h2>

        {savedCarts.length === 0 ? (
            <div className="noSavedCarts">No saved carts found</div>
        ) : (
            <ul className="savedCartsList">
            {savedCarts.map((cart) => (
                <li key={cart.id} className="savedCartItem">
                <h5 className="savedCartTitle">{cart.name}</h5>
                <p className="savedCartDate">Saved on: {new Date(cart.created_at).toLocaleString()}</p>
                <div className="savedCartDetails">
                    {cart.items.map((item, index) => (
                    <div key={index}>
                        <p>{item.name}</p>
                        <p>Price: ${item.price}</p>
                    </div>
                    ))}
                </div>
                </li>
            ))}
            </ul>
        )}
        </div>
    </div>
  );
};

export default SavedCarts;
