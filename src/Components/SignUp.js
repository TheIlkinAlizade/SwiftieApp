import React from 'react';
import { useState } from 'react';
import { supabase } from '../client';
import { Link } from 'react-router-dom';
import Footer from './Footer';
const SignUp = () => {
  
  const [formData, setFormData] = useState({
    fullname: '',
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
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullname
          }
        }
      });
      alert("Check your email for verification link");
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <div className='signcontainer'>
      <div className='wrapper'>
        <form onSubmit={handleSubmit}>
          <h1>
            Register
          </h1>
          <div class="input-box">
            <input
              placeholder='Full name'
              name='fullname'
              onChange={handleChange}
              type='text'
            />
          </div>
          <div class="input-box">
            <input
              placeholder='Email'
              name='email'
              onChange={handleChange}
              type='email'
            />
          </div>
          <div class="input-box">
            <input
              placeholder='Password'
              name='password'
              onChange={handleChange}
              type='password'
            />
          </div>
          <button
            type='submit'
            className='btn'
          >
            Sign Up
          </button>
          <div class="register-link">
            <p>
            Already have an account?{' '}
            <Link to='/login'>
              Login
            </Link> <br/>
              <Link to='/'>Main Page</Link><br/>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
