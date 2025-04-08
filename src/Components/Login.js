import React from 'react';
import { useState } from 'react';
import { supabase } from '../client';
import { Link, useNavigate } from 'react-router-dom';

const Login = ({ setToken }) => {
  let navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  function handleChange(event) {
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        [event.target.name]: event.target.value
      };
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      });
      if (error) throw error;
      setToken(data);
      navigate('/home');
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#121212',
        color: 'white'
      }}
    >
      <div
        style={{
          backgroundColor: '#000000',
          padding: '40px',
          borderRadius: '8px',
          width: '100%',
          maxWidth: '400px',
          textAlign: 'center',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)'
        }}
      >
        <h1
          style={{
            color: 'white',
            marginBottom: '20px',
            fontSize: '32px',
            fontWeight: 'bold',
            letterSpacing: '2px'
          }}
        >
          Login
        </h1>
        <form onSubmit={handleSubmit}>
          <input
            placeholder='Email'
            name='email'
            onChange={handleChange}
            type='email'
            style={{
              width: '100%',
              padding: '12px 16px',
              marginBottom: '15px',
              borderRadius: '4px',
              border: '1px solid #333',
              backgroundColor: '#2a2a2a',
              color: 'white',
              fontSize: '16px'
            }}
          />
          <input
            placeholder='Password'
            name='password'
            onChange={handleChange}
            type='password'
            style={{
              width: '100%',
              padding: '12px 16px',
              marginBottom: '20px',
              borderRadius: '4px',
              border: '1px solid #333',
              backgroundColor: '#2a2a2a',
              color: 'white',
              fontSize: '16px'
            }}
          />
          <button
            type='submit'
            style={{
              backgroundColor: '#1DB954',
              width: '100%',
              padding: '12px',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              color: 'white',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Sign in
          </button>
        </form>
        <p style={{ marginTop: '20px' }}>
          Don't have an account?{' '}
          <Link to='/register' style={{ color: '#1DB954', textDecoration: 'none' }}>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
