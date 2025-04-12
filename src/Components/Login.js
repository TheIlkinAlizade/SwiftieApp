import React, { useState } from 'react';
import { supabase } from '../client';
import { Link, useNavigate } from 'react-router-dom';
import '../signin.css';

const Login = ({ setToken }) => {
  let navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);

  function handleChange(event) {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [event.target.name]: event.target.value
    }));
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
    <div className='signcontainer'>
      <div className='wrapper'>
        <form onSubmit={handleSubmit}>
          <h1>Login</h1>
          <div className="input-box">
            <input
              placeholder='Email'
              name='email'
              onChange={handleChange}
              type='email'
              value={formData.email}
            />
          </div>
          <div className="input-box">
            <input
              placeholder='Password'
              name='password'
              onChange={handleChange}
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
            />
          </div>
          <div className="remember-forgot">
            <label><input type="checkbox" /> Remember me</label>
            <a href="/go">Forgot password?</a>
          </div>
          <div className="show-password">
            <label>
              <input
                type="checkbox"
                checked={showPassword}
                onChange={() => setShowPassword((prev) => !prev)}
              /> Show password
            </label>
          </div>
          <button type='submit' className='btn'>Sign in</button>
          <div className="register-link">
            <p>
              Don't have an account? <Link to='/register'>Register</Link><br />
              <Link to='/'>Main Page</Link><br />
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
